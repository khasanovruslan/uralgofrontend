<template>
  <main>
    <!-- COMPUTER -->
    <div class="hidden xl:flex flex-col">
      <p class="text-[48px] font-extrabold ml-[200px] mt-[50px]">Создать поездку</p>
      <div class="flex">
        <div class="border-t border-black w-[120px] mt-[35px]"></div>
        <form @submit.prevent="createTrip" class="w-[712px] h-[500px] border border-black mt-8 rounded-[40px] flex flex-col justify-evenly items-center">
          <div class="w-[600px] flex items-center">
            <input v-model="trip.fromWhere" list="fromCities" placeholder="Откуда?" required class="font-montserrat text-[20px] text-[#606060] outline-none border-b border-black w-[200px] text-start">
            <datalist id="fromCities">
              <option v-for="city in cities" :value="city"></option>
            </datalist>
            <img src="/images/createTripPageArrows.svg" alt="" class="mx-5">
            <input v-model="trip.toWhere" list="toCities" placeholder="Куда?" required class="font-montserrat text-[20px] text-[#606060] outline-none border-b border-black w-[200px] text-start">
            <datalist id="toCities">
              <option v-for="city in cities" :value="city"></option>
            </datalist>
          </div>
          <div class="w-[600px] flex items-center">
            <input v-model="trip.createDate" :min="minDate" class="font-montserrat text-[20px] text-[#606060] outline-none border-b border-black w-[200px] text-start" type="date"/>
            <input v-model="trip.createTime" :min="timeMin" class="ml-[78px] font-montserrat text-[20px] text-[#606060] outline-none border-b border-black w-[200px] text-start" type="time"/>
          </div>
          <div class="w-[600px] flex justify-between">
            <p class="font-montserrat text-[20px] font-normal">Сколько свободных мест в автомобиле?</p>
            <select v-model="trip.availableSeats" class="outline-none border border-black w-10 h-10 rounded-full appearance-none font-montserrat text-[20px] text-center" style="text-align-last:center ;">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        
          <div class="w-[600px] flex justify-between">
            <p class="font-montserrat text-[20px] font-normal">Могут ли попутчики бронировать сразу?</p>
            <label class="relative inline-block w-16 h-8 cursor-pointer">
              <input v-model="trip.allowBooking" type="checkbox" class="opacity-0 w-0 h-0">
              <span :class="['slider', 'round', trip.allowBooking ? 'bg-green-500' : 'bg-gray-500']"></span>
              <span :class="['absolute h-7 w-7 bg-white rounded-full transition-transform top-[2px] left-[2px]', trip.allowBooking ? 'transform translate-x-[28px]' : 'transform translate-x-0']"></span>
            </label>
          </div>


          <div class="w-[600px] flex justify-between">
            <p class="font-montserrat text-[20px] font-normal">Цена поездки? (за одного попутчика)</p>
            <div class="flex items-center">
              <input v-model="trip.pricePerPassenger" type="text" class="outline-none w-[80px] h-10 border border-black rounded-full font-montserrat text-[20px] text-center">
              <span class="font-montserrat text-[20px] ml-1">₽</span>
            </div>
          </div>
          <div class="w-[600px] flex justify-between">
            <label class="font-montserrat text-[20px] font-normal">Описание поездки:</label>
            <textarea v-model="trip.description" rows="4" placeholder="Например: не курю, с собой домашние животные не разрешены и т.д."></textarea>
          </div>
          
          <div class="w-[600px] flex justify-end">
            <button type="submit" class="outline-none border-none bg-white w-[270px]">
              <img src="/images/createTripPageCreateTripBtn.svg" alt="">
            </button>
          </div>
          
        </form>
        <div class="border-t border-black w-[700px] mt-[35px] ml-[10px]"></div>
      </div>
    </div>



    <!-- 
    PHONE 
    -->



    <div class="xl:hidden flex flex-col items-center">
      <p class="text-[24px] font-extrabold ml-[50px] mt-[50px]">Создать поездку</p>
      <div class="border-t-[2px] border-black w-screen mt-[5px]"></div>
        <form @submit.prevent="createTrip" class="w-[400px] mt-8flex flex-col">
          <div class="flex">
            <img src="/images/createTripPageArrows.svg" alt="" class="mx-5 rotate-90 h-[28px] mt-[32px] ml-[10px]">
            <div class="flex flex-col mt-[10px]">
              <input v-model="trip.fromWhere" list="fromCities" placeholder="Откуда?" required class="font-montserrat font-semibold text-[20px] text-black outline-none border-b border-black w-[300px] text-start">
            <datalist id="fromCities">
              <option v-for="city in cities" :value="city"></option>
            </datalist>
            <input v-model="trip.toWhere" list="toCities" placeholder="Куда?" required class="font-montserrat font-semibold text-[20px] text-black outline-none border-b border-black w-[300px] text-start my-[15px]">
            <datalist id="toCities">
              <option v-for="city in cities" :value="city"></option>
            </datalist>
            </div>
          </div>
          <div class="w-[400px] ml-[30px]">
            <input v-model="trip.createDate" :min="minDate" class="font-montserrat font-semibold text-[20px] text-[#606060] outline-none border-b border-black w-[328px] text-start" type="date"/>
            <input v-model="trip.createTime" :min="timeMin" class="font-montserrat font-semibold text-[20px] text-[#606060] outline-none border-b border-black w-[328px] text-start mt-[10px]" type="time"/>
          </div>
          <div class="w-[400px] flex mt-[30px]">
            <p class="font-montserrat font-semibold text-[16px] ml-[20px]">Сколько свободных мест<br> в автомобиле?</p>
            <select v-model="trip.availableSeats" class="outline-none border border-black w-10 h-10 rounded-full appearance-none font-montserrat font-semibold text-[16px] text-center -mt-[5px] ml-[100px]" style="text-align-last:center ;">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div class="w-[400px] flex">
            <p class="font-montserrat font-semibold text-[16px] ml-[20px]">Могут ли попутчики<br> бронировать сразу?</p>
            <label class="relative inline-block w-16 h-8 cursor-pointer ml-4">
              <input v-model="trip.allowBooking" type="checkbox" class="opacity-0 w-0 h-0">
              <span :class="['slider', 'round', trip.allowBooking ? 'bg-green-500' : 'bg-gray-500']"></span>
              <span :class="['absolute h-7 w-7 bg-white rounded-full transition-transform top-[2px] left-[2px]', trip.allowBooking ? 'transform translate-x-[28px]' : 'transform translate-x-0']"></span>
            </label>
          </div>
          <div class="w-[400px] flex justify-between">
            <p class="font-montserrat font-semibold text-[16px]">Цена поездки? (за одного попутчика)</p>
            <div class="flex items-center">
              <input v-model="trip.pricePerPassenger" type="text" class="outline-none w-[80px] h-10 border border-black rounded-full font-montserrat font-semibold text-[16px] text-center">
              <span class="font-montserrat text-[20px] ml-1">₽</span>
            </div>
          </div>
          <div class="w-[400px] flex justify-end">
            <button type="submit" class="outline-none border-none bg-white w-[270px]">
              <img src="/images/createTripPageCreateTripBtn.svg" alt="">
            </button>
          </div>
        </form>
    </div>
  </main>
</template>

<script setup>
//pages/CreateTrip.vue
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const cities = ref([])

const trip = ref({
  fromWhere: '',
  toWhere: '',
  createDate: '',
  createTime: '',
  availableSeats: 1,
  allowBooking: false,
  pricePerPassenger: '',
  description: ''
})

const minDate = new Date().toISOString().split('T')[0]
const minTime = new Date().toTimeString().split(' ')[0].slice(0, 5)


// Новое: динамический минимум для time-input
const timeMin = computed(() => {
  // если выбранная дата — сегодня, то current time, иначе — начало суток
  return trip.value.createDate === minDate
    ? minTime
    : '00:00'
})

async function loadCities() {
  try {
    const response = await axios.get(
      'https://gist.githubusercontent.com/gorborukov/0722a93c35dfba96337b/raw/435b297ac6d90d13a68935e1ec7a69a225969e58/russia'
    )
    cities.value = response.data.map(city => city.city)
  } catch (error) {
    console.error('Ошибка загрузки городов:', error)
  }
}


async function createTrip() {
  if (
    !cities.value.includes(trip.value.fromWhere) ||
    !cities.value.includes(trip.value.toWhere)
  ) {
    alert('В данном городе пока не совершаются поездки')
    return
  }

  const now = new Date()
  const selectedDateTime = new Date(`${trip.value.createDate}T${trip.value.createTime}`)

  if (selectedDateTime <= now) {
    alert('Время отправления должно быть позже текущего момента')
    return
  }

  try {
    const payload = {
      origin: trip.value.fromWhere,
      destination: trip.value.toWhere,
      departureTime: selectedDateTime.toISOString(), // это UTC, сервер должен быть готов
      seats: +trip.value.availableSeats,
      availableSeats: +trip.value.availableSeats,
      allowBooking: trip.value.allowBooking,
      price: +trip.value.pricePerPassenger,
      description: trip.value.description
    }

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/trips`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })


    alert('Поездка успешно создана')
    console.log('Создана поездка:', response.data)
  } catch (error) {
    console.error('Ошибка при создании поездки:', error)
    alert('Ошибка создания поездки')
  }
}


onMounted(() => {
  loadCities()
})
</script>



<style scoped>
img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
.slider {
  display: block;
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  transition: background-color 0.3s;
}
.slider-before {
  position: absolute;
  left: 2px;
  top: 2px;
  width: 28px;
  height: 28px;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
}
.translate-x-full {
  transform: translateX(32px);
}
.translate-x-0 {
  transform: translateX(0);
}
.bg-gray-500 {
  background-color: #6b7280; /* gray-500 color */
}
.bg-green-500 {
  background-color: #10b981; /* green-500 color */
}
</style>
