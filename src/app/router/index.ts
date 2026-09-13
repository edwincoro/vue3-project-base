import { createRouter, createWebHistory } from 'vue-router';

import { setupRouterGuards } from './guards';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/auth/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/modules/auth/views/RegisterView.vue')
    },
    {
      path: '/',
      component: () => import('@/app/layouts/AuthenticatedLayout.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/modules/home/views/HomeView.vue')
        },

        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/modules/categories/views/CategoryListView.vue')
        },

        {
          path: 'products',
          name: 'products',
          component: () => import('@/modules/products/views/ProductListView.vue')
        }
      ]
    }
  ]
});

setupRouterGuards(router);

export default router;