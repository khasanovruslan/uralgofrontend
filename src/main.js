// File: src/main.js
import './assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Инициализируем Pinia
const pinia = createPinia()
app.use(pinia)

// Подключаем Vue Router
app.use(router)

app.mount('#app')