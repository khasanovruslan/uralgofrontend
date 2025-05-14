<template>
  <div class="w-screen h-screen xl:block hidden font-Montserrat" style="background-image: url(/images/регистрация.svg);">
    <div class="absolute top-0 right-0 w-1/2 h-full bg-opacity-10 backdrop-blur-[10px] -z-5">
      <form @submit.prevent="loginUser" class="flex flex-col w-[400px] h-[500px] ml-[50px] mt-[180px] z-10">
        <p class="font-medium text-[24px] leading-[136%]">Добро пожаловать!</p>
        <p class="mt-[5px] leading-[136%] text-[14px]">Вход в аккаунт</p>
        <div class="flex flex-col mt-[70px]">
          <p class="registerText">Email</p>
          <input v-model="form.email" type="email" class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4" placeholder="Введите почту">
        </div>
        <div class="flex flex-col mt-3">
          <p class="registerText">Пароль</p>
          <input v-model="form.password" type="password" class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4" placeholder="Введите пароль">
        </div>
        <AuthButton class="mt-20" @click="loginUser" />
        <div class="flex mt-[190px] text-white">
          <p>Еще нет аккаунта?</p>
          <button class="font-bold ml-1" @click="redirectToRegister">Регистрация</button>
        </div>
      </form>
    </div>
    <button class="font-black m-6 text-[36px]" @click="goBackHome">
      uralgo
    </button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import AuthButton from '@/components/buttons/AuthButton.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const loginUser = async () => {
  try {
    await authStore.login(form);
  } catch (err) {
    alert(err.response?.data?.message || 'Ошибка входа');
  }
};

const redirectToRegister = () => router.push('/register');
const goBackHome = () => router.push('/');
</script>

<style lang="scss" scoped>
/* твои стили без изменений */
</style>
