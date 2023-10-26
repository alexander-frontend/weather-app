<script lang="ts">
import { defineComponent } from 'vue';
import Chart from '@/components/Chart.vue';
import IconsArow from '@/components/Icons/Arrow.vue';
import DailyForecastItem from '@/components/DailyForecast/DailyForecastItem/DailyForecastItem.vue';

export default defineComponent({
  name: 'FiveDayList',
  components: {
    Chart,
    IconsArow,
    DailyForecastItem,
  },
  props: {
    forecast: {},
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
});
</script>

<template>
  <div class="accordion-panels">
    <DailyForecastItem
      v-for="(item, index) of forecast"
      :key="index"
      :forecast="item"
      :index="index"
    />
  </div>
</template>

<style lang="scss" scoped></style>
