<!-- File: src/components/Pages/EventsPage/InfoRow.vue ПОКА НЕ ИСПОЛЬЗУЕТСЯ -->
<template>
  <div class="flex items-center space-x-2">
    <img :src="`@/assets/icons/${icon}`" :alt="label" class="w-5 h-5"/>
    <span class="text-sm text-gray-700">{{ label }}: {{ value }}</span>
  </div>
</template>
<script setup>
const props = defineProps({
  icon:  String,
  label: String,
  value: [String, Number]
})
</script>
