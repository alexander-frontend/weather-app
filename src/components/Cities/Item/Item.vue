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

        <Actions :city="city" :is-favorite-page="isFavoritePage" />
      </div>

      <Loader v-if="isLoading" />

      <template v-else>
        <div class="city-name">
          <h2 v-if="city.stateName">
            {{ city.cityName }}, {{ city.stateName }},
            {{ city.countryAbbreviation }}
          </h2>
          <h2 v-else>{{ city.cityName }}, {{ city.countryAbbreviation }}</h2>
        </div>

        <div class="city-data">
          <p>
            <b>{{ formattedDate }}</b>
          </p>
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
            <b>{{ $t('Feels_like') }}</b>
            {{ Math.round(city.dailyHigh) }}&#8451;
          </p>
        </div>
      </template>
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
            :class="{ 'is-active': chartType === 'five_days' }"
            class="btn"
            @click="() => (chartType = 'five_days')"
          >
            {{ $t('5_days') }}
          </button>
        </div>

        <template v-if="forecast.length">
          <Chart v-if="chartType === 'day'" :forecast="forecast[0]" />

          <DailyForecastList v-else :forecast="forecast" />
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useCitiesStore } from '@/store/WeatherDataStore';
import Search from '@/components/Card/Search.vue';
import DailyForecastList from '@/components/DailyForecast/DailyForecastList.vue';
import Chart from '@/components/Chart.vue';
import Loader from '@/components/Loader.vue';
import Actions from '@/components/Card/Actions.vue';
import eventbus from '@/eventbus/index';

export default defineComponent({
  name: 'Item',
  components: {
    Search,
    Chart,
    DailyForecastList,
    Loader,
    Actions,
  },
  emits: ['open-modal'],
  setup() {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
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
      chartType: 'day' as 'day' | 'five_days',
      isLoading: true,
      openweathermapApiKey: '',
      forecast: [],
      messageType: '',
      messageToDisplay: '',
      formattedDate: '',
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

      this.weatherRequest(this.city);
    }
  },
  computed: {
    showRemoveBtn() {
      return (
        this.$route.path === '/weather-app/' &&
        this.cityStore.getNumberOfCities == this.minCities
      );
    },
  },
  created() {
    eventbus.on('refresh-weather', this.refreshWeatherHandler);
  },
  unmounted() {
    eventbus.off('refresh-weather', this.refreshWeatherHandler);
  },
  methods: {
    refreshWeatherHandler() {
      this.isLoading = true;

      this.weatherRequest(this.city);
    },
    getMonthDayDate(time: number) {
      const dateFromTimeStamp = new Date(time * 1000);
      const day = this.$t(`Days.${dateFromTimeStamp.getUTCDay()}`);
      const month = this.$t(`Months.${dateFromTimeStamp.getUTCMonth()}`);
      const date = dateFromTimeStamp.getUTCDate();

      let val;

      switch (this.$i18n.locale) {
        case 'en':
          val = `${day}, ${month} ${date}`;
          break;
        case 'uk':
          val = `${day}, ${date} ${month}`;
          break;
        default:
          val = `${day}, ${date}, ${month}`;
          break;
      }

      return val;
    },
    async weatherRequest(city) {
      const { lat, lon } = city;

      const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.openweathermapApiKey}&units=metric&lang=${this.$i18n.locale}`;

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

        this.formattedDate = this.getMonthDayDate(this.forecast[0][0].dt);
      } catch (err) {
        console.error(err);
      }

      this.chartType = 'day';

      this.isLoading = false;
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
          const response = await fetch(
            'https://api.openweathermap.org/data/2.5/weather?lat=' +
              city.lat +
              '&lon=' +
              city.lon +
              '&units=metric&APPID=' +
              this.openweathermapApiKey
          );

          const data = await response.json();

          // handle success
          console.log('Retrieved current temperature: ' + data.main.temp);

          console.log(
            'and high/low: ' + data.main.temp_max + ' / ' + data.main.temp_min
          );

          this.cityStore.updateCity(
            id,
            city.name,
            city.state,
            city.country,
            city.lat,
            city.lon,
            data.weather[0].main,
            data.main.temp,
            data.main.temp_max,
            data.main.temp_min,
            data.main.feels_like
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
      min-height: 370px;
    }

    .chart-type {
      margin: 1rem 0 2rem 0;
      h3 {
        cursor: pointer;
        margin-right: 0.1rem;
        + h3 {
          margin-left: 0.1rem;
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
      margin: 0 0 3rem 0;
      padding: 2rem;
      &-right,
      &-left {
        width: 100%;
        margin: 0;
        padding: 2rem;
        min-height: auto;
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
