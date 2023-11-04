<template>
  <div class="modal" v-if="isOpen">
    <div class="modal-content">
      <p v-html="message"></p>
      <div class="modal-actions">
        <button class="btn btn-yes" @click="confirmAction">
          {{ $t('Ok') }}
        </button>
        <button v-if="cancel" class="btn btn-no" @click="cancelAction">
          {{ $t('No') }}
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
      confirmAction: {} as any,
      cancelAction: {} as any,
    };
  },
  methods: {
    openModal() {
      this.isOpen = true;

      return new Promise<void>((resolve, reject) => {
        this.confirmAction = () => {
          this.isOpen = false;

          resolve();
        };
        this.cancelAction = () => {
          this.isOpen = false;

          reject();
        };
      });
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
  padding: 0 1rem;
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
    padding: 1rem 2rem;
    border-radius: 1.6rem;
    cursor: pointer;
  }

  .btn-yes {
    background-color: $color-light-cyan;
  }

  .btn-no {
    background-color: $color-light-gray-shade;
    margin-left: 1rem;
  }
}
</style>
