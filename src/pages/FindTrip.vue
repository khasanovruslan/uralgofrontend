<!-- File: src/pages/FindTrip.vue -->
<template>
  <main>
    <!-- DESKTOP -->
    <div class="hidden h-[430px] xl:flex flex-col items-center justify-center">
      <p class="font-extrabold text-[48px] tracking-wide">Найти попутку</p>
      <div class="flex justify-between mt-[30px] w-screen items-center font-Montserrat text-[20px]">
        <div class="border-t border-black w-[160px]"></div>

        <div class="border border-black rounded-[155px] w-[1080px] h-[72px] flex items-center justify-between p-2">
          
          <!-- FROM -->
          <div class="w-[180px]">
            <GeoSearch
              v-model="from"
              placeholder="Откуда"
              @select="opt => { from = opt.name; fromLat = opt.lat; fromLon = opt.lon }"
              class="!border-none !px-0 !py-0 !rounded-none focus:!ring-0"
            />
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <!-- TO -->
          <div class="w-[180px]">
            <GeoSearch
              v-model="to"
              placeholder="Куда"
              @select="opt => { to = opt.name; toLat = opt.lat; toLon = opt.lon }"
              class="!border-none !px-0 !py-0 !rounded-none focus:!ring-0"
            />
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <!-- DATE -->
          <div class="flex items-center justify-around w-[199px] h-full">
            <input
              v-model="date"
              type="date"
              :min="minDate"
              class="w-[160px] h-[30px] outline-none"
            />
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <!-- PASSENGERS -->
          <div class="flex items-center w-[140px]">
            <select
              v-model="passengers"
              class="w-full h-full rounded-lg appearance-none ml-[20px]"
            >
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
          />
        </div>

        <div class="border-t border-black w-[160px]"></div>
      </div>
    </div>
    
    <!-- MOBILE -->
    <div class="xl:hidden flex flex-col items-center px-4">
      <p class="text-[24px] font-extrabold mt-12 text-center">Найти попутку</p>
      <div class="border-t border-black w-full my-2"></div>

      <form @submit.prevent="onFind" class="w-full max-w-sm flex flex-col space-y-4">
        <div class="flex items-start space-x-2">
          <img
            src="/images/createTripPageArrows.svg"
            alt=""
            class="h-7 rotate-90 flex-shrink-0 mt-8"
          />
          <div class="flex-1 flex flex-col mt-4 space-y-4">
            <GeoSearch
              v-model="from"
              placeholder="Откуда?"
              @select="opt => { from = opt.name; fromLat = opt.lat; fromLon = opt.lon }"
              class="border-b border-black font-montserrat font-semibold text-[16px] outline-none"
            />
            <GeoSearch
              v-model="to"
              placeholder="Куда?"
              @select="opt => { to = opt.name; toLat = opt.lat; toLon = opt.lon }"
              class="border-b border-black font-montserrat font-semibold text-[16px] outline-none"
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
            v-model="passengers"
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
          />
        </div>
      </form>
    </div>

    <div class="h-[200px]"></div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GeoSearch from '@/components/maps/GeoSearch.vue'

const router = useRouter()

// Параметры поиска
const from = ref('')
const fromLat = ref(null)
const fromLon = ref(null)

const to = ref('')
const toLat = ref(null)
const toLon = ref(null)

const date = ref('')
const passengers = ref(1)

const minDate = new Date().toISOString().split('T')[0]

function onFind() {
  if (!from.value || !to.value || !date.value) {
    alert('Заполните все поля поиска')
    return
  }
  router.push({
    path: '/results',
    query: {
      from:     from.value,
      fromLat:  fromLat.value,
      fromLon:  fromLon.value,
      to:       to.value,
      toLat:    toLat.value,
      toLon:    toLon.value,
      date:     date.value,
      pax:      passengers.value
    }
  })
}
</script>

<style scoped>
/* автокомплит-подсказки для мобильного */
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
