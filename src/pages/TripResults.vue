<template>
  <main>
    <!-- ФОРМА ПОИСКА -->
    <div class="hidden h-[430px] xl:flex flex-col items-center justify-center">
      <p class="font-extrabold text-[48px] tracking-wide">Найти попутку</p>
      <div class="flex justify-between mt-[30px] w-screen items-center font-Montserrat text-[20px]">
        <div class="border-t border-black w-[160px]"></div>

        <div class="border border-black rounded-[155px] w-[1080px] h-[72px] flex items-center justify-between p-2">
          <!-- FROM -->
          <div class="flex justify-center items-center w-[180px] relative">
            <input
              v-model="from"
              @input="showSuggestions('from')"
              type="text"
              placeholder="откуда"
              class="w-full h-full text-center"
            />
            <div
              v-if="showFrom"
              class="autocomplete-suggestions absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg"
            >
              <div
                v-for="city in filteredCities(from)"
                :key="city.city"
                class="autocomplete-suggestion"
                @click="select('from', city.city)"
              >{{ city.city }}</div>
            </div>
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <!-- TO -->
          <div class="flex items-center w-[180px] relative">
            <input
              v-model="to"
              @input="showSuggestions('to')"
              type="text"
              placeholder="куда"
              class="w-full h-full text-center"
            />
            <div
              v-if="showTo"
              class="autocomplete-suggestions absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg"
            >
              <div
                v-for="city in filteredCities(to)"
                :key="city.city"
                class="autocomplete-suggestion"
                @click="select('to', city.city)"
              >{{ city.city }}</div>
            </div>
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
          <div class="flex items-center w-[140px]">
            <select v-model="passengers" class="w-full h-full rounded-lg appearance-none ml-[20px]">
              <option value="1">1 человек</option>
              <option value="2">2 человека</option>
              <option value="3">3 человека</option>
              <option value="4">4 человека</option>
            </select>
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <!-- FIND BUTTON -->
          <button
            class="w-[232px] h-[39px] bg-contain bg-no-repeat"
            style="background-image: url(/images/findTripPageFindBtn.svg);"
            @click="onFind"
          ></button>
        </div>

        <div class="border-t border-black w-[160px]"></div>
      </div>
    </div>

    <!-- ВЫВОД ПАРАМЕТРОВ -->
    <div class="text-center mb-6">
      <h2 class="text-xl font-semibold">
        Поездки из {{ route.query.from }} в {{ route.query.to }} на {{ formatDate(route.query.date) }}
      </h2>
    </div>

    <!-- РЕЗУЛЬТАТЫ -->
    <div class="trip-results mt-10 space-y-4">
      <TripBlock v-for="t in trips" :key="t.id" :trip="t" />
       
    
    <MapLibreRoute :start="[55.76,37.62]" :end="[59.93,30.34]" />






      <p v-if="trips.length === 0" class="text-center text-gray-500">
        Поездок не найдено
      </p>
    </div>
    <div>
        <!-- МЕСТО 
        ДЛЯ 
        ЯНДЕКС 
        КАРТ -->

        <div class="p-4">

<section v-if="originCoords && destinationCoords" class="mb-10">
  <h2 class="text-xl font-semibold mb-2">
    Маршрут: {{ from }} → {{ to }}
  </h2>
  <RouteMapMapLibre
    :origin="[originCoords.lat, originCoords.lng]"
    :destination="[destinationCoords.lat, destinationCoords.lng]"
    width="100%"
    height="400px"
  />
</section>
  </div>

    
  </div>

    <div class="h-[290px]"></div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TripBlock from '@/components/TripBlock.vue'
import RouteMapMapLibre from '@/components/maps/RouteMapMapLibre.vue'
import { geocodeCity } from '@/utils/geocode.js'



const router = useRouter()
const route = useRoute()

// Для формы
const cities = ref([])
const from = ref(route.query.from || '')
const to = ref(route.query.to || '')
const date = ref(route.query.date || '')
const passengers = ref(Number(route.query.pax) || 1);
const originCoords      = ref(null)  // { lat, lng }
const destinationCoords = ref(null)
const showFrom = ref(false)
const showTo = ref(false)
const minDate = new Date().toISOString().split('T')[0]

function filteredCities(query) {
  return cities.value.filter(c =>
    c.city.toLowerCase().startsWith(query.toLowerCase())
  )
}
function showSuggestions(field) {
  if (field === 'from') showFrom.value = true
  else showTo.value = true
}
function select(field, city) {
  if (field === 'from') {
    from.value = city
    showFrom.value = false
  } else {
    to.value = city
    showTo.value = false
  }
}
function onFind() {
  if (!from.value || !to.value || !date.value) {
    alert('Заполните все поля поиска')
    return
  }
  if (new Date(date.value) < new Date(minDate)) {
    alert('Выберите будущую дату')
    return
  }
  router.push({
    path: '/results',
    query: { from: from.value, to: to.value, date: date.value, pax: passengers.value }
  })
}
async function fetchCities() {
  try {
    const res = await fetch('https://gist.githubusercontent.com/gorborukov/0722a93c35dfba96337b/raw/435b297ac6d90d13a68935e1ec7a69a225969e58/russia')
    cities.value = await res.json()
  } catch (e) {
    console.error('Ошибка загрузки городов:', e)
  }
}
onMounted(fetchCities)

// Для поездок
const trips = ref([])

function formatDate(rawDate) {
  if (!rawDate) return ''
  const date = new Date(rawDate)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

async function fetchTrips() {
  const { from: qFrom, to: qTo, date: qDate, pax: qPax } = route.query;
  if (!qFrom || !qTo || !qDate) {
    trips.value = [];
    return;
  }


  const params = new URLSearchParams({
    origin:      qFrom,
    destination: qTo,
    date:        qDate,
    pax:         qPax ?? '1'
  });
  const url = `${import.meta.env.VITE_API_URL}/api/trips?${params}`;

  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(res.statusText);
  trips.value = await res.json();
}

// Загружает coords для from и to
async function loadRoutes() {
  if (!from.value || !to.value) {
    originCoords.value = null
    destinationCoords.value = null
    return
  }
  try {
    originCoords.value      = await geocodeCity(from.value)
    destinationCoords.value = await geocodeCity(to.value)
  } catch (err) {
    console.error('Геокодинг не удался:', err)
    originCoords.value = destinationCoords.value = null
  }
}


onMounted(fetchCities)
onMounted(async () => {
  await fetchTrips()
  await loadRoutes()
})
 

watch(() => route.query, async (q) => {
  // обновляем поля формы…
  from.value       = q.from || ''
  to.value         = q.to   || ''
  date.value       = q.date || ''
  passengers.value = Number(q.pax) || 1

  // перезапускаем fetch и геокодинг
  await fetchTrips()
  await loadRoutes()
})


</script>

<style scoped>
.trip-results {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.autocomplete-suggestions {
  border: 1px solid #ddd;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  background: #fff;
  z-index: 10;
}
.autocomplete-suggestion {
  padding: 10px;
  cursor: pointer;
}
.autocomplete-suggestion:hover {
  background: #f0f0f0;
}
</style>
