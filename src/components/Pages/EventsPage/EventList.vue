<!-- File: src/components/Pages/EventsPage/EventList.vue -->
<template>
  <div class="grid gap-4">
    <div
      v-for="evt in events"
      :key="evt.id"
      class="border rounded-lg p-4 flex flex-col md:flex-row justify-between bg-white shadow-sm"
    >
      <!-- Левая часть: картинка с сохранением пропорций -->
      <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6 w-full md:w-48">
        <div
          class="w-full rounded overflow-hidden bg-gray-100 relative"
          style="padding-top: 75%;"     
        >
          <img
            v-if="evt.imageUrl"
            :src="fullImageUrl(evt.imageUrl)"
            alt="Фото события"
            class="absolute top-0 left-0 w-full h-full"
            style="object-fit: contain;"
          />
          <span
            v-else
            class="absolute inset-0 flex items-center justify-center text-gray-400"
          >
            No Image
          </span>
        </div>
      </div>

      <!-- Центральная часть: текстовые поля -->
      <div class="flex-1 space-y-2">
        <!-- Название -->
        <h2 class="text-xl font-semibold text-gray-800">{{ evt.title }}</h2>

        <!-- Тип события -->
        <div class="flex items-center space-x-2 text-gray-600">
          <img src="@/assets/icons/type.png" alt="Тип" class="w-5 h-5" />
          <span>{{ evt.type }}</span>
        </div>

        <!-- Дата/время -->
        <div class="flex items-center space-x-2 text-gray-600">
          <img src="@/assets/icons/calendar.png" alt="Время" class="w-5 h-5" />
          <span>
            {{ formatDate(evt.startTime) }}
            <template v-if="evt.endTime">
              &nbsp;–&nbsp;{{ formatDate(evt.endTime) }}
            </template>
          </span>
        </div>

        <!-- Адрес -->
        <div v-if="evt.address" class="flex items-center space-x-2 text-gray-600">
          <img src="@/assets/icons/location.png" alt="Адрес" class="w-5 h-5" />
          <span>{{ evt.address }}</span>
        </div>

        <!-- Максимум участников -->
        <div v-if="evt.maxParticipants !== null" class="flex items-center space-x-2 text-gray-600">
          <img src="@/assets/icons/participants.png" alt="Участники" class="w-5 h-5" />
          <span>{{ evt.maxParticipants }}</span>
        </div>

        <!-- Категория -->
        <div v-if="evt.category" class="flex items-center space-x-2 text-gray-600">
          <img src="" alt="Категория" class="w-5 h-5" />
          <span>{{ evt.category }}</span>
        </div>

        <!-- Теги -->
        <div v-if="evt.tags?.length" class="flex items-start space-x-2 text-gray-600">
          <img src="" alt="Теги" class="w-5 h-5 mt-1" />
          <span>{{ evt.tags.join(', ') }}</span>
        </div>

        <!-- Описание -->
        <p v-if="evt.description" class="mt-2 text-gray-700 italic">
          {{ evt.description }}
        </p>
      </div>

      <!-- Правая часть: организатор + кнопки -->
      <div class="flex-shrink-0 flex flex-col items-end space-y-4">
        <!-- Организатор -->
        <div class="flex items-center space-x-2">
          <img
            v-if="evt.owner?.photoUrl"
            :src="fullImageUrl(evt.owner.photoUrl)"
            alt="Организатор"
            class="w-8 h-8 rounded-full object-cover"
          />
          <span class="text-gray-600 text-sm">Орг.: {{ evt.owner.fullName }}</span>
        </div>
        <!-- Кнопка чат -->
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          @click="$emit('openChat', evt.id)"
        >
          Чат
        </button>
        <button
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded mt-2"
          @click="$router.push({ name: 'event-detail', params: { id: evt.id } })"
        >
          Подробнее
        </button>
        <button
            v-if="showLeaveButton(evt)"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            @click="$emit('leave', evt.id)"
          >
            Выйти
         </button>
         <button
            v-if="evt.owner?.id === authStore.user.id"
            class="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded"
            @click="$emit('delete', evt.id)"
          >
            Удалить
          </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()

const props = defineProps({
  events: Array,
  mainMode: Number,
  subMode: Number
})

const emit = defineEmits(['openChat', 'leave', 'delete'])

function showLeaveButton(evt) {
  return (
    evt.owner?.id !== authStore.user.id && // не создатель
    props.subMode === 1 && // только в участии
    props.mainMode === 0 // только для актуальных
  )
}
async function deleteEvent(eventId) {
  if (confirm('Удалить событие?')) {
    await api.delete(`/events/${eventId}`)
    await fetch()
  }
}


// Базовый URL для картинок
const apiBase = import.meta.env.VITE_API_URL || ''

// Помощник для полного URL
function fullImageUrl(path) {
  return path.startsWith('http') ? path : `${apiBase}${path}`
}

// Форматирование дат
function formatDate(iso) {
  const d = new Date(iso)
  if (isNaN(d)) return '—'
  return d.toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' })
}
</script>

<style scoped>
/* Переносим слишком длинные слова */
span, p {
  word-break: break-word;
}
</style>
