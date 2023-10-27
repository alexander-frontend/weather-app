<template>
  <div class="accordion-panel d-flex flex-column">
    <div
      @click="toggleAccordion()"
      class="accordion-panel-desc d-flex align-items-center justify-content-space-between"
      :class="{ opened: isOpen == true }"
      :aria-expanded="isOpen"
    >
      <div>{{ formattedDate }}</div>
      <div>{{ weatherDescription }}</div>
      <div>
        {{ $t('Avg_temp') }}
        <p>{{ averageTemperature() }} &#8451;</p>
      </div>

      <IconsArow />
    </div>

    <div v-if="isOpen" class="accordion-panel-item">
      <Chart :forecast="forecast" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chart from '@/components/Chart.vue';
import IconsArow from '@/components/Icons/Arrow.vue';

export default defineComponent({
  name: 'DailyForecastItem',
  components: { IconsArow, Chart },
  setup() {},
  data() {
    return { isOpen: false, formattedDate: '', weatherDescription: '' };
  },
  props: {
    forecast: Object,
    index: Number,
  },
  mounted() {
    if (this.index == 0) this.isOpen = true;

    this.formattedDate = this.getMonthDayDate(this.forecast[0].dt);
    this.weatherDescription = this.forecast[0].weather[0].description;
  },
  methods: {
    averageTemperature(): number {
      const temp = this.forecast.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.main.temp;
      }, 0);

      return Math.round(temp / this.forecast.length);
    },
    toggleAccordion() {
      this.isOpen = !this.isOpen;
    },
    getMonthDayDate(time: number) {
      const dateFromTimeStamp = new Date(time * 1000);
      const month = this.$t(`Months.${dateFromTimeStamp.getUTCMonth()}`);
      const day = this.$t(`Days.${dateFromTimeStamp.getUTCDay()}`);
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
  },
});
</script>

<style lang="scss" scoped>
.accordion-panel {
  width: 100%;
  border: 1px solid $color-light-gray-shade;
  border-bottom: 0;
  border-radius: 0.4rem;
  box-shadow: 0.2rem 0.2rem 0.2rem 0 rgba(0, 0, 0, 0.2);
  &-desc {
    flex: 1 1 auto;
    padding: 1rem 1.4rem;
    transition: all 0.3s ease-out;
    border-radius: 0.4rem;
    font-size: 1.4rem;
    line-height: 1.8rem;
    text-align: left;
    cursor: pointer;
    &.opened,
    &:hover {
      border-radius: 0.4rem;
      background-color: $color-light-gray-shade;
    }

    &.opened svg {
      rotate: 180deg;
    }

    svg {
      transition: all 0.3s ease-out;
    }

    > div {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      padding: 0 0.3rem;
    }
  }

  &-item {
    padding: 2rem 0;
  }
}
</style>
