<template>
  <div class="city-action-btns align-items-center d-flex justify-content-end">
    <template v-if="isFavoritePage">
      <button class="remove-button" @click="removeCityFromFavorite(index)">
        <IconsRemove />
      </button>
    </template>
    <template v-else-if="cityStore.getNumberOfCities > minCities">
      <button class="remove-button" @click="removeCity(city.id)">
        <IconsRemove />
      </button>
    </template>

    <div>
      <button
        @click="addToFavorites(city)"
        class="favorite-button"
        :class="{ 'is-active': isFavorite(city) }"
      >
        <IconsFavorite />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import IconsFavorite from '@/components/Icons/Favorite.vue';
import IconsRemove from '@/components/Icons/Remove.vue';
import { useCitiesStore } from '@/store/WeatherDataStore';
import eventbus from '@/eventbus';

export default defineComponent({
  name: 'Actions',
  components: {
    IconsFavorite,
    IconsRemove,
  },
  setup() {
    const cityStore = useCitiesStore();

    return { cityStore };
  },
  props: {
    forecast: {},
    isFavoritePage: Boolean,
    city: {},
  },
  data() {
    return {
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      maxCities: 5,
      // Min cities
      minCities: 1,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    addToFavorites(city) {
      if (this.isFavorite(city)) {
        return;
      }

      if (this.favorites.length < this.maxCities) {
        this.cityStore.addToFavorite(city);
        this.favorites = JSON.parse(localStorage.getItem('favorites'));
      } else {
        eventbus.emit('open-modal', {
          message:
            'Кількість обраних міст максимум 5. Для додавання видаліть якесь місто з обраного.',
          cancel: true,
        });
      }
    },
    isFavorite(city) {
      return this.favorites.some(
        (item) =>
          JSON.stringify(item.cityName) === JSON.stringify(city.cityName)
      );
    },
    removeCity(id: String) {
      this.cityStore.removeCity(id);
    },
    removeCityFromFavorite(index: number): void {
      this.cityStore.removeFavorite(index);
    },
  },
});
</script>

<style lang="scss" scoped>
.city-action-btns button {
  margin-left: 1rem;
  fill: #aaa;
  color: #aaa;
  transition: all 0.3s ease-out;
  &.is-active {
    fill: red;
    color: red;
  }
}
</style>
