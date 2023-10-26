<script lang="ts">
import { defineComponent } from 'vue';
import Chart from '@/components/City/Chart.vue';
import IconsArow from '@/components/Icons/Arrow.vue';
import FiveDayListItem from '@/components/City/Forecast/FiveDayListItem.vue';

export default defineComponent({
  name: 'FiveDayList',
  components: {
    Chart,
    IconsArow,
    FiveDayListItem,
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
    <FiveDayListItem
      v-for="(item, index) of forecast"
      :key="index"
      :forecast="item"
      :index="index"
    />
  </div>
</template>

<style lang="scss" scoped></style>
