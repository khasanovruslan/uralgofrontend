<!-- File: src/pages/FindResults.vue -->
<template>
  <main>
    <!-- 1. Форма поиска -->
    <div class="hidden h-[300px] xl:flex flex-col items-center justify-center">
      <p class="font-extrabold text-[48px] tracking-wide">Найти попутку</p>
      <div class="flex justify-between mt-[30px] w-screen items-center font-Montserrat text-[20px]">
        <div class="border-t border-black w-[160px]"></div>

        <div class="border border-black rounded-[155px] w-[1080px] h-[72px] flex items-center justify-between p-2">

          <!-- FROM -->
          <div class="w-[180px]">
            <GeoSearch
              v-model="from"
              placeholder="Откуда"
              @select="opt => from = opt.name"
            />
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <!-- TO -->
          <div class="w-[180px]">
            <GeoSearch
              v-model="to"
              placeholder="Куда"
              @select="opt => to = opt.name"
            />
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <!-- DATE -->
          <div class="flex items-center justify-around w-[199px] h-full">
            <input
              v-model="date"
              type="date"
              :min="minDate"
              class="w-[160px] h-[30px]"
            />
            <img src="/images/calendarMonth.svg" class="w-[32px] h-[33px]" />
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <!-- PASSENGERS -->
          <div class="w-[140px]">
            <select v-model.number="passengers" class="w-full h-full rounded-lg appearance-none ml-[20px]">
              <option v-for="n in 4" :key="n" :value="n">{{ n }} человек</option>
            </select>
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <!-- FIND BUTTON -->
          <button
            class="w-[232px] h-[39px] bg-contain bg-no-repeat"
            style="background-image: url(/images/findTripPageFindBtn.svg);"
            @click="onFind"
          />
        </div>

        <div class="border-t border-black w-[160px]"></div>
      </div>
    </div>

    <!-- 2. Мобильная форма -->
    <div class="xl:hidden flex flex-col items-center px-4">
      <p class="text-[24px] font-extrabold mt-12 text-center">Найти попутку</p>
      <div class="border-t border-black w-full my-2"></div>

      <form @submit.prevent="onFind" class="w-full max-w-sm flex flex-col space-y-4">
        <!-- Откуда / Куда -->
        <div class="flex items-start space-x-2">
          <img src="/images/createTripPageArrows.svg"
               alt=""
               class="h-7 rotate-90 flex-shrink-0 mt-8" />
          <div class="flex-1 flex flex-col mt-4 space-y-4">
            <GeoSearch
              v-model="from"
              placeholder="Откуда?"
              @select="opt => from = opt.name"
              class="w-full font-montserrat font-semibold text-[16px] text-black"
            />
            <GeoSearch
              v-model="to"
              placeholder="Куда?"
              @select="opt => to = opt.name"
              class="w-full font-montserrat font-semibold text-[16px] text-black"
            />
          </div>
        </div>

        <!-- DATE -->
        <div class="relative">
          <input
            v-model="date"
            type="date"
            :min="minDate"
            class="w-full font-montserrat font-semibold text-[20px] outline-none border-b border-black"
          />
        </div>

        <!-- PASSENGERS -->
        <div class="flex justify-between items-center">
          <p class="font-montserrat font-semibold text-[16px]">Пассажиров</p>
          <select
            v-model.number="passengers"
            class="outline-none border border-black w-12 h-10 rounded-full text-center font-montserrat font-semibold text-[16px]"
          >
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <!-- FIND BUTTON -->
        <div class="flex justify-center mt-4">
          <button
            type="submit"
            class="outline-none border-none bg-white w-[232px] h-[39px] bg-contain bg-no-repeat"
            style="background-image: url(/images/findTripPageFindBtn.svg);"
          ></button>
        </div>
      </form>
    </div>

    <!-- 3. Список результатов -->
    <div class="trip-results mt-8 px-6">
      <TripBlock
        v-for="trip in trips"
        :key="trip.id"
        :trip="trip"
        @select="openModal"
      />
      <p v-if="trips.length === 0" class="text-center text-gray-500 mt-6">
        Поездок не найдено
      </p>
    </div>

    <div>
      <div class="h-[200px]"></div>
    </div>

    <!-- 4. Модалка деталей и бронирования -->
    <TripDetailModal
      v-if="selectedTrip"
      :trip="selectedTrip"
      @close="selectedTrip = null"
      @booked="onBooked"
    />
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import GeoSearch        from '@/components/maps/GeoSearch.vue'
import TripBlock        from '@/components/TripBlock.vue'
import TripDetailModal  from '@/components/TripDetailModal.vue'
import api              from '@/api/axiosInstance'

const router = useRouter()
const route  = useRoute()

// reactive fields
const from       = ref(route.query.from || '')
const to         = ref(route.query.to   || '')
const date       = ref(route.query.date || '')
const passengers = ref(Number(route.query.pax) || 1)
const minDate    = new Date().toISOString().split('T')[0]

// trips & modal
const trips        = ref([])
const selectedTrip = ref(null)

// fetch trips
async function fetchTrips() {
  if (!from.value || !to.value || !date.value) {
    trips.value = []
    return
  }
  const params = new URLSearchParams({
    origin:      from.value,
    destination: to.value,
    date:        date.value,
    pax:         passengers.value
  })
  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')

  const res = await api.get(`/trips?${params.toString()}`)
  if (res.status === 401) return router.push('/login')
  trips.value = res.data
}

// onFind
function onFind() {
  if (!from.value || !to.value || !date.value) {
    alert('Заполните все поля')
    return
  }
  if (new Date(date.value) < new Date(minDate)) {
    alert('Выберите будущую дату')
    return
  }
  router.push({
    path: '/results',
    query: {
      from: from.value,
      to:   to.value,
      date: date.value,
      pax:  passengers.value
    }
  })
}

// open modal
function openModal(trip) {
  selectedTrip.value = trip
}
function onBooked() {
  selectedTrip.value = null
  fetchTrips()
}

// react to URL-changes
watch(() => route.query, () => {
  from.value       = route.query.from || ''
  to.value         = route.query.to   || ''
  date.value       = route.query.date || ''
  passengers.value = Number(route.query.pax) || 1
  fetchTrips()
})

// init
onMounted(fetchTrips)
</script>

<style scoped>
.trip-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
