<template>
  <div class="xl:flex justify-center mt-5">
    <div class="trip-block w-[1060px] h-[220px] bg-[#f1f1f1] rounded-[35px] flex justify-between p-6">
      <div class="flex flex-col">
        <div class="flex items-center text-[24px] font-semibold tracking-wide">
          <p class="mr-3">{{ trip.origin }}</p>
          <img src="/images/fromToArrow.svg" alt="" class="mr-3" />
          <p>{{ trip.destination }}</p>
        </div>
          <p class="mt-3 font-light text-[24px]">
          {{ formatDate(trip.departureTime) }}      <!-- camelCase -->
        </p>
        <p class="mt-3 font-light text-[24px]">
          Свободных мест: {{ trip.availableSeats }} <!-- camelCase -->
        </p>
      </div>

      <div class="flex flex-col justify-between text-end">
        <p
          v-if="trip.price !== null"
          class="text-[24px] font-semibold tracking-wide"
        >
          {{ Math.round(trip.price) }} ₽
        </p>
        <p
          v-else
          class="text-[24px] font-semibold tracking-wide"
        >
          Цена не указана
        </p>
        <button class="w-[223px] h-[40px] bg-contain bg-center bg-no-repeat" 
                style="background-image: url(/images/bookTrip.svg)">
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  trip: { type: Object, required: true }
})

function formatDate(dt) {
  const d = new Date(dt);
  return d.toLocaleString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
</script>

<style scoped>
.trip-block {
  margin: 10px 0;
}
</style>
