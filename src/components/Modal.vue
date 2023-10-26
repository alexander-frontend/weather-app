<template>
  <div class="modal" v-if="isOpen">
    <div class="modal-content">
      <p v-html="message"></p>
      <div class="modal-actions">
        <button class="btn btn-yes" @click="confirmAction">Ok</button>
        <button v-if="cancel" class="btn btn-no" @click="cancelAction">
          No
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Modal',
  setup() {},
  props: {
    message: {
      type: String,
      required: true,
    },
    cancel: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
      resolveCallback: null,
      rejectCallback: null,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    openModal() {
      this.isOpen = true;

      return new Promise((resolve, reject) => {
        this.resolveCallback = resolve;
        this.rejectCallback = reject;
      });
    },
    confirmAction() {
      this.isOpen = false;

      this.resolveCallback();
    },
    cancelAction() {
      this.isOpen = false;

      this.rejectCallback();
    },
  },
});
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  &-content {
    background-color: $color-white;
    padding: 2rem;
    border-radius: 2rem;
    color: $color-medium-dark-cyan-blue;
    text-align: center;
  }

  &-actions {
    margin-top: 2rem;
    text-align: center;
  }

  .btn {
    padding: 0.5rem 1, 5rem;
    border-radius: 1.6rem;
    cursor: pointer;
  }

  .btn-yes {
    background-color: #dbf0e4;
    color: black;
  }

  .btn-no {
    background-color: #f5a79e;
    color: black;
    margin-left: 1rem;
  }
}
</style>
