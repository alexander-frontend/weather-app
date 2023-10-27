import HomeView from '../views/HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import FavoritesView from '@/views/FavoritesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    {
      path: '/:pathMatch(.*)*',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        next('/weather-app');
      },
    },
  ],
});

export default router;
