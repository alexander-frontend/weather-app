import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FavoritesView from '../views/FavoritesView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: FavoritesView,
    },
  ],
});

export default router;
