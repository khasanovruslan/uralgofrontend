
<template>
  <div class="relative w-full h-screen">
    <!-- Контейнер карты -->
    <div ref="mapContainer" class="w-[800px] h-[500px]"></div>

    <!-- Модалка создания события -->
    <div
      v-if="showCreate"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <form
        @submit.prevent="submitEvent"
        class="bg-white rounded-lg w-full max-w-md p-6 space-y-4 overflow-auto max-h-[90vh]"
      >
        <h2 class="text-xl font-bold">Новое событие</h2>
        <p>Координаты: {{ newEvent.longitude.toFixed(5) }}, {{ newEvent.latitude.toFixed(5) }}</p>

        <!-- Обязательно -->
        <div class="space-y-2">
          <label class="block font-semibold">Название *</label>
          <input
            v-model="newEvent.title"
            type="text"
            required
            class="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div class="space-y-2">
          <label class="block font-semibold">Тип *</label>
          <input
            v-model="newEvent.type"
            type="text"
            required
            class="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div class="space-y-2">
          <label class="block font-semibold">Дата/время начала *</label>
          <input
            v-model="newEvent.startTime"
            type="datetime-local"
            required
            class="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <!-- Опционально -->
        <div class="space-y-2">
          <label class="block font-semibold">Дата/время окончания</label>
          <input
            v-model="newEvent.endTime"
            type="datetime-local"
            class="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div class="space-y-2">
          <label class="block font-semibold">Описание</label>
          <textarea
            v-model="newEvent.description"
            class="w-full border border-gray-300 rounded px-3 py-2 resize-vertical"
            rows="3"
          ></textarea>
        </div>
        <div class="space-y-2">
          <label class="block font-semibold">Адрес</label>
          <input
            v-model="newEvent.address"
            type="text"
            class="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div class="space-y-2">
          <label class="block font-semibold">Максимум участников</label>
          <input
            v-model.number="newEvent.maxParticipants"
            type="number"
            min="1"
            class="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div class="space-y-2">
          <label class="block font-semibold">URL изображения</label>
          <input
            v-model="newEvent.imageUrl"
            type="url"
            class="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div class="space-y-2">
          <label class="block font-semibold">Категория</label>
          <input
            v-model="newEvent.category"
            type="text"
            class="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div class="space-y-2">
          <label class="block font-semibold">Теги (через запятую)</label>
          <input
            v-model="newEvent.tags"
            type="text"
            placeholder="tag1, tag2, tag3"
            class="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            @click="showCreate = false"
            class="px-4 py-2"
          >Отмена</button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded"
          >Создать</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import api from '@/api/axiosInstance'

// Простая debounce-функция
function debounce(fn, delay) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

const props = defineProps({
  center: { type: Array, default: () => [55.76, 37.64] },
  zoom:   { type: Number, default: 10 }
})

const mapContainer = ref(null)
let mapInstance = null
const eventsOnMap = ref([])

const showCreate = ref(false)
const newEvent = ref({
  title: '',
  type: '',
  latitude: 0,
  longitude: 0,
  startTime: '',
  endTime: '',
  description: '',
  address: '',
  maxParticipants: null,
  imageUrl: '',
  category: '',
  tags: ''
})

// Загрузка событий по bbox
async function loadEventsByBBox() {
  if (!mapInstance) return
  const b = mapInstance.getBounds()
  const bbox = [
    b.getSouth(), b.getWest(),
    b.getNorth(), b.getEast()
  ].join(',')
  try {
    const { data } = await api.get('/events', { params: { bbox } })
    eventsOnMap.value = data.map(ev => ({
      id: ev.id,
      title: ev.title,
      coords: [ev.latitude, ev.longitude],
      imgUrl: ev.owner?.avatarUrl,
      description: ev.description,
      members: ev.members || []
    }))
    drawMarkers()
  } catch (e) {
    console.error('Ошибка загрузки событий:', e)
  }
}

// Отрисовка маркеров
let markers = []
function drawMarkers() {
  markers.forEach(m => m.remove())
  markers = []
  eventsOnMap.value.forEach(ev => {
    const el = document.createElement('div')
    el.className = 'rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer'
    el.style.width = '40px'; el.style.height = '40px'
    const img = document.createElement('img')
    img.src = ev.imgUrl
    img.alt = ev.title
    img.style.width = '100%'; img.style.height = '100%'
    el.appendChild(img)
    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([ev.coords[1], ev.coords[0]])
      .setPopup(new maplibregl.Popup({ offset: 25 })
        .setHTML(`<strong>${ev.title}</strong><br>${ev.description || ''}`))
      .addTo(mapInstance)
    markers.push(marker)
  })
}

// Создание события по клику
function onMapClick(e) {
  newEvent.value.latitude = e.lngLat.lat
  newEvent.value.longitude = e.lngLat.lng
  showCreate.value = true
}

// Сабмит формы
async function submitEvent() {
  try {
    const payload = { ...newEvent.value }
    if (payload.tags) payload.tags = payload.tags.split(',').map(t => t.trim())
    await api.post('/events', payload)
    showCreate.value = false
    loadEventsByBBox()
  } catch (e) {
    console.error('Ошибка создания события:', e)
    alert('Не удалось создать событие')
  }
}

onMounted(() => {
  mapInstance = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
      },
      layers: [
        {
          id: 'osm-tiles',
          type: 'raster',
          source: 'osm-tiles'
        }
      ]
    },
    center: [props.center[1], props.center[0]],
    zoom: props.zoom
  })
  mapInstance.addControl(new maplibregl.NavigationControl(), 'top-left')
  mapInstance.on('load', loadEventsByBBox)
  mapInstance.on('moveend', debounce(loadEventsByBBox, 500))
  mapInstance.on('click', onMapClick)
})

onBeforeUnmount(() => {
  markers.forEach(m => m.remove())
  if (mapInstance) mapInstance.remove()
})
</script>

<style scoped>
.events-map { }
</style>
