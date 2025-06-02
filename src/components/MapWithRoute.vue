<!-- src/components/MapWithRoute.vue -->
<template>
  <div ref="mapEl" class="h-64 rounded-lg overflow-hidden"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet-routing-machine'

// Исправляем иконки, если надо
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:   require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:         require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:       require('leaflet/dist/images/marker-shadow.png'),
})

const props = defineProps({
  start: { type: Array, required: true },  // [lat, lng]
  end:   { type: Array, required: true }
})

const mapEl = ref(null)

onMounted(() => {
  const map = L.map(mapEl.value).setView(props.start, 10)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  L.Routing.control({
    waypoints: [ L.latLng(...props.start), L.latLng(...props.end) ],
    router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
    lineOptions: { styles: [{ weight: 4 }] },
    createMarker: i => L.marker(i === 0 ? props.start : props.end),
    addWaypoints: false,
    showAlternatives: false
  }).addTo(map)
})
</script>

<style scoped>
/* Высота и скругления можно подправить */
</style>
