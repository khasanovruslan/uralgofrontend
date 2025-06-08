<template>
    <div>
        <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Демо MapLibre-карт</h1>

    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-2">Маршрут Москва → Санкт-Петербург</h2>
      <RouteMapMapLibre
        :origin="[55.7558, 37.6176]"
        :destination="[59.9311, 30.3609]"
        width="100%"
        height="400px"
      />
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-2">События на карте</h2>
      <EventsMapMapLibre
        :events="eventsOnMap"
        width="100%"
        height="500px"
      />
    </section>
  </div>

    </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import RouteMapMapLibre from '@/components/maps/RouteMapMapLibre.vue'
import EventsMapMapLibre from '@/components/maps/EventsMapMapLibre.vue'

const eventsOnMap = reactive([
  {
    id: 1,
    title: 'Встреча попутчиков: Москва',
    coords: [55.7558, 37.6176],
    avatarUrl: 'https://i.pravatar.cc/50?img=3',
    authorName: 'Алексей',
    description: 'Ищем попутчиков до Санкт-Петербурга, выезд завтра утром.',
    participants: [
      { id: 101, name: 'Мария',   avatarUrl: 'https://i.pravatar.cc/50?img=5' },
      { id: 102, name: 'Дмитрий', avatarUrl: 'https://i.pravatar.cc/50?img=7' },
    ],
  },
  {
    id: 2,
    title: 'Пикник в Коломенском',
    coords: [55.6845, 37.6256],
    avatarUrl: 'https://i.pravatar.cc/50?img=4',
    authorName: 'Ольга',
    description: 'Приглашаю всех на субботний пикник!',
    participants: [
      { id: 201, name: 'Ирина', avatarUrl: 'https://i.pravatar.cc/50?img=9' },
    ],
  },
])

</script>

<style lang="scss" scoped>

</style>