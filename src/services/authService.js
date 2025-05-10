// File: src/services/authService.js
import apiClient from './apiClient';

export const authService = {
  register: (payload) => apiClient.post('/auth/register', payload),
  login: (payload)    => apiClient.post('/auth/login', payload),
  getProfile: ()      => apiClient.get('/user'),
  // при необходимости logout удалить токен
};