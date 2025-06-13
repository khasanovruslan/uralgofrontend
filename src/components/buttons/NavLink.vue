<!-- File: src/components/NavLink.vue -->
<template>
    <router-link
      :to="to"
      class="inline-block cursor-pointer hover:opacity-70 focus:outline-none"
      v-bind="$attrs"
    >
      <slot />
    </router-link>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    to: {
      type: [String, Object],
      required: true
    }
  });
  </script>
  
  <style scoped>
  /* при необходимости добавь дополнительные стили для активного состояния */
  </style>
  