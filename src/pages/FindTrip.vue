<template>
  <main>
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

          <!-- PASSENGERS COUNT (скрываем, пока без фильтра) -->
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
    <div class="h-[300px]"></div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cities = ref([])
const from = ref('')
const to = ref('')
const date = ref('')
const passengers = ref(1)

const showFrom = ref(false)
const showTo = ref(false)

const minDate = new Date().toISOString().split('T')[0]

async function fetchCities() {
  try {
    const res = await fetch('https://gist.githubusercontent.com/gorborukov/0722a93c35dfba96337b/raw/435b297ac6d90d13a68935e1ec7a69a225969e58/russia')
    cities.value = await res.json()
  } catch (e) {
    console.error('Ошибка загрузки городов:', e)
  }
}

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
    from.value = city; showFrom.value = false
  } else {
    to.value = city; showTo.value = false
  }
}

function onFind() {
  if (!from.value || !to.value || !date.value) {
    alert('Заполните все поля поиска')
    return
  }
  if (new Date(date.value) < new Date()) {
    alert('Выберите будущую дату')
    return
  }
  router.push({
    path: '/results',
    query: { from: from.value, to: to.value, date: date.value, pax: passengers.value }
  })
}

onMounted(fetchCities)
</script>

<style scoped>
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
