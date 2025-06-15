<template>
  <div class="p-6 flex flex-col h-[60vh]">
    <!-- Хедер с кнопкой Назад и заголовком -->
    <div class="flex items-center justify-between mb-4">
      <button @click="goBack" class="text-blue-600 hover:underline flex items-center">
        ← Мои поездки
      </button>
      <h1 class="text-2xl font-bold">Чат поездки: {{ tripTitle || '...' }}</h1>
      <span style="width: 4rem"></span>
    </div>

    <!-- Скроллируемый контейнер с сообщениями -->
    <div
      ref="messagesContainer"
      class="flex-1 border rounded overflow-y-auto p-4 space-y-3 bg-gray-50"
    >
      <div v-for="msg in messages" :key="msg.id" class="flex space-x-2">
        <strong>{{ msg.user?.fullName || '...' }}:</strong>
        <span>{{ msg.content }}</span>
      </div>
    </div>

    <!-- Ввод и кнопка отправки -->
    <div class="mt-4 flex">
      <input
        v-model="text"
        @keyup.enter="send"
        class="flex-1 border rounded px-3 py-2"
        placeholder="Сообщение…"
      />
      <button
        @click="send"
        class="ml-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        Отправить
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axiosInstance'

const route = useRoute()
const router = useRouter()
const tripId = route.params.id

const tripTitle = ref('')
const messages = ref([])
const text = ref('')
const messagesContainer = ref(null)

async function load() {
  // Получаем название поездки (например, "Москва → Казань")
  try {
    const { data: trip } = await api.get(`/trips/${tripId}`)
    tripTitle.value = `${trip.origin} → ${trip.destination}`
  } catch {
    tripTitle.value = ''
  }
  // Получаем все сообщения чата поездки
  try {
    const { data } = await api.get(`/trips/${tripId}/chat/messages`)
    messages.value = data
    // после обновления DOM прокручиваем вниз
    await nextTick()
    const c = messagesContainer.value
    if (c) c.scrollTop = c.scrollHeight
  } catch (e) {
    console.error(e)
  }
}

async function send() {
  if (!text.value.trim()) return
  try {
    await api.post(`/trips/${tripId}/chat/messages`, { content: text.value.trim() })
    text.value = ''
    await load()
  } catch (e) {
    console.error(e)
    alert(e.response?.data?.message || 'Не удалось отправить сообщение')
  }
}

function goBack() {
  router.push('/my-trips')
}

onMounted(load)
</script>

<style scoped>
.flex-1::-webkit-scrollbar {
  width: 6px;
}
.flex-1::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 3px;
}
</style>
