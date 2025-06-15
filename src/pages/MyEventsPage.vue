<!-- File: src/pages/MyEventsPage.vue -->
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

    <!-- Если в выбранном режиме нет событий, показываем заглушку -->
    <div v-if="currentEvents.length === 0" class="text-center text-gray-500 py-8">
      {{ emptyMessage }}
    </div>
    <!-- Иначе выводим список -->
    <EventList
      v-else
      :events="currentEvents"
      @openChat="openChat"
    />
  </div>

  <div class="h-[400px]"><!-- отступ снизу --></div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const router = useRouter()

function openChat(eventId) {
  router.push(`/events/${eventId}/chat`)
}

// вычисляем, какие события показывать
const currentEvents = computed(() =>
  mode.value === 0 ? createdEvents.value : joinedEvents.value
)

// сообщение для пустого списка
const emptyMessage = computed(() =>
  mode.value === 0
    ? 'У вас ещё нет созданных событий'
    : 'Вы пока не участвуете ни в одном событии'
)
</script>
