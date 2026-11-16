import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { configureApi } from '@curasense/shared/api/client';
import { API_URL } from '../config';
import { storage } from './storage';
import { isTokenExpired } from './token';

export interface User { id?: string; name?: string; email?: string; role?: string }
type Status = 'loading' | 'signedOut' | 'signedIn';
/** How the person arrived, which decides the welcome they see: just signed in, just signed up, or a saved session picked up again. */
export type Arrival = { kind: 'signin' | 'signup' | 'resume'; name: string } | null;
interface AuthValue {
  status: Status;
  user: User | null;
  arrival: Arrival;
  signIn: (token: string, user: User, how?: 'signin' | 'signup') => Promise<void>;
  signOut: () => Promise<void>;
  /** The welcome calls this when it has finished. */
  endArrival: () => void;
}
const firstName = (name?: string) => (name ?? '').trim().split(/\s+/)[0] ?? '';

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
  const [arrival, setArrival] = useState<Arrival>(null);

  // Restore the session from the secure store. An expired token is dropped here instead of failing the first request.
  useEffect(() => {
    (async () => {
      try {
        const [token, saved] = await Promise.all([storage.get(TOKEN_KEY), storage.get(USER_KEY)]);
        if (token && !isTokenExpired(token)) {
          currentToken = token;
          const restored: User | null = saved ? JSON.parse(saved) : null;
          setUser(restored);
          setArrival({ kind: 'resume', name: firstName(restored?.name) });
          setStatus('signedIn');
          return;
        }
        if (token) await Promise.all([storage.remove(TOKEN_KEY), storage.remove(USER_KEY)]);
      } catch { /* an unreadable store means signed out */ }
      setStatus('signedOut');
    })();
  }, []);

  const signIn = useCallback(async (token: string, next: User, how: 'signin' | 'signup' = 'signin') => {
    currentToken = token;
    setUser(next);
    setArrival({ kind: how, name: firstName(next.name) });
    setStatus('signedIn');
    await Promise.all([storage.set(TOKEN_KEY, token), storage.set(USER_KEY, JSON.stringify(next))]).catch(() => { /* signed in for this session even if saving fails */ });
  }, []);

  const signOut = useCallback(async () => {
    currentToken = null;
    setUser(null);
    setArrival(null);
    setStatus('signedOut');
    await Promise.all([storage.remove(TOKEN_KEY), storage.remove(USER_KEY)]).catch(() => {});
  }, []);

  const endArrival = useCallback(() => setArrival(null), []);
  const value = useMemo(() => ({ status, user, arrival, signIn, signOut, endArrival }), [status, user, arrival, signIn, signOut, endArrival]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
