import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }, {
      path: '/posts/:slug',
      name: 'post_find',
      
      component: () => import('../views/PostFind.vue')
    },{
      path: '/RegisterView',
      name: 'RegisterView',
      
      component: () => import('../views/RegisterView.vue')
    },{
      path: '/LoginView',
      name: 'LoginView',
      
      component: () => import('../views/LoginView.vue')
    },{
      path: '/PostList',
      name: 'PostList',
      
      component: () => import('../views/PostList.vue')
    }
  ]
})

export default router
