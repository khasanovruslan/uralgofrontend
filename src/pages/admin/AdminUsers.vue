<!-- File: src/pages/admin/AdminUsers.vue -->
<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Управление пользователями</h1>
      <button @click="openModal(null)"
              class="px-4 py-2 bg-green-600 text-white rounded">Новый пользователь</button>
    </div>

    <input
      v-model="search"
      type="text"
      placeholder="Поиск по имени или email"
      class="mb-4 p-2 border rounded w-full"
    />

    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">ID</th>
          <th class="p-2 border">Имя</th>
          <th class="p-2 border">Email</th>
          <th class="p-2 border">Телефон</th>
          <th class="p-2 border">Роли</th>
          <th class="p-2 border">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in filtered" :key="u.id" class="hover:bg-gray-50">
          <td class="p-2 border">{{ u.id }}</td>
          <td class="p-2 border">{{ u.fullName }}</td>
          <td class="p-2 border">{{ u.email }}</td>
          <td class="p-2 border">{{ u.phone || '—' }}</td>
          <td class="p-2 border">{{ u.roles.join(', ') }}</td>
          <td class="p-2 border space-x-2">
            <button @click="openModal(u)" class="px-2 py-1 bg-blue-500 text-white rounded">✏️</button>
            <button @click="del(u.id)" class="px-2 py-1 bg-red-500 text-white rounded">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded w-96">
        <h2 class="text-xl mb-4">{{ form.id ? 'Редактировать' : 'Новый' }} пользователя</h2>
        <div class="space-y-2">
          <input v-model="form.fullName"  placeholder="Имя" class="w-full p-2 border rounded"/>
          <input v-model="form.email"     placeholder="Email" class="w-full p-2 border rounded"/>
          <input v-model="form.phone"     placeholder="Телефон" class="w-full p-2 border rounded"/>
          <input v-model="roleInput"      placeholder="Роли (через запятую)" class="w-full p-2 border rounded"/>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button @click="show=false" class="px-4 py-2">Отмена</button>
          <button @click="save()" class="px-4 py-2 bg-green-600 text-white rounded">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axiosInstance'

const users  = ref([])
const search = ref('')
const show    = ref(false)
const form    = ref({ fullName: '', email: '', phone: '', roles: [] })
const roleInput = ref('')

// загрузка
async function fetchUsers() {
  users.value = (await api.get('/admin/users')).data
}
onMounted(fetchUsers)

// фильтрация
const filtered = computed(() =>
  users.value.filter(u =>
    u.fullName.toLowerCase().includes(search.value.toLowerCase()) ||
    u.email.toLowerCase().includes(search.value.toLowerCase())
  )
)

// открыть модалку
function openModal(u) {
  if (u) {
    form.value = { ...u }
    roleInput.value = u.roles.join(', ')
  } else {
    form.value = { fullName: '', email: '', phone: '', roles: [] }
    roleInput.value = ''
  }
  show.value = true
}

// сохранить (create/update)
async function save() {
  // Собираем чистый payload
  const payload = {
    fullName: form.value.fullName,
    email:    form.value.email,
    phone:    form.value.phone || null,
    // если в form есть birthDate, приводим к YYYY-MM-DD
    birthDate: form.value.birthDate
      ? form.value.birthDate.split('T')[0]
      : null,
    // роли как массив строк или как IDs, в зависимости от API
    roles: form.value.roles  
  };

  if (form.value.id) {
    await api.put(`/admin/users/${form.value.id}`, payload);
  } else {
    await api.post('/admin/users', payload);
  }
  show.value = false;
  await fetchUsers();
}


// удалить
async function del(id) {
  if (!confirm('Удалить пользователя?')) return
  await api.delete(`/admin/users/${id}`)
  await fetchUsers()
}
</script>
