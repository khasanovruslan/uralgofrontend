<template>
  <!-- ----------------------------
       КОМПЬЮТЕРНАЯ ВЕРСИЯ (XL+)
       ---------------------------- -->
  <div
    class="w-screen h-screen xl:block hidden font-Montserrat bg-cover bg-center"
    style="background-image: url(/images/регистрация.svg);"
  >
    <!-- Полупрозрачный оверлей -->
    <div class="absolute top-0 right-0 w-1/2 h-full bg-white/10 backdrop-blur-[10px] z-10">
      <form @submit.prevent="loginUser" class="flex flex-col ml-[50px] mt-[180px] z-20">
        <p class="font-medium text-[24px] leading-[136%]">Добро пожаловать!</p>
        <p class="mt-[5px] leading-[136%] text-[14px]">Вход в аккаунт</p>

        <!-- EMAIL -->
        <div class="flex flex-col mt-[70px]">
          <label for="email-desktop" class="registerText">Email</label>
          <input
            id="email-desktop"
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4"
            placeholder="Введите почту"
          />
          <p v-if="errorMessage && !form.email" class="text-red-500 text-sm mt-1">
            Поле Email не может быть пустым
          </p>
        </div>

        <!-- PASSWORD -->
        <div class="flex flex-col mt-3">
          <label for="password-desktop" class="registerText">Пароль</label>
          <input
            id="password-desktop"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            class="h-[46px] w-[424px] rounded-[6px] mt-2 pl-4"
            placeholder="Введите пароль"
          />
          <p v-if="errorMessage && !form.password" class="text-red-500 text-sm mt-1">
            Поле Пароль не может быть пустым
          </p>
        </div>

        <!-- Ошибка от сервера или общая -->
        <p v-if="serverError" class="text-red-500 text-sm mt-4">
          {{ serverError }}
        </p>

        <!-- КНОПКА ВОЙТИ -->
        <AuthButton type="submit" :disabled="isLoading" class="mt-6 w-[424px] h-[46px]">
          <span v-if="isLoading">Загрузка…</span>
          <span v-else>Войти</span>
        </AuthButton>

        <!-- ССЫЛКА НА РЕГИСТРАЦИЮ -->
        <div class="flex mt-8 text-white">
          <p>Еще нет аккаунта?</p>
          <button
            type="button"
            class="font-bold ml-1"
            @click="redirectToRegister"
          >
            Регистрация
          </button>
        </div>
      </form>
    </div>

    <!-- ЛОГО (ВЕРНУТЬСЯ НА ГЛАВНУЮ) -->
    <button
      type="button"
      class="font-black m-6 text-[36px] absolute top-0 left-0 text-white"
      @click="goBackHome"
    >
      uralgo
    </button>
  </div>

  <!-- ----------------------------
       МОБИЛЬНАЯ ВЕРСИЯ (XS–LG)
       ---------------------------- -->
  <div
    class="w-screen min-h-screen block xl:hidden font-Montserrat bg-[url('/images/регистрация-mobile.svg')] bg-cover bg-center"
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
        <p class="font-medium text-[20px] leading-[136%] text-gray-900">Добро пожаловать!</p>
        <p class="mt-1 text-[12px] leading-[136%] text-gray-600">Вход в аккаунт</p>
      </div>

      <!-- Форма -->
      <form @submit.prevent="loginUser" class="flex flex-col space-y-4">
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
            Поле Email не может быть пустым
          </p>
        </div>

        <!-- PASSWORD -->
        <div class="flex flex-col">
          <label for="password-mobile" class="text-sm font-medium text-gray-700">Пароль</label>
          <input
            id="password-mobile"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            class="h-[40px] w-full rounded-md mt-1 pl-3 border border-gray-300"
            placeholder="Введите пароль"
          />
          <p v-if="errorMessage && !form.password" class="text-red-500 text-xs mt-1">
            Поле Пароль не может быть пустым
          </p>
        </div>

        <!-- Ошибка от сервера или общая -->
        <p v-if="serverError" class="text-red-500 text-xs mt-2">
          {{ serverError }}
        </p>

        <!-- КНОПКА ВОЙТИ (Мобильная) -->
        <AuthButton type="submit" :disabled="isLoading" class="mt-4 w-full h-[44px]">
          <span v-if="isLoading">Загрузка…</span>
          <span v-else>Войти</span>
        </AuthButton>

        <!-- Ссылка на регистрацию -->
        <div class="flex justify-center mt-6 text-gray-700 text-sm">
          <p>Еще нет аккаунта?</p>
          <button
            type="button"
            class="font-semibold ml-1 text-blue-600"
            @click="redirectToRegister"
          >
            Регистрация
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import AuthButton from '@/components/buttons/AuthButton.vue';

const router = useRouter();
const authStore = useAuthStore();

// Сбор полей формы
const form = reactive({
  email: '',
  password: '',
});

const isLoading = ref(false);
const errorMessage = ref(''); // для валидации полей
const serverError = ref(''); // для ошибок от сервера

async function loginUser() {
  // 1) Простая проверка на пустые поля
  if (!form.email || !form.password) {
    errorMessage.value = 'Пожалуйста, заполните все поля';
    return;
  }

  // Сбрасываем предыдущие ошибки
  serverError.value = '';
  errorMessage.value = '';
  isLoading.value = true;

  try {
    // Pinia-метод делает запрос к бэку и пушит на главную
    await authStore.login(form);
  } catch (err) {
    // Если бэк вернул сообщение об ошибке, показываем его
    serverError.value = err.response?.data?.message || 'Ошибка входа';
  } finally {
    isLoading.value = false;
  }
}

function redirectToRegister() {
  router.push('/register');
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
/* Остальные ваши стили оставьте без изменений */
</style>
