<template>
  <main>
    <!-- 1. Форма поиска -->
    <div class="hidden h-[300px] xl:flex flex-col items-center justify-center">
      <p class="font-extrabold text-[48px] tracking-wide">Найти попутку</p>
      <div class="flex justify-between mt-[30px] w-screen items-center font-Montserrat text-[20px]">
        <div class="border-t border-black w-[160px]"></div>
        <div class="border border-black rounded-[155px] w-[1080px] h-[72px] flex items-center justify-between p-2">
          
          <!-- FROM -->
          <div class="relative w-[180px]">
            <input
              v-model="from"
              @input="showSuggestions('from')"
              type="text"
              placeholder="откуда"
              class="w-full h-full text-center"
            />
            <ul
              v-if="showFrom"
              class="autocomplete-suggestions absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg"
            >
              <li
                v-for="c in filteredCities(from)" :key="c.city"
                class="autocomplete-suggestion"
                @click="select('from', c.city)"
              >{{ c.city }}</li>
            </ul>
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <!-- TO -->
          <div class="relative w-[180px]">
            <input
              v-model="to"
              @input="showSuggestions('to')"
              type="text"
              placeholder="куда"
              class="w-full h-full text-center"
            />
            <ul
              v-if="showTo"
              class="autocomplete-suggestions absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg"
            >
              <li
                v-for="c in filteredCities(to)" :key="c.city"
                class="autocomplete-suggestion"
                @click="select('to', c.city)"
              >{{ c.city }}</li>
            </ul>
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

    <!-- 2. Параметры запроса -->
    <div class="text-center my-6">
      <h2 class="text-xl font-semibold">
        Поездки из {{ from }} в {{ to }} на {{ formatDate(date) }}
      </h2>
    </div>

    <!-- 3. Список результатов -->
    <div class="trip-results mt-10 space-y-4">
      <TripBlock
        v-for="trip in trips"
        :key="trip.id"
        :trip="trip"
        @select="openModal"
      />
      <p v-if="trips.length === 0" class="text-center text-gray-500">
        Поездок не найдено
      </p>
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
import TripBlock          from '@/components/TripBlock.vue'
import TripDetailModal    from '@/components/TripDetailModal.vue'
import { geocodeCity }    from '@/utils/geocode.js'

// Роутер и параметры
const router = useRouter()
const route  = useRoute()

// Поисковая форма
const cities     = ref([])
const from       = ref(route.query.from || '')
const to         = ref(route.query.to   || '')
const date       = ref(route.query.date || '')
const passengers = ref(Number(route.query.pax) || 1)
const minDate    = new Date().toISOString().split('T')[0]
const showFrom   = ref(false)
const showTo     = ref(false)

// Результаты и модалка
const trips        = ref([])
const selectedTrip = ref(null)

// Фильтрация автокомплита
function filteredCities(q) {
  if (!q) return []
  return cities.value.filter(c =>
    c.city.toLowerCase().startsWith(q.toLowerCase())
  )
}
function showSuggestions(field) {
  if (field === 'from') showFrom.value = true
  else                  showTo.value   = true
}
function select(field, city) {
  if (field === 'from') { from.value = city; showFrom.value = false }
  else                   { to.value   = city; showTo.value   = false }
}

// Формат даты для заголовков
function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

// Навигация при поиске
function onFind() {
  if (!from.value || !to.value || !date.value) {
    return alert('Заполните все поля поиска')
  }
  if (new Date(date.value) < new Date(minDate)) {
    return alert('Выберите будущую дату')
  }
  router.push({
    path: '/results',
    query: {
      from, to, date,
      pax: passengers.value
    }
  })
}

// Загрузка списка городов (ваш JSON или свой API)

async function fetchCities(query) {
  if (!query) {
    cities.value = []
    return
  }
  try {
    const res = await fetch(`/api/geonames?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error(res.statusText)
    cities.value = await res.json()
  } catch (e) {
    console.error('Ошибка GeoNames-прокси:', e)
    cities.value = []
  }
}

// Запрос поездок
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
  const url   = `${import.meta.env.VITE_API_URL}/api/trips?${params}`
  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (res.status === 401) return router.push('/login')
  if (!res.ok) throw new Error(res.statusText)
  trips.value = await res.json()
}

// Открыть модалку
function openModal(trip) {
  selectedTrip.value = trip
}

// После успешного бронирования — обновляем список и закрываем
function onBooked() {
  selectedTrip.value = null
  fetchTrips()
}

// Следим за изменением query, обновляем всё
watch(() => route.query, () => {
  from.value       = route.query.from || ''
  to.value         = route.query.to   || ''
  date.value       = route.query.date || ''
  passengers.value = Number(route.query.pax) || 1
  fetchTrips()
})

// Начальная инициализация
onMounted(async () => {
  await fetchCities()
  await fetchTrips()
})
</script>

<style scoped>
.autocomplete-suggestions {
  list-style: none;
  margin: 0;
  padding: 0;
}
.autocomplete-suggestion {
  padding: 8px;
  cursor: pointer;
}
.autocomplete-suggestion:hover {
  background: #f0f0f0;
}
.trip-results {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
