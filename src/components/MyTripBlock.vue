<template>
  <div class="xl:flex justify-center mt-5">
    <div
      class="trip-block w-[1060px] h-auto bg-[#f1f1f1] rounded-[35px] flex justify-between p-6 cursor-pointer hover:shadow-lg transition-shadow"
      @click="$emit('select', trip)"
    >
      <div class="flex items-start space-x-4">
        <!-- Аватар водителя -->
        <img
          :src="avatarSrc"
          alt="Аватар водителя"
          class="w-12 h-12 rounded-full object-cover"
        />
        <div class="flex flex-col">
          <!-- Маршрут -->
          <div class="flex items-center text-[24px] font-semibold tracking-wide">
            <p class="mr-3">{{ shortOrigin }}</p>
            <img src="/images/fromToArrow.svg" alt="→" class="mr-3" />
            <p>{{ shortDestination }}</p>
          </div>

          <!-- Имя водителя -->
          <p class="mt-2 text-[18px] font-medium text-gray-700">
            {{ trip.creator.fullName }}
          </p>

          <!-- Дата и время -->
          <p class="mt-1 text-[16px] font-light text-gray-600">
            {{ formatDate(trip.departureTime) }}
          </p>

          <!-- Свободные места -->
          <p class="mt-1 text-[16px] font-light text-gray-600">
            Свободных мест: {{ trip.seats }}
          </p>

          <!-- Описание поездки, если есть -->
          <p v-if="trip.description" class="mt-1 text-[14px] text-gray-500">
            {{ trip.description }}
          </p>
        </div>
      </div>

      <!-- Цена и кнопки -->
      <div class="flex flex-col justify-between items-end">
        <p v-if="trip.price !== null" class="text-[24px] font-semibold tracking-wide">
          {{ formattedPrice }} ₽
        </p>
        <p v-else class="text-[24px] font-semibold tracking-wide">
          Цена не указана
        </p>

        <div class="flex gap-2">
          <button
            class="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            @click.stop="confirmCancel"
          >
            Отменить
          </button>
          <button
            class="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            @click.stop="openChat"
          >
            Чат
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка подтверждения отмены -->
    <div v-if="showConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <p class="mb-4">Вы уверены, что хотите отменить эту поездку?</p>
        <div class="flex justify-center gap-4">
          <button class="px-4 py-1 bg-gray-300 rounded-lg" @click="showConfirm = false">
            Нет
          </button>
          <button class="px-4 py-1 bg-red-500 text-white rounded-lg" @click="cancelTrip">
            Да, отменить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import { useAuthStore } from '@/store/authStore'

const props = defineProps({
  trip: { type: Object, required: true }
})

const emit = defineEmits(['cancelled'])

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const avatarSrc = computed(() =>
  props.trip.creator.photoUrl
    ? `${baseUrl}${props.trip.creator.photoUrl}`
    : '/images/default-avatar.svg'
)

const formattedPrice = computed(() => {
  const p = Number(props.trip.price)
  return isNaN(p) ? '0.00' : p.toFixed(2)
})

function shortText(str) {
  return (str || '').split(',').slice(0, 1).map(s => s.trim()).join(', ')
}

const shortOrigin = computed(() => shortText(props.trip.origin))
const shortDestination = computed(() => shortText(props.trip.destination))

function formatDate(dt) {
  const d = new Date(dt)
  return d.toLocaleString('ru-RU', {
    year:   'numeric',
    month:  'long',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit'
  })
}

// Логика кнопок
const router = useRouter()
const showConfirm = ref(false)
const authStore = useAuthStore()

function confirmCancel() {
  showConfirm.value = true
}

async function cancelTrip() {
  showConfirm.value = false
  try {
    if (props.trip.creatorId === authStore.user.id) {
      await api.delete(`/trips/${props.trip.id}`) // для создателя поездки
    } else {
      await api.delete(`/bookings/${props.trip.bookingId}`)
    }
    emit('cancelled', props.trip.id)
  } catch (e) {
    alert(e.response?.data?.message || 'Ошибка отмены поездки')
  }
}

function openChat() {
  router.push({ name: 'trip-chat', params: { id: props.trip.id } })
}
</script>


<style scoped>
.trip-block {
  margin: 10px 0;
}
</style>
