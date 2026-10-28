import {
  createContext, useContext, useState, useEffect,
  useCallback, useRef, type ReactNode,
} from 'react';
import { translate } from '../i18n/translations';
import { getUserSettings, updateUserSettings } from '../services/api';

// ── Exported Types ─────────────────────────────────────────────────────────────
// Exported so Settings.tsx and other consumers share the exact same types
// without redefining them locally.

export type AppLanguage    = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ar' | 'zh' | 'ja' | 'pt' | 'ru';
export type MeasurementUnit = 'metric' | 'imperial';
export type ExplainLevel   = 'clinical' | 'simple';
export type OutputDepth    = 'concise'  | 'comprehensive';

export interface Dependent {
  id: string;
  name: string;
  dob: string;
  sex: 'male' | 'female' | 'other' | 'prefer_not';
  allergies: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface SettingsPayload {
  aiPreferences?: { explainLevel?: ExplainLevel; outputDepth?: OutputDepth };
  dependents?: Dependent[];
  emergencyProtocols?: { contacts?: EmergencyContact[]; autoAlertsEnabled?: boolean };
  localization?: {
    measurementStandard?: MeasurementUnit;
    language?: AppLanguage;
    highContrast?: boolean;
    largeText?: boolean;
  };
}

export interface ToastState {
  msg: string;
  type: 'success' | 'error';
}

// ── localStorage key map ───────────────────────────────────────────────────────
// One constant per key so typos are caught at compile-time, not at runtime.
const LS = {
  LANG:     'cura_lang',
  HC:       'cura_highContrast',
  LT:       'cura_largeText',
  MEAS:     'cura_measurement',
  EXPLAIN:  'cura_explainLevel',
  DEPTH:    'cura_outputDepth',
  DEPS:     'cura_dependents',
  CONTACTS: 'cura_emergencyContacts',
  ALERTS:   'cura_autoAlerts',
} as const;

const VALID_LANGS: AppLanguage[] = ['en', 'es', 'fr', 'de', 'hi', 'ar', 'zh', 'ja', 'pt', 'ru'];

// ── Context shape ──────────────────────────────────────────────────────────────
interface AppSettings {
  // ── State ──
  language: AppLanguage;
  highContrast: boolean;
  largeClinicalText: boolean;
  measurement: MeasurementUnit;
  explainLevel: ExplainLevel;
  outputDepth: OutputDepth;
  dependents: Dependent[];
  emergencyContacts: EmergencyContact[];
  autoAlertsEnabled: boolean;

  // ── Instant setters (write to state + localStorage immediately) ──
  setLanguage: (l: AppLanguage) => void;
  setHighContrast: (v: boolean) => void;
  setLargeClinicalText: (v: boolean) => void;
  setMeasurement: (m: MeasurementUnit) => void;
  setExplainLevel: (l: ExplainLevel) => void;
  setOutputDepth: (d: OutputDepth) => void;
  setDependents: (d: Dependent[]) => void;
  setEmergencyContacts: (c: EmergencyContact[]) => void;
  setAutoAlertsEnabled: (v: boolean) => void;

  // ── API sync ──
  syncFromDB: () => Promise<void>;
  saveSettings: (payload: SettingsPayload) => Promise<{ ok: boolean; error?: string }>;
  clearAll: () => void;

  // ── Status ──
  isSyncing: boolean;
  isSaving: boolean;

  // ── Toast ──
  toast: ToastState | null;
  showToast: (msg: string, type: 'success' | 'error', duration?: number) => void;
  clearToast: () => void;

  // ── Translation ──
  t: (key: string) => string;
}

// ── Context default (never actually used — provider is always present) ─────────
const AppSettingsContext = createContext<AppSettings>({
  language: 'en', highContrast: false, largeClinicalText: false, measurement: 'metric',
  explainLevel: 'clinical', outputDepth: 'concise', dependents: [], emergencyContacts: [],
  autoAlertsEnabled: false,
  setLanguage: () => {}, setHighContrast: () => {}, setLargeClinicalText: () => {},
  setMeasurement: () => {}, setExplainLevel: () => {}, setOutputDepth: () => {},
  setDependents: () => {}, setEmergencyContacts: () => {}, setAutoAlertsEnabled: () => {},
  syncFromDB: async () => {}, saveSettings: async () => ({ ok: false }), clearAll: () => {},
  isSyncing: false, isSaving: false,
  toast: null, showToast: () => {}, clearToast: () => {},
  t: (k) => k,
});

// ── Public hooks ───────────────────────────────────────────────────────────────
export function useAppSettings() { return useContext(AppSettingsContext); }
export function useTranslation()  { const { t } = useAppSettings(); return { t }; }

// ── Provider ───────────────────────────────────────────────────────────────────
export function AppSettingsProvider({ children }: { children: ReactNode }) {
  // Localization & Accessibility
  const [language, setLang]           = useState<AppLanguage>('en');
  const [highContrast, setHC]         = useState(false);
  const [largeClinicalText, setLT]    = useState(false);
  const [measurement, setMeas]        = useState<MeasurementUnit>('metric');
  // AI Preferences
  const [explainLevel, setEL]         = useState<ExplainLevel>('clinical');
  const [outputDepth, setOD]          = useState<OutputDepth>('concise');
  // Dependents
  const [dependents, setDep]          = useState<Dependent[]>([]);
  // Emergency
  const [emergencyContacts, setEC]    = useState<EmergencyContact[]>([]);
  const [autoAlertsEnabled, setAA]    = useState(false);
  // Status
  const [isSyncing, setIsSyncing]     = useState(false);
  const [isSaving, setIsSaving]       = useState(false);
  // Toast
  const [toast, setToast]             = useState<ToastState | null>(null);
  const toastTimer                    = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Restore persisted settings from localStorage on mount ──────────────────
  useEffect(() => {
    try {
      const lang = localStorage.getItem(LS.LANG) as AppLanguage | null;
      if (lang && VALID_LANGS.includes(lang)) setLang(lang);

      if (localStorage.getItem(LS.HC) === 'true') setHC(true);
      if (localStorage.getItem(LS.LT) === 'true') setLT(true);

      const meas = localStorage.getItem(LS.MEAS);
      if (meas === 'metric' || meas === 'imperial') setMeas(meas);

      const el = localStorage.getItem(LS.EXPLAIN);
      if (el === 'clinical' || el === 'simple') setEL(el);

      const od = localStorage.getItem(LS.DEPTH);
      if (od === 'concise' || od === 'comprehensive') setOD(od);

      const depsRaw = localStorage.getItem(LS.DEPS);
      if (depsRaw) setDep(JSON.parse(depsRaw));

      const ctxRaw = localStorage.getItem(LS.CONTACTS);
      if (ctxRaw) setEC(JSON.parse(ctxRaw));

      if (localStorage.getItem(LS.ALERTS) === 'true') setAA(true);
    } catch { /* malformed cache — silently use defaults */ }
  }, []);

  // ── DOM side-effects ───────────────────────────────────────────────────────
  // These run immediately whenever the state changes, giving instant visual
  // feedback without waiting for a Save or an API round-trip.

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir  = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('cura-high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('cura-large-text', largeClinicalText);
  }, [largeClinicalText]);

  // ── Setters: update state AND localStorage atomically ─────────────────────
  // localStorage is the L1 cache — changes survive page refresh instantly,
  // even before the user clicks Save (which persists to the DB as L2).

  const setLanguage = useCallback((l: AppLanguage) => {
    setLang(l);
    localStorage.setItem(LS.LANG, l);
  }, []);

  const setHighContrast = useCallback((v: boolean) => {
    setHC(v);
    localStorage.setItem(LS.HC, String(v));
  }, []);

  const setLargeClinicalText = useCallback((v: boolean) => {
    setLT(v);
    localStorage.setItem(LS.LT, String(v));
  }, []);

  const setMeasurement = useCallback((m: MeasurementUnit) => {
    setMeas(m);
    localStorage.setItem(LS.MEAS, m);
  }, []);

  const setExplainLevel = useCallback((l: ExplainLevel) => {
    setEL(l);
    localStorage.setItem(LS.EXPLAIN, l);
  }, []);

  const setOutputDepth = useCallback((d: OutputDepth) => {
    setOD(d);
    localStorage.setItem(LS.DEPTH, d);
  }, []);

  const setDependents = useCallback((d: Dependent[]) => {
    setDep(d);
    try { localStorage.setItem(LS.DEPS, JSON.stringify(d)); } catch { /* storage quota */ }
  }, []);

  const setEmergencyContacts = useCallback((c: EmergencyContact[]) => {
    setEC(c);
    try { localStorage.setItem(LS.CONTACTS, JSON.stringify(c)); } catch { /* storage quota */ }
  }, []);

  const setAutoAlertsEnabled = useCallback((v: boolean) => {
    setAA(v);
    localStorage.setItem(LS.ALERTS, String(v));
  }, []);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string, type: 'success' | 'error', duration = 3500) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), duration);
  }, []);

  const clearToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  // ── syncFromDB ─────────────────────────────────────────────────────────────
  // Called by App.tsx immediately after the user authenticates.
  // Fetches the user's saved settings from MongoDB and overwrites
  // both React state and localStorage — the DB is the authoritative source.
  const syncFromDB = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await getUserSettings();
      if (res.error || !res.data?.settings) return;

      const s = res.data.settings;

      // Localization
      const loc = s.localization || {};
      if (loc.language && VALID_LANGS.includes(loc.language)) {
        setLang(loc.language);
        localStorage.setItem(LS.LANG, loc.language);
      }
      if (loc.measurementStandard === 'metric' || loc.measurementStandard === 'imperial') {
        setMeas(loc.measurementStandard);
        localStorage.setItem(LS.MEAS, loc.measurementStandard);
      }
      if (typeof loc.highContrast === 'boolean') {
        setHC(loc.highContrast);
        localStorage.setItem(LS.HC, String(loc.highContrast));
      }
      if (typeof loc.largeText === 'boolean') {
        setLT(loc.largeText);
        localStorage.setItem(LS.LT, String(loc.largeText));
      }

      // AI Preferences
      const ai = s.aiPreferences || {};
      if (ai.explainLevel === 'clinical' || ai.explainLevel === 'simple') {
        setEL(ai.explainLevel);
        localStorage.setItem(LS.EXPLAIN, ai.explainLevel);
      }
      if (ai.outputDepth === 'concise' || ai.outputDepth === 'comprehensive') {
        setOD(ai.outputDepth);
        localStorage.setItem(LS.DEPTH, ai.outputDepth);
      }

      // Dependents
      if (Array.isArray(s.dependents)) {
        setDep(s.dependents);
        try { localStorage.setItem(LS.DEPS, JSON.stringify(s.dependents)); } catch { /* quota */ }
      }

      // Emergency
      const ep = s.emergencyProtocols || {};
      if (Array.isArray(ep.contacts)) {
        setEC(ep.contacts);
        try { localStorage.setItem(LS.CONTACTS, JSON.stringify(ep.contacts)); } catch { /* quota */ }
      }
      if (typeof ep.autoAlertsEnabled === 'boolean') {
        setAA(ep.autoAlertsEnabled);
        localStorage.setItem(LS.ALERTS, String(ep.autoAlertsEnabled));
      }
    } catch { /* network error — localStorage values remain active */ } finally {
      setIsSyncing(false);
    }
  }, []);

  // ── saveSettings ───────────────────────────────────────────────────────────
  // Persists a settings section to MongoDB via PATCH.
  // Only the provided fields are touched — other sections are not overwritten.
  // Called by Settings.tsx save buttons and the auto-save add/remove handlers.
  const saveSettings = useCallback(async (
    payload: SettingsPayload,
  ): Promise<{ ok: boolean; error?: string }> => {
    setIsSaving(true);
    try {
      const res = await updateUserSettings(payload);
      if (res.error) return { ok: false, error: res.error };
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error. Changes saved locally.' };
    } finally {
      setIsSaving(false);
    }
  }, []);

  // ── clearAll ───────────────────────────────────────────────────────────────
  // Called by App.tsx handleLogout.
  // Wipes every settings localStorage key and resets context state to defaults
  // so the next user to log in on this device starts from a clean slate.
  const clearAll = useCallback(() => {
    Object.values(LS).forEach(key => localStorage.removeItem(key));
    setLang('en');
    setHC(false);
    setLT(false);
    setMeas('metric');
    setEL('clinical');
    setOD('concise');
    setDep([]);
    setEC([]);
    setAA(false);
    setToast(null);
  }, []);

  const t = useCallback((key: string) => translate(key, language), [language]);

  return (
    <AppSettingsContext.Provider value={{
      language, highContrast, largeClinicalText, measurement,
      explainLevel, outputDepth, dependents, emergencyContacts, autoAlertsEnabled,
      setLanguage, setHighContrast, setLargeClinicalText, setMeasurement,
      setExplainLevel, setOutputDepth, setDependents, setEmergencyContacts, setAutoAlertsEnabled,
      syncFromDB, saveSettings, clearAll,
      isSyncing, isSaving,
      toast, showToast, clearToast,
      t,
    }}>
      {children}
    </AppSettingsContext.Provider>
  );
}
