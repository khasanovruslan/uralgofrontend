//store/authStore.js
import { defineStore } from 'pinia';
import { authService } from '@/services/authService';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
  isAuthenticated: (state) => !!state.token,
  userName: (state) => state.user?.fullName || '',
},
  actions: {
    async login(credentials) {
      const { data } = await authService.login(credentials);
      this.token = data.token;
      localStorage.setItem('token', data.token);
      this.user = data.user;
      router.push('/');
    },
    async register(payload) {
      const { data } = await authService.register(payload);
      this.token = data.token;
      localStorage.setItem('token', data.token);
      this.user = data.user;      
      router.push('/');       
    },
    async fetchProfile() {
      const { data } = await authService.getProfile();
      this.user = data;
    },
    logout() {
      authService.logout();
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      router.push('/login');
    },
  },
});
