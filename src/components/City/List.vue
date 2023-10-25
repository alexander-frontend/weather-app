<template>
  <div>
    <ModalPopup :cancel="false" :message="modalMessage" ref="modal" />

    <Loader v-if="isLoading" />

    <div v-else class="city-list">
      <Item
        @open-modal="openModal"
        v-for="(city, index) in cities"
        :city="city"
        :key="city.id"
        :is-favorite-page="isFavoritePage"
        :index="index"
      />

      <div
        class="add-button"
        v-if="
          cityStore.weatherData.length &&
          cityStore.weatherData.length < maxCities &&
          $route.path == '/weather-app/'
        "
      >
        <button class="btn" @click="addCity">{{ $t('Add_city') }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCitiesStore } from '@/store/WeatherDataStore';
import { defineComponent, ref } from 'vue';
import ModalPopup from '@/components/Base/ModalPopup.vue';
import Loader from '@/components/Loader/Loader.vue';
import Item from '@/components/City/Item.vue';

export default defineComponent({
  name: 'List',
  components: {
    ModalPopup,
    Loader,
    Item,
  },
  setup() {
    const apiKey = 'f41ec13a2657bc185cdffa04442de35f';
    const urlBase = 'https://api.openweathermap.org/data/2.5/weather?q=';

    const cityStore = useCitiesStore();

    const forecast = ref([]);

    return { apiKey, urlBase, cityStore, forecast };
  },
  props: {
    cities: Array,
    isFavoritePage: Boolean,
  },
  data() {
    return {
      // Message to display on banner
      messageToDisplay: '',
      // Message type (Info, Success, or Error) to display on banner
      messageType: 'Info',
      // API key from openweathermap.org
      openweathermapApiKey: '',
      // Max cities
      maxCities: 5,
      // Min cities
      minCities: 1,
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      isLoading: false,
      timeOfDayCategories: [],
      modalMessage: 'Are you sure?',
      cancel: Boolean,
    };
  },
  mounted() {
    if (!this.cityStore.weatherData.length) {
      this.isLoading = true;
      this.addCity();
    }
    // Perform a check that the API key from openweathermap.org is defined
    if (this.apiKey === undefined) {
      this.messageType = 'Error';
      this.messageToDisplay =
        'Error! API Key needs to be loaded to use openweathermap.org!';
    } else {
      this.openweathermapApiKey = this.apiKey;
    }
  },
  methods: {
    openModal(message: string, cancel) {
      this.modalMessage = message;
      this.cancel = cancel;
      this.$refs.modal.openModal();
    },
    async addCity() {
      const url = 'http://ip-api.com/json/';

      try {
        const response = await fetch(url);
        const data = await response.json();

        this.weatherLocation(data);

        this.isLoading = false;
      } catch (err) {
        console.error(err);
      }
    },
    isFavorite(city) {
      return this.favorites.some(
        (item) =>
          JSON.stringify(item.cityName) === JSON.stringify(city.cityName)
      );
    },
    splitByDays(forecastOrigin) {
      const groupedData = forecastOrigin.list.reduce((days, row) => {
        const date = row.dt_txt.split(' ')[0];

        days[date] = [...(days[date] ? days[date] : []), row];

        return days;
      }, {});

      return Object.values(groupedData);
    },
    async weatherLocation(data) {
      const { lat, lon, city, country } = data;

      const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=${this.$i18n.locale}`;

      let state = '';

      try {
        /**
         * Promise [currentWeather, Forecast]
         */
        const resolve = await Promise.all([fetch(urlWeather)]);

        if (resolve[0].status == 404) {
          throw 'City not found';
        }

        const data = resolve.map((response) => response.json());

        const value = await data[0];

        if ('state' in value) {
          state = value.state;
        }

        // save the weather data to the Pinia data store
        this.cityStore.addCity(
          window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
          city,
          state,
          country,
          value.coord.lat,
          value.coord.lon,
          value.weather[0].main,
          value.main.temp,
          value.main.temp_max,
          value.main.temp_min,
          value.main.feels_like
        );
      } catch (err) {
        console.error(err);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.add-button {
  display: flex;
  justify-content: center;
  margin: 2rem;
  button {
    border-radius: 1rem;
  }
}
</style>
