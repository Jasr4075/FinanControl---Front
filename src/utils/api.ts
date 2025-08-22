// src/utils/api.ts
import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ajusta para sua API
  headers: {
    'Content-Type': 'application/json',
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

export default api;
