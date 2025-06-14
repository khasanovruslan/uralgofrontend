<template>
  <div class="event-popup flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-lg">
    <button class="close-btn" @click="$emit('close')">✕</button>
    <h3 class="text-xl font-semibold">{{ event.title }}</h3>
    <div class="flex items-center space-x-2">
      <img src="@/assets/icons/type.png"   alt="Тип"          class="w-5 h-5"/>
      <span>{{ event.type }}</span>
    </div>
    <div class="flex items-center space-x-2">
      <img src="@/assets/icons/calendar.png" alt="Дата"        class="w-5 h-5"/>
      <span>{{ formattedStart }}</span>
    </div>
    <div v-if="event.address" class="flex items-center space-x-2">
      <img src="@/assets/icons/location.png" alt="Место"      class="w-5 h-5"/>
      <span>{{ event.address }}</span>
    </div>
    <div v-if="event.maxParticipants !== null" class="flex items-center space-x-2">
      <img src="@/assets/icons/participants.png" alt="Участники" class="w-5 h-5"/>
      <span>{{ event.maxParticipants }}</span>
    </div>
    <div v-if="event.description" class="description pl-3 border-l-4 border-gray-300 bg-gray-50 p-2 italic text-sm">
      {{ event.description }}
    </div>
    <div class="flex items-center space-x-2">
      <img v-if="ownerAvatarUrl"
           :src="ownerAvatarUrl"
           alt="Орг."
           class="w-6 h-6 rounded-full"/>
      <span class="text-sm">Организатор: {{ event.owner.fullName }}</span>
    </div>
    <button class="join-btn" @click="$emit('join', event.id)">
      Вступить
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ event: Object })
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const ownerAvatarUrl = computed(() => {
  const url = props.event.owner?.photoUrl
  return url?.startsWith('http') ? url : apiBase + url
})

const formattedStart = computed(() => {
  const d = new Date(props.event.startTime)
  return isNaN(d)
    ? '—'
    : d.toLocaleString('ru-RU', { dateStyle:'medium', timeStyle:'short' })
})
</script>

<style>
.event-popup {
  width: 20rem;
  position: relative;
  overflow-wrap: break-word;    /* автоматический перенос длинных слов */
  word-break: break-word;
}
.event-popup * {
  /* на всякий случай запрещаем прокрутку по горизонтали */
  overflow-x: hidden;
}
.event-popup .description {
  white-space: pre-wrap;        /* сохраняем переносы из текста */
  overflow-wrap: break-word;
}
@media (max-width: 640px) {
  .event-popup { width: 90vw; }
}
.close-btn {
  position: absolute;
  top: 8px; right: 8px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
.join-btn {
  background: #16a34a;
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  text-align: center;
  font-weight: 600;
  width: 100%;
}
</style>
