<template>
  <header class="sticky top-0 h-12 xl:h-24 w-auto bg-headerImage xl:flex xl:items-center xl:justify-between px-4 lg:px-50 z-10">
    <div class="flex items-center absolute">
      <nav class="m-8 space-x-8 lg:space-x-8 font-normal hidden xl:block tracking-2pct md:text-sm">
        <NavLink to="/" class="">главная</NavLink>
        <NavLink to="/destinations" class="">направления</NavLink>
        <NavLink to="/createtrip" class="">поездки</NavLink>
      </nav>
    </div>
    <div class="flex-grow flex justify-start xl:justify-center items-center h-12">
      <NavLink to="/" class="xl:text-6xl font-Montserrat font-black opacity-80 text-2xl">uralgo</NavLink>
    </div>
    <div class="xl:hidden absolute flex space-x-5 -mt-[35px] right-6">
      <button class="focus:outline-none bg-userIcon bg-contain bg-no-repeat w-[26px] h-[26px]"></button>
      <button class="focus:outline-none bg-burgerIcon bg-contain bg-no-repeat w-[26px] h-[26px]"></button>
    </div>
    <!--Шапка для компьютера-->
    <div class="hidden xl:flex absolute right-0 mr-0.5 xl:mr-4 border-[1px] border-black border-opacity-15 bg-white bg-opacity-40 min-h-10 min-w-24 bg-no-repeat items-center justify-center pl-[15px] pr-[15px] pt-[10px] pb-[10px] z-15 rounded-[100px]">
      <NavLink
        :to="authStore.isAuthenticated ? '/account' : '/login'"
        class="font-bold text-md opacity-90 focus:outline-none z-20"
      >
        {{ authStore.isAuthenticated ? authStore.userName : 'войти' }}
      </NavLink>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import NavLink from '@/components/buttons/NavLink.vue';

const authStore = useAuthStore();

// при монтировании подгружаем профиль
onMounted(async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch {
      authStore.logout();
    }
  }
});
</script>

<style scoped>
/* Оригинальные стили шапки сохранены */
</style>
