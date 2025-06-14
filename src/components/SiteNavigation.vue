<!-- File: src/components/AppHeader.vue -->
<template>
  <header class="sticky top-0 w-full bg-headerImage bg-no-repeat bg-cover bg-center z-50">
    <!-- Десктоп -->
    <div class="hidden xl:flex items-center justify-between h-24 px-8 relative">
      <nav class="flex items-center space-x-8 text-sm font-normal">
        <NavLink to="/">главная</NavLink>
        <NavLink to="/destinations">направления</NavLink>

        <!-- Experiences dropdown -->
        <div ref="expRef" class="relative" @keydown.esc="experiencesOpen = false">
          <button
            @click="toggleExperiences"
            class="flex items-center space-x-1 focus:outline-none"
            aria-haspopup="true"
            :aria-expanded="experiencesOpen"
          >
            <span>впечатления</span>
            <svg
              class="w-3 h-3 transform transition-transform duration-200"
              :class="{ 'rotate-180': experiencesOpen }"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 
                   0 111.08 1.04l-4.25 4.5a.75.75 
                   0 01-1.08 0l-4.25-4.5a.75.75 
                   0 01.02-1.06z"
                clip-rule="evenodd"/>
            </svg>
          </button>
          <ul
            v-show="experiencesOpen"
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50"
            role="menu"
            aria-label="Меню впечатлений"
          >
            <li @click="goTo('/events')" class="menu-item" role="menuitem">
              события
            </li>
            <li @click="goTo('/excursions')" class="menu-item" role="menuitem">
              экскурсии
            </li>
            <li
              v-if="authStore.isAuthenticated"
              @click="goTo('/my-events')"
              class="menu-item"
              role="menuitem"
            >
              мои события
            </li>
          </ul>
        </div>

        <!-- Trips dropdown (ваш старый) -->
        <div ref="tripRef" class="relative" @keydown.esc="tripsOpen = false">
          <button
            @click="toggleTrips"
            class="flex items-center space-x-1 focus:outline-none"
            aria-haspopup="true"
            :aria-expanded="tripsOpen"
          >
            <span>поездки</span>
            <svg
              class="w-3 h-3 transform transition-transform duration-200"
              :class="{ 'rotate-180': tripsOpen }"
              fill="currentColor" viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 
                   0 111.08 1.04l-4.25 4.5a.75.75 
                   0 01-1.08 0l-4.25-4.5a.75.75 
                   0 01.02-1.06z"
                clip-rule="evenodd"/>
            </svg>
          </button>
          <ul
            v-show="tripsOpen"
            class="absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-md z-50"
            role="menu"
            aria-label="Меню поездок"
          >
            <li
              v-if="authStore.isAuthenticated && isDriver"
              @click="goTo('/create-trip')"
              class="menu-item"
            >
              создать
            </li>
            <li @click="goTo('/find-trip')" class="menu-item">найти</li>
            <li
              v-if="authStore.isAuthenticated"
              @click="goTo('/bookings')"
              class="menu-item"
            >
              актуальные
            </li>
          </ul>
        </div>
      </nav>

      <!-- Лого -->
      <NavLink
        to="/"
        class="absolute left-1/2 transform -translate-x-1/2 text-6xl font-black opacity-80"
      >uralgo</NavLink>

      <!-- Аккаунт -->
      <div class="border border-black border-opacity-15 bg-white bg-opacity-40 px-4 py-2 rounded-full flex items-center z-15">
        <template v-if="authStore.isAuthenticated && authStore.user">
          <NavLink to="/account" class="flex items-center focus:outline-none">
            <img :src="userAvatar" alt="Аватар" class="w-8 h-8 rounded-full mr-2"/>
            <span class="font-bold">{{ authStore.user.fullName }}</span>
          </NavLink>
        </template>
        <template v-else>
          <NavLink to="/login" class="font-bold focus:outline-none">войти</NavLink>
        </template>
      </div>
    </div>

    <!-- Мобилка -->
    <div class="xl:hidden flex items-center justify-between h-12 px-4 relative">
      <NavLink to="/" class="text-2xl font-black">uralgo</NavLink>
      <div class="flex items-center space-x-4">
        <template v-if="authStore.isAuthenticated && authStore.user">
          <NavLink to="/account">
            <img :src="userAvatar" alt="Аватар" class="w-8 h-8 rounded-full"/>
          </NavLink>
        </template>
        <template v-else>
          <NavLink to="/login" class="font-bold">войти</NavLink>
        </template>
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="focus:outline-none transform transition-transform duration-200"
          :class="{ 'rotate-90': mobileMenuOpen }"
        >
          <img src="/images/burgerIcon.svg" alt="Меню" class="w-8 h-8"/>
        </button>
      </div>
    </div>

    <transition name="slide-down">
      <div v-show="mobileMenuOpen" class="xl:hidden bg-white shadow-md">
        <nav class="flex flex-col p-4 space-y-2">
          <NavLink to="/">главная</NavLink>
          <NavLink to="/destinations">направления</NavLink>

          <!-- мобильный dropdown впечатлений -->
          <div>
            <button
              @click="expMobileOpen = !expMobileOpen"
              class="w-full flex justify-between items-center py-1"
            >
              впечатления
              <svg
                class="w-4 h-4 transform transition-transform"
                :class="{ 'rotate-180': expMobileOpen }"
                fill="currentColor" viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 
                     0 111.08 1.04l-4.25 4.5a.75.75 
                     0 01-1.08 0l-4.25-4.5a.75.75 
                     0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <ul v-show="expMobileOpen" class="pl-4">
              <li @click="goTo('/events')" class="py-1">события</li>
              <li @click="goTo('/excursions')" class="py-1">экскурсии</li>
              <li
                v-if="authStore.isAuthenticated"
                @click="goTo('/my-events')"
                class="py-1"
              >мои события</li>
            </ul>
          </div>

          <!-- поездки -->
          <NavLink to="/find-trip">найти поездку</NavLink>
          <NavLink v-if="authStore.isAuthenticated && isDriver" to="/create-trip">создать поездку</NavLink>
          <NavLink v-if="authStore.isAuthenticated" to="/bookings">актуальные бронирования</NavLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter }     from 'vue-router'
import { useAuthStore }  from '@/store/authStore'
import NavLink           from '@/components/buttons/NavLink.vue'
import defaultAvatar     from '@/assets/images/default-avatar.svg'

const router = useRouter()
const authStore = useAuthStore()

// desktop dropdowns
const experiencesOpen = ref(false)
const tripsOpen       = ref(false)
// mobile
const mobileMenuOpen  = ref(false)
const expMobileOpen   = ref(false)

// refs для клика вне
const expRef  = ref(null)
const tripRef = ref(null)

const isDriver = computed(
  () => authStore.isAuthenticated && authStore.user?.roles?.some(r=>r.name==='Driver')
)

const baseUrl    = import.meta.env.VITE_API_URL || ''
const userAvatar = computed(() => {
  const photo = authStore.user?.photoUrl
  return authStore.isAuthenticated && photo
    ? `${baseUrl}${photo}`
    : defaultAvatar
})

function toggleExperiences() {
  experiencesOpen.value = !experiencesOpen.value
  tripsOpen.value       = false
}
function toggleTrips() {
  tripsOpen.value       = !tripsOpen.value
  experiencesOpen.value = false
}
function goTo(path) {
  experiencesOpen.value = tripsOpen.value = false
  mobileMenuOpen.value = expMobileOpen.value = false
  router.push(path)
}

function handleClickOutside(e) {
  if (expRef.value && !expRef.value.contains(e.target)) {
    experiencesOpen.value = false
  }
  if (tripRef.value && !tripRef.value.contains(e.target)) {
    tripsOpen.value = false
  }
}

onMounted(async ()=>{
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleClickOutside)
  // загрузка профиля, если надо
  if (authStore.token && !authStore.user) {
    try { await authStore.fetchProfile() }
    catch { authStore.logout() }
  }
})
onBeforeUnmount(()=>{
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleClickOutside)
})
</script>

<style scoped>
.menu-item {
  padding: 10px 15px;
  cursor: pointer;
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
  max-height: 0; overflow: hidden;
}
.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 400px;
}
</style>
