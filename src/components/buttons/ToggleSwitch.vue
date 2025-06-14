<template>
  <div class="inline-flex bg-gray-200 rounded-full p-1">
    <button
      v-for="(opt,i) in options"
      :key="i"
      @click="$emit('update:modelValue', i)"
      :class="[
        'px-4 py-1 rounded-full transition-colors',
        modelValue === i ? 'bg-white shadow' : 'text-gray-600'
      ]"
    >
      {{ opt }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  options: Array,
  modelValue: Number
})
defineEmits(['update:modelValue'])
</script>
