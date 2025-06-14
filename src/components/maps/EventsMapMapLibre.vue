<!-- File: src/components/maps/EventsMapMapLibre.vue -->
<template>
  <div class="relative overflow-hidden" :style="{ width, height }">
    <!-- Поиск -->
    <div class="absolute top-4 right-4 z-50 w-64">
      <input
        v-model="query"
        @input="onQueryChange"
        @input.debounce="doSearch"
        type="search"
        placeholder="Найти город, улицу..."
        class="w-full px-3 py-1 rounded border"
      />
      <ul
        v-if="suggestions.length"
        class="bg-white rounded shadow mt-1 max-h-48 overflow-auto"
      >
        <li
          v-for="item in suggestions"
          :key="item.place_id"
          @click="selectSuggestion(item)"
          class="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
        >
          {{ item.display_name }}
        </li>
      </ul>
    </div>

    <!-- Контейнер карты -->
    <div ref="mapContainer" class="w-full h-full map-container"></div>

    <!-- Ваш Vue-попап -->
    <EventPopup
      v-if="selectedEvent"
      :event="selectedEvent"
      :style="popupStyle"
      @close="selectedEvent = null"
      @join="onJoin"
    />

    <!-- Модалка создания -->
    <NewEventModal
      v-if="showCreate"
      :coords="[newEvent.latitude, newEvent.longitude]"
      @created="onEventCreated"
      @close="showCreate = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import EventPopup     from '@/components/Pages/EventsPage/EventPopup.vue'
import NewEventModal  from '@/components/Pages/EventsPage/NewEventModal.vue'
import api            from '@/api/axiosInstance'
import { useRouter }  from 'vue-router'

const props = defineProps({
  center: { type: Array, default: () => [58.01,56.23] },
  zoom:   { type: Number, default: 12 },
  width:  { type: String, default: '100%' },
  height: { type: String, default: '600px' }
})

const router        = useRouter()
const mapContainer  = ref(null)
let   map           = null
let   markers       = []

// события
const eventsOnMap   = ref([])
// поиск
const query         = ref('')
const suggestions   = ref([])
let   searchAbort   = null
// попап события
const selectedEvent = ref(null)
const popupPixel    = ref({ x:0, y:0 })
// создание
const showCreate    = ref(false)
const newEvent      = reactive({ latitude:0, longitude:0 })

// стиль Vue-попапа
const popupStyle = computed(() => ({
  position:  'absolute',
  left:      `${popupPixel.value.x}px`,
  top:       `${popupPixel.value.y}px`,
  transform: 'translate(-50%,-100%)',
  zIndex:    1000
}))

// загрузка
async function loadEventsByBBox() {
  if (!map) return
  const b    = map.getBounds()
  const bbox = [b.getSouth(),b.getWest(),b.getNorth(),b.getEast()].join(',')
  const { data } = await api.get('/events',{ params:{ bbox }})
  eventsOnMap.value = data
  drawMarkers()
}

// рисование
function drawMarkers() {
  markers.forEach(m=>m.remove()); markers=[]
  const mapW   = map.getContainer().clientWidth
  const popupW = 300

  eventsOnMap.value.forEach(ev=>{
    const el = document.createElement('div')
    el.className = 'marker-class w-[40px] h-[40px] rounded-full border-2 border-white shadow-lg cursor-pointer'
    el.style.transform='translate(-20px,-20px)'

    // картинка
    const img = document.createElement('img')
    const url = ev.imageUrl?.startsWith('http')
      ? ev.imageUrl
      : `${import.meta.env.VITE_API_URL||''}${ev.imageUrl}`
    img.src = url || '/images/default-event.png'
    img.style.width=img.style.height='100%'
    el.appendChild(img)

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([ev.longitude,ev.latitude])
      .addTo(map)
    markers.push(marker)

    el.addEventListener('click', e=>{
      e.stopPropagation()
      const pt = map.project([ev.longitude,ev.latitude])
      let x = pt.x
      if (x < popupW/2)           x = popupW/2
      else if (x + popupW/2 > mapW) x = mapW - popupW/2

      popupPixel.value    = { x, y:pt.y }
      selectedEvent.value = ev
    })
  })
}

// клик по карте
function handleMapClick(e) {
  if (selectedEvent.value) {
    selectedEvent.value = null
  } else {
    newEvent.latitude  = e.lngLat.lat
    newEvent.longitude = e.lngLat.lng
    showCreate.value   = true
  }
}

// создано
function onEventCreated() {
  showCreate.value = false
  loadEventsByBBox()
}

// вступить
async function onJoin(id) {
  try {
    await api.post(`/events/${id}/join`)
    router.push('/my-events')
  } catch (err) {
    alert(err.response?.data?.message||'Ошибка при вступлении')
  }
}

// поиск
async function doSearch() {
  const q = query.value.trim()
  if (!q) { suggestions.value = []; return }
  searchAbort && searchAbort.abort()
  const ctrl = new AbortController(); searchAbort = ctrl
  try {
    const resp = await api.get('/geocode', {
      params:{ city: q, limit:5 },
      signal: ctrl.signal
    })
    suggestions.value = resp.data   // ожидаем массив подсказок
  } catch(err) {
    if (err.name!=='CanceledError') console.error(err)
  }
}
function onQueryChange() {
  if (!query.value) suggestions.value=[]
}
function selectSuggestion(item) {
  suggestions.value = []
  query.value       = item.display_name
  const lat = parseFloat(item.lat)
  const lon = parseFloat(item.lon)
  map.flyTo({ center:[lon,lat], zoom:14 })
}

// lifecycle
onMounted(()=>{
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version:8,
      sources:{ 'osm-tiles': {
        type:'raster',
        tiles:['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize:256
      }},
      layers:[{ id:'osm-tiles',type:'raster',source:'osm-tiles' }]
    },
    center:[props.center[1],props.center[0]],
    zoom: props.zoom
  })
  map.addControl(new maplibregl.NavigationControl(),'top-left')
  map.addControl(new maplibregl.FullscreenControl(),'top-left')
  map.addControl(new maplibregl.GeolocateControl({ trackUserLocation:true }),'top-left')

  map.on('load',    loadEventsByBBox)
  map.on('moveend', loadEventsByBBox)
  map.on('move',    ()=>{
    if (selectedEvent.value) {
      const pt = map.project([selectedEvent.value.longitude,selectedEvent.value.latitude])
      popupPixel.value = { x:pt.x, y:pt.y }
    }
  })
  map.on('click', handleMapClick)
})

onBeforeUnmount(()=>{
  markers.forEach(m=>m.remove())
  map && map.remove()
})
</script>

<style scoped>
.map-container {
  position: relative;
  overflow: hidden;
}
/* Поисковые подсказки */
.absolute ul { z-index:9998; }
/* Скрываем дефолтный popup MapLibre */
.mapboxgl-popup { display:none !important; }
/* Стили маркера */
.marker-class { position:absolute; }
</style>
