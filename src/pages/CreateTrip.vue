<template>
  <main>
    <!-- COMPUTER -->
    <div class="hidden xl:flex flex-col h-[720px]">
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
            <input v-model="trip.createTime" :min="minTime" class="ml-[78px] font-montserrat text-[20px] text-[#606060] outline-none border-b border-black w-[200px] text-start" type="time"/>
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
            <p class="font-montserrat text-[20px] font-normal">Сколько людей изначально едут в автомобиле?</p>
            <select v-model="trip.initialPassengers" class="outline-none border border-black w-10 h-10 rounded-full appearance-none font-montserrat text-[20px] text-center" style="text-align-last:center ;">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div class="w-[600px] flex justify-between">
            <p class="font-montserrat text-[20px] font-normal">Могут ли попутчики бронировать сразу?</p>
            <label class="relative inline-block w-16 h-8">
              <input v-model="trip.allowBooking" type="checkbox" class="opacity-0 w-0 h-0" @change="updateCheckbox">
              <span :class="['slider', trip.allowBooking ? 'bg-green-500' : 'bg-gray-500']"></span>
              <span :class="['slider-before', trip.allowBooking ? 'translate-x-full' : 'translate-x-0']"></span>
            </label>
          </div>
          <div class="w-[600px] flex justify-between">
            <p class="font-montserrat text-[20px] font-normal">Цена поездки? (за одного попутчика)</p>
            <div class="flex items-center">
              <input v-model="trip.pricePerPassenger" type="text" class="outline-none w-[80px] h-10 border border-black rounded-full font-montserrat text-[20px] text-center">
              <span class="font-montserrat text-[20px] ml-1">₽</span>
            </div>
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
    <!-- PHONE -->
    <div class="xl:hidden flex flex-col h-[720px]">
      <p class="text-[24px] font-extrabold ml-[50px] mt-[50px]">Создать поездку</p>
      <div class="border-t-[2px] border-black w-screen mt-[5px]"></div>
        <form @submit.prevent="createTrip" class="w-[400px] mt-8flex flex-col justify-evenly">
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
            <input v-model="trip.createTime" :min="minTime" class="font-montserrat font-semibold text-[20px] text-[#606060] outline-none border-b border-black w-[328px] text-start mt-[10px]" type="time"/>
          </div>
          <div class="w-[400px] flex mt-[30px]">
            <p class="font-montserrat font-semibold text-[16px] ml-[20px]">Сколько свободных мест<br> в автомобиле?</p>
            <select v-model="trip.availableSeats" class="outline-none border border-black w-10 h-10 rounded-full appearance-none font-montserrat font-semibold text-[16px] text-center -mt-[5px] ml-[100px]" style="text-align-last:center ;">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div class="w-[400px] flex mt-[20px]">
            <p class="font-montserrat font-semibold text-[16px] ml-[20px]">Сколько людей<br> изначально едут<br> в автомобиле?</p>
            <select v-model="trip.initialPassengers" class="outline-none border border-black w-10 h-10 rounded-full appearance-none font-montserrat font-semibold text-[16px] text-center ml-[172px]" style="text-align-last:center ;">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div class="w-[400px] flex">
            <p class="font-montserrat font-semibold text-[16px] ml-[20px]">Могут ли попутчики<br> бронировать сразу?</p>
            <label class="relative inline-block w-16 h-8">
              <input v-model="trip.allowBooking" type="checkbox" class="opacity-0 w-0 h-0" @change="updateCheckbox">
              <span :class="['slider', trip.allowBooking ? 'bg-green-500' : 'bg-gray-500']"></span>
              <span :class="['slider-before', trip.allowBooking ? 'translate-x-full' : 'translate-x-0']"></span>
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

<script>
import axios from 'axios';

export default {
  name: "CreateTrip",
  data() {
    return {
      trip: {
        fromWhere: '',
        toWhere: '',
        createDate: '',
        createTime: '',
        availableSeats: 1,
        initialPassengers: 1,
        allowBooking: false,
        pricePerPassenger: ''
      },
      minDate: this.getTodayDate(),
      cities: [] // Массив для хранения загруженных городов
    };
  },
  methods: {
    async createTrip() {
      // Проверяем, что выбранные города существуют в списке городов
      if (!this.cities.includes(this.trip.fromWhere) || !this.cities.includes(this.trip.toWhere)) {
        alert('В данном городе пока не совершаются поездки');
        return; // Прерываем выполнение функции, если города не найдены
      }
      
      try {
        const response = await axios.post('http://localhost:3000/create-trip/create-trip', this.trip);
        console.log('Trip created:', response.data);
        alert('Поездка успешно создана');
      } catch (error) {
        console.error('Error creating trip:', error);
        alert('Ошибка создания поездки');
      }
    },

    updateCheckbox(event) {
      this.trip.allowBooking = event.target.checked;
    },
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async loadCities() {
      try {
        const response = await axios.get('https://gist.githubusercontent.com/gorborukov/0722a93c35dfba96337b/raw/435b297ac6d90d13a68935e1ec7a69a225969e58/russia');
        this.cities = response.data.map(city => city.city); // Преобразуем объекты JSON в массив строк с названиями городов
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    }
  },
  mounted() {
    this.loadCities(); // Загрузка списка городов при загрузке компонента
  }
};
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
