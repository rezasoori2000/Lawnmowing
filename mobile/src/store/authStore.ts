import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
import type { AuthUser } from '../types';

const KEYCHAIN_SERVICE = 'com.turfops.auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  /** True while restoring a persisted session from the keychain on app start. */
  isHydrating: boolean;
  isAuthenticated: boolean;
  hydrate: () => Promise<void>;
  signIn: (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Auth/session state. The JWT is persisted in the OS keychain (via
 * react-native-keychain) so a signed-in user stays signed in across app
 * restarts; the in-memory zustand store is what the rest of the app reads
 * synchronously (e.g. the axios request interceptor).
 */
export const useAuthStore = create<AuthState>(set => ({
  token: null,
  user: null,
  isHydrating: true,
  isAuthenticated: false,

  hydrate: async () => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
      if (credentials) {
        const user: AuthUser = JSON.parse(credentials.username);
        const token = credentials.password;
        set({ token, user, isAuthenticated: true, isHydrating: false });
        return;
      }
    } catch {
      // Keychain unavailable or corrupt entry - fall through to signed-out state.
    }
    set({ isHydrating: false });
  },

  signIn: async (token: string, user: AuthUser) => {
    set({ token, user, isAuthenticated: true });
    try {
      await Keychain.setGenericPassword(JSON.stringify(user), token, {
        service: KEYCHAIN_SERVICE,
      });
    } catch {
      // Persisting to the keychain is best-effort; the session still works
      // for the current app run even if this fails.
    }
  },

  signOut: async () => {
    set({ token: null, user: null, isAuthenticated: false });
    try {
      await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
    } catch {
      // Ignore - nothing more we can do if the keychain entry can't be cleared.
    }
  },
}));
