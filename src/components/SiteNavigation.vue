<template>
  <header class="sticky top-0 w-full bg-headerImage bg-no-repeat bg-cover bg-center z-50">
    <!-- Десктопная шапка -->
    <div class="hidden xl:flex items-center justify-between h-24 px-8 relative">
      <!-- Левое меню -->
      <nav class="flex items-center space-x-8 text-sm font-normal">
        <NavLink to="/">главная</NavLink>
        <NavLink to="/destinations">направления</NavLink>
        <NavLink to="/experiences">впечатления</NavLink>
        <!-- Dropdown «поездки» -->
        <div ref="dropdownRef" class="relative" @keydown.esc="menuOpen = false">
          <button
            @click="toggleMenu"
            class="flex items-center space-x-1 focus:outline-none"
            aria-haspopup="true"
            :aria-expanded="menuOpen"
          >
            <span>поездки</span>
            <svg
              class="w-3 h-3 transform transition-transform duration-200"
              :class="{ 'rotate-180': menuOpen }"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <ul
            v-show="menuOpen"
            class="absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-md z-50"
            role="menu"
            aria-label="Меню поездок"
          >
            <li
              v-if="authStore.isAuthenticated && isDriver"
              class="menu-item"
              role="menuitem"
              @click="goTo('/create-trip')"
            >создать</li>
            <li
              class="menu-item"
              role="menuitem"
              @click="goTo('/find-trip')"
            >найти</li>
            <li
              v-if="authStore.isAuthenticated"
              class="menu-item"
              role="menuitem"
              @click="goTo('/bookings')"
            >актуальные</li>
          </ul>
        </div>
      </nav>

      <!-- Логотип по центру -->
      <NavLink
        to="/"
        class="absolute left-1/2 transform -translate-x-1/2 text-6xl font-black opacity-80"
      >
        uralgo
      </NavLink>

      <!-- Кнопка «войти» или имя пользователя -->
      <div
        class="border border-black border-opacity-15 bg-white bg-opacity-40 px-4 py-2 rounded-full flex items-center justify-center z-15"
      >
        <template v-if="authStore.isAuthenticated && authStore.user">
          <NavLink to="/account" class="flex items-center focus:outline-none">
            <img
              :src="userAvatar"
              alt="Аватар пользователя"
              class="w-8 h-8 rounded-full object-cover mr-2"
              loading="lazy"
            />
            <span class="font-bold text-md opacity-90">
              {{ authStore.user.fullName }}
            </span>
          </NavLink>
        </template>
        <template v-else>
          <NavLink to="/login" class="font-bold text-md opacity-90 focus:outline-none">
            войти
          </NavLink>
        </template>
      </div>
    </div>

    <!-- Мобильная шапка -->
    <div class="xl:hidden flex items-center justify-between h-12 px-4 relative">
      <!-- Логотип слева -->
      <NavLink to="/" class="text-2xl font-black">uralgo</NavLink>

      <div class="flex items-center space-x-4">
        <!-- Кнопка входа / аватар -->
        <div>
          <template v-if="authStore.isAuthenticated && authStore.user">
            <NavLink to="/account" class="focus:outline-none">
              <img
                :src="userAvatar"
                alt="Аватар"
                class="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
            </NavLink>
          </template>
          <template v-else>
            <NavLink to="/login" class="font-bold text-md opacity-90 focus:outline-none">
              войти
            </NavLink>
          </template>
        </div>

        <!-- Бургер -->
        <button
          @click="toggleMobileMenu"
          class="focus:outline-none transform transition-transform duration-200"
          :class="{ 'rotate-90': mobileMenuOpen }"
          aria-label="Открыть меню"
          :aria-expanded="mobileMenuOpen"
        >
          <img src="/images/burgerIcon.svg" alt="Меню" class="w-8 h-8" loading="lazy" />
        </button>
      </div>
    </div>

    <!-- Мобильное меню -->
    <transition name="slide-down">
      <div
        v-show="mobileMenuOpen"
        class="xl:hidden bg-white shadow-md"
        role="menu"
        aria-label="Мобильное меню"
      >
        <nav class="flex flex-col p-4 space-y-2">
          <NavLink to="/">главная</NavLink>
          <NavLink to="/destinations">направления</NavLink>
          <NavLink to="/experiences">впечатления</NavLink>
          <NavLink v-if="isDriver" to="/create-trip">создать поездку</NavLink>
          <NavLink to="/find-trip">найти поездку</NavLink>
          <NavLink v-if="authStore.isAuthenticated" to="/bookings">актуальные бронирования</NavLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import NavLink from '@/components/buttons/NavLink.vue'
import defaultAvatar from '@/assets/images/default-avatar.svg'

const router = useRouter()
const authStore = useAuthStore()

const menuOpen = ref(false)
const mobileMenuOpen = ref(false)
const dropdownRef = ref(null)

// Проверяем роль водителя
const isDriver = computed(
  () => authStore.isAuthenticated && authStore.user?.roles?.some(r => r.name === 'Driver')
)

// Формируем URL аватара или используем дефолт
const baseUrl = import.meta.env.VITE_API_URL || ''
const userAvatar = computed(() => {
  const photo = authStore.user?.photoUrl
  return authStore.isAuthenticated && photo
    ? `${baseUrl}${photo}`
    : defaultAvatar
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function goTo(path) {
  menuOpen.value = false
  mobileMenuOpen.value = false
  router.push(path)
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    menuOpen.value = false
  }
}

function handleScroll() {
  menuOpen.value = false
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll)

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchProfile()
    } catch {
      authStore.logout()
    }
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.menu-item {
  padding: 10px 15px;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px solid rgba(0,0,0,0.15);
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:hover {
  background-color: #f0f0f0;
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  overflow: hidden;
}
.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 400px;
}
</style>
