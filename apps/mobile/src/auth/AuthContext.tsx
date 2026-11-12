import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { configureApi } from '@curasense/shared/api/client';
import { API_URL } from '../config';
import { storage } from './storage';
import { isTokenExpired } from './token';

export interface User { id?: string; name?: string; email?: string; role?: string }
type Status = 'loading' | 'signedOut' | 'signedIn';
interface AuthValue {
  status: Status;
  user: User | null;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

// Same keys as the website, so the two stay easy to compare.
const TOKEN_KEY = 'curasense_token';
const USER_KEY = 'curasense_user';

// The shared API client reads the token from here, so a request never waits for the Keychain.
let currentToken: string | null = null;
configureApi({ baseUrl: API_URL, getToken: () => currentToken });

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<User | null>(null);

  // Restore the session from the secure store. An expired token is dropped here instead of failing the first request.
  useEffect(() => {
    (async () => {
      try {
        const [token, saved] = await Promise.all([storage.get(TOKEN_KEY), storage.get(USER_KEY)]);
        if (token && !isTokenExpired(token)) {
          currentToken = token;
          setUser(saved ? JSON.parse(saved) : null);
          setStatus('signedIn');
          return;
        }
        if (token) await Promise.all([storage.remove(TOKEN_KEY), storage.remove(USER_KEY)]);
      } catch { /* an unreadable store means signed out */ }
      setStatus('signedOut');
    })();
  }, []);

  const signIn = useCallback(async (token: string, next: User) => {
    currentToken = token;
    setUser(next);
    setStatus('signedIn');
    await Promise.all([storage.set(TOKEN_KEY, token), storage.set(USER_KEY, JSON.stringify(next))]).catch(() => { /* signed in for this session even if saving fails */ });
  }, []);

  const signOut = useCallback(async () => {
    currentToken = null;
    setUser(null);
    setStatus('signedOut');
    await Promise.all([storage.remove(TOKEN_KEY), storage.remove(USER_KEY)]).catch(() => {});
  }, []);

  const value = useMemo(() => ({ status, user, signIn, signOut }), [status, user, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
