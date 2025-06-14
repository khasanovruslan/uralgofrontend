<template>
  <div class="account-page flex flex-col pt-[5%] items-center">
    <!-- Аватар пользователя -->
    <div class="mb-6">
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="Аватар пользователя"
        class="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
      />
      <img
        v-else
        src="/images/default-avatar.svg"
        alt="Аватар по умолчанию"
        class="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
      />
    </div>

    <div class="flex w-full justify-between items-center">
      <hr class="w-[35%] border-t-2 border-black" />
      <h1 class="text-[36px] text-center font-bold px-4">Личный кабинет</h1>
      <hr class="w-[35%] border-t-2 border-black" />
    </div>

    <form @submit.prevent="submitForm" class="account-form max-w-[360px] flex flex-col gap-y-8 mt-[50px] md:flex">
      <!-- Имя -->
      <AccountInput
        v-model="form.name"
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
        placeholder="@example.com"
        :required="true"
      />

      <!-- Телефон -->
      <AccountInput
        v-model="form.phone"
        label="Телефон"
        placeholder="+7XXXXXXXXXX"
        :required="true"
      />

      <!-- Дата Рождения -->
      <AccountInput
        v-model="form.birthDate"
        label="Дата Рождения"
        type="date"
        :required="false"
      />

      <!-- Паспорт -->
      <AccountInput
        v-model="form.passport"
        label="Серия и номер паспорта"
        placeholder="XXXX XXXXXX"
        :required="false"
      />

      <!-- Выбор ролей -->
      <div class="roles-section flex flex-col gap-4">
        <label class="flex items-center">
          <input type="checkbox" v-model="form.roles" value="Driver" class="mr-2" /> Я водитель
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="form.roles" value="Guide" class="mr-2" /> Гид
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="form.roles" value="Organizer" class="mr-2" /> Организатор туров
        </label>
      </div>

      <!-- Поле водительских прав, если роль Driver -->
      <AccountInput
        v-if="form.roles.includes('Driver')"
        v-model="form.driverLicense"
        label="Водительские права"
        placeholder="Номер водительских прав"
        :required="form.roles.includes('Driver')"
      />

      <!-- Загрузка нового фото -->
      <div class="photo-section flex flex-col">
        <label>Загрузить новый аватар:</label>
        <input type="file" @change="onFileChange" accept="image/*" class="mt-2" />
      </div>

      <button type="submit" class="mt-4 bg-blue-500 text-white py-2 rounded-lg">
        Сохранить
      </button>
    </form>

    <button @click="logout" class="mt-6 text-red-500">Выйти</button>
  </div>
</template>

<script setup>
import AccountInput from '@/components/inputs/AccountInput.vue'
import defaultAvatar from '@/assets/images/default-avatar.svg'
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: '',
  city: '',
  email: '',
  phone: '',
  birthDate: '',
  passport: '',
  driverLicense: '',
  roles: []
});

const photoFile = ref(null);
const previewUrl = ref('');

function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  photoFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
}

function emailValidator(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? '' : 'Неверный формат email.';
}

async function submitForm() {
  try {
    const formData = new FormData();
    if (form.name) formData.append('fullName', form.name);
    if (form.city) formData.append('city', form.city);
    if (form.email) formData.append('email', form.email);
    if (form.phone) formData.append('phone', form.phone);
    if (form.birthDate) formData.append('birthDate', form.birthDate);
    if (form.passport) formData.append('passport', form.passport);
    if (form.driverLicense) formData.append('driverLicense', form.driverLicense);
    formData.append('roles', JSON.stringify(form.roles));
    if (photoFile.value) {
      formData.append('photo', photoFile.value);
    }

    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/user`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authStore.token}`
        }
      }
    );
    alert('Профиль успешно обновлён');
    authStore.user = data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Ошибка при обновлении профиля');
  }
}

function logout() {
  authStore.logout();
  router.push('/login');
}

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchProfile();
  }
  const u = authStore.user;
  form.name = u.fullName || '';
  form.city = u.city || '';
  form.email = u.email || '';
  form.phone = u.phone || '';
  form.birthDate = u.birth_date || '';
  form.passport = u.passport || '';
  form.driverLicense = u.driver_license || '';
  form.roles = u.roles?.map(r => r.name) || [];
  previewUrl.value = u.photoUrl
  ? `${import.meta.env.VITE_API_URL}${u.photoUrl}`
  : '';
});
</script>

<style scoped>
.preview-img {
  max-width: 120px;
  border-radius: 50%;
}
</style>
