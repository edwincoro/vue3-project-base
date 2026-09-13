import type { AxiosInstance } from 'axios';
import authStorage from '@/core/storage/authStorage';

export function setupInterceptors(httpClient: AxiosInstance): void {
  httpClient.interceptors.request.use(
    (config) => {
      const token = authStorage.getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  httpClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}