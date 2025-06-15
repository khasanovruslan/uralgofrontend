<template>
  <div class="p-6 max-w-2xl mx-auto">
    <button @click="goBack" class="text-blue-600 hover:underline mb-4">
      ← Назад к событиям
    </button>

    <div class="flex gap-6 mb-6">
      <img
        v-if="event.imageUrl"
        :src="fullImageUrl(event.imageUrl)"
        alt="Фото события"
        class="w-40 h-40 rounded object-cover bg-gray-100"
      />
      <div class="flex-1">
        <h1 class="text-2xl font-bold">{{ event.title }}</h1>
        <p class="text-gray-600">{{ formatDate(event.startTime) }}
          <template v-if="event.endTime">
            – {{ formatDate(event.endTime) }}
          </template>
        </p>
        <p v-if="event.address" class="text-gray-600">Адрес: {{ event.address }}</p>
        <p class="text-gray-700 mt-2" v-if="event.description">{{ event.description }}</p>
        <div class="mt-4 text-sm text-gray-500">
          Организатор: <span class="font-medium">{{ event.owner.fullName }}</span>
        </div>
      </div>
    </div>

    <h2 class="text-lg font-semibold mt-4 mb-2">Участники:</h2>
    <div v-if="members.length === 0" class="text-gray-500">Нет участников</div>
    <div v-else class="flex flex-col gap-2">
      <div
        v-for="member in members"
        :key="member.id"
        class="flex items-center gap-2"
      >
        <img
          v-if="member.photoUrl"
          :src="fullImageUrl(member.photoUrl)"
          alt="Аватар"
          class="w-8 h-8 rounded-full object-cover"
        />
        <span>{{ member.fullName }}</span>
        <button
          v-if="isOwner && member.id !== authStore.user.id"
          @click="kick(member.id)"
          class="ml-2 px-2 py-1 bg-red-400 rounded text-white text-xs"
        >
          Кикнуть
        </button>
      </div>
    </div>

    <!-- Кнопка выйти -->
    <button
      v-if="!isOwner && isActive"
      @click="leave"
      class="mt-8 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
    >
      Выйти из события
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import { useAuthStore } from '@/store/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const eventId = route.params.id

const event = ref({})
const members = ref([])

const isOwner = computed(() => event.value.owner?.id === authStore.user.id)
const isActive = computed(() => {
  if (event.value.endTime) {
    return new Date(event.value.endTime) >= new Date()
  }
  return new Date(event.value.startTime) >= new Date()
})

async function load() {
  const { data: ev } = await api.get(`/events/${eventId}`)
  event.value = ev
  const { data: mbs } = await api.get(`/events/${eventId}/members`)
  members.value = mbs
}

async function leave() {
  await api.delete(`/events/${eventId}/leave`)
  router.push('/my-events')
}
async function kick(userId) {
  await api.delete(`/events/${eventId}/chat/members/${userId}`)
  await load()
}
function goBack() {
  router.back()
}
function fullImageUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : (import.meta.env.VITE_API_URL || '') + path
}
function formatDate(iso) {
  const d = new Date(iso)
  if (isNaN(d)) return '—'
  return d.toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' })
}

onMounted(load)
</script>
