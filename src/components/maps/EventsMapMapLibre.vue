<!-- src/components/EventsMapMapLibre.vue -->
<template>
  <div
    ref="mapContainer"
    class="events-map"
    :style="{ width, height }"
  ></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import maplibregl from 'maplibre-gl'

// Пропсы
const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '600px',
  },
  center: {
    type: Array,
    default: () => [55.76, 37.64],
  },
  zoom: {
    type: Number,
    default: 10,
  },
})

const mapContainer = ref(null)
let mapInstance = null
let markers = []

function drawMarkers() {
  if (!mapInstance) return

  // Очищаем предыдущие маркеры
  markers.forEach((m) => m.remove())
  markers = []

  props.events.forEach((ev) => {
    // Создаём div для иконки
    const el = document.createElement('div')
    el.style.width = '50px'
    el.style.height = '50px'
    el.style.borderRadius = '50%'
    el.style.overflow = 'hidden'
    el.style.border = '2px solid #fff'
    el.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)'
    el.style.cursor = 'pointer'

    const img = document.createElement('img')
    img.src = ev.avatarUrl
    img.alt = ev.title
    img.style.width = '100%'
    img.style.height = '100%'
    el.appendChild(img)

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([ev.coords[1], ev.coords[0]])
      .addTo(mapInstance)
    markers.push(marker)

    // Создаём содержимое попапа
    const container = document.createElement('div')
    container.style.minWidth = '200px'
    container.style.padding = '10px'

    const titleEl = document.createElement('h3')
    titleEl.innerText = ev.title
    container.appendChild(titleEl)

    const authorEl = document.createElement('p')
    authorEl.innerHTML = `<strong>Автор:</strong> ${ev.authorName}`
    container.appendChild(authorEl)

    if (ev.description) {
      const descEl = document.createElement('p')
      descEl.innerText = ev.description
      container.appendChild(descEl)
    }

    const participantsWrapper = document.createElement('div')
    participantsWrapper.innerHTML = '<strong>Участники:</strong> '
    ev.participants.forEach((p) => {
      const imgPart = document.createElement('img')
      imgPart.src = p.avatarUrl
      imgPart.title = p.name
      imgPart.style.width = '30px'
      imgPart.style.height = '30px'
      imgPart.style.borderRadius = '50%'
      imgPart.style.marginRight = '5px'
      imgPart.style.cursor = 'pointer'
      imgPart.dataset.userId = p.id
      imgPart.dataset.userName = p.name
      participantsWrapper.appendChild(imgPart)
    })
    container.appendChild(participantsWrapper)

    const btn = document.createElement('button')
    btn.innerText = 'Присоединиться'
    btn.style.marginTop = '10px'
    btn.style.padding = '5px 10px'
    btn.id = `join-btn-${ev.id}`
    container.appendChild(btn)

    const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(container)

    marker.setPopup(popup)

    // Когда попап откроется, навешиваем клики
    marker.getElement().addEventListener('click', () => {
      popup.addTo(mapInstance)
      popup.on('open', () => {
        const joinBtn = document.getElementById(`join-btn-${ev.id}`)
        if (joinBtn) {
          joinBtn.addEventListener('click', () => {
            alert(`Вы нажали «Присоединиться» к событию "${ev.title}"`)
          })
        }
        const imgs = popup.getElement().querySelectorAll('img[data-user-id]')
        imgs.forEach((imgEl) => {
          imgEl.addEventListener('click', () => {
            const userId = imgEl.dataset.userId
            const userName = imgEl.dataset.userName
            alert(`Клик по аватарке участника ${userName} (id=${userId})`)
          })
        })
      })
    })
  })
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
    center: [props.center[1], props.center[0]],
    zoom: props.zoom,
  })

  mapInstance.on('load', () => {
    drawMarkers()
  })
})

watch(
  () => props.events,
  () => {
    if (mapInstance && mapInstance.isStyleLoaded()) {
      drawMarkers()
    }
  },
  { deep: true }
)

onBeforeUnmount(() => {
  markers.forEach((m) => m.remove())
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<style scoped>
.events-map {
  /* ширина/высота из пропсов */
}
</style>
