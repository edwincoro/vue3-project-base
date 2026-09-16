<script setup lang="ts">
import { useRouter } from "vue-router";

import { useAuthStore } from "@/modules/auth/stores/authStore";
import AppNavigation from "@/shared/components/AppNavigation.vue";

const router = useRouter();
const authStore = useAuthStore();

function logout(): void {
  authStore.logout();
  router.push("/login");
}
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="app-title">Vue 3 Project Base</div>

      <div class="app-user">
        <div v-if="authStore.user" class="user-profile">
          <div class="avatar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div class="user-details">
            <!-- <span class="greeting">Conectado como</span> -->
            <span class="email">{{ authStore.user.email }}</span>
          </div>
        </div>

        <button type="button" @click="logout" class="logout-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="logout-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
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
  background-color: #f4f7fa;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
  color: #334155;
}

.app-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 0;
  z-index: 10;
}

.app-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #0f172a;
  letter-spacing: -0.025em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-title::before {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
}

.app-user {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 6px 16px 6px 6px;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
}

.avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.avatar svg {
  width: 20px;
  height: 20px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.email {
  font-weight: 600;
  font-size: 0.9rem;
  color: #0f172a;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 0.875rem;
  color: #ef4444;
  background: transparent;
  border: 1px solid #fca5a5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-icon {
  width: 18px;
  height: 18px;
}

.logout-btn:hover {
  background: #fef2f2;
  border-color: #ef4444;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.1);
  transform: translateY(-1px);
}

.app-body {
  flex: 1;
  display: flex;
}

.app-sidebar {
  width: 260px;
  padding: 32px 24px;
  background: #ffffff;
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 1px 0 10px rgba(0, 0, 0, 0.02);
}

.app-content {
  flex: 1;
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>
