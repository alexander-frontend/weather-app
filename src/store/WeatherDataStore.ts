import { defineStore } from 'pinia';

export const useCitiesStore = defineStore('cities', {
  // state is the data being stored in the data store
  state: () => ({
    weatherData: [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    language: 'en',
  }),

  // getters return data from the data store
  getters: {
    getNumberOfCities: (state) => {
      return state.weatherData.length;
    },

    getNumberOfFavorites: (state) => {
      return state.favorites.length;
    },
  },

  // actions are operations that change the state
  actions: {
    removeCity(id): void {
      const newWeatherData = this.weatherData.filter((item) => item.id !== id);

      this.weatherData = newWeatherData;
    },
    addCity(
      id,
      city,
      state,
      country,
      latitude,
      longitude,
      summary,
      currentTemp,
      high,
      feels_like,
      low
    ) {
      this.weatherData.push({
        id: id,
        cityName: city,
        stateName: state,
        countryAbbreviation: country,
        lat: latitude,
        lon: longitude,
        weatherSummary: summary,
        currentTemperature: currentTemp,
        dailyHigh: high,
        dailyLow: low,
        feelsLike: feels_like,
      });
    },
    updateCity(
      id,
      city,
      state,
      country,
      latitude,
      longitude,
      summary,
      currentTemp,
      high,
      low,
      feels_like
    ): void {
      const newWeatherData = this.weatherData.map((item) => {
        return item.id === id
          ? {
              id: id,
              cityName: city,
              stateName: state,
              countryAbbreviation: country,
              lat: latitude,
              lon: longitude,
              weatherSummary: summary,
              currentTemperature: currentTemp,
              dailyHigh: high,
              dailyLow: low,
              feelsLike: feels_like,
            }
          : item;
      });

      this.weatherData = newWeatherData;
    },
    addToFavorite(city) {
      this.favorites.push(city);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    removeFavorite(index: number) {
      this.favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
  },
});
