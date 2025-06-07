// src/services/authService.js  (frontend)
import api from '@/api/axios';

export const authService = {
  register(data) { return api.post('/auth/register', data); },
  login(data)    { return api.post('/auth/login',    data); },
  logout()       { return api.post('/auth/logout');        },
  getProfile()   { return api.get ('/user');               },   // 👈 корень!
};
