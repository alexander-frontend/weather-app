<script lang="ts">
import { defineComponent } from 'vue';
import IconsFavorite from '@/components/Icons/Favorite.vue';
import IconsRemove from '@/components/Icons/Remove.vue';
import { useCitiesStore } from '@/store/WeatherDataStore';

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
      if (this.favorites.length < this.maxCities) {
        this.cityStore.addToFavorite(city);
        this.favorites = JSON.parse(localStorage.getItem('favorites'));
      } else {
        this.$emit(
          'open-modal',
          'Кількість обраних міст максимум 5. Для додавання видаліть якесь місто з обраного.',
          true
        );
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

<template>
  <div class="city-action-btns align-items-center d-flex justify-content-end">
    <template v-if="isFavoritePage">
      <button class="remove-button" @click="removeCityFromFavorite(index)">
        <IconsRemove />
      </button>
    </template>
    <template v-else-if="cityStore.weatherData.length > minCities">
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
