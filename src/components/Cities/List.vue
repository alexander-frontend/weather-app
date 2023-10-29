<template>
  <div>
    <Modal :cancel="modalCancel" :message="modalMessage" ref="modal" />

    <div class="city-list">
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
          cityStore.getNumberOfCities < cityStore.maxCities &&
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
import { defineComponent, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import Loader from '@/components/Loader.vue';
import Item from '@/components/Cities/Item/Item.vue';
import eventbus from '@/eventbus';

export default defineComponent({
  name: 'List',
  components: {
    Modal,
    Loader,
    Item,
  },
  setup() {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    const cityStore = useCitiesStore();

    const forecast = ref([]);

    return { apiKey, cityStore, forecast };
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
      modalMessage: '',
      modalCancel: false,
    };
  },
  created() {
    eventbus.on('open-modal', this.openModalHandler);
  },
  unmounted() {
    eventbus.off('open-modal', this.openModalHandler);
  },
  mounted() {
    // Perform a check that the API key from openweathermap.org is defined
    if (this.apiKey === undefined) {
      this.messageType = 'Error';
      this.messageToDisplay =
        'Error! API Key needs to be loaded to use openweathermap.org!';
    } else {
      this.openweathermapApiKey = this.apiKey;

      if (!this.cityStore.getNumberOfCities) {
        this.addCity();
      }
    }
  },
  methods: {
    openModalHandler(event) {
      this.openModal(event.message, event.cancel, event.callback);
    },
    openModal(message: string, cancel, callback?) {
      this.modalMessage = message;
      this.modalCancel = cancel;

      this.$refs.modal.openModal().then(
        () => {
          if (callback) {
            callback();
          }
        },
        () => {}
      );
    },
    async addCity() {
      const url = 'https://freeipapi.com/api/json/';

      try {
        const response = await fetch(url);
        const data = await response.json();

        this.weatherLocation(data);
      } catch (err) {
        console.error(err);
      }
    },
    async weatherLocation(data) {
      const { latitude, longitude, cityName, countryName } = data;

      const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.openweathermapApiKey}&units=metric&lang=${this.$i18n.locale}`;

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
          state = value.state || '';
        }

        // save the weather data to the Pinia data store
        this.cityStore.addCity(
          window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
          cityName,
          state,
          countryName,
          {},
          value.coord.lat,
          value.coord.lon,
          value.weather[0].description,
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
