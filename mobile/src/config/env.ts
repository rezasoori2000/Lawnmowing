import { API_BASE_URL, API_TIMEOUT_MS } from '@env';

/**
 * Centralised, typed access to environment configuration.
 *
 * Values are sourced from the .env file at the project root (see .env.example)
 * via react-native-dotenv, with sane fallbacks so the app still boots in a
 * fresh checkout before a .env file has been created.
 *
 * Point API_BASE_URL at the real .NET 8 Web API once it is reachable -
 * nothing else in the app needs to change.
 */
export const env = {
  apiBaseUrl: API_BASE_URL || 'http://10.0.2.2:5000/api',
  apiTimeoutMs: Number(API_TIMEOUT_MS) || 15000,
} as const;
