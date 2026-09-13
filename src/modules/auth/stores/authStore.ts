import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import authApi from '@/infrastructure/rest/authApi';
import authStorage from '@/core/storage/authStorage';
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload
} from '@/infrastructure/rest/authApi';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const token = ref<string | null>(authStorage.getToken());
  const loading = ref(false);

  const isAuthenticated = computed(() => token.value !== null);

  async function login(payload: LoginPayload): Promise<void> {
    loading.value = true;

    try {
      const response = await authApi.login(payload);

      token.value = response.accessToken;
      user.value = response.user;

      authStorage.setToken(response.accessToken);
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: RegisterPayload): Promise<void> {
    loading.value = true;

    try {
      const response = await authApi.register(payload);

      token.value = response.accessToken;
      user.value = response.user;

      authStorage.setToken(response.accessToken);
    } finally {
      loading.value = false;
    }
  }

  function logout(): void {
    token.value = null;
    user.value = null;

    authStorage.removeToken();
  }

  function initialize(): void {
    const storedToken = authStorage.getToken();

    token.value = storedToken;
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    initialize
  };
});