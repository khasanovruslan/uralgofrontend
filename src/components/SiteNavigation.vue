<template>
  <header class="sticky top-0 h-12 xl:h-24 w-full bg-headerImage bg-no-repeat bg-cover bg-center xl:flex xl:items-center xl:justify-between px-4 lg:px z-10">
    <div class="flex items-center absolute">
      <nav class="m-8 space-x-8 lg:space-x-8 font-normal hidden xl:block tracking-2pct md:text-sm">
        <NavLink to="/" class="">главная</NavLink>
        <NavLink to="/destinations" class="">направления</NavLink>
        <NavLink to="/experiences" class="">впечатления</NavLink>

        <div class="relative group inline-block  ml-8">
      <div
        class="flex items-center cursor-pointer select-none"
        @click="toggleMenu"
      >
        <span class="font-normal tracking-2pct md:text-sm">поездки</span>
        <svg
          class="ml-1 w-3 h-3 transform transition-transform duration-200"
          :class="{ 'rotate-180': menuOpen }"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Выпадающее меню -->
      <div
        v-if="menuOpen"
        class="absolute flex flex-col mt-2 right-0 bg-white border border-gray-300 shadow-md rounded-md z-50 w-40 text-black text-sm"
      >
        <ul>
          <li v-if="authStore.isAuthenticated && authStore.user?.roles?.some(r => r.name === 'Driver')" class="menu-item" @click="goTo('/create-trip')">
            создать
          </li>
          <li class="menu-item" @click="goTo('/find-trip')">найти</li>
          <li v-if="authStore.isAuthenticated" class="menu-item" @click="goTo('/account')">актуальные</li>
        </ul>
      </div>
    </div>


      </nav>
    </div>
    <div class="flex-grow flex justify-start xl:justify-center items-center h-12">
      <NavLink to="/" class="xl:text-6xl font-Montserrat font-black opacity-80 text-2xl">uralgo</NavLink>
    </div>
    <div class="xl:hidden absolute flex space-x-5 -mt-[35px] right-6">
      <button class="focus:outline-none bg-userIcon bg-contain bg-no-repeat w-[26px] h-[26px]"></button>
      <button class="focus:outline-none bg-burgerIcon bg-contain bg-no-repeat w-[26px] h-[26px]"></button>
    </div>
    <!--Шапка для компьютера-->
    <div class="hidden xl:flex absolute right-0 mr-0.5 xl:mr-4 border-[1px] border-black border-opacity-15 bg-white bg-opacity-40 min-h-10 min-w-24 bg-no-repeat items-center justify-center pl-[15px] pr-[15px] pt-[10px] pb-[10px] z-15 rounded-[100px]">
      <NavLink
        :to="authStore.isAuthenticated ? '/account' : '/login'"
        class="font-bold text-md opacity-90 focus:outline-none z-20"
      >
        {{ authStore.isAuthenticated ? authStore.userName : 'войти' }}
      </NavLink>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import NavLink from '@/components/buttons/NavLink.vue';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function goTo(path) {
  menuOpen.value = false
  router.push(path)
}

const authStore = useAuthStore();

// при монтировании подгружаем профиль
onMounted(async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch {
      authStore.logout();
    }
  }
});
</script>

<style scoped>
.menu-item {
  padding: 10px 15px;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px solid black;
  width: 100%;

}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

</style>
