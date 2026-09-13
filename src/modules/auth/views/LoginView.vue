<template>
  <main class="login-view">
    <section class="login-card">
      <h1>Iniciar sesión</h1>

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
            autocomplete="current-password"
            required
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
          {{ authStore.loading ? 'Ingresando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <p class="register-link">
        ¿No tienes una cuenta?
        <RouterLink :to="{ name: 'register' }">
          Crear cuenta
        </RouterLink>
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@/modules/auth/stores/authStore';
import { parseHttpError } from '@/core/http/errors';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleSubmit(): Promise<void> {
  errorMessage.value = '';

  try {
    await authStore.login({
      email: email.value,
      password: password.value
    });

    const redirect =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/home';

    await router.push(redirect);
  } catch (error: unknown) {
    const httpError = parseHttpError(error);

    errorMessage.value = httpError.message;
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.error-message {
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
}

button:disabled,
input:disabled {
  cursor: not-allowed;
}

.register-link {
  margin-top: 1rem;
  text-align: center;
}
</style>