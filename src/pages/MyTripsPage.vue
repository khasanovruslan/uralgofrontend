<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Мои поездки</h1>

    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <ToggleSwitch
        :options="['Актуальные', 'Архив']"
        v-model="mainMode"
        class="flex-1"
      />
      <ToggleSwitch
        :options="['Созданные', 'Участие']"
        v-model="subMode"
        class="flex-1"
      />
    </div>

    <div v-if="filteredTrips.length === 0" class="text-center text-gray-500 py-8">
      {{ emptyMessage }}
    </div>
    <TripList
      v-else
      :trips="filteredTrips"
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

const mainMode = ref(0) // 0 - Актуальные, 1 - Архив
const subMode = ref(0) // 0 - Созданные, 1 - Участие

const createdTrips = ref([])
const joinedTrips = ref([])

async function fetch() {
  createdTrips.value = (await api.get('/trips/my/created')).data
  joinedTrips.value  = (await api.get('/trips/my/joined')).data
}
onMounted(fetch)

const router = useRouter()
function openTrip(trip) {
  router.push({ name: 'trip-detail', params: { id: trip.id } })
}

const now = new Date()

function isArchived(trip) {
  // Архив: завершённые или отменённые поездки
  return trip.status === 'finished' || trip.status === 'canceled'
}
function isActive(trip) {
  return trip.status === 'planned' || trip.status === 'in_progress'
}

const filteredTrips = computed(() => {
  let arr =
    subMode.value === 0
      ? createdTrips.value
      : joinedTrips.value
  if (mainMode.value === 0) {
    // Актуальные
    return arr.filter(isActive)
  } else {
    // Архивные
    return arr.filter(isArchived)
  }
})

const emptyMessage = computed(() => {
  if (mainMode.value === 0 && subMode.value === 0) return 'У вас ещё нет актуальных созданных поездок'
  if (mainMode.value === 0 && subMode.value === 1) return 'Вы пока не участвуете ни в одной актуальной поездке'
  if (mainMode.value === 1 && subMode.value === 0) return 'Архив созданных поездок пуст'
  if (mainMode.value === 1 && subMode.value === 1) return 'Архив поездок, в которых вы участвовали, пуст'
  return 'Нет поездок'
})
</script>
