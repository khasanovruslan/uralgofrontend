<template>
  <div>
    <h1 class="text-2xl mb-4">Управление событиями</h1>
    <input
      v-model="search"
      placeholder="Поиск по названию или типу"
      class="mb-4 p-2 border rounded w-full"
    />

    <table class="w-full border-collapse mb-4">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">ID</th>
          <th class="p-2 border">Название</th>
          <th class="p-2 border">Тип</th>
          <th class="p-2 border">Начало</th>
          <th class="p-2 border">Конец</th>
          <th class="p-2 border">Категория</th>
          <th class="p-2 border">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="e in filtered"
          :key="e.id"
          class="hover:bg-gray-50"
        >
          <td class="p-2 border">{{ e.id }}</td>
          <td class="p-2 border">{{ e.title }}</td>
          <td class="p-2 border">{{ e.type }}</td>
          <td class="p-2 border">{{ formatDate(e.startTime) }}</td>
          <td class="p-2 border">{{ formatDate(e.endTime) }}</td>
          <td class="p-2 border">{{ e.category || '—' }}</td>
          <td class="p-2 border space-x-2">
            <button @click="openModal(e)" class="px-2 py-1 bg-blue-500 text-white rounded">✏️</button>
            <button @click="del(e.id)" class="px-2 py-1 bg-red-500 text-white rounded">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="openModal(null)" class="mb-4 px-4 py-2 bg-green-600 text-white rounded">
      Новое событие
    </button>

    <!-- Модалка -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded w-96">
        <h2 class="text-xl mb-4">
          {{ form.id ? 'Редактировать' : 'Новое' }} событие
        </h2>
        <div class="space-y-2">
          <input v-model="form.title" placeholder="Название" class="w-full p-2 border rounded" />
          <input v-model="form.type" placeholder="Тип" class="w-full p-2 border rounded" />
          <input v-model="form.address" placeholder="Адрес" class="w-full p-2 border rounded" />
          <input type="datetime-local" v-model="form.startTime" class="w-full p-2 border rounded" />
          <input type="datetime-local" v-model="form.endTime" class="w-full p-2 border rounded" />
          <input v-model="form.category" placeholder="Категория" class="w-full p-2 border rounded" />
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button @click="showModal = false" class="px-4 py-2">Отмена</button>
          <button @click="save()" class="px-4 py-2 bg-green-600 text-white rounded">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axiosInstance'
import dayjs from 'dayjs'

const events     = ref([])
const search     = ref('')
const showModal  = ref(false)
const form       = ref({
  id: null,
  title: '',
  type: '',
  address: '',
  startTime: '',
  endTime: '',
  category: ''
})

// Загрузка списка
async function fetch() {
  events.value = (await api.get('/admin/events')).data
}
onMounted(fetch)

// Фильтрация
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return events.value.filter(e =>
    e.title.toLowerCase().includes(term) ||
    e.type.toLowerCase().includes(term)
  )
})

// Формат даты
function formatDate(dt) {
  return dt ? dayjs(dt).format('YYYY-MM-DD HH:mm') : '—'
}

// Удаление
async function del(id) {
  if (!confirm('Удалить событие?')) return
  await api.delete(`/admin/events/${id}`)
  await fetch()
}

// Открыть/скрыть модалку
function openModal(evt) {
  if (evt) {
    form.value = {
      id: evt.id,
      title: evt.title,
      type: evt.type,
      address: evt.address || '',
      startTime: dayjs(evt.startTime).format('YYYY-MM-DDTHH:mm'),
      endTime: dayjs(evt.endTime).format('YYYY-MM-DDTHH:mm'),
      category: evt.category || ''
    }
  } else {
    form.value = { id: null, title: '', type: '', address: '', startTime: '', endTime: '', category: '' }
  }
  showModal.value = true
}

// Сохранение
async function save() {
  
    const payload = {
    title:      form.value.title,
    type:       form.value.type,
    address:    form.value.address || null,
    startTime:  form.value.startTime && dayjs(form.value.startTime).isValid()
        ? dayjs(form.value.startTime).toISOString()
        : null,
    endTime:    form.value.endTime && dayjs(form.value.endTime).isValid()
        ? dayjs(form.value.endTime).toISOString()
        : null,
    category:   form.value.category || null
    }

  try {
    if (form.value.id) {
      await api.put(`/admin/events/${form.value.id}`, payload)
    } else {
      await api.post(`/admin/events`, payload)
    }
    showModal.value = false
    await fetch()
  } catch (err) {
    alert(err.response?.data?.message || err.message)
  }
}
</script>
