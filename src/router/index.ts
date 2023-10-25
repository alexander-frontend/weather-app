import HomeView from '../views/HomeView.vue';
import { createRouter, createWebhHistory } from 'vue-router';
import FavoritesView from '@/views/FavoritesView.vue';

const router = createRouter({
  history: createWebhHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
      meta: {
        title: 'Weather app',
      },
    },
    {
      path: '/favorites',
      component: FavoritesView,
      meta: {
        title: 'Five day forecast',
      },
    },
  ],
});

export default router;
