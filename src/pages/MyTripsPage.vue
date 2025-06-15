<!-- File: src/pages/MyTripsPage.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Мои поездки</h1>

    <div class="mb-6">
      <ToggleSwitch :options="['Созданные', 'Участие']" v-model="mode" />
    </div>

    <div v-if="currentTrips.length === 0" class="text-center text-gray-500 py-8">
      {{ emptyMessage }}
    </div>
    <TripList
      v-else
      :trips="currentTrips"
      @select="openTrip"
      @refresh="fetch"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import ToggleSwitch from '@/components/buttons/ToggleSwitch.vue'
import TripList from '@/components/Pages/TripsPage/TripList.vue'

const mode = ref(0)
const createdTrips = ref([])
const joinedTrips  = ref([])

async function fetch() {
  createdTrips.value = (await api.get('/trips/my/created')).data
  joinedTrips.value  = (await api.get('/trips/my/joined')).data
}
onMounted(fetch)

const router = useRouter()
function openTrip(trip) {
  // Навигация на страницу деталей поездки
  router.push({ name: 'trip-detail', params: { id: trip.id } })
}

const currentTrips = computed(() =>
  mode.value === 0 ? createdTrips.value : joinedTrips.value
)
const emptyMessage = computed(() =>
  mode.value === 0
    ? 'У вас ещё нет созданных поездок'
    : 'Вы пока не участвуете ни в одной поездке'
)
</script>
