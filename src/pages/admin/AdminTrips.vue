<template>
  <div>
    <h1 class="text-2xl mb-4">Управление поездками</h1>
    <input
      v-model="search"
      placeholder="Поиск по городу отправления или назначения"
      class="mb-4 p-2 border rounded w-full"
    />

    <table class="w-full border-collapse mb-4">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">ID</th>
          <th class="p-2 border">Откуда → Куда</th>
          <th class="p-2 border">Время</th>
          <th class="p-2 border">Мест</th>
          <th class="p-2 border">Цена</th>
          <th class="p-2 border">Статус</th>
          <th class="p-2 border">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="t in filtered"
          :key="t.id"
          class="hover:bg-gray-50"
        >
          <td class="p-2 border">{{ t.id }}</td>
          <td class="p-2 border">{{ t.origin }} → {{ t.destination }}</td>
          <td class="p-2 border">{{ formatDate(t.departureTime) }}</td>
          <td class="p-2 border">{{ t.seats }}</td>
          <td class="p-2 border">{{ t.price ?? '—' }}</td>
          <td class="p-2 border">{{ t.status }}</td>
          <td class="p-2 border space-x-2">
            <button
              @click="openModal(t)"
              class="px-2 py-1 bg-blue-500 text-white rounded"
            >✏️</button>
            <button
              @click="del(t.id)"
              class="px-2 py-1 bg-red-500 text-white rounded"
            >🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button
      @click="openModal(null)"
      class="mb-4 px-4 py-2 bg-green-600 text-white rounded"
    >Новая поездка</button>

    <!-- Модалка -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded w-96">
        <h2 class="text-xl mb-4">
          {{ form.id ? 'Редактировать' : 'Новая' }} поездка
        </h2>
        <div class="space-y-2">
          <input
            v-model="form.origin"
            placeholder="Откуда"
            class="w-full p-2 border rounded"
          />
          <input
            v-model="form.destination"
            placeholder="Куда"
            class="w-full p-2 border rounded"
          />
          <input
            type="datetime-local"
            v-model="form.departureTime"
            class="w-full p-2 border rounded"
          />
          <input
            type="number"
            v-model.number="form.seats"
            placeholder="Мест"
            class="w-full p-2 border rounded"
          />
          <input
            type="number"
            v-model.number="form.price"
            placeholder="Цена"
            step="0.01"
            class="w-full p-2 border rounded"
          />
          <select
            v-model="form.status"
            class="w-full p-2 border rounded"
          >
            <option value="planned">planned</option>
            <option value="in_progress">in_progress</option>
            <option value="finished">finished</option>
          </select>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="showModal = false"
            class="px-4 py-2"
          >Отмена</button>
          <button
            @click="save()"
            class="px-4 py-2 bg-green-600 text-white rounded"
          >Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axiosInstance'
import dayjs from 'dayjs'

const trips     = ref([])
const search    = ref('')
const showModal = ref(false)
const form      = ref({
  id: null,
  origin: '',
  destination: '',
  departureTime: '',
  seats: 1,
  price: null,
  status: 'planned'
})

// Fetch
async function fetch() {
  trips.value = (await api.get('/admin/trips')).data
}
onMounted(fetch)

// Filter
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return trips.value.filter(t =>
    t.origin.toLowerCase().includes(term) ||
    t.destination.toLowerCase().includes(term)
  )
})

// Format
function formatDate(dt) {
  return dayjs(dt).format('YYYY-MM-DD HH:mm')
}

// Delete
async function del(id) {
  if (!confirm('Удалить поездку?')) return
  await api.delete(`/admin/trips/${id}`)
  await fetch()
}

// Modal
function openModal(trip) {
  if (trip) {
    form.value = {
      id: trip.id,
      origin: trip.origin,
      destination: trip.destination,
      departureTime: dayjs(trip.departureTime).format('YYYY-MM-DDTHH:mm'),
      seats: trip.seats,
      price: trip.price,
      status: trip.status
    }
  } else {
    form.value = { id: null, origin: '', destination: '', departureTime: '', seats: 1, price: null, status: 'planned' }
  }
  showModal.value = true
}

// Save
async function save() {
  const departureISO = new Date(form.value.departureTime).toISOString()

  // price: ensure number|null
  let price = form.value.price
  if (price === '' || price === null || isNaN(price)) {
    price = null
  }

  const payload = {
    origin:        form.value.origin,
    destination:   form.value.destination,
    departureTime: departureISO,
    seats:         form.value.seats,
    price,
    status:        form.value.status,
  }

  try {
    if (form.value.id) {
      await api.put(`/admin/trips/${form.value.id}`, payload)
    } else {
      await api.post('/admin/trips', payload)
    }
    showModal.value = false
    await fetch()
  } catch (err) {
    alert(err.response?.data?.message || err.message)
  }
}
</script>
