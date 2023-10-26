<template>
  <div class="content">
    <List :cities="cityStore.weatherData" class="cities"></List>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Search from '@/components/Card/Search.vue';
import List from '@/components/Cities/List.vue';
import { useCitiesStore } from '@/store/WeatherDataStore';

export default defineComponent({
  name: 'HomeView',
  components: { Search, List },
  setup() {
    const cityStore = useCitiesStore();

    return { cityStore };
  },
  mounted() {},
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  .cities {
    padding: 0 1rem;
    margin-bottom: 14rem;
  }
}
</style>
