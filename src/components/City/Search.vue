<template>
  <div class="city-search">
    <div v-if="$route.path == '/weather-app/'" class="city-search-input">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="$t('Search')"
        @input="getSearchResults"
      />

      <ul
        v-if="mapboxSearchResults"
        class="city-search-select d-flex"
        role="list"
      >
        <li
          v-for="city in searchCities"
          :key="city.name"
          @click="selectCity(city)"
        >
          <template v-if="city.state">
            {{ city.name }}, {{ city.state }},
            {{ city.country }}
          </template>
          <template v-else>{{ city.name }}, {{ city.country }}</template>
        </li>
        <li class="not-found">
          {{ $t('Not_found') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { useCitiesStore } from '@/store/WeatherDataStore';
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Search',
  components: {},
  emits: ['search-city'],
  props: {
    city: {},
  },
  setup() {
    let searchQuery = ref('');
    let selectedCity = ref('');
    const queryTimeout = ref(null);
    const searchError = ref('');
    const mapboxSearchResults = ref(null);
    const cityStore = useCitiesStore();

    return {
      searchError,
      queryTimeout,
      searchQuery,
      selectedCity,
      mapboxSearchResults,
      cityStore,
    };
  },
  data() {
    return {
      // Max cities
      maxCities: 5,
      // Min cities
      minCities: 1,
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    };
  },
  computed: {
    searchCities() {
      if (this.searchQuery === '') {
        return [];
      }

      /*
      let matches = 0;

      const fgfg = this.mapboxSearchResults.filter((city) => {
        if (
          city.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          matches < 10
        ) {
          matches++;
          return city;
        }
      });
      */

      return this.mapboxSearchResults;
    },
  },
  methods: {
    getSearchResults() {
      clearTimeout(this.queryTimeout);

      this.queryTimeout = setTimeout(async () => {
        if (this.searchQuery !== '') {
          try {
            const result = await axios.get(
              `https://api.openweathermap.org/geo/1.0/direct?q=${this.searchQuery}&limit=5&appid=f41ec13a2657bc185cdffa04442de35f`
            );

            this.mapboxSearchResults = result.data;
          } catch {
            this.searchError = true;
          }

          return;
        }

        this.mapboxSearchResults = null;
      }, 300);
    },
    clearCity() {
      this.inputCity = '';
    },
    selectCity(city) {
      // save the weather data to the Pinia data store
      this.searchQuery = '';
      this.mapboxSearchResults = null;
      this.$emit('search-city', city, this.city.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.city-search-title h2 {
  text-align: center;
  margin-bottom: 0.5em;
}

.city-search-buttons {
  margin: 0.5em;
}

.city-search-input {
  position: relative;
}

.city-search-select {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  flex-direction: column;
  background-color: $color-white;
  color: black;
  li {
    padding: 0.6rem 1rem;
    border: 1px solid #c8e6e8;
    text-align: left;
    font-size: 1.4rem;
    cursor: pointer;
    &.not-found {
      cursor: default;
    }
  }
}

.city-search-input label {
  font-size: 1.35em;
  margin-right: 0.5em;
}

.city-search-input input {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2rem;
  border-radius: 5rem;
  border: none;
  font-size: 1.6rem;
  outline: 2px solid $color-light-gray-shade;
  transition: all 0.3s ease-out;
  &:focus {
    outline: 2px solid $color-baby-blue;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
}
</style>
