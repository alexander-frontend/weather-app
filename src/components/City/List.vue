<template>
  <div>
    <ModalPopup :cancel="cancel" :message="modalMessage" ref="modal" />

    <Loader v-if="isLoading" />

    <div v-else class="city-list">
      <Item
        v-for="(city, index) in cities"
        :city="city"
        :key="city.id"
        :is-favorite-page="isFavoritePage"
        :index="index"
      />

      <div
        class="add-button"
        v-if="
          cityStore.getNumberOfCities &&
          cityStore.getNumberOfCities < maxCities &&
          $route.path == '/weather-app'
        "
      >
        <button class="btn" @click="addCity">{{ $t('Add_city') }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCitiesStore } from '@/store/WeatherDataStore';
import { defineComponent, ref, nextTick } from 'vue';
import ModalPopup from '@/components/Base/ModalPopup.vue';
import Loader from '@/components/Loader/Loader.vue';
import Item from '@/components/City/Item.vue';
import eventbus from '@/eventbus';

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
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      isLoading: false,
      timeOfDayCategories: [],
      modalMessage: '',
      cancel: false,
    };
  },
  created() {
    eventbus.on('open-modal', this.handleOpenModal);
  },
  unmounted() {
    eventbus.off('open-modal', this.handleOpenModal);
  },
  mounted() {
    if (!this.cityStore.getNumberOfCities) {
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
    handleOpenModal(event) {
      this.openModal(event.message, event.cancel, event.cb);
    },
    openModal(message: string, cancel, cb?) {
      this.modalMessage = message;
      this.cancel = cancel;

      this.$refs.modal.openModal().then(
        () => {
          if (cb) cb();
        },
        () => {}
      );
    },
    async addCity() {
      const url = 'https://ipapi.co/json/';

      try {
        const response = await fetch(url);
        const data = await response.json();

        this.weatherLocation(data);

        this.isLoading = false;
      } catch (err) {
        console.error(err);
      }
    },
    async weatherLocation(data) {
      const { latitude, longitude, city, country } = data;

      const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&lang=${this.$i18n.locale}`;

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
