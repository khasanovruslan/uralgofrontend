import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api';
const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Интерцептор запросов: добавляем токен из localStorage
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
