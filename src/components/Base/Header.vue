<template>
  <header
    class="header d-flex align-items-center justify-content-space-between"
  >
    <h1 class="d-flex">
      <router-link to="/weather-app/"><IconsLogo />{{ title }}</router-link>
    </h1>
    <nav class="header-nav d-flex">
      <router-link
        to="/weather-app"
        class="btn"
        :class="{ 'is-active': $route.path === '/weather-app/' }"
        >{{ $t('Home') }}</router-link
      >

      <router-link
        to="/weather-app/favorites"
        class="btn"
        :class="{ 'is-active': $route.path === '/weather-app/favorites' }"
        >{{ $t('Favorite') }}</router-link
      >
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconsLogo from '../Icons/Logo.vue';

export default defineComponent({
  name: 'Header',
  components: {
    IconsLogo,
  },
  props: {
    title: String,
  },
  setup() {},
});
</script>

<style lang="scss" scoped>
.header {
  padding: 2rem;
  h1 {
    font-size: 2.4rem;
    line-height: 2.4rem;
    a {
      display: flex;
      align-items: center;
      color: $color-medium-dark-cyan-blue;
      text-decoration: none;
    }
  }

  &-nav a {
    &:first-child {
      border-bottom-left-radius: 1rem;
      border-left-width: 1px;
      border-top-left-radius: 1rem;
    }

    &:last-child {
      border-bottom-right-radius: 1rem;
      border-right-width: 1px;
      border-top-right-radius: 1rem;
    }
  }
}
</style>
