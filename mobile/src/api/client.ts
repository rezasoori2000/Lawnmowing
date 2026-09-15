import axios from 'axios';
import { env } from '../config/env';
import { useAuthStore } from '../store/authStore';

/**
 * Shared axios instance for the .NET 8 Web API. All resource-specific API
 * modules (lawnAreas.ts, mowRecords.ts, people.ts, equipment.ts, reports.ts)
 * should go through this client so auth headers, base URL and error shape
 * stay consistent in one place.
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      // Token expired/invalid - drop local session so the auth gate kicks the
      // user back to the Login screen.
      useAuthStore.getState().signOut();
    }
    return Promise.reject(error);
  },
);
