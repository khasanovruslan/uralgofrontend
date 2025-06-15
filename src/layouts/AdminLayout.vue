<!-- File: src/layouts/AdminLayout.vue -->
<template>
  <div class="flex h-screen">
    <aside class="w-60 bg-gray-800 text-white p-4">
      <h2 class="text-xl mb-4">Admin Panel</h2>
      <nav class="space-y-2">
        <router-link to="/admin/users"    class="block hover:bg-gray-700 p-2 rounded">Пользователи</router-link>
        <router-link to="/admin/trips"    class="block hover:bg-gray-700 p-2 rounded">Поездки</router-link>
        <router-link to="/admin/events"   class="block hover:bg-gray-700 p-2 rounded">События</router-link>
        <router-link to="/admin/bookings" class="block hover:bg-gray-700 p-2 rounded">Бронирования</router-link>
      </nav>
    </aside>
    <main class="flex-1 p-6 overflow-auto">
      <router-view />
    </main>
  </div>
</template>
