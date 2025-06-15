<!-- src/components/RouteMapMapLibre.vue -->
<template>
  <div
    ref="mapContainer"
    class="route-map"
    :style="{ width, height }"
  ></div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import maplibregl from 'maplibre-gl'
import polyline from '@mapbox/polyline'

const props = defineProps({
  origin:      { type: [Array, Object, String], required: true },
  destination: { type: [Array, Object, String], required: true },
  width:       { type: String, default: '100%' },
  height:      { type: String, default: '400px' }
})

const mapContainer = ref(null)
let mapInstance = null

const ROUTE_SOURCE_ID = 'route-source'
const ROUTE_LAYER_ID  = 'route-layer'

/** Извлекает [lat, lon] из 
 *  • [lat, lon]
 *  • [{ lat, lon, … }]
 *  • { lat, lon }
 *  • иначе → [NaN,NaN]
 */
function parsePlace(input) {
  // 1) готовый массив чисел
  if (Array.isArray(input)
    && input.length === 2
    && typeof input[0] === 'number'
    && typeof input[1] === 'number'
  ) {
    return input
  }
  // 2) массив объектов [{lat,lon}, …]
  if (Array.isArray(input)
    && input.length > 0
    && input[0] !== null
    && typeof input[0] === 'object'
    && input[0].lat != null
    && input[0].lon != null
  ) {
    return [ parseFloat(input[0].lat), parseFloat(input[0].lon) ]
  }
  // 3) одиночный объект {lat, lon}
  if (input && typeof input === 'object' && input.lat != null && input.lon != null) {
    return [ parseFloat(input.lat), parseFloat(input.lon) ]
  }
  // всё остальное — невалидно
  return [ NaN, NaN ]
}

const originCoords      = computed(() => parsePlace(props.origin))
const destinationCoords = computed(() => parsePlace(props.destination))

function coordsValid([lat, lng]) {
  return !isNaN(lat) && !isNaN(lng)
}

async function drawRoute() {
  if (!mapInstance) return

  const [oLat, oLng] = originCoords.value
  const [dLat, dLng] = destinationCoords.value

  if (!coordsValid([oLat,oLng]) || !coordsValid([dLat,dLng])) {
    console.warn('RouteMap: нет валидных координат', originCoords.value, destinationCoords.value)
    return
  }

  // убрать старые слой/источник
  if (mapInstance.getLayer(ROUTE_LAYER_ID))  mapInstance.removeLayer(ROUTE_LAYER_ID)
  if (mapInstance.getSource(ROUTE_SOURCE_ID)) mapInstance.removeSource(ROUTE_SOURCE_ID)

  // маркеры
  new maplibregl.Marker({ color: 'green' }).setLngLat([oLng,oLat]).addTo(mapInstance)
  new maplibregl.Marker({ color: 'red'   }).setLngLat([dLng,dLat]).addTo(mapInstance)

  // запрос к OSRM
  const coordsParam = `${oLng},${oLat};${dLng},${dLat}`
  const url = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=polyline`
  try {
    const res  = await fetch(url)
    const json = await res.json()
    if (!json.routes?.length) {
      console.warn('OSRM: нет маршрутов')
      return
    }

    const encoded      = json.routes[0].geometry
    const decodedLines = polyline.decode(encoded).map(([lat, lng]) => [lng, lat])

    mapInstance.addSource(ROUTE_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: decodedLines },
        properties: {}
      }
    })
    mapInstance.addLayer({
      id: ROUTE_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint:  { 'line-color': '#0074D9', 'line-width': 5 }
    })

    // фокус по маршруту
    const bounds = decodedLines.reduce(
      (b, c) => b.extend(c),
      new maplibregl.LngLatBounds(decodedLines[0], decodedLines[0])
    )
    mapInstance.fitBounds(bounds, { padding: 40 })

  } catch (err) {
    console.error('Ошибка построения маршрута:', err)
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
          tileSize: 256
        }
      },
      layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm-tiles' }]
    },
    center:  coordsValid(originCoords.value)
             ? [originCoords.value[1], originCoords.value[0]]
             : [0,0],
    zoom: 10
  })
  mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right')
  mapInstance.on('load', drawRoute)
})

watch([ originCoords, destinationCoords ], () => {
  if (mapInstance && mapInstance.isStyleLoaded()) {
    drawRoute()
  }
})

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<style scoped>
.route-map { width: 100%; height: 100%; }
</style>
