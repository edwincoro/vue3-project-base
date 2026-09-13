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
}

.register-card {
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

.login-link {
  margin-top: 1rem;
  text-align: center;
}
</style>