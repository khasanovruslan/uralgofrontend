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
            <p class="mr-3">{{ trip.origin }}</p>
            <img src="/images/fromToArrow.svg" alt="→" class="mr-3" />
            <p>{{ trip.destination }}</p>
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

      <!-- Цена и кнопка бронирования -->
      <div class="flex flex-col justify-between text-end">
        <p v-if="trip.price !== null" class="text-[24px] font-semibold tracking-wide">
          {{ formattedPrice }} ₽
        </p>
        <p v-else class="text-[24px] font-semibold tracking-wide">
          Цена не указана
        </p>
        <button
          class="w-[223px] h-[40px] bg-contain bg-center bg-no-repeat mt-2"
          :style="{ backgroundImage: 'url(/images/bookTrip.svg)' }"
          :disabled="!trip.allowBooking || trip.seats === 0"
          :class="{ 'opacity-50 cursor-not-allowed': !trip.allowBooking || trip.seats === 0 }"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  trip: { type: Object, required: true }
})

// Базовый URL для изображений (API)
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Источник аватара с заглушкой
const avatarSrc = computed(() =>
  props.trip.creator.photoUrl
    ? `${baseUrl}${props.trip.creator.photoUrl}`
    : '/images/default-avatar.svg'
)

// Форматированная цена с двумя знаками после точки
const formattedPrice = computed(() => {
  const p = Number(props.trip.price)
  return isNaN(p) ? '0.00' : p.toFixed(2)
})

// Форматирование даты и времени
function formatDate(dt) {
  const d = new Date(dt)
  return d.toLocaleString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>

<style scoped>
.trip-block {
  margin: 10px 0;
}
</style>
