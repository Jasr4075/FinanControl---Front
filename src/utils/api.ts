// src/utils/api.ts
import axios from "axios";
import { getToken, deleteToken } from "./auth";
import { router } from "expo-router"; // pode usar direto aqui

const api = axios.create({
  baseURL: "https://financontrol-ywel.onrender.com/api", // ajusta para sua API
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

// Interceptor para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await deleteToken();
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      router.replace("/login"); // força redirecionar pro login
    } else if (error.response) {
      // Para outros erros, também limpar e redirecionar se necessário
      await deleteToken();
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      router.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
