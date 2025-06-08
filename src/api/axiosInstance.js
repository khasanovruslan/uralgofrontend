// File: src/api/axiosInstance.js
import axios from 'axios';

// VITE_API_URL задаётся в .env (файл .env.development или .env)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Интерцептор запросов: добавляем токен из localStorage
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
