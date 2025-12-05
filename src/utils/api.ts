// src/utils/api.ts
import axios from "axios";
import { getToken, getRefreshToken, saveToken, saveRefreshToken, saveUser, forceLogout } from "../features/auth/auth";

const api = axios.create({
  // baseURL: "https://financontrol-y8zd.onrender.com/api",
   baseURL: "http://localhost:3000/api",
  //baseURL: "https://financontrol-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Interceptor para tratar erros globais e renovar token
let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => {
    // Salva tokens ao logar/registrar
    if (response.config.url?.includes("/auth/login") || response.config.url?.includes("/auth/register")) {
      const { token, refreshToken, user } = response.data || {};
      if (token) saveToken(token);
      if (refreshToken) saveRefreshToken(refreshToken);
      if (user) saveUser(user);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isLogin = originalRequest?.url?.includes("/auth/login");
  const status = error.response?.status;
  // handle unauthorized or forbidden
  if (!isLogin && (status === 401 || status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then((token) => {
          if (token) originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("Refresh token ausente");
        const resp = await api.post("/token/refresh", { refreshToken });
    const { token, refreshToken: newRefreshToken, user } = resp.data;
    if (token) await saveToken(token);
    if (newRefreshToken) await saveRefreshToken(newRefreshToken);
    if (user) await saveUser(user);
    processQueue(null, token);
    originalRequest.headers["Authorization"] = `Bearer ${token}`;
    return api(originalRequest);
      } catch (err) {
    processQueue(err, null);
    // Unrecoverable: force logout and navigate to login
    try { await forceLogout(true); } catch {}
    return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  // For other status codes (400, 404, 500), don't clear auth automatically.
  // Let components handle these errors based on their status.
    return Promise.reject(error);
  }
);

export default api;
