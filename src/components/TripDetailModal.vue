
<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-window bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 my-10 p-6 overflow-auto">
      <button class="modal-close absolute top-2 right-2 text-gray-500 hover:text-gray-700" @click="close">
        ✕
      </button>
      <h2 class="text-2xl font-semibold mb-4">Маршрут: {{ trip.origin }} → {{ trip.destination }}</h2>

      <!-- Мини-карта маршрута -->
      <div class="h-64 mb-4">
        <RouteMapMapLibre
          :origin="[originCoords.lat, originCoords.lng]"
          :destination="[destinationCoords.lat, destinationCoords.lng]"
          width="100%"
          height="100%"
        />
      </div>

      <!-- Информация о водителе -->
      <div class="flex items-center mb-4">
        <img
          :src="avatarSrc"
          alt="Аватар водителя"
          class="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p class="font-medium">{{ trip.creator.fullName }}</p>
          <p v-if="trip.creator.phone" class="text-sm text-gray-600">Телефон: {{ trip.creator.phone }}</p>
        </div>
      </div>

      <!-- Описание -->
      <p v-if="trip.description" class="mb-4 text-gray-700">{{ trip.description }}</p>
      <p v-else class="mb-4 text-gray-500">Описание отсутствует.</p>

      <!-- Бронирование -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Количество мест:</label>
        <input
          type="number"
          min="1"
          :max="trip.availableSeats"
          v-model.number="seatsReserved"
          class="w-20 p-1 border rounded"
        />
        <span class="ml-2 text-sm text-gray-600">(доступно: {{ trip.availableSeats }})</span>
      </div>
      <button
        class="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        :disabled="!canReserve"
        @click="reserve"
      >
        Забронировать
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import RouteMapMapLibre from '@/components/maps/RouteMapMapLibre.vue'
import { geocodeCity } from '@/utils/geocode.js'
import { useRouter } from 'vue-router'

const props = defineProps({
  trip: { type: Object, required: true }
})
const emit = defineEmits(['close', 'booked'])

const seatsReserved = ref(1)
const originCoords = ref(null)
const destinationCoords = ref(null)
const router = useRouter()

// Настройка аватара
const baseUrl = import.meta.env.VITE_API_URL || ''
const avatarSrc = computed(() => {
  return props.trip.creator.photoUrl
    ? baseUrl + props.trip.creator.photoUrl
    : '/images/default-avatar.svg'
})

const canReserve = computed(() => {
  return seatsReserved.value >= 1 && seatsReserved.value <= props.trip.availableSeats
})

async function loadCoords() {
  try {
    originCoords.value = await geocodeCity(props.trip.origin)
    destinationCoords.value = await geocodeCity(props.trip.destination)
  } catch {
    originCoords.value = destinationCoords.value = null
  }
}

async function reserve() {
  const token = localStorage.getItem('token')
  const res = await fetch(`${baseUrl}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ tripId: props.trip.id, seatsReserved: seatsReserved.value })
  })
  if (res.ok) {
    emit('booked')
    close()
  } else {
    const err = await res.json()
    alert(err.message || 'Ошибка бронирования')
  }
}

function close() {
  emit('close')
}

onMounted(loadCoords)
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-window {
  position: relative;
}
.modal-close {
  font-size: 1.25rem;
  background: transparent;
  border: none;
}
</style>