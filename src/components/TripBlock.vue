<template>
  <div class="xl:w-[screen] hidden xl:flex justify-center mt-5">
    <div class="trip-block w-[1060px] h-[220px] bg-[#f1f1f1] rounded-[35px] flex justify-between">
      <div class="flex flex-col">
        <div class="flex align-middle w-[300px] text-[24px] font-semibold tracking-2pct">
          <p class="mr-3">{{ trip.from_where }}</p>
          <img src="/images/fromToArrow.svg" alt="" class="mr-3">
          <p>{{ trip.to_where }}</p>
        </div>
        <p class="mt-3 font-light text-[24px]">{{ formattedDate }} <span class="mr-4"></span> {{ formattedTime}}</p>
        <p class="mt-3 font-light text-[24px]">Свободных мест: {{ trip.available_seats}}</p>
      </div>

      <div class="flex flex-col justify-between text-end">
        <p v-if="trip.price_per_passenger" class="text-[24px] font-semibold tracking-2pct">{{ formattedPrice }} ₽</p>
        <p v-else class="text-[24px] font-semibold tracking-2pct">Цена не указана</p>
        <button class="bg-[url(/images/bookTrip.svg)] bg-contain bg-center bg-no-repeat w-[223px] h-[40px]">
            
        </button>

      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'TripBlock',
  props: {
    trip: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.trip.create_date);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    formattedPrice() {
      return Math.round(this.trip.price_per_passenger);
    },
    formattedTime() {
  // Разбиваем строку времени по символу ":"
  const timeParts = this.trip.create_time.split(':');
  
  // Извлекаем часы и минуты из массива
  const hours = timeParts[0];
  const minutes = timeParts[1];

  // Возвращаем время в формате "часы:минуты"
  return `${hours}:${minutes}`;
}

  }
};
</script>


<style scoped>
.trip-block {
  margin: 10px 0;
  padding: 30px;
}
</style>
