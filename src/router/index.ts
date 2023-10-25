import HomeView from '../views/HomeView.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import FavoritesView from '@/views/FavoritesView.vue';

const router = createRouter({
  history: createWebHashHistory(),
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

//router.push('/weather-app/');

export default router;
