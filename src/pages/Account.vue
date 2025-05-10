<template>
  <div class="account-page">
    <h1>Добро пожаловать, {{ userName }}!</h1>
    <button @click="logout">Выйти</button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const userName = computed(() => authStore.userName);

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch {
      authStore.logout();
    }
  } else if (!authStore.isAuthenticated) {
    router.push('/login');
  }
});

const logout = () => {
  authStore.logout();
};
</script>
