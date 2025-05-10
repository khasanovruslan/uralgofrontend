// File: src/store/authStore.js
import { defineStore } from 'pinia';
import { authService } from '../services/authService';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || '',
  },
  actions: {
    async login(credentials) {
      const response = await authService.login(credentials);
      this.token = response.data.token;
      localStorage.setItem('token', this.token);
      this.user = response.data.user;
      router.push('/');
    },
    async register(data) {
      const response = await authService.register(data);
      this.token = response.data.token;
      localStorage.setItem('token', this.token);
      this.user = response.data.user;
      router.push('/login');
    },
    async fetchProfile() {
      const response = await authService.getProfile();
      this.user = response.data;
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      router.push('/login');
    }
  }
});
