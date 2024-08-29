import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/posts/:slug',
    name: 'post_find',
    component: () => import('../views/PostFind.vue'),
  },
  {
    path: '/RegisterView',
    name: 'RegisterView',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/LoginView',
    name: 'LoginView',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/PostList',
    name: 'PostList',
    component: () => import('../views/PostList.vue'),
  },
  {
    path: '/SearchView',
    name: 'SearchView',
    component: () => import('../views/SearchView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
