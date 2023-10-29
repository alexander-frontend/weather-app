<template>
  <div class="city-search">
    <div v-if="$route.path == '/weather-app'" class="city-search-input">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="$t('Search')"
        @input="getSearchResults"
      />

      <ul
        v-if="searchQuery != ''"
        class="city-search-select d-flex"
        role="list"
      >
        <li v-if="searchResults.length == 0" class="not-found">
          {{ $t('Not_found') }}
        </li>
        <li
          v-else
          v-for="city in searchCities"
          :key="`${city.lon}${city.lat}`"
          @click="selectCity(city)"
        >
          <template v-if="city.state">
            {{ setCityName(city) }}, {{ city.state }},
            {{ city.country }}
          </template>
          <template v-else
            >{{ setCityName(city) }}, {{ city.country }}</template
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { useCitiesStore } from '@/store/WeatherDataStore';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Search',
  components: {},
  emits: ['get-weather'],
  props: {
    city: {},
  },
  setup() {
    let searchQuery = ref('');
    let selectedCity = ref('');
    const queryTimeout = ref(0);
    const searchResults = ref([]);
    const cityStore = useCitiesStore();
    const searchError: Boolean = false;

    return {
      searchError,
      queryTimeout,
      searchQuery,
      selectedCity,
      searchResults,
      cityStore,
    };
  },
  data() {
    return {};
  },
  computed: {
    searchCities() {
      if (this.searchQuery === '') {
        return [];
      }

      return this.searchResults;
    },
  },
  methods: {
    getSearchResults() {
      clearTimeout(this.queryTimeout);

      this.queryTimeout = window.setTimeout(async () => {
        if (this.searchQuery !== '') {
          try {
            const result = await fetch(
              `https://api.openweathermap.org/geo/1.0/direct?q=${
                this.searchQuery
              }&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
            );

            const data = await result.json();

            this.searchResults = data;
          } catch {
            this.searchError = true;
          }

          return;
        }

        this.searchResults = [];
      }, 300);
    },
    clearSearchQuery() {
      this.searchQuery = '';
    },
    setCityName(city) {
      return city.local_names && city.local_names[this.$i18n.locale]
        ? city.local_names[this.$i18n.locale]
        : city.name;
    },
    selectCity(city) {
      // save the weather data to the Pinia data store
      this.clearSearchQuery();
      this.searchResults = [];
      this.$emit('get-weather', city, this.city.id);
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
  border-radius: 1rem;
  color: black;
  li {
    padding: 0.6rem 1rem;
    border: 1px solid #c8e6e8;
    text-align: left;
    font-size: 1.4rem;
    cursor: pointer;
    &:first-child {
      border-top-left-radius: 1rem;
      border-left-width: 1px;
      border-top-right-radius: 1rem;
    }

    &:last-child {
      border-bottom-left-radius: 1rem;
      border-bottom-width: 1px;
      border-bottom-right-radius: 1rem;
    }
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
