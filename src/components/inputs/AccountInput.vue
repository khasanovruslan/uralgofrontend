<template>
    <div class="base-input relative flex flex-col">
      <label v-if="label"
        class="absolute px-2 bg-white top-0 left-[10%] transform -translate-y-1/2"
      >
        {{ label }}
      </label>
      <input
        class="w-[360px] h-[48px] border-black border-[1px] rounded-[55px] pl-[20px] pr-[20px] text-[16px] font-[600]"
        :type="type"
        :placeholder="placeholder"
        v-model="localValue"
        @blur="onBlur"
        @input="onInput"
      />
      <img src="@/assets/icons/InputIcon.png" class="w-[34px] absolute top-[50%] left-[85%] transform -translate-y-1/2" alt="">
      <div v-if="errorMessage" class="error-message mt-2">{{ errorMessage }}</div>
    </div>
  </template>
  
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: [String, Number, Date],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    // Кастомная функция для валидации, если нужна
    validator: {
      type: Function,
      default: null
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'validate']);
  
  const localValue = ref(props.modelValue);
  const errorMessage = ref('');
  
  // Синхронизируем внутреннее значение с моделью
  watch(
    () => props.modelValue,
    (newVal) => {
      localValue.value = newVal;
    }
  );
  
  // Следим за изменениями и эмитим событие
  watch(localValue, (newVal) => {
    emit('update:modelValue', newVal);
    if (props.validator) {
      validateField();
    }
  });
  
  // Функция валидации. Можно расширять по необходимости.
  function validateField() {
    errorMessage.value = '';
  
    if (props.required && !localValue.value) {
      errorMessage.value = `${props.label} обязателен.`;
    } else if (props.validator) {
      const error = props.validator(localValue.value);
      if (error) {
        errorMessage.value = error;
      }
    }
    emit('validate', !errorMessage.value);
  }
  
  function onBlur() {
    validateField();
  }
  
  function onInput() {
    // Здесь можно добавить дебаунсинг, если требуется
    validateField();
  }
  </script>
  
  