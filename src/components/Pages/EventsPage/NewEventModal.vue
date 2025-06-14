<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
       <form @submit.prevent="handleSubmit"
         class="bg-white rounded-lg p-6 w-full max-w-md space-y-4
                overflow-auto max-h-[90vh]">
      <h2 class="text-xl font-bold">Новое событие</h2>
      <p class="text-sm text-gray-600">
        Коорд.: {{ coords[1].toFixed(5) }}, {{ coords[0].toFixed(5) }}
      </p>

      <div class="space-y-2">
        <label class="font-semibold">Название *</label>
        <input v-model="form.title" required class="w-full border rounded px-3 py-2"/>
      </div>
      <div class="space-y-2">
        <label class="font-semibold">Тип *</label>
        <input v-model="form.type" required class="w-full border rounded px-3 py-2"/>
      </div>
      <div class="space-y-2">
        <label class="font-semibold">Дата/время начала *</label>
        <input v-model="form.startTime" type="datetime-local" required
               class="w-full border rounded px-3 py-2"/>
      </div>
      <div class="space-y-2">
        <label class="font-semibold">Дата/время окончания</label>
        <input v-model="form.endTime" type="datetime-local"
               class="w-full border rounded px-3 py-2"/>
      </div>
      <div class="space-y-2">
        <label class="font-semibold">Описание</label>
        <textarea v-model="form.description" rows="3"
                  class="w-full border rounded px-3 py-2"></textarea>
      </div>
      <div class="space-y-2">
        <label class="font-semibold">Адрес</label>
        <input v-model="form.address" class="w-full border rounded px-3 py-2"/>
      </div>
      <div class="space-y-2">
        <label class="font-semibold">Максимум участников</label>
        <input v-model.number="form.maxParticipants" type="number" min="1"
               class="w-full border rounded px-3 py-2"/>
      </div>
      <div class="space-y-2">
        <label class="font-semibold">Фото</label>
        <input type="file" accept="image/*" @change="onFileChange" class="w-full"/>
      </div>
      <div class="space-y-2">
        <label class="font-semibold">Категория</label>
        <input v-model="form.category" class="w-full border rounded px-3 py-2"/>
      </div>
      <div class="space-y-2">
        <label class="font-semibold">Теги (через запятую)</label>
        <input v-model="form.tags" placeholder="a,b,c"
               class="w-full border rounded px-3 py-2"/>
      </div>

      <div class="flex justify-end space-x-2 pt-4">
        <button type="button" @click="$emit('close')" class="px-4 py-2">
          Отмена
        </button>
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
          Создать
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, toRefs, watch } from 'vue'
import api from '@/api/axiosInstance'

const props = defineProps({
  coords: { type: Array, required: true } // [lat, lng]
})
const emits = defineEmits(['created','close'])

const form = reactive({
  title: '', type: '', startTime: '',
  description: '', address: '',
  maxParticipants: null, category: '',
  tags: '', photo: null
})

// вносим координаты в форму
watch(() => props.coords, ([lat, lng]) => {
  form.latitude  = lat
  form.longitude = lng
}, { immediate: true })

function onFileChange(e) {
  form.photo = e.target.files[0] || null
}

async function handleSubmit() {
  try {
    const payload = new FormData()
    payload.append('title', form.title)
    payload.append('type',  form.type)
    payload.append('latitude',  form.latitude)
    payload.append('longitude', form.longitude)
    payload.append('startTime', form.startTime)
    if (form.endTime)   payload.append('endTime', form.endTime)
    if (form.description)   payload.append('description', form.description)
    if (form.address)       payload.append('address',     form.address)
    if (form.maxParticipants)
      payload.append('maxParticipants', form.maxParticipants)
    if (form.category)      payload.append('category',    form.category)
    if (form.tags)
      payload.append('tags', JSON.stringify(
        form.tags.split(',').map(t => t.trim())
      ))
    if (form.photo)
      payload.append('photo', form.photo)

    await api.post('/events', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    emits('created')
  } catch {
    alert('Не удалось создать событие')
  }
}
</script>
