<template>
  <div class="grid gap-4">
    <div
      v-for="evt in events"
      :key="evt.id"
      class="border rounded p-4 flex justify-between items-start"
    >
      <div>
        <h2 class="text-lg font-semibold">{{ evt.title }}</h2>
        <p class="text-sm">{{ new Date(evt.startTime).toLocaleString() }}</p>
        <p class="text-sm mt-1">{{ evt.description }}</p>
      </div>
      <button
        class="px-3 py-1 bg-blue-600 text-white rounded"
        @click="$emit('openChat', evt.id)"
      >
        Чат
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ events: Array })
defineEmits(['openChat'])
</script>
