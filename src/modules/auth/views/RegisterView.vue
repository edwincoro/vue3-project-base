<template>
  <main class="register-view">
    <section class="register-card">
      <h1>Crear cuenta</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Correo electrónico</label>

          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            :disabled="authStore.loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>

          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="new-password"
            required
            minlength="6"
            :disabled="authStore.loading"
          />
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirmar contraseña</label>

          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            minlength="6"
            :disabled="authStore.loading"
          />
        </div>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Creando cuenta...' : 'Crear cuenta' }}
        </button>
      </form>

      <p class="login-link">
        ¿Ya tienes una cuenta?
        <RouterLink :to="{ name: 'login' }">
          Iniciar sesión
        </RouterLink>
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import { parseHttpError } from '@/core/http/errors';
import { useAuthStore } from '@/modules/auth/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

async function handleSubmit(): Promise<void> {
  errorMessage.value = '';

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }

  try {
    await authStore.register({
      email: email.value,
      password: password.value
    });

    await router.push({ name: 'home' });
  } catch (error: unknown) {
    const httpError = parseHttpError(error);

    errorMessage.value = httpError.message;
  }
}
</script>

<style scoped>
.register-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4fd 0%, #e0eafc 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #334155;
}

.register-card {
  width: 100%;
  max-width: 420px;
  padding: 3rem 2.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.025em;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

input {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s ease;
  outline: none;
}

input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.error-message {
  margin-bottom: 1.5rem;
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  background: #fef2f2;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -2px rgba(59, 130, 246, 0.4);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled,
input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;
}

.login-link a {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.login-link a:hover {
  color: #2563eb;
  text-decoration: underline;
}
</style>