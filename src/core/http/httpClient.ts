import axios from 'axios';
import env from '@/core/config/env';
import { setupInterceptors } from './interceptors';

/**
 * Cliente HTTP principal de la aplicación.
 *
 * Toda comunicación REST del frontend deberá utilizar
 * este cliente en lugar de importar Axios directamente.
 */
const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

setupInterceptors(httpClient);

export default httpClient;