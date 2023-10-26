<template>
  <div class="lds-ring">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Loader',
  components: {},
  setup() {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
});
</script>

<style lang="scss" scoped>
.lds-ring {
  display: inline-block;
  position: absolute;
  width: 30px;
  height: 30px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 50px;
  height: 50px;
  margin: 2px;
  border: 3px solid $color-light-gray-shade;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: $color-light-gray-shade transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
