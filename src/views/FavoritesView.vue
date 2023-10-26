<template>
  <div class="content">
    <List
      v-if="cityStore.favorites && cityStore.favorites.length"
      :cities="cityStore.favorites"
      :is-favorite-page="true"
      class="cities"
    ></List>
    <div v-else class="cities">
      <h2 class="no-favorites">
        {{ $t('Nothing_here') }}<br />
        {{ $t('Add_favorites') }}
      </h2>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import List from '@/components/Cities/List.vue';
import { useCitiesStore } from '@/store/WeatherDataStore';

export default defineComponent({
  name: 'FavoritesView',
  components: { List },
  setup() {
    const cityStore = useCitiesStore();

    return { cityStore };
  },
  props: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {},
});
</script>

<style lang="scss" scoped>
.content {
  width: 100%;

  .cities {
    margin-bottom: 14rem;
    padding: 0 1rem;
  }

  .no-favorites {
    margin-top: 2rem;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .content {
    .cities {
      margin-bottom: 6rem;
    }

    .no-favorites {
      font-size: 2rem;
    }
  }
}
</style>
