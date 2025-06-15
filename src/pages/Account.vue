<template>
  <div class="account-page min-h-screen bg-gray-50 py-12 flex justify-center">
    <div class="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-8">
      <!-- Шапка: аватар, заголовок и выход -->
      <div class="flex items-center justify-between mb-8">
        <!-- Аватар и заголовок -->
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-500">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt="Аватар пользователя"
              class="object-cover w-full h-full"
            />
            <img
              v-else
              :src="defaultAvatar"
              alt="Аватар по умолчанию"
              class="object-cover w-full h-full"
            />
          </div>
          <h1 class="text-2xl font-semibold text-gray-800">Личный кабинет</h1>
        </div>

        <!-- Кнопка выход -->
        <button
          @click="logout"
          class="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          Выйти
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Грид для полей: 2 колонки на md+ -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountInput v-model="form.name"      label="Имя"                         :required="true" />
          <AccountInput v-model="form.city"      label="Город"      placeholder="Введите ваш город" :required="true" />
          <AccountInput v-model="form.email"     label="Email"     type="email" :validator="emailValidator" placeholder="@example.com" :required="true" />
          <AccountInput v-model="form.phone"     label="Телефон"    placeholder="+7XXXXXXXXXX"         :required="true" />
          <AccountInput v-model="form.birthDate" label="Дата Рождения" type="date"             :required="false" />
          <AccountInput v-model="form.passport"  label="Паспорт"    placeholder="XXXX XXXXXX"         :required="false" />
        </div>

        <!-- Переключатели ролей -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <label
    v-for="(label, value) in {
      Driver: 'Я водитель',
      Guide:  'Я гид',
      Organizer: 'Я организатор туров'
    }"
    :key="value"
    class="relative inline-flex items-center cursor-pointer"
  >
    <input
      type="checkbox"
      v-model="form.roles"
      :value="value"
      class="sr-only peer"
    />

    <span
      class="w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200
             peer-checked:bg-blue-500"
    ></span>

    <span
      class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow
             transform transition-transform duration-200
             peer-checked:translate-x-5"
    ></span>

    <span class="ml-3 text-gray-700">{{ label }}</span>
  </label>
</div>


        <!-- Если роль Driver -->
        <div v-if="form.roles.includes('Driver')" class="grid grid-cols-1 md:grid-cols-2">
          <AccountInput
            v-model="form.driverLicense"
            label="Водительские права"
            placeholder="Номер водительских прав"
            :required="true"
          />
        </div>

        <!-- Загрузка нового аватара -->
        <div>
          <label class="block text-gray-700 mb-2">Загрузить новый аватар</label>
          <input
            type="file"
            @change="onFileChange"
            accept="image/*"
            class="block w-full text-gray-600 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <!-- Кнопка сохранить -->
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Сохранить
        </button>
      </form>
    </div>
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
    formData.append('fullName', form.name);
    formData.append('city', form.city);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    if (form.birthDate) formData.append('birthDate', form.birthDate);
    // Всегда отправляем passport, даже если пустой
    formData.append('passport', form.passport || '');
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
  form.birthDate     = u.birthDate
                        ? u.birthDate.slice(0, 10)
                        : '';
  form.passport      = u.passport      || '';
  form.driverLicense = u.driverLicense || '';
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
