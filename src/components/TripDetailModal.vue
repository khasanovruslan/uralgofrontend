<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-window bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 my-10 p-6 overflow-auto">
      <button class="modal-close absolute top-2 right-2 text-gray-500 hover:text-gray-700" @click="close">
        ✕
      </button>
      <h2 class="text-2xl font-semibold mb-4">Маршрут: {{ trip.origin }} → {{ trip.destination }}</h2>

      <!-- Мини-карта -->
      <div class="h-64 mb-4">
        <RouteMapMapLibre
          v-if="originCoords && destinationCoords"
          :origin="originCoords"
          :destination="destinationCoords"
          width="100%"
          height="100%"
        />
        <p v-else class="text-center text-gray-500">Загрузка карты...</p>
      </div>

      <!-- Водитель -->
      <div class="flex items-center mb-4">
        <img
          :src="avatarSrc"
          alt="Аватар водителя"
          class="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p class="font-medium">{{ trip.creator.fullName }}</p>
          <p v-if="trip.creator.phone" class="text-sm text-gray-600">
            Телефон: {{ trip.creator.phone }}
          </p>
        </div>
      </div>

      <!-- Описание -->
      <p v-if="trip.description" class="mb-4 text-gray-700">{{ trip.description }}</p>
      <p v-else class="mb-4 text-gray-500">Описание отсутствует.</p>

      <!-- Выбор мест -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Количество мест:</label>
        <input
          type="number"
          min="1"
          :max="trip.seats"
          v-model.number="seatsReserved"
          class="w-20 p-1 border rounded"
        />
        <span class="ml-2 text-sm text-gray-600">(доступно: {{ trip.seats }})</span>
      </div>

      <!-- Кнопка -->
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RouteMapMapLibre from '@/components/maps/RouteMapMapLibre.vue'
import { geocodeCity } from '@/utils/geocode.js'

const props = defineProps({
  trip: { type: Object, required: true }
})
const emit = defineEmits(['close', 'booked'])
const router = useRouter()

const seatsReserved   = ref(1)
const originCoords    = ref(null)
const destinationCoords = ref(null)
const baseUrl         = import.meta.env.VITE_API_URL || ''
const avatarSrc       = computed(() =>
  props.trip.creator.photoUrl
    ? `${baseUrl}${props.trip.creator.photoUrl}`
    : '/images/default-avatar.svg'
)
const canReserve      = computed(() =>
  seatsReserved.value >= 1 &&
  seatsReserved.value <= props.trip.seats &&
  props.trip.allowBooking
)


async function loadCoords() {
  try {
  const oRes = await geocodeCity(props.trip.origin)    // oRes = [{ lat, lon, …}, …]
   const dRes = await geocodeCity(props.trip.destination)
   if (!Array.isArray(oRes) || !oRes.length || !Array.isArray(dRes) || !dRes.length) {
     throw new Error('не удалось получить координаты')
   }
   originCoords.value      = [ parseFloat(oRes[0].lat), parseFloat(oRes[0].lon) ]
   destinationCoords.value = [ parseFloat(dRes[0].lat), parseFloat(dRes[0].lon) ]
  } catch (err) {
    console.error(err)
  }
}

async function reserve() {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        tripId:        props.trip.id,
        seatsReserved: seatsReserved.value
      })
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Ошибка бронирования')
    }

    // Успех!
    emit('booked')
    close()

    // Окно-подтверждение с переходом
    const go = window.confirm(
      'Вы успешно забронировали поездку! Перейти в «Актуальные бронирования»?'
    )
    if (go) {
      router.push('/my-trips')  // адаптируйте путь под ваш роут
    }
  } catch (err) {
    alert(err.message)
  }
}

function close() {
  emit('close')
}

onMounted(loadCoords)
</script>

<style scoped>
.modal-backdrop {
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-window {
  position: relative;
}
.modal-close {
  font-size: 1.25rem; background: none; border: none;
}
</style>
