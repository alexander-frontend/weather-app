<script lang="ts">
import { defineComponent } from 'vue';
import Chart from '@/components/City/Chart.vue';
import IconsArow from '@/components/Icons/Arrow.vue';
import AccordionPanel from '@/components/City/AccordionPanel.vue';

export default defineComponent({
  name: 'AccordionPanels',
  components: {
    Chart,
    IconsArow,
    AccordionPanel,
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
    <AccordionPanel
      v-for="(item, index) of forecast"
      :key="index"
      :forecast="item"
      :index="index"
    />
  </div>
</template>

<style lang="scss" scoped></style>
