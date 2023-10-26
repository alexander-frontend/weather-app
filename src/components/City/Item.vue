<template>
  <div
    class="city-item d-flex flex-direction-row justify-content-space-between"
  >
    <div class="city-item-left">
      <div class="d-flex justify-content-space-between">
        <Search
          class="weather-search"
          @search-city="searchCity"
          :city="city"
        ></Search>

        <Actions
          @open-modal="openModal"
          :city="city"
          :is-favorite-page="isFavoritePage"
        />
      </div>

      <div class="city-name">
        <h2 v-if="city.stateName">
          {{ city.cityName }}, {{ city.stateName }},
          {{ city.countryAbbreviation }}
        </h2>
        <h2 v-else>{{ city.cityName }}, {{ city.countryAbbreviation }}</h2>
      </div>

      <div class="city-data">
        <p>
          <b>{{ $t('Weather_summary') }}</b> {{ city.weatherSummary }}
        </p>
        <p>
          <b>{{ $t('Current_temperature') }}</b>
          {{ Math.round(city.currentTemperature) }}&#8451;
        </p>
        <p>
          <b>{{ $t('High') }}</b> {{ Math.round(city.dailyHigh) }}&#8451; /
          <b>{{ $t('Low') }}</b> {{ Math.round(city.dailyLow) }}&#8451;
        </p>
        <p>
          <b>{{ $t('Feels_like') }}</b> {{ Math.round(city.dailyHigh) }}&#8451;
        </p>
      </div>
    </div>

    <div class="city-item-right">
      <h2>{{ $t('Forecast') }}</h2>

      <Loader v-if="isLoading" />

      <template v-else>
        <div class="chart-type d-flex align-items-center">
          <button
            :class="{ 'is-active': chartType === 'day' }"
            class="btn"
            @click="() => (chartType = 'day')"
          >
            {{ $t('Day') }}
          </button>
          <button
            :class="{ 'is-active': chartType === 'fiveDays' }"
            class="btn"
            @click="() => (chartType = 'fiveDays')"
          >
            {{ $t('5_days') }}
          </button>
        </div>

        <template v-if="forecast.length">
          <OneDayItem v-if="chartType === 'day'" :forecast="forecast[0]" />

          <FiveDayList v-else :forecast="forecast" />
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useCitiesStore } from '@/store/WeatherDataStore';
import Search from '@/components/City/Search.vue';
import axios from 'axios';
import FiveDayList from '@/components/City/Forecast/FiveDayList.vue';
import OneDayItem from '@/components/City/Forecast/OneDayItem.vue';
import Loader from '@/components/Loader/Loader.vue';
import Actions from '@/components/City/Actions.vue';

export default defineComponent({
  name: 'Item',
  components: {
    Search,
    OneDayItem,
    FiveDayList,
    Loader,
    Actions,
  },
  emits: ['open-modal'],
  setup() {
    const apiKey = 'f41ec13a2657bc185cdffa04442de35f';
    const urlBase = 'https://api.openweathermap.org/data/2.5/weather?q=';

    const cityStore = useCitiesStore();

    return { apiKey, urlBase, cityStore };
  },
  props: {
    city: {},
    isFavoritePage: Boolean,
    index: Number,
  },
  data() {
    return {
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      // Max cities
      maxCities: 5,
      // Min cities
      minCities: 1,
      chartType: 'day' as 'day' | 'fiveDays',
      isLoading: true,
      openweathermapApiKey: '',
      forecast: [],
      messageType: '',
      messageToDisplay: '',
    };
  },
  mounted() {
    // Perform a check that the API key from openweathermap.org is defined
    if (this.apiKey === undefined) {
      this.messageType = 'Error';
      this.messageToDisplay =
        'Error! API Key needs to be loaded to use openweathermap.org!';
    } else {
      this.openweathermapApiKey = this.apiKey;
    }

    this.weatherRequest(this.city);
  },
  computed: {
    showRemoveBtn() {
      return (
        this.$route.path === '/weather-app/' &&
        this.cityStore.getNumberOfCities == this.minCities
      );
    },
  },
  methods: {
    openModal(message: string, cancel) {
      this.$emit(
        'open-modal',
        'Кількість обраних міст максимум 5. Для додавання видаліть якесь місто з обраного.',
        true
      );
    },
    async weatherRequest(city) {
      const { lat, lon } = city;

      const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=${this.$i18n.locale}`;

      try {
        /**
         * Promise [currentWeather, Forecast]
         */
        const resolve = await Promise.all([fetch(urlForecast)]);

        if (resolve[0].status == 404) {
          throw 'City not found';
        }

        const data = resolve.map((response) => response.json());
        const value = await data[0];

        this.forecast = this.splitByDays(value);
      } catch (err) {
        console.error(err);
      }

      this.isLoading = false;
      this.chartType = 'day';
    },
    splitByDays(forecastOrigin) {
      const groupedData = forecastOrigin.list.reduce((days, row) => {
        const date = row.dt_txt.split(' ')[0];

        days[date] = [...(days[date] ? days[date] : []), row];

        return days;
      }, {});

      return Object.values(groupedData);
    },
    async searchCity(city, id: String): Promise<void> {
      this.isLoading = true;

      if (city !== '') {
        // GET request for retrieving the current weather data using the Current
        // Weather Data API from OpenWeather (https://openweathermap.org/current)
        try {
          const response2 = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather?lat=' +
              city.lat +
              '&lon=' +
              city.lon +
              '&units=metric&APPID=' +
              this.openweathermapApiKey
          );

          // handle success
          console.log(
            'Retrieved current temperature: ' + response2.data.main.temp
          );

          console.log(
            'and high/low: ' +
              response2.data.main.temp_max +
              ' / ' +
              response2.data.main.temp_min
          );

          this.cityStore.updateCity(
            id,
            city.name,
            city.state,
            city.country,
            city.lat,
            city.lon,
            response2.data.weather[0].main,
            response2.data.main.temp,
            response2.data.main.temp_max,
            response2.data.main.temp_min,
            response2.data.main.feels_like
          );
        } catch (error) {
          // handle error
          this.messageType = 'Error';
          this.messageToDisplay =
            'ERROR! Unable to retrieve weather data for ' + city.name + '!';
          console.log(error);
        }
      }

      this.weatherRequest(this.city);
    },
  },
});
</script>

<style lang="scss" scoped>
.city {
  &-item {
    width: 100%;
    color: $color-medium-dark-cyan-blue;
    background: $color-light-gray-shade;
    border-radius: 1rem;
    margin-bottom: 3rem;
    box-shadow: 0.5rem 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.3);

    &-left,
    &-right {
      position: relative;
      width: 50%;
      padding: 3rem;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0.5rem 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.3);
      border-radius: 1rem;
      margin: 2rem;
      text-align: center;
    }

    &-right {
      height: auto;
      min-height: 344px;
    }

    .chart-type {
      margin: 1rem 0 2rem 0;
      h3 {
        cursor: pointer;
        margin-right: 10px;
        + h3 {
          margin-left: 10px;
        }
        &.is-active {
          text-decoration: underline;
        }
      }
    }
  }

  &-name,
  &-data p {
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .city {
    &-item {
      flex-direction: column;
      margin: 0 0 2rem 0;
      padding: 2rem;
      &-right,
      &-left {
        width: 100%;
        margin: 0;
        padding: 2rem;
        &:first-child {
          margin-bottom: 1rem;
        }

        &:last-child {
          margin-top: 1rem;
        }
      }
    }
  }
}
</style>
