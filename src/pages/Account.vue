<template>
  <div class="account-page flex flex-col pt-[5%] items-center">  
    <div class="flex w-full justify-between items-center">
      <hr class="w-[35%] border-t-2 border-black">
      <h1 class="text-[36px] text-center font-bold px-4">Личный кабинет</h1>
      <hr class="w-[35%] border-t-2 border-black">
    </div>

    <form @submit.prevent="submitForm" class="account-form flex flex-col gap-y-8 mt-[50px] md:flex">
      <!-- Имя -->
      <AccountInput 
        v-model="form.firstName" 
        label="Имя" 
        :required="true"
      />

      <!-- Город -->
      <AccountInput 
        v-model="form.city" 
        label="Город" 
        placeholder="Введите ваш город"
        :required="true"
      />

      <!-- Email с валидацией -->
      <AccountInput 
        v-model="form.email" 
        label="Email" 
        type="email" 
        :validator="emailValidator" 
        placeholder="name@example.com"
        :required="true"
      />

      <!-- Дата Рождения -->
      <AccountInput 
        v-model="form.birthDate" 
        label="Дата Рождения" 
        type="date" 
        :required="true"
      />

      <!-- Паспорт -->
      <AccountInput 
        v-model="form.passport" 
        label="Серия и номер паспорта" 
        placeholder="XXXX XXXXXX"
        :required="true"
      />

      <!-- Чекбокс, определяющий роль (водитель или попутчик) -->
      <div class="checkbox-wrapper">
        <label>
          <input type="checkbox" v-model="isDriver" />
          Я водитель
        </label>
      </div>

      <!-- Если пользователь водитель, показываем поле для водительских прав -->
      <AccountInput 
        v-if="isDriver" 
        v-model="form.driverLicense" 
        label="Водительские права" 
        placeholder="Номер водительских прав"
        :required="isDriver"
      />

      <!-- Пароль -->
      <AccountInput 
        v-model="form.password" 
        label="Пароль" 
        type="password" 
        :required="true"
      />

      <button type="submit">Сохранить</button>
    </form>
    <button @click="logout">Выйти</button>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios'; // Подключаем axios для HTTP-запросов
import AccountInput from '@/components/inputs/AccountInput.vue';

const router = useRouter();
const authStore = useAuthStore();

const userName = computed(() => authStore.userName);

// Флаг для определения, является ли пользователь водителем
const isDriver = ref(false);

// Структура формы аккаунта
const form = reactive({
  firstName: '',
  city: '',
  email: '',
  phone: '',
  birthDate: '',
  passport: '',
  driverLicense: '',
  password: ''
});

// Загружаем профиль при монтировании страницы
onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
      authStore.logout();
    }
  } else if (!authStore.isAuthenticated) {
    router.push('/login');
  }

  // **Автозаполнение формы данными пользователя**
  if (authStore.user) {
    form.firstName = authStore.user.name || '';
    form.email = authStore.user.email || '';
    form.phone = authStore.user.phone || '';
    form.city = authStore.user.city || '';
    form.birthDate = authStore.user.birthDate || '';
    form.passport = authStore.user.passport || '';
    form.driverLicense = authStore.user.driverLicense || '';
    isDriver.value = authStore.user.isDriver || false;
  }
});

// Обновляем форму, если данные `authStore.user` изменятся после загрузки
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    form.firstName = newUser.name || '';
    form.email = newUser.email || '';
    form.phone = newUser.phone || '';
    form.city = newUser.city || '';
    form.birthDate = newUser.birthDate || '';
    form.passport = newUser.passport || '';
    form.driverLicense = newUser.driverLicense || '';
    isDriver.value = newUser.isDriver || false;
  }
}, { immediate: true });

const logout = () => {
  authStore.logout();
};

// Валидация email
const emailValidator = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Неверный формат email.';
  }
  return '';
};

// **Функция обновления профиля пользователя**
const submitForm = async () => {
  try {
    // собираем «сырые» данные
    const raw = {
      name:        form.firstName,
      city:        form.city,
      email:       form.email,
      phone:       form.phone,
      birthDate:   form.birthDate,
      passport:    form.passport,
      isDriver:    isDriver.value,
      driverLicense: form.driverLicense,
      // пароль не трогаем, если у пользователя нет поля для его смены
    };

    // удаляем пустые поля
    const payload = {};
    Object.entries(raw).forEach(([k, v]) => {
      if (v !== '' && v != null) payload[k] = v;
    });

    console.log("Отправка данных аккаунта:", payload);

    const { data } = await axios.put(
      'http://localhost:3000/api/user',
      payload,
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    );
    console.log("Ответ сервера:", data);
    alert("Данные успешно обновлены!");
  } catch (err) {
    console.error("Ошибка при обновлении профиля:", err.response?.data || err);
    alert("Ошибка при обновлении данных.");
  }
};

</script>

