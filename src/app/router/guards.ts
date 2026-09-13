import type { Router } from 'vue-router';

import { useAuthStore } from '@/modules/auth/stores/authStore';

export function setupRouterGuards(router: Router): void {
  router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      };
    }

    if (to.name === 'login' && authStore.isAuthenticated) {
      return {
        name: 'home'
      };
    }

    return true;
  });
}