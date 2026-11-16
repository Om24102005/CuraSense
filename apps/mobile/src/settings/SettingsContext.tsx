import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo } from 'react-native';
import { getUserSettings, updateUserSettings } from '@curasense/shared/api/settings';
import { DEFAULT_SETTINGS, parseServerSettings, toServerPayload, type SettingsValues } from '@curasense/shared/settings';
import { useAuth } from '../auth/AuthContext';

const KEY = 'curasense_settings';

export interface Notice { kind: 'success' | 'error'; message: string }
interface Value {
  values: SettingsValues;
  /** False until the copy kept on this phone has been read, so the first screen is drawn with the right contrast and text size. */
  ready: boolean;
  /** The result of the last save, shown for a few seconds. */
  notice: Notice | null;
  /** Shows the change at once and saves it to the account. If the save fails the change is undone and the notice says why. */
  update: (patch: Partial<SettingsValues>, saved: string) => Promise<boolean>;
}

// The default lets code that only reads a setting (the theme, text) work without a provider.
const SettingsContext = createContext<Value>({ values: DEFAULT_SETTINGS, ready: true, notice: null, update: async () => false });

/**
 * The signed-in user's settings. The account on the server is the truth; a copy on the phone lets the app start with the right
 * contrast and text size, and work offline. As on the website, signing out wipes the copy so the next person starts clean.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const [values, setValues] = useState(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const current = useRef(DEFAULT_SETTINGS); // the latest values, for code that continues after an await
  const edits = useRef(0); // counts changes, so a slow sync cannot overwrite a newer edit
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const commit = useCallback((next: SettingsValues) => {
    current.current = next;
    setValues(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const say = useCallback((n: Notice) => {
    setNotice(n);
    AccessibilityInfo.announceForAccessibility(n.message); // iOS does not read live regions
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), n.kind === 'error' ? 7000 : 3000);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    let live = true;
    (async () => {
      if (status === 'signedOut') { commit(DEFAULT_SETTINGS); setReady(true); return; }
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw && live) { current.current = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }; setValues(current.current); }
      } catch { /* an unreadable copy is the same as none */ }
      if (!live) return;
      setReady(true);
      const seen = edits.current;
      const res = await getUserSettings();
      if (live && !res.error && res.data && edits.current === seen) commit({ ...current.current, ...parseServerSettings(res.data.settings) });
    })();
    return () => { live = false; };
  }, [status, commit]);

  const update = useCallback(async (patch: Partial<SettingsValues>, saved: string) => {
    const keys = Object.keys(patch) as (keyof SettingsValues)[];
    const before = current.current;
    edits.current += 1;
    commit({ ...before, ...patch });
    const payload = toServerPayload(current.current, keys);
    const res = Object.keys(payload).length ? await updateUserSettings(payload) : null; // device-only settings have nothing to send
    if (res?.error) {
      // Put back only what this change touched, so a newer change to something else survives.
      commit({ ...current.current, ...Object.fromEntries(keys.map((k) => [k, before[k]])) });
      say({ kind: 'error', message: `${String(res.error).replace(/[.\s]+$/, '')}. The change was undone.` });
      return false;
    }
    say({ kind: 'success', message: saved });
    return true;
  }, [commit, say]);

  const value = useMemo(() => ({ values, ready, notice, update }), [values, ready, notice, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
