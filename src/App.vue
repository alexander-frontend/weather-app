<template>
  <div class="container d-flex flex-column">
    <Header class="header justify-content-space-between" :title="title" />
    <main class="d-flex justify-content-center">
      <router-view :key="$route.fullPath" v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component"></component>
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import Header from '../src/components/Base/Header.vue';
import Footer from '../src/components/Base/Footer.vue';

export default defineComponent({
  data() {
    return {
      title: ref('Weather App'),
    };
  },
  setup() {},
  components: {
    Header,
    Footer,
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
}

main {
  flex-grow: 1;
  max-width: 130rem;
  width: 100%;
  margin: auto;
}

.header {
  max-width: 130rem;
}

.footer,
.header {
  margin: auto;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
