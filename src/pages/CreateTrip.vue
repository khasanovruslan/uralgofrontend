<!-- File: src/pages/CreateTrip.vue -->
<template>
  <main>
    <!-- DESKTOP -->
    <div class="hidden xl:flex flex-col">
      <p class="text-[48px] font-extrabold ml-[200px] mt-[50px]">Создать поездку</p>
      <div class="flex">
        <div class="border-t border-black w-[120px] mt-[35px]"></div>

        <form
          @submit.prevent="createTrip"
          class="w-[712px] min-h-[500px] border border-black mt-8 rounded-[40px] flex flex-col justify-start items-center space-y-6 p-6"
        >
          <!-- From / To -->
          <div class="w-[600px] flex items-center">
            <div class="w-[200px]">
              <GeoSearch
                v-model="trip.fromWhere"
                placeholder="Откуда?"
                @select="opt => { trip.fromWhere = opt.name; trip.fromLat = opt.lat; trip.fromLon = opt.lon }"
                class="border rounded"
              />
            </div>
            <img src="/images/createTripPageArrows.svg" alt="" class="mx-5" />
            <div class="w-[200px]">
              <GeoSearch
                v-model="trip.toWhere"
                placeholder="Куда?"
                @select="opt => { trip.toWhere = opt.name; trip.toLat = opt.lat; trip.toLon = opt.lon }"
                class="border rounded"
              />
            </div>
          </div>

          <!-- Date / Time -->
          <div class="w-[600px] flex items-center">
            <input
              v-model="trip.createDate"
              :min="minDate"
              type="date"
              class="font-montserrat text-[20px] text-[#606060] outline-none border-b border-black w-[200px] text-start"
            />
            <input
              v-model="trip.createTime"
              :min="timeMin"
              type="time"
              class="ml-[78px] font-montserrat text-[20px] text-[#606060] outline-none border-b border-black w-[200px] text-start"
            />
          </div>

          <!-- Seats -->
          <div class="w-[600px] flex justify-between">
            <p class="font-montserrat text-[20px] font-normal">Свободных мест</p>
            <select
              v-model.number="trip.seats"
              class="outline-none border border-black w-10 h-10 rounded-full appearance-none font-montserrat text-[20px] text-center"
            >
              <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <!-- Allow Booking -->
          <div class="w-[600px] flex justify-between items-center">
            <p class="font-montserrat text-[20px] font-normal">
              Могут ли попутчики бронировать сразу?
            </p>
            <label class="relative inline-block w-16 h-8 cursor-pointer">
              <input v-model="trip.allowBooking" type="checkbox" class="opacity-0 w-0 h-0" />
              <span
                :class="[
                  'slider round',
                  trip.allowBooking ? 'bg-green-500' : 'bg-gray-500'
                ]"
              ></span>
              <span
                :class="[
                  'absolute h-7 w-7 bg-white rounded-full transition-transform top-[2px] left-[2px]',
                  trip.allowBooking ? 'translate-x-7' : 'translate-x-0'
                ]"
              ></span>
            </label>
          </div>

          <!-- Price -->
          <div class="w-[600px] flex justify-between items-center">
            <p class="font-montserrat text-[20px] font-normal">
              Цена поездки? (за одного)
            </p>
            <div class="flex items-center">
              <input
                v-model.number="trip.pricePerPassenger"
                type="number"
                class="outline-none w-[80px] h-10 border border-black rounded-full font-montserrat text-[20px] text-center"
              />
              <span class="font-montserrat text-[20px] ml-1">₽</span>
            </div>
          </div>

          <!-- Description -->
          <div class="w-[600px] flex items-start justify-between">
            <label class="font-montserrat text-[20px] font-normal">Описание поездки:</label>
            <textarea
              v-model="trip.description"
              rows="4"
              class="w-[300px] border border-gray-300 rounded-md p-2 resize-vertical"
              placeholder="Например: не курю, без животных и т.д."
            ></textarea>
          </div>

          <!-- Submit -->
          <div class="w-[600px] flex justify-end">
            <button type="submit" class="outline-none border-none bg-white w-[270px]">
              <img src="/images/createTripPageCreateTripBtn.svg" alt="Создать поездку" />
            </button>
          </div>
        </form>

        <div class="border-t border-black w-[700px] mt-[35px] ml-[10px]"></div>
      </div>
    </div>

    <!-- MOBILE -->
    <div class="xl:hidden flex flex-col items-center px-4">
      <p class="text-[24px] font-extrabold mt-12 text-center">Создать поездку</p>
      <div class="border-t border-black w-full my-2"></div>

      <form @submit.prevent="createTrip" class="w-full max-w-sm flex flex-col space-y-6">
        <!-- From/To -->
        <div class="flex items-start space-x-2">
          <img
            src="/images/createTripPageArrows.svg"
            alt=""
            class="h-7 rotate-90 flex-shrink-0 mt-8"
          />
          <div class="flex-1 flex flex-col mt-4 space-y-4">
            <GeoSearch
              v-model="trip.fromWhere"
              placeholder="Откуда?"
              @select="opt => { trip.fromWhere = opt.name; trip.fromLat = opt.lat; trip.fromLon = opt.lon }"
              class="font-montserrat font-semibold text-[16px] text-black outline-none border-b border-black"
            />
            <GeoSearch
              v-model="trip.toWhere"
              placeholder="Куда?"
              @select="opt => { trip.toWhere = opt.name; trip.toLat = opt.lat; trip.toLon = opt.lon }"
              class="font-montserrat font-semibold text-[16px] text-black outline-none border-b border-black"
            />
          </div>
        </div>

        <!-- Date/Time -->
        <div class="flex flex-col space-y-2">
          <input
            v-model="trip.createDate"
            :min="minDate"
            type="date"
            class="w-full font-montserrat font-semibold text-[20px] outline-none border-b border-black"
          />
          <input
            v-model="trip.createTime"
            :min="timeMin"
            type="time"
            class="w-full font-montserrat font-semibold text-[20px] outline-none border-b border-black"
          />
        </div>

        <!-- Seats -->
        <div class="flex justify-between items-center">
          <p class="font-montserrat font-semibold text-[16px]">Свободных мест</p>
          <select
            v-model.number="trip.seats"
            class="w-12 h-10 appearance-none border border-black rounded-full text-center font-montserrat font-semibold text-[16px]"
          >
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <!-- Allow Booking -->
        <div class="flex justify-between items-center">
          <p class="font-montserrat font-semibold text-[16px]">Бронировать сразу?</p>
          <label class="relative inline-block w-16 h-8 cursor-pointer">
            <input
              v-model="trip.allowBooking"
              type="checkbox"
              class="opacity-0 w-0 h-0"
            />
            <span
              :class="[
                'slider round',
                trip.allowBooking ? 'bg-green-500' : 'bg-gray-500'
              ]"
            ></span>
            <span
              :class="[
                'absolute h-7 w-7 bg-white rounded-full transition-transform top-[2px] left-[2px]',
                trip.allowBooking ? 'translate-x-7' : 'translate-x-0'
              ]"
            ></span>
          </label>
        </div>

        <!-- Price -->
        <div class="flex justify-between items-center">
          <p class="font-montserrat font-semibold text-[16px]">Цена (за одного)</p>
          <div class="flex items-center space-x-1">
            <input
              v-model.number="trip.pricePerPassenger"
              type="number"
              class="w-20 h-10 border border-black rounded-full text-center font-montserrat font-semibold text-[16px] outline-none"
            />
            <span class="font-montserrat text-[20px]">₽</span>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-center mt-4">
          <button type="submit" class="outline-none border-none bg-white">
            <img src="/images/createTripPageCreateTripBtn.svg" alt="Создать поездку" />
          </button>
        </div>
      </form>
    </div>

    <!-- Spacer -->
    <div class="h-[200px]"></div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import GeoSearch from '@/components/maps/GeoSearch.vue'

const router = useRouter()

// Основная модель поездки
const trip = ref({
  fromWhere: '',
  toWhere: '',
  fromLat: null,
  fromLon: null,
  toLat: null,
  toLon: null,
  createDate: '',
  createTime: '',
  seats: 1,
  allowBooking: false,
  pricePerPassenger: null,
  description: ''
})

// Минимумы
const minDate = new Date().toISOString().split('T')[0]
const minTime = new Date().toTimeString().slice(0, 5)
const timeMin = computed(() =>
  trip.value.createDate === minDate ? minTime : '00:00'
)

// Отправка формы
async function createTrip() {
  // валидация полей
  if (!trip.value.fromWhere || !trip.value.toWhere) {
    return alert('Выберите город из списка')
  }
  const dt = new Date(`${trip.value.createDate}T${trip.value.createTime}`)
  if (dt <= new Date()) {
    return alert('Время отправления должно быть в будущем')
  }

  try {
    const payload = {
      origin:    trip.value.fromWhere,
      destination: trip.value.toWhere,
      departureTime: dt.toISOString(),
      seats:     trip.value.seats,
      allowBooking: trip.value.allowBooking,
      price:     trip.value.pricePerPassenger,
      description: trip.value.description
    }
    const token = localStorage.getItem('token')
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/trips`,
      payload,
      { headers: { Authorization: `Bearer ${token}` }}
    )
    alert('Поездка успешно создана')
    router.push('/my-trips')
  } catch (err) {
    console.error(err)
    alert('Ошибка при создании поездки')
  }
}
</script>

<style scoped>
img { user-drag: none; }
.slider {
  display: block;
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  transition: background-color 0.3s;
}
.round { }
.slider.round { }
.bg-gray-500 { background-color: #6b7280; }
.bg-green-500 { background-color: #10b981; }
.translate-x-0 { transform: translateX(0); }
.translate-x-7 { transform: translateX(28px); }
</style>
