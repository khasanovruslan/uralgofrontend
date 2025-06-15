<!-- src/pages/Bookings.vue -->
<template>
  <main class="p-6">
    <h1 class="text-3xl font-bold mb-6">Мои бронирования</h1>

    <div v-if="loading" class="text-center text-gray-500">Загрузка...</div>
    <div v-else>
      <div v-if="bookings.length === 0" class="text-center text-gray-500">
        У вас нет активных бронирований.
      </div>
      <div class="space-y-4">
        <div
          v-for="b in bookings"
          :key="b.id"
          class="bg-white shadow rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <div class="text-lg font-semibold">
              {{ b.trip.origin }} → {{ b.trip.destination }}
            </div>
            <div class="text-sm text-gray-600">
              {{ formatDate(b.trip.departureTime) }}
            </div>
            <div class="text-sm">
              Забронировано мест: {{ b.seatsReserved }}
            </div>
            <div class="text-sm">
              Статус: 
              <span 
                :class="{
                  'text-yellow-600': b.status === 'pending',
                  'text-green-600': b.status === 'confirmed'
                }"
              >
                {{ b.status }}
              </span>
            </div>
          </div>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            :disabled="b.status === 'canceled'"
            @click="cancel(b.id)"
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'

const router = useRouter()
const authStore = useAuthStore()

const bookings = ref([])
const loading = ref(true)

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

async function fetchBookings() {
  loading.value = true
  try {
    const token = authStore.token
    if (!token) {
      router.push('/login')
      return
    }
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/bookings`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (!res.ok) throw new Error('Не удалось загрузить бронирования')
    const data = await res.json()
    // Оставляем только активные
    bookings.value = data.filter(b => b.status !== 'canceled')
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

async function cancel(id) {
  if (!confirm('Вы действительно хотите отменить бронирование?')) return
  try {
    const token = authStore.token
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/bookings/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Ошибка при отмене')
    }
    await fetchBookings()

   window.alert('Бронирование успешно отменено')
  } catch (err) {
    alert(err.message)
  }
}

onMounted(fetchBookings)
</script>

<style scoped>
main {
  max-width: 800px;
  margin: 0 auto;
}
</style>
