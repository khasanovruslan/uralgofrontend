<template>
  <div class="flex flex-col min-h-screen font-Montserrat">
    <SiteNavigation v-if="showNavigation" />
    <RouterView />
    <Footer v-if="showNavigation" />
  </div>
</template>

<script>
import { computed } from 'vue';
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

    return {
      showNavigation,
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
