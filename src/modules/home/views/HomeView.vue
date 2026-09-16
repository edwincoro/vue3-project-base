<template>
  <main class="home-view">
    <div class="welcome-card">
      <img src="@/assets/logo.jpg" alt="Logo del Sistema de Productos" class="app-logo" />
      <h1>Inicio</h1>
      <p>Bienvenido de nuevo, <strong>{{ authStore.user?.email ?? 'Usuario' }}</strong>.</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/stores/authStore';

const authStore = useAuthStore();
</script>

<style scoped>
.home-view {
  animation: fadeIn 0.4s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 3rem 4rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(226, 232, 240, 0.8);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.app-logo {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  margin: 0 auto 1.5rem;
  display: block;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  object-fit: cover;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
}
</style>