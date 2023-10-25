import HomeView from '../views/HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import FavoritesView from '@/views/FavoritesView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/weather-app',
      component: HomeView,
      name: 'home',
      meta: {
        title: 'Weather app',
      },
    },
    {
      path: '/weather-app/favorites',
      component: FavoritesView,
      name: 'favorites',
      meta: {
        title: 'Five day forecast',
      },
    },
  ],
});

export default router;
