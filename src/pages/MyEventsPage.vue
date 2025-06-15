<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Мои события</h1>

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

    <div v-if="filteredEvents.length === 0" class="text-center text-gray-500 py-8">
      {{ emptyMessage }}
    </div>
    <EventList
      v-else
      :events="filteredEvents"
      :mainMode="mainMode"
      :subMode="subMode"
      @openChat="openChat"
      @leave="leaveEvent"
      @kick="kickMember"
      @delete="deleteEvent"
    />
  </div>
  <div class="h-[400px]"></div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import ToggleSwitch from '@/components/buttons/ToggleSwitch.vue'
import EventList from '@/components/Pages/EventsPage/EventList.vue'

const mainMode = ref(0) // 0 - Актуальные, 1 - Архив
const subMode = ref(0) // 0 - Созданные, 1 - Участие

const createdEvents = ref([])
const joinedEvents  = ref([])

async function fetch() {
  createdEvents.value = (await api.get('/events/my/created')).data
  joinedEvents.value  = (await api.get('/events/my/joined')).data
}
onMounted(fetch)

async function deleteEvent(eventId) {
  if (confirm('Удалить событие?')) {
    await api.delete(`/events/${eventId}`)
    await fetch()
  }
}

const router = useRouter()
function openChat(eventId) {
  router.push(`/events/${eventId}/chat`)
}

// Архив = endTime есть и она в прошлом (или startTime в прошлом для вечных событий)
function isArchived(evt) {
  if (evt.endTime) {
    return new Date(evt.endTime) < new Date()
  }
  // Если нет endTime, считаем архивом, если startTime в прошлом (иначе бессрочные и всегда актуальные)
  return new Date(evt.startTime) < new Date()
}
function isActive(evt) {
  if (evt.endTime) {
    return new Date(evt.endTime) >= new Date()
  }
  return new Date(evt.startTime) >= new Date() // бессрочные считаем актуальными до старта
}

const filteredEvents = computed(() => {
  let arr = subMode.value === 0 ? createdEvents.value : joinedEvents.value
  if (mainMode.value === 0) {
    return arr.filter(isActive)
  } else {
    return arr.filter(isArchived)
  }
})

const emptyMessage = computed(() => {
  if (mainMode.value === 0 && subMode.value === 0) return 'У вас ещё нет актуальных созданных событий'
  if (mainMode.value === 0 && subMode.value === 1) return 'Вы пока не участвуете ни в одном актуальном событии'
  if (mainMode.value === 1 && subMode.value === 0) return 'Архив созданных событий пуст'
  if (mainMode.value === 1 && subMode.value === 1) return 'Архив событий, в которых вы участвовали, пуст'
  return 'Нет событий'
})

// Методы для выхода/кика
async function leaveEvent(eventId) {
  await api.delete(`/events/${eventId}/leave`)
  await fetch()
}
async function kickMember({ eventId, userId }) {
  await api.delete(`/events/${eventId}/chat/members/${userId}`)
  await fetch()
}
</script>
