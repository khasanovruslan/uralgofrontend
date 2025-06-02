<template>
  <div ref="mapEl" class="map-container"></div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Импорт иконок Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

// Настраиваем пути к иконкам
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
})

// Пропсы: старт и финиш
const props = defineProps({
  start: { type: Array, required: true },
  end:   { type: Array, required: true }
})

const mapEl = ref(null)
let map, routeLayer

onMounted(() => {
  // Центрируем карту между точками
  const centerLat = (props.start[0] + props.end[0]) / 2
  const centerLng = (props.start[1] + props.end[1]) / 2

  map = L.map(mapEl.value).setView([centerLat, centerLng], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Маркеры
  L.marker(props.start).addTo(map)
  L.marker(props.end).addTo(map)

  // Линия маршрута
  routeLayer = L.polyline([props.start, props.end], { weight: 3 }).addTo(map)

  // Подгоняем масштаб под маршрут
  map.fitBounds(routeLayer.getBounds(), { padding: [40, 40] })
})

// Если координаты поменялись — обновляем линию и зум
watch(() => [props.start, props.end], ([newS, newE]) => {
  if (!map) return
  routeLayer.setLatLngs([newS, newE])
  map.fitBounds(routeLayer.getBounds(), { padding: [40, 40] })
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}
</style>
