<template>
  <main>
    <!-- FIND TRIP COMPUTER-->
    <div class="hidden h-[430px] xl:flex flex-col items-center justify-center">
      <p class="font-extrabold text-[48px] tracking-wide">Найти попутку</p>
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
          <button class="w-[232px] h-[39px] bg-contain bg-no-repeat" style="background-image: url(/images/findTripPageFindBtn.svg);" @click="findTripClick"></button>
        </div>

        <div class="border-t border-black w-[160px]"></div>
      </div>
    </div>
    <div class="h-[300px]"></div>
  </main>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: "FindTrip",
  setup() {
    const router = useRouter();

    const cities = ref([]);
    const searchQuery = ref("");
    const searchQueryTo = ref("");
    const tripDate = ref("");
    const showFromSuggestions = ref(false);
    const showToSuggestions = ref(false);

    const filteredCitiesFrom = computed(() =>
      cities.value.filter(city => city.city.toLowerCase().startsWith(searchQuery.value.toLowerCase()))
    );

    const filteredCitiesTo = computed(() =>
      cities.value.filter(city => city.city.toLowerCase().startsWith(searchQueryTo.value.toLowerCase()))
    );

    const fetchCities = async () => {
      try {
        const response = await fetch('https://gist.githubusercontent.com/gorborukov/0722a93c35dfba96337b/raw/435b297ac6d90d13a68935e1ec7a69a225969e58/russia');
        cities.value = await response.json();
      } catch (error) {
        console.error("Ошибка при загрузке городов:", error);
      }
    };

    const showSuggestions = (field) => {
      if (field === 'from') {
        showFromSuggestions.value = true;
      } else if (field === 'to') {
        showToSuggestions.value = true;
      }
    };

    const hideSuggestions = () => {
      showFromSuggestions.value = false;
      showToSuggestions.value = false;
    };

    const selectCity = (city) => {
      searchQuery.value = city.city;
      hideSuggestions();
    };

    const selectCityTo = (city) => {
      searchQueryTo.value = city.city;
      hideSuggestions();
    };

    const findTripClick = () => {
      if (new Date(tripDate.value) < new Date()) {
        alert('Пожалуйста, выберите дату, которая еще не наступила');
      } else if (!cities.value.find(city => city.city === searchQuery.value)) {
        alert('Мы еще не работаем в этом городе');
      } else {
        // Перенаправление на страницу результатов
        router.push({
          path: '/results',
          query: {
            from: searchQuery.value,
            to: searchQueryTo.value,
            date: tripDate.value,
          },
        });
      }
    };

    onMounted(() => {
      fetchCities();
      document.addEventListener('click', hideSuggestions);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', hideSuggestions);
    });

    return {
      searchQuery,
      searchQueryTo,
      tripDate,
      showFromSuggestions,
      showToSuggestions,
      filteredCitiesFrom,
      filteredCitiesTo,
      showSuggestions,
      selectCity,
      selectCityTo,
      findTripClick,
    };
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
