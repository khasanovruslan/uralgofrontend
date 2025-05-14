<template>
  <div v-if="loading" class="preloader">
    <!-- Показываем прелоадер -->
    <p>Загрузка...</p>
  </div>
  <div v-else class="flex flex-col min-h-screen font-Montserrat">
    <SiteNavigation v-if="showNavigation" />
    <RouterView />
    <Footer v-if="showNavigation" />
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SiteNavigation from "./components/SiteNavigation.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    SiteNavigation,
    Footer,
  },
  setup() {
    const route = useRoute();
    const showNavigation = computed(() => !route.meta.hideNavigation);
    const loading = ref(true);

    onMounted(async () => {
      await preloadImages([
        '/images/background.jpg',
        '/images/logo.png',
        '/images/banner.jpg',
      ]);
      loading.value = false;
    });

    const preloadImages = (images) => {
      return Promise.all(images.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Чтобы не зависать в случае ошибки
        });
      }));
    };

    return {
      showNavigation,
      loading,
    };
  }
};
</script>

<style lang="scss" scoped>
.preloader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 24px;
  font-weight: bold;
}
</style>
