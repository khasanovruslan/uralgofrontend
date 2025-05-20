<template>
  <div class="w-screen h-screen xl:block hidden font-Montserrat" style="background-image: url(/images/регистрация.svg);">
    <div class="absolute top-0 right-0 w-1/2 h-full bg-opacity-10 backdrop-blur-[10px] -z-5">
      <form @submit.prevent="registerUser" class="flex flex-col w-[400px] h-[600px] ml-[50px] mt-[150px] z-10">
        <p class="font-medium text-[24px] leading-[136%]">Создайте учетную запись</p>
        <p class="mt-[5px] leading-[136%] text-[14px]">Просто и бесплатно</p>
        <div class="flex flex-col mt-[70px]">
          <p class="registerText">Имя</p>
          <input v-model="form.name" type="text" class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4" placeholder="Введите имя">
        </div>
        <div class="flex flex-col mt-3">
          <p class="registerText">Email</p>
          <input v-model="form.email" type="email" class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4" placeholder="Введите почту">
        </div>
        <div class="flex flex-col mt-3">
          <p class="registerText">Номер телефона</p>
          <input v-model="form.phone" type="text" class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4" placeholder="Введите номер телефона">
        </div>
        <div class="flex flex-col mt-3">
          <p class="registerText">Пароль</p>
          <input v-model="form.password" type="password" class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4" placeholder="Введите пароль">
        </div>
        <button type="submit" class="w-[424px] h-[48px] mt-8 bg-RegisterPageRegisterButton">
          
        </button>
        <div class="flex text-white mt-16">
          <p>Уже есть аккаунт?</p>
          <button class="font-bold ml-1" @click="redirectToLogin">Вход</button>
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

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: ''
});

const registerUser = async () => {
  if (form.password.length < 6) {
    alert('Пароль должен быть не менее 6 символов');
    return;
  }
  try {
    await authStore.register(form);
    // router.push('/login') уже в сторе
  } catch (err) {
    alert(err.response?.data?.message || 'Ошибка регистрации');
  }
};

const redirectToLogin = () => router.push('/login');
const goBackHome = () => router.push('/');
</script>
