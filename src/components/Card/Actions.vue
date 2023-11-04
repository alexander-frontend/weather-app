<template>
  <div class="city-action-btns align-items-center d-flex justify-content-end">
    <template v-if="isFavoritePage">
      <button class="remove-button" @click="removeCityFromFavorite(index)">
        <IconsRemove />
      </button>
    </template>
    <template
      v-else-if="cityStore.getNumberOfCities > constants.min_cities_count"
    >
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
import { defineComponent, ref } from 'vue';
import IconsFavorite from '@/components/Icons/Favorite.vue';
import IconsRemove from '@/components/Icons/Remove.vue';
import { useCitiesStore } from '@/store/WeatherDataStore';
import eventbus from '@/eventbus/index';
import constants from '@/helpers/constants';

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
    index: Number,
  },
  data() {
    return { constants };
  },
  computed: {},
  mounted() {},
  methods: {
    addToFavorites(city) {
      if (this.isFavorite(city)) {
        return;
      }

      if (this.cityStore.getNumberOfFavorites < constants.max_cities_count) {
        this.cityStore.addToFavorite(city);
      } else {
        eventbus.emit('open-modal', {
          message: this.$t('Favorite_limit'),
          cancel: false,
        });
      }
    },
    isFavorite(city) {
      return this.cityStore.favorites.some(
        (item) =>
          JSON.stringify({ name: item.name, state: item.stateName }) ===
          JSON.stringify({ name: city.name, state: city.stateName })
      );
    },
    handleEventOpenModal(message: String, cancel: Boolean, callback: {}) {
      eventbus.emit('open-modal', {
        message: message,
        cancel: cancel,
        callback: callback,
      });
    },
    removeCity(id: String) {
      this.handleEventOpenModal(
        this.$t('Are_you_sure'),
        true,
        this.cityStore.removeCity.bind(null, id)
      );
    },
    removeCityFromFavorite(index: number) {
      this.handleEventOpenModal(
        this.$t('Are_you_sure_favorite'),
        true,
        this.cityStore.removeFavorite.bind(null, index)
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.city-action-btns {
  button {
    margin-left: 1rem;
    fill: $color-light-blue-shade;
    color: $color-light-blue-shade;
    transition: all 0.3s ease-out;

    &.is-active,
    &:hover {
      fill: $color-red;
      color: $color-red;
    }
  }
}
</style>
