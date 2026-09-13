import { AUTH_TOKEN_KEY } from '@/core/config/constants';
import storage from './storage';

const authStorage = {
  getToken(): string | null {
    return storage.get<string>(AUTH_TOKEN_KEY);
  },

  setToken(token: string): void {
    storage.set(AUTH_TOKEN_KEY, token);
  },

  removeToken(): void {
    storage.remove(AUTH_TOKEN_KEY);
  },

  hasToken(): boolean {
    return this.getToken() !== null;
  }
};

export default authStorage;