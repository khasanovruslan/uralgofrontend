<template>
  <div class="base-input relative flex flex-col w-full">
    <label
      v-if="label"
      class="absolute px-2 bg-white top-0 left-4 transform -translate-y-1/2 text-gray-700 text-sm"
    >
      {{ label }}
    </label>
    <input
      class="w-full h-12 border border-gray-300 rounded-full pl-5 pr-5 text-base font-medium focus:border-blue-400 transition"
      :type="type"
      :placeholder="placeholder"
      v-model="localValue"
      @blur="onBlur"
      @input="onInput"
    />
    <div v-if="errorMessage" class="text-red-500 text-sm mt-1">{{ errorMessage }}</div>
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
  
  