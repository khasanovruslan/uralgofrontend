<template>
  <div class="p-6">
    <h1 class="text-2xl mb-4">Чат события</h1>
    <div class="border rounded h-96 overflow-auto p-4 space-y-3">
      <div v-for="msg in messages" :key="msg.id">
        <strong>{{ msg.user.fullName }}:</strong> {{ msg.text }}
      </div>
    </div>
    <div class="mt-4 flex">
      <input
        v-model="text"
        @keyup.enter="send"
        class="flex-1 border rounded px-3 py-2"
        placeholder="Сообщение…"
      />
      <button class="ml-2 px-4 bg-green-600 text-white rounded" @click="send">
        Отправить
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axiosInstance'
import { useRoute } from 'vue-router'

const route = useRoute()
const chatId = route.params.id
const messages = ref([])
const text     = ref('')

async function load() {
  const { data } = await api.get(`/events/${chatId}/chat`)
  messages.value = data.messages
}
async function send() {
  if (!text.value.trim()) return
  await api.post(`/events/${chatId}/chat/messages`, { text: text.value })
  text.value = ''
  await load()
}

onMounted(load)
</script>
