// File: src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/authStore'

// Route component lazy-loading for performance
const HomePage     = () => import('@/pages/HomePage.vue')
const Login        = () => import('@/pages/Login.vue')
const Register     = () => import('@/pages/Register.vue')
const Account      = () => import('@/pages/Account.vue')
const CreateTrip   = () => import('@/pages/CreateTrip.vue')
const FindTrip     = () => import('@/pages/FindTrip.vue')
const Destinations = () => import('@/pages/Destinations.vue')
const TripResults  = () => import('@/pages/TripResults.vue')
const Experiences  = () => import('@/pages/Experiences.vue')
const NotFound     = () => import('@/pages/NotFound.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: 'Главная' }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { hideNavigation: true, title: 'Вход' }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { hideNavigation: true, title: 'Регистрация' }
  },
  {
    path: '/account',
    name: 'account',
    component: Account,
    meta: { requiresAuth: true, title: 'Личный кабинет' }
  },
  {
    path: '/create-trip',
    name: 'create-trip',
    component: CreateTrip,
    meta: { requiresAuth: true, title: 'Создать поездку' }
  },
  {
    path: '/find-trip',
    name: 'find-trip',
    component: FindTrip,
    meta: { title: 'Найти поездку' }
  },
  {
    path: '/destinations',
    name: 'destinations',
    component: Destinations,
    meta: { title: 'Направления' }
  },
  {
    path: '/results',
    name: 'results',
    component: TripResults,
    meta: { title: 'Результаты поездок' }
  },
  {
    path: '/experiences',
    name: 'experiences',
    component: Experiences,
    meta: { title: 'Впечатления' }
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { hideNavigation: true, title: 'Страница не найдена' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // если есть сохранённая позиция — вернуться к ней
    if (savedPosition) {
      return savedPosition
    }
    // иначе — плавно наверх страницы
    return { top: 0, behavior: 'smooth' }
  }
})

// Глобальный guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Устанавливаем заголовок страницы
  if (to.meta?.title) {
    document.title = `${to.meta.title} — UralGo`
  }

  // Защита auth-only маршрутов
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Защита от входа зарегистрированных на страницы входа/регистрации
  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }

  next()
})

export default router
