<template>
  <main>
    <!-- FIND TRIP COMPUTER-->
    <div class="hidden h-[100px] xl:flex flex-col items-center justify-center">
      <div class="flex justify-between mt-[30px] w-screen items-center font-Montserrat text-[20px]">
        <div class="border-t border-black w-[160px]"></div>
        
        <div class="border border-black rounded-[155px] w-[1080px] h-[72px] flex items-center justify-between p-2">
          <div class="flex justify-center items-center w-[180px] relative">
            <input v-model="searchQuery" @input="showSuggestions('from')" type="text" placeholder="откуда" class="w-full h-full text-center">
            <div v-if="showFromSuggestions" class="autocomplete-suggestions absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg">
              <div v-for="(city, index) in filteredCitiesFrom" :key="'from_' + index" class="autocomplete-suggestion" @click="selectCity(city)">{{ city.city }}</div>
            </div>
          </div>
          
          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <div class="flex items-center w-[180px] relative">
            <input v-model="searchQueryTo" @input="showSuggestions('to')" type="text" placeholder="куда" class="w-full h-full text-center">
            <div v-if="showToSuggestions" class="autocomplete-suggestions absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg">
              <div v-for="(city, index) in filteredCitiesTo" :key="'to_' + index" class="autocomplete-suggestion" @click="selectCityTo(city)">{{ city.city }}</div>
            </div>
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <div class="flex items-center justify-around w-[199px] h-full">
            <input v-model="tripDate" type="date" class="w-[160px] h-[30px]" placeholder="когда">
            <img src="/images/calendarMonth.svg" class="w-[32px] h-[33px] bg-no-repeat bg-contain">
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>

          <div class="flex items-center w-[140px]">
            <select class="w-full h-full rounded-lg focus:outline-none appearance-none ml-[20px]">
              <option value="1">1 человек</option>
              <option value="2">2 человека</option>
              <option value="3">3 человека</option>
              <option value="4">4 человека</option>
            </select>
          </div>

          <div class="w-[1px] h-[55px] bg-black mx-2"></div>
          <button class="w-[232px] h-[39px] bg-contain bg-no-repeat" style="background-image: url(/images/findTripPageFindBtn.svg);" @click="findTrip"></button>
        </div>

        <div class="border-t border-black w-[160px]"></div>
      </div>
    </div>

    <div class="trip-results mt-10">
      <TripBlock v-for="trip in trips" :key="trip.id" :trip="trip" />
    </div>
    <div class="h-[290px]">

    </div>
  </main>
</template>

<script>
import { ref, onMounted, watch } from 'vue'; // импорт необходимых функций из Vue 3
import { useRoute, useRouter } from 'vue-router'; // импорт useRoute и useRouter из vue-router
import TripBlock from '@/components/TripBlock.vue';

export default {
  name: 'TripResults',
  components: {
    TripBlock,
  },
  setup() {
    const route = useRoute(); // использование хука useRoute для доступа к текущему маршруту
    const router = useRouter(); // использование хука useRouter для доступа к объекту маршрутизатора

    // Создание реактивных переменных с помощью ref
    const searchQuery = ref(route.query.from || '');
    const searchQueryTo = ref(route.query.to || '');
    const tripDate = ref(route.query.date || '');
    const trips = ref([]);
    const showFromSuggestions = ref(false);
    const showToSuggestions = ref(false);

    const fetchTrips = async () => {
      if (searchQuery.value && searchQueryTo.value && tripDate.value) {
        const url = `http://localhost:3000/find-trips/find-trips?from=${searchQuery.value}&to=${searchQueryTo.value}&date=${tripDate.value}`;
        console.log('Fetching trips from URL:', url);

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          const data = await response.json();
          trips.value = data;
        } catch (error) {
          console.error('Ошибка при загрузке поездок:', error);
        }
      }
    };

    const findTrip = () => {
      router.push({
        path: '/results',
        query: {
          from: searchQuery.value,
          to: searchQueryTo.value,
          date: tripDate.value,
        },
      });
    };

    const showSuggestions = (field) => {
      if (field === 'from') {
        showFromSuggestions.value = true;
      } else if (field === 'to') {
        showToSuggestions.value = true;
      }
    };

    // Использование хуков жизненного цикла
    onMounted(() => {
      fetchTrips();
    });

    // Автоматическое обновление списка поездок при изменении параметров маршрута
    watch(() => route.query, (newQuery) => {
      searchQuery.value = newQuery.from || '';
      searchQueryTo.value = newQuery.to || '';
      tripDate.value = newQuery.date || '';
      fetchTrips();
    });

    // Возвращение всех переменных и методов, которые будут использоваться в компоненте
    return {
      searchQuery,
      searchQueryTo,
      tripDate,
      trips,
      findTrip,
      showSuggestions,
      showFromSuggestions,
      showToSuggestions,
      selectCity(city) {
        searchQuery.value = city.city;
        showFromSuggestions.value = false;
      },
      selectCityTo(city) {
        searchQueryTo.value = city.city;
        showToSuggestions.value = false;
      },
    };
  },
};
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.trip-results {
  display: flex;
  flex-direction: column;
}
.autocomplete-suggestions {
  border: 1px solid #ddd;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  background-color: #fff;
  z-index: 10;
}
.autocomplete-suggestion {
  padding: 10px;
  cursor: pointer;
}
.autocomplete-suggestion:hover {
  background-color: #f0f0f0;
}
</style>
