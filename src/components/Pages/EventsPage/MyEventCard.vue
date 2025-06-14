<template>
  <div class="my-event-card bg-white rounded-lg shadow p-4 flex flex-col space-y-4">
    <!-- Закрытие/действия (опционально) -->
    <div class="flex justify-end">
      <button @click="$emit('close', event.id)" class="text-gray-400 hover:text-gray-700">
        ✕
      </button>
    </div>

    <!-- Фото -->
    <img
      v-if="fullImageUrl"
      :src="fullImageUrl"
      alt="Фото события"
      class="w-full h-40 object-cover rounded-md"
    />

    <!-- Заголовок -->
    <h2 class="text-2xl font-semibold text-gray-800">{{ event.title }}</h2>

    <!-- Основная информация -->
    <div class="grid grid-cols-1 gap-2 text-gray-700">
      <InfoRow icon="type.png"    label="Тип"      :value="event.type" />
      <InfoRow icon="calendar.png" label="Начало"  :value="formattedStart" />
      <InfoRow
        v-if="hasEnd"
        icon="calendar.png"
        label="Окончание"
        :value="formattedEnd"
      />
      <InfoRow
        v-if="event.address"
        icon="location.png"
        label="Адрес"
        :value="event.address"
      />
      <InfoRow
        v-if="event.maxParticipants !== null"
        icon="participants.png"
        label="Макс. уч."
        :value="event.maxParticipants"
      />
      <InfoRow
        v-if="event.category"
        icon="category.png"
        label="Категория"
        :value="event.category"
      />
      <div v-if="event.tags?.length" class="flex items-start space-x-2">
        <img src="" alt="Теги" class="w-5 h-5 mt-1"/>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in event.tags"
            :key="tag"
            class="px-2 py-0.5 bg-gray-200 rounded-full text-xs"
          >{{ tag }}</span>
        </div>
      </div>
      <InfoRow
        icon="refresh.png"
        label="Обновлено"
        :value="formattedUpdated"
      />
    </div>

    <!-- Описание -->
    <div v-if="event.description" class="description pl-3 border-l-4 border-gray-300 bg-gray-50 p-2">
      {{ event.description }}
    </div>

    <!-- Организатор -->
    <div class="flex items-center space-x-2">
      <img
        v-if="ownerAvatarUrl"
        :src="ownerAvatarUrl"
        alt="Организатор"
        class="w-8 h-8 rounded-full object-cover"
      />
      <span class="text-sm text-gray-600">
        Организатор: {{ event.owner.fullName }}
      </span>
    </div>

    <!-- Действия -->
    <div class="flex space-x-2">
      <button
        class="join-btn flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold"
        @click="$emit('join', event.id)"
      >Вступить</button>
      <button
        class="chat-btn flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
        @click="$emit('openChat', event.id)"
      >Чат</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import InfoRow from '@/components/Pages/EventsPage/InfoRow.vue'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const fullImageUrl = computed(() => {
  const url = props.event.imageUrl
  return url?.startsWith('http') ? url : `${apiBase}${url}`
})

const ownerAvatarUrl = computed(() => {
  const url = props.event.owner?.photoUrl
  return url?.startsWith('http') ? url : `${apiBase}${url}`
})

const formattedStart = computed(() => {
  const d = new Date(props.event.startTime)
  return isNaN(d) ? '—' : d.toLocaleString('ru-RU', {
    dateStyle: 'medium', timeStyle: 'short'
  })
})
const formattedEnd = computed(() => {
  const d = new Date(props.event.endTime)
  return isNaN(d) ? '—' : d.toLocaleString('ru-RU', {
    dateStyle: 'medium', timeStyle: 'short'
  })
})
const hasEnd = computed(() => !!props.event.endTime)

const formattedUpdated = computed(() => {
  const d = new Date(props.event.updatedAt)
  return isNaN(d) ? '—' : d.toLocaleString('ru-RU', {
    dateStyle: 'short', timeStyle: 'short'
  })
})
</script>

<style scoped>
.my-event-card {
  width: 100%;
}
.description {
  white-space: pre-wrap;
}
.join-btn { flex: 2; }
.chat-btn { flex: 1; }
</style>
