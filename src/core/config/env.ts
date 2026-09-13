const env = {
  appName: import.meta.env.VITE_APP_NAME,
  appVersion: import.meta.env.VITE_APP_VERSION,
  environment: import.meta.env.VITE_APP_ENV,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  apiTimeout: import.meta.env.VITE_API_TIMEOUT
} as const;

export default env;