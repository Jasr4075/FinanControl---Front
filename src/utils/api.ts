// src/utils/api.ts
import axios from "axios";
import { getToken, deleteToken } from "./auth";
import { router } from "expo-router"; // pode usar direto aqui

const api = axios.create({
  baseURL: "http://localhost:3000/api", // ajusta para sua API
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
      router.replace("/login"); // força redirecionar pro login
    }
    return Promise.reject(error);
  }
);

export default api;
