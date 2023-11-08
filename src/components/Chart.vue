<template>
  <div class="weather-chart">
    <canvas ref="chart" class="chart" width="400" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Chart } from 'chart.js/auto';
import moment from 'moment';

export default defineComponent({
  name: 'Chart',
  props: {
    forecast: {},
  },
  data() {
    return {
      chart: ref({}),
      reloadChart: Function,
    };
  },
  computed: {
    labels() {
      return this.forecast.map((item) =>
        moment(item.dt * 1000).format('HH:mm')
      );
    },
    temperatures() {
      return this.forecast.map((item) => Math.round(item.main.temp));
    },
  },
  watch: {
    forecast: {
      handler() {
        this.reloadChart();
      },
    },
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const ctx = <CanvasRenderingContext2D>this.$refs.chart;

      const config = {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: this.$t('Temperature'),
              fill: false,
              borderColor: 'green',
              backgroundColor: ['green'],
              data: this.temperatures,
            },
          ],
        },
        options: {
          animation: {
            duration: 1000,
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            customCanvasBackgroundColor: {
              color: 'lightGreen',
            },
          },
        },
      };

      let chart = new Chart(ctx, config);

      this.reloadChart = () => {
        chart.destroy();
        chart = new Chart(ctx, config);
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.weather-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.1rem;
  width: 100%;

  .chart {
    max-height: 20rem;
    max-width: 54rem;
  }
}
</style>
