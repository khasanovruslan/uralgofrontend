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
const Events  = () => import('@/pages/Events.vue')
const NotFound     = () => import('@/pages/NotFound.vue')
const Booking     = () => import('@/pages/Booking.vue')
const MyEventsPage  = () => import('@/pages/MyEventsPage.vue')
const MyTripsPage  = () => import('@/pages/MyTripsPage.vue')
const EventChatPage = () => import('@/pages/EventChatPage.vue')
const TripChatPage = () => import('@/pages/TripChatPage.vue')

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
    path: '/bookings',
    name: 'bookings',
    component: Booking,
    meta: { requiresAuth: true, title: 'Бронирования' }
  },
  {
    path: '/create-trip',
    name: 'create-trip',
    component: CreateTrip,
    meta: { requiresAuth: true, requiresDriver: true, title: 'Создать поездку' }
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
    path: '/events',
    name: 'events',
    component: Events,
    meta: { title: 'События' }
  },
    {
    path: '/my-events',
    name: 'my-events',
    component: MyEventsPage,
    meta: { requiresAuth: true, title: 'Мои события' }
  },
  {
    path: '/events/:id/chat',
    name: 'event-chat',
    component: EventChatPage,
    meta: { requiresAuth: true, title: 'Чат события' }
  },
   { path: '/events/:id', name: 'event-detail', component: () => import('@/pages/EventDetail.vue') },

  {
    path: '/trips/:id/chat',
    name: 'trip-chat',
    component: TripChatPage,
    meta: { requiresAuth: true, title: 'Чат поездки' }
  },
  {
    path: '/my-trips',
    name: 'my-trips',
    component: MyTripsPage,
    meta: { requiresAuth: true, title: 'Мои поездки' }
  },
  {
  path: '/admin',
  component: () => import('@/layouts/AdminLayout.vue'),
  meta: { requiresAuth: true, requiresAdmin: true },
  children: [
    { path: 'users',    component: () => import('@/pages/admin/AdminUsers.vue'),    meta: { title: 'Пользователи' } },
    { path: 'trips',    component: () => import('@/pages/admin/AdminTrips.vue'),    meta: { title: 'Поездки' } },
    { path: 'events',   component: () => import('@/pages/admin/AdminEvents.vue'),   meta: { title: 'События' } },
    { path: 'bookings', component: () => import('@/pages/admin/AdminBookings.vue'), meta: { title: 'Бронирования' } },
  ]
},
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { hideNavigation: true, title: 'Страница не найдена' }
  },
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
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Если у нас есть токен, но нет загруженного user — подгружаем профиль
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchProfile()
    } catch (err) {
      // сбросить состояние, если refresh-токен просрочен
      authStore.logout()
      return next({ name: 'login' })
    }
  }

  // ——————————————————————————————————————————————————————————
  // проверка на любые requiresAuth
  if (to.matched.some(r => r.meta.requiresAuth) && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // запрещённый доступ к логину/регистрации, если уже в системе
  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }

  // проверка роли Driver
  if (to.matched.some(r => r.meta.requiresDriver)) {
    const roles = authStore.user?.roles?.map(r => r.name) || []
    if (!roles.includes('Driver')) {
      return next({ name: 'home' })
    }
  }

  // ——— НОВЫЙ БЛОК: проверка на Admin ——————
  if (to.matched.some(r => r.meta.requiresAdmin)) {
    const roles = authStore.user?.roles?.map(r => r.name) || []
    if (!roles.includes('Admin')) {
      return next({ name: 'home' })
    }
  }
  // ——————————————————————————————————————————————————————————

  // всё ок
  next()
})

export default router
