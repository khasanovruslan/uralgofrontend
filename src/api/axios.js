// src/api/axios.js
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,          // чтобы refreshCookie шёл сам
});

// ➜ прикрепляем accessToken из pinia
api.interceptors.request.use((config) => {
  const store = useAuthStore();
  if (store.token) {
    config.headers.Authorization = `Bearer ${store.token}`;
  }
  return config;
});

// ➜ авто-refresh по 401
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const store = useAuthStore();
    if (
      error.response?.status === 401 &&
      !error.config._retry
    ) {
      try {
        error.config._retry = true;

        // просим новый accessToken
        const { data } = await api.post('/auth/refresh');
        store.token = data.token;
        localStorage.setItem('token', data.token);

        // повторяем исходный запрос
        error.config.headers.Authorization = `Bearer ${data.token}`;
        return api(error.config);
      } catch {
        store.logout();               // refresh не сработал
      }
    }
    return Promise.reject(error);
  },
);

export default api;
