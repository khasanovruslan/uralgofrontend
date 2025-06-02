<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import maplibregl from 'maplibre-gl'

// Жёстко заданные точки: Москва и Санкт-Петербург
const props = defineProps({
  start: { type: Array, default: () => [55.7558, 37.6176] },
  end:   { type: Array, default: () => [59.9311, 30.3609] }
})

const mapContainer = ref(null)
let map, routeSourceId = 'route'

onMounted(() => {
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://demotiles.maplibre.org/style.json',  // бесплатный стиль MapLibre
    center: [(props.start[1] + props.end[1]) / 2, (props.start[0] + props.end[0]) / 2].reverse(),
    zoom: 5
  })

  map.on('load', () => {
    // добавляем слой с маршрутом (прямая линия)
    map.addSource(routeSourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [props.start[1], props.start[0]],
              [props.end[1],   props.end[0]]
            ]
          }
        }]
      }
    })

    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: routeSourceId,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#007cbf', 'line-width': 4 }
    })

    // маркеры
    new maplibregl.Marker().setLngLat([props.start[1], props.start[0]]).addTo(map)
    new maplibregl.Marker().setLngLat([props.end[1],   props.end[0]]).addTo(map)

    // подгоняем зум под маршрут
    const bounds = new maplibregl.LngLatBounds(
      [props.start[1], props.start[0]],
      [props.end[1],   props.end[0]]
    )
    map.fitBounds(bounds, { padding: 40 })
  })
})

// если props меняются — обновляем источник
watch(() => [props.start, props.end], ([newS, newE]) => {
  if (!map || !map.getSource(routeSourceId)) return
  map.getSource(routeSourceId).setData({
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [newS[1], newS[0]],
          [newE[1], newE[0]]
        ]
      }
    }]
  })
})
</script>

<style scoped>
.map-container {
  width: 80%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
