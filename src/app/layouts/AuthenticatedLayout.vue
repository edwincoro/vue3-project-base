<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/modules/auth/stores/authStore';
import AppNavigation from '@/shared/components/AppNavigation.vue';

const router = useRouter();
const authStore = useAuthStore();

function logout(): void {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="app-title">
        Vue 3 Project Base
      </div>

      <div class="app-user">
        <span v-if="authStore.user">
          {{ authStore.user.email }}
        </span>

        <button type="button" @click="logout">
          Cerrar sesión
        </button>
      </div>
    </header>

    <div class="app-body">
      <aside class="app-sidebar">
        <AppNavigation />
      </aside>

      <main class="app-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #ddd;
  background: #ffffff;
}

.app-title {
  font-weight: 600;
}

.app-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-user button {
  padding: 6px 12px;
  cursor: pointer;
}

.app-body {
  flex: 1;
  display: flex;
}

.app-sidebar {
  width: 220px;
  padding: 24px 16px;
  border-right: 1px solid #ddd;
  background: #f8f8f8;
}

.app-content {
  flex: 1;
  padding: 24px;
}
</style>