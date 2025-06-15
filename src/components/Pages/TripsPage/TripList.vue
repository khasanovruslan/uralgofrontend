<template>
  <div class="space-y-4">
    <MyTripBlock
      v-for="trip in trips"
      :key="trip.id"
      :trip="trip"
      @cancelled="handleCancelled"
      @select="$emit('select', trip)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import MyTripBlock from '@/components/MyTripBlock.vue'

const props = defineProps({
  trips: { type: Array, default: () => [] }
})

const emit = defineEmits(['select', 'refresh'])

function handleCancelled(tripId) {
  emit('refresh')
}
</script>
