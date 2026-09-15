import axios from 'axios';
import { apiClient } from './client';
import type { AuthUser } from '../types';

export interface LoginResult {
  token: string;
  user: AuthUser;
}

/** Shape actually returned by POST /auth/login on the .NET API. */
interface ApiLoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: {
    id: number | string;
    email: string;
    displayName: string;
    role: number | string;
    isActive: boolean;
  };
}

/**
 * Attempts a real login against the .NET API; if it isn't reachable yet this
 * falls back to a locally-generated session so the app remains usable for
 * development/demo purposes. Any non-empty email/password is accepted by the
 * fallback path.
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const { data } = await apiClient.post<ApiLoginResponse>('/auth/login', { email, password });
    return {
      token: data.accessToken,
      user: {
        id: String(data.user.id),
        email: data.user.email,
        name: data.user.displayName,
      },
    };
  } catch (error) {
    // Only fall back to a local dev session when the API itself is
    // unreachable (no response at all) - never on a real rejection (e.g. 401
    // for wrong credentials), which must fail the sign-in attempt.
    const isNetworkError = axios.isAxiosError(error) && !error.response;
    if (!isNetworkError) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Incorrect email or password.');
      }
      throw new Error('Sign in failed. Please try again.');
    }
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    return {
      token: `dev-local-token-${Date.now()}`,
      user: { id: `local-${email}`, email, name: email.split('@')[0] },
    };
  }
}
