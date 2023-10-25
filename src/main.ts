import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import i18n from './i18n';

import './assets/scss/main.scss';

const pinia = createPinia();

createApp(App).use(router).use(pinia).use(i18n).mount('#app');
