<template>
  <div class="footer">
    <div class="container">
      <label for="locale-select">{{ $t('Choose_lang') }}: </label>
      <select v-model="$i18n.locale" id="locale-select">
        <option
          v-for="locale in locales"
          :key="locale.code"
          :value="locale.code"
        >
          {{ locale.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { supportedLocales } from '@/i18n/index';

export default defineComponent({
  name: 'Footer',
  data() {
    return {};
  },
  computed: {
    locales() {
      return Object.keys(supportedLocales).map((code) => ({
        code,
        name: supportedLocales[code].name,
      }));
    },
  },
});
</script>

<style lang="scss" scoped>
.footer {
  background: $color-light-blue;
  .container {
    width: 100%;
    max-width: 130rem;
    padding: 3rem 0;
    margin: auto;
    text-align: center;
    label {
      display: block;
      margin-bottom: 1rem;
      font-weight: 500;
    }

    select {
      appearance: none;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAqUlEQVR4nO2TQQrCMAAE56S+IqKPUVB/ZKu+yFb9jGKfoV6VgIciSZukW+jBgVxnSaaFP0PhArzF51wfmAJPofwFzH9vcRAO7F3PNAZuAnkFTHwtloKBTVvwUwd5GfJFGeCRGHZGILuEgZwIYoNXTWEVwdckUgbICzpgWoJHhfWRNwxkCBgBV4f8nhLWx8IxsEJMUZMf6QHzDS4J6yMDtn3JLfYPt2c4fAD/dchwnz+b7wAAAABJRU5ErkJggg==');
      background-position: right 10px center;
      background-repeat: no-repeat;
      background-color: $color-light-gray-shade;
      background-size: 1.2rem;
      padding: 0.8rem 3rem 0.8rem 1.5rem;
      border-radius: 1rem;
      cursor: pointer;
    }
  }
}
</style>
