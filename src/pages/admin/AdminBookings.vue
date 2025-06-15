<template>
  <div>
    <h1 class="text-2xl mb-4">Управление бронированиями</h1>
    <input
      v-model="search"
      placeholder="Поиск по пользователю или поездке"
      class="mb-4 p-2 border rounded w-full"
    />

    <table class="w-full border-collapse mb-4">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">ID</th>
          <th class="p-2 border">Пользователь ID</th>
          <th class="p-2 border">Поездка ID</th>
          <th class="p-2 border">Мест</th>
          <th class="p-2 border">Статус</th>
          <th class="p-2 border">Дата создания</th>
          <th class="p-2 border">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="b in filtered"
          :key="b.id"
          class="hover:bg-gray-50"
        >
          <td class="p-2 border">{{ b.id }}</td>
          <td class="p-2 border">{{ b.userId }}</td>
          <td class="p-2 border">{{ b.tripId }}</td>
          <td class="p-2 border">{{ b.seatsReserved }}</td>
          <td class="p-2 border">{{ b.status }}</td>
          <td class="p-2 border">{{ formatDate(b.createdAt) }}</td>
          <td class="p-2 border space-x-2">
            <button @click="openModal(b)" class="px-2 py-1 bg-blue-500 text-white rounded">✏️</button>
            <button @click="del(b.id)" class="px-2 py-1 bg-red-500 text-white rounded">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="openModal(null)" class="mb-4 px-4 py-2 bg-green-600 text-white rounded">
      Новое бронирование
    </button>

    <!-- Модалка -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded w-96">
        <h2 class="text-xl mb-4">
          {{ form.id ? 'Редактировать' : 'Новое' }} бронирование
        </h2>
        <div class="space-y-2">
          <input type="number" v-model.number="form.userId" placeholder="User ID" class="w-full p-2 border rounded" />
          <input type="number" v-model.number="form.tripId" placeholder="Trip ID" class="w-full p-2 border rounded" />
          <input type="number" v-model.number="form.seatsReserved" placeholder="Мест зарезервировано" class="w-full p-2 border rounded" />
          <select v-model="form.status" class="w-full p-2 border rounded">
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="canceled">canceled</option>
          </select>
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

const bookings   = ref([])
const search     = ref('')
const showModal  = ref(false)
const form       = ref({
  id: null,
  userId: null,
  tripId: null,
  seatsReserved: 1,
  status: 'pending'
})

// Fetch
async function fetch() {
  bookings.value = (await api.get('/admin/bookings')).data
}
onMounted(fetch)

// Filter
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return bookings.value.filter(b =>
    String(b.userId).includes(term) ||
    String(b.tripId).includes(term)
  )
})

// Format date
function formatDate(dt) {
  return dayjs(dt).format('YYYY-MM-DD HH:mm')
}

// Delete
async function del(id) {
  if (!confirm('Удалить бронирование?')) return
  await api.delete(`/admin/bookings/${id}`)
  await fetch()
}

// Modal
function openModal(bk) {
  if (bk) {
    form.value = {
      id: bk.id,
      userId: bk.userId,
      tripId: bk.tripId,
      seatsReserved: bk.seatsReserved,
      status: bk.status
    }
  } else {
    form.value = { id: null, userId: null, tripId: null, seatsReserved: 1, status: 'pending' }
  }
  showModal.value = true
}

// Save
async function save() {
  const payload = {
    userId:       form.value.userId,
    tripId:       form.value.tripId,
    seatsReserved: form.value.seatsReserved,
    status:       form.value.status
  }

  try {
    if (form.value.id) {
      await api.put(`/admin/bookings/${form.value.id}`, payload)
    } else {
      await api.post(`/admin/bookings`, payload)
    }
    showModal.value = false
    await fetch()
  } catch (err) {
    alert(err.response?.data?.message || err.message)
  }
}
</script>
