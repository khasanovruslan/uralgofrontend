<!-- src/components/RouteMapMapLibre.vue -->
<template>
    <div
      ref="mapContainer"
      class="route-map"
      :style="{ width: width, height: height }"
    ></div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import maplibregl from 'maplibre-gl'
  import polyline from '@mapbox/polyline' // npm install @mapbox/polyline
  
  // Пропсы компонента: origin и destination в формате [lat, lng]
  const props = defineProps({
    origin: {
      type: Array,
      required: true,
    },
    destination: {
      type: Array,
      required: true,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '400px',
    },
  })
  
  // Ссылка на контейнер карты
  const mapContainer = ref(null)
  let mapInstance = null
  
  // Источник и слой для маршрута
  const ROUTE_SOURCE_ID = 'route-source'
  const ROUTE_LAYER_ID = 'route-layer'
  
  // Функция, которая запрашивает маршрут у OSRM и рисует его на карте
  async function drawRoute() {
    if (!mapInstance) return
  
    // Удалим предыдущий источник/слой, если он существует
    if (mapInstance.getLayer(ROUTE_LAYER_ID)) {
      mapInstance.removeLayer(ROUTE_LAYER_ID)
    }
    if (mapInstance.getSource(ROUTE_SOURCE_ID)) {
      mapInstance.removeSource(ROUTE_SOURCE_ID)
    }


  // Маркеры отправления / прибытия
  new maplibregl.Marker({ color: 'green' })
    .setLngLat([props.origin[1], props.origin[0]])
    .addTo(mapInstance)
  new maplibregl.Marker({ color: 'red' })
    .setLngLat([props.destination[1], props.destination[0]])
    .addTo(mapInstance)
  
    // Формируем строку запроса для OSRM (lng,lat;lng,lat)
    const coords = [
      props.origin[1] + ',' + props.origin[0],
      props.destination[1] + ',' + props.destination[0],
    ].join(';')
  
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=polyline`
    try {
      const response = await fetch(url)
      const data = await response.json()
      if (!data.routes || data.routes.length === 0) {
        console.warn('Маршрут не найден')
        return
      }
      // OSRM возвращает полилинию в формате Mapbox polyline (encoded)
      const encoded = data.routes[0].geometry
      const coordsDecoded = polyline.decode(encoded).map(([lat, lng]) => [lng, lat])
  
      // Добавляем источник с GeoJSON LineString
      mapInstance.addSource(ROUTE_SOURCE_ID, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordsDecoded,
          },
        },
      })
  
      // Добавляем слой, чтобы отобразить маршрут
      mapInstance.addLayer({
        id: ROUTE_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#0074D9',
          'line-width': 5,
        },
      })
  
      // Центруем и зумим карту по всему маршруту
      const bounds = coordsDecoded.reduce(
        (b, coord) => b.extend(coord),
        new maplibregl.LngLatBounds(coordsDecoded[0], coordsDecoded[0])
      )
      mapInstance.fitBounds(bounds, { padding: 40 })
    } catch (err) {
      console.error('Ошибка при построении маршрута:', err)
    }
  }
  
  onMounted(() => {
    // Инициализируем карту с «растровым» слоем OpenStreetMap
    mapInstance = new maplibregl.Map({
      container: mapContainer.value,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
          },
        ],
      },
      center: [props.origin[1], props.origin[0]],
      zoom: 10,
    })
    mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right')
  
    mapInstance.on('load', () => {
      drawRoute()
    })
  })
  
  // При изменении origin/destination пересоздаём маршрут
  watch(
    () => [props.origin, props.destination],
    () => {
      if (mapInstance && mapInstance.isStyleLoaded()) {
        drawRoute()
      }
    }
  )
  
  onBeforeUnmount(() => {
    if (mapInstance) {
      mapInstance.remove()
      mapInstance = null
    }
  })
  </script>
  
  <style scoped>
  </style>
  