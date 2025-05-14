// File: src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import HomePage from '../pages/HomePage.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Account from '../pages/Account.vue'
import CreateTrip from '../pages/CreateTrip.vue'
import FindTrip from '../pages/FindTrip.vue'
import Destinations from '../pages/Destinations.vue'
import TripResults from '../pages/TripResults.vue'

const routes = [
  { path: '/',           name: 'home',       component: HomePage },
  { path: '/login',      name: 'login',      component: Login,    meta: { hideNavigation: true }   },
  { path: '/register',   name: 'register',   component: Register, meta: { hideNavigation: true }   },
  { path: '/account',    name: 'account',    component: Account,  meta: { requiresAuth: true } },
  { path: '/createtrip', name: 'createtrip', component: CreateTrip, meta: { requiresAuth: true } },
  { path: '/findtrip',   name: 'findtrip',   component: FindTrip },
  { path: '/destinations', name: 'destinations', component: Destinations },
  { path: '/results',    name: 'results',     component: TripResults },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }; // ⬆️ плавно вверх
  }
})

// Глобальный guard для защиты маршрутов и layout
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // Защита маршрутов
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }
  // Если авторизован, не пускаем на login/register
  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }
  next()
})

export default router
