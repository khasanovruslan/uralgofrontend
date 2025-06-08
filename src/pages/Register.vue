<template>
  <!-- =========================== 
   ДЕСКТОП (>= 1280px) 
   =========================== -->
  <div
    class="w-screen h-screen xl:block hidden font-Montserrat bg-cover bg-center"
    style="background-image: url(/images/регистрация.svg);"
  >
    <!-- Полупрозрачный оверлей -->
    <div class="absolute top-0 right-0 w-1/2 h-full bg-white/10 backdrop-blur-[10px] z-10">
      <form @submit.prevent="registerUser" class="flex flex-col ml-[50px] mt-[180px] z-20">
        <!-- Заголовок -->
        <p class="font-medium text-[24px] leading-[136%]">Создайте учетную запись</p>
        <p class="mt-[5px] leading-[136%] text-[14px]">Просто и бесплатно</p>

        <!-- ИМЯ -->
        <div class="flex flex-col mt-[70px]">
          <label for="name-desktop" class="registerText text-white">Имя</label>
          <input
            id="name-desktop"
            v-model="form.fullName"
            type="text"
            autocomplete="name"
            class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4"
            placeholder="Введите имя"
          />
          <p v-if="errorMessage && !form.fullName" class="text-red-400 text-sm mt-1">
            Поле «Имя» не может быть пустым
          </p>
        </div>

        <!-- EMAIL -->
        <div class="flex flex-col mt-3">
          <label for="email-desktop" class="registerText text-white">Email</label>
          <input
            id="email-desktop"
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4"
            placeholder="Введите почту"
          />
          <p v-if="errorMessage && !form.email" class="text-red-400 text-sm mt-1">
            Поле «Email» не может быть пустым
          </p>
        </div>

        <!-- НОМЕР ТЕЛЕФОНА -->
        <div class="flex flex-col mt-3">
          <label for="phone-desktop" class="registerText text-white">Номер телефона</label>
          <input
            id="phone-desktop"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4"
            placeholder="Введите номер телефона"
          />
          <p v-if="errorMessage && !form.phone" class="text-red-400 text-sm mt-1">
            Поле «Номер телефона» не может быть пустым
          </p>
        </div>

        <!-- ПАРОЛЬ -->
        <div class="flex flex-col mt-3">
          <label for="password-desktop" class="registerText text-white">Пароль</label>
          <input
            id="password-desktop"
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4"
            placeholder="Введите пароль"
          />
          <p v-if="errorMessage && form.password.length < 6" class="text-red-400 text-sm mt-1">
            Пароль должен быть не менее 6 символов
          </p>
        </div>

        <!-- Ошибка от сервера или общая -->
        <p v-if="serverError" class="text-red-500 text-sm mt-4">
          {{ serverError }}
        </p>

        <!-- КНОПКА РЕГИСТРАЦИИ -->
        <AuthButton type="submit" :disabled="isLoading" class="mt-8 w-[424px] h-[48px]">
          <span v-if="isLoading">Регистрация...</span>
          <span v-else>Зарегистрироваться</span>
        </AuthButton>

        <!-- Ссылка на Вход -->
        <div class="flex mt-8">
          <p class="text-white">Уже есть аккаунт?</p>
          <button type="button" class="font-bold ml-1 text-white" @click="redirectToLogin">
            Вход
          </button>
        </div>
      </form>
    </div>

    <!-- КНОПКА «uralgo» для возврата на главную -->
    <button
      type="button"
      class="font-black m-6 text-[36px] absolute top-0 left-0 text-white z-20"
      @click="goBackHome"
    >
      uralgo
    </button>
  </div>

  <!-- =========================== МОБИЛЬНАЯ (XS–LG) =========================== -->
  <div
    class="w-screen min-h-screen block xl:hidden font-montserrat bg-[url('/images/регистрация-mobile.svg')] bg-cover bg-center"
  >
    <div class="px-4 pt-12">
      <!-- ЛОГО сверху -->
      <button
        type="button"
        class="font-black text-[24px] text-gray-800 mb-8"
        @click="goBackHome"
      >
        uralgo
      </button>

      <!-- Заголовок -->
      <div class="mb-6">
        <p class="font-medium text-[20px] leading-[136%] text-gray-900">
          Создайте учетную запись
        </p>
        <p class="mt-1 text-[12px] leading-[136%] text-gray-600">Просто и бесплатно</p>
      </div>

      <!-- Форма -->
      <form @submit.prevent="registerUser" class="flex flex-col space-y-4">
        <!-- ИМЯ -->
        <div class="flex flex-col">
          <label for="name-mobile" class="text-sm font-medium text-gray-700">Имя</label>
          <input
            id="name-mobile"
            v-model="form.fullName"
            type="text"
            autocomplete="name"
            class="h-[40px] w-full rounded-md mt-1 pl-3 border border-gray-300"
            placeholder="Введите имя"
          />
          <p v-if="errorMessage && !form.fullName" class="text-red-500 text-xs mt-1">
            Поле «Имя» не может быть пустым
          </p>
        </div>

        <!-- EMAIL -->
        <div class="flex flex-col">
          <label for="email-mobile" class="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email-mobile"
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="h-[40px] w-full rounded-md mt-1 pl-3 border border-gray-300"
            placeholder="Введите почту"
          />
          <p v-if="errorMessage && !form.email" class="text-red-500 text-xs mt-1">
            Поле «Email» не может быть пустым
          </p>
        </div>

        <!-- НОМЕР ТЕЛЕФОНА -->
        <div class="flex flex-col">
          <label for="phone-mobile" class="text-sm font-medium text-gray-700">Номер телефона</label>
          <input
            id="phone-mobile"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            class="h-[40px] w-full rounded-md mt-1 pl-3 border border-gray-300"
            placeholder="Введите номер телефона"
          />
          <p v-if="errorMessage && !form.phone" class="text-red-500 text-xs mt-1">
            Поле «Номер телефона» не может быть пустым
          </p>
        </div>

        <!-- ПАРОЛЬ -->
        <div class="flex flex-col">
          <label for="password-mobile" class="text-sm font-medium text-gray-700">Пароль</label>
          <input
            id="password-mobile"
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            class="h-[40px] w-full rounded-md mt-1 pl-3 border border-gray-300"
            placeholder="Введите пароль"
          />
          <p v-if="errorMessage && form.password.length < 6" class="text-red-500 text-xs mt-1">
            Пароль должен быть не менее 6 символов
          </p>
        </div>

        <!-- Ошибка от сервера или общая -->
        <p v-if="serverError" class="text-red-500 text-xs mt-2">
          {{ serverError }}
        </p>

        <!-- КНОПКА РЕГИСТРАЦИИ -->
        <AuthButton type="submit" :disabled="isLoading" class="mt-4 w-full h-[44px]">
          <span v-if="isLoading">Регистрация...</span>
          <span v-else>Зарегистрироваться</span>
        </AuthButton>

        <!-- Ссылка на Вход -->
        <div class="flex justify-center mt-6 text-gray-700 text-sm">
          <p>Уже есть аккаунт?</p>
          <button
            type="button"
            class="font-semibold ml-1 text-blue-600"
            @click="redirectToLogin"
          >
            Вход
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import AuthButton from '@/components/buttons/AuthButton.vue';

const router = useRouter();
const authStore = useAuthStore();

// Сбор полей формы
const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
});

const isLoading = ref(false);
const errorMessage = ref(''); // для валидации полей
const serverError = ref(''); // для ошибок от сервера

async function registerUser() {
  // 1) Базовая валидация на пустые поля и длину пароля
  if (!form.fullName || !form.email || !form.phone || form.password.length < 6) {
    errorMessage.value = 'Пожалуйста, заполните все поля корректно';
    return;
  }

  // Очищаем предыдущие ошибки
  serverError.value = '';
  errorMessage.value = '';
  isLoading.value = true;

  try {
    // Вызывать Pinia-метод, он сделает запрос к бэку и автоперенаправление
    await authStore.register(form);
  } catch (err) {
    // Если бэк вернул ошибку, покажем её
    serverError.value = err.response?.data?.message || 'Ошибка регистрации';
  } finally {
    isLoading.value = false;
  }
}

function redirectToLogin() {
  router.push('/login');
}

function goBackHome() {
  router.push('/');
}
</script>

<style lang="scss" scoped>
.registerText {
  font-size: 14px;
  font-weight: 500;
}
/* Остальные стили без изменений */
</style>
