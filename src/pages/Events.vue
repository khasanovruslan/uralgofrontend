<template>
  <main class="flex flex-col items-center py-6">
    <h1 class="text-3xl font-extrabold mb-4">События на карте</h1>
    <EventsMapMapLibre
      width="100%"
      height="500px"
    />
  </main>
</template>

<script setup>
import EventsMapMapLibre from '@/components/maps/EventsMapMapLibre.vue'
</script>

<style scoped>
</style>
