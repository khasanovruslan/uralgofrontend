<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      Мои события
    </h1>

    <div class="mb-6">
      <ToggleSwitch
        :options="['Созданные', 'Участие']"
        v-model="mode"
      />
    </div>

    <EventList
      :events="mode === 0 ? createdEvents : joinedEvents"
      @openChat="openChat"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import ToggleSwitch from '@/components/buttons/ToggleSwitch.vue'
import EventList from '@/components/Pages/EventsPage/EventList.vue'

const mode = ref(0) // 0 — «Созданные», 1 — «Участие»
const createdEvents = ref([])
const joinedEvents  = ref([])

async function fetch() {
  createdEvents.value = (await api.get('/events/my/created')).data
  joinedEvents.value  = (await api.get('/events/my/joined')).data
}

onMounted(fetch)

// вот это вместо $router
const router = useRouter()
function openChat(eventId) {
  router.push(`/events/${eventId}/chat`)
}
</script>
