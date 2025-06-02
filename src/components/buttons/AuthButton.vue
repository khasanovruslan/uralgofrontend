<template>
    <button
      :type="type"
      class="w-[424px] h-[48px] bg-black text-white rounded-[90px]"
      @click="handleClick"
    > 
    <slot>Кнопка</slot>
    </button>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  defineProps({
    type: {
      type: String,
      default: 'submit', // По умолчанию кнопка "submit"
    },
  });
  
  const emit = defineEmits(['click']);
  
  const handleClick = () => {
    emit('click');
  };
  </script>
  
  <style lang="scss" scoped>
  /* Здесь можешь добавить кастомные стили для кнопки */
  </style>
  