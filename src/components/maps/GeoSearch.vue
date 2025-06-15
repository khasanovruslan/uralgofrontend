<template>
  <div class="relative w-full">
    <input
      :value="modelValue"
      @input="onInput"
      @focus="open = true"
      @blur="onBlur"
      :placeholder="placeholder"
      class="w-full px-3 py-2 text-sm rounded"
    />

    <ul
      v-if="open && suggestions.length"
      class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto"
    >
      <li
        v-for="item in suggestions"
        :key="item.place_id"
        @mousedown.prevent="select(item)"
        class="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
      >
        {{ formatName(item.display_name) }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/axiosInstance'
import { debounce } from 'lodash'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue','select'])

const open = ref(false)
const suggestions = ref([])
let searchAbort = null

// Debounced Nominatim search
const doSearch = debounce(async (q) => {
  if (!q.trim()) {
    suggestions.value = []
    return
  }

  if (searchAbort) searchAbort.abort()
  const ctrl = new AbortController()
  searchAbort = ctrl

  try {
    const { data } = await api.get('/geocode', {
      params: { city: q, limit: 5 },
      signal: ctrl.signal
    })
    suggestions.value = Array.isArray(data) ? data : []
    open.value = true
  } catch (err) {
    if (err.name !== 'CanceledError') console.error(err)
  } finally {
    searchAbort = null
  }
}, 300)

function onInput(e) {
  const v = e.target.value
  emit('update:modelValue', v)
  doSearch(v)
}

function onBlur() {
  setTimeout(() => { open.value = false }, 150)
}

// Показываем только два уровня: город и край
function formatName(displayName) {
  return displayName
    .split(',')
    .slice(0, 2)
    .map(s => s.trim())
    .join(', ')
}

function select(item) {
  const name = formatName(item.display_name)
  emit('update:modelValue', name)
  emit('select', {
    name,
    lat:  parseFloat(item.lat),
    lon:  parseFloat(item.lon)
  })
  open.value = false
}
</script>

<style scoped>
ul {
  scrollbar-width: thin;
}
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 3px;
}
</style>
