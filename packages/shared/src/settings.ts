// The user's settings as the Node API stores them (GET and PATCH /api/user/settings), and how a stored answer maps to the app's state.
// Ported from the website's AppSettingsContext (which keeps its own copy). Self-contained: no imports, so Node can run its tests.

export type AppLanguage = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ar' | 'zh' | 'ja' | 'pt' | 'ru';
export type MeasurementUnit = 'metric' | 'imperial';
export type ExplainLevel = 'clinical' | 'simple';
export type OutputDepth = 'concise' | 'comprehensive';

export const LANGUAGES: { code: AppLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'de', label: 'Deutsch (German)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ar', label: 'العربية (Arabic)' },
  { code: 'zh', label: '中文 (Chinese Simplified)' },
  { code: 'ja', label: '日本語 (Japanese)' },
  { code: 'pt', label: 'Português (Portuguese)' },
  { code: 'ru', label: 'Русский (Russian)' },
];

export interface Dependent { id: string; name: string; dob: string; sex: 'male' | 'female' | 'other' | 'prefer_not'; allergies: string }
export interface EmergencyContact { id: string; name: string; relation: string; phone: string }

/** What PATCH /api/user/settings accepts: only the sections you send are changed. */
export interface SettingsPayload {
  aiPreferences?: { explainLevel?: ExplainLevel; outputDepth?: OutputDepth };
  dependents?: Dependent[];
  emergencyProtocols?: { contacts?: EmergencyContact[]; autoAlertsEnabled?: boolean };
  localization?: { measurementStandard?: MeasurementUnit; language?: AppLanguage; highContrast?: boolean; largeText?: boolean };
}

export interface SettingsValues {
  language: AppLanguage;
  highContrast: boolean;
  largeText: boolean;
  measurement: MeasurementUnit;
  explainLevel: ExplainLevel;
  outputDepth: OutputDepth;
  dependents: Dependent[];
  emergencyContacts: EmergencyContact[];
  autoAlertsEnabled: boolean;
}

export const DEFAULT_SETTINGS: SettingsValues = {
  language: 'en', highContrast: false, largeText: false, measurement: 'metric', explainLevel: 'clinical', outputDepth: 'concise',
  dependents: [], emergencyContacts: [], autoAlertsEnabled: false,
};

/** The stored settings object to the values it holds; anything missing or of the wrong kind is left out, so the caller keeps what it has. */
export function parseServerSettings(s: any): Partial<SettingsValues> {
  const out: Partial<SettingsValues> = {};
  const loc = s?.localization || {};
  if (LANGUAGES.some((l) => l.code === loc.language)) out.language = loc.language;
  if (loc.measurementStandard === 'metric' || loc.measurementStandard === 'imperial') out.measurement = loc.measurementStandard;
  if (typeof loc.highContrast === 'boolean') out.highContrast = loc.highContrast;
  if (typeof loc.largeText === 'boolean') out.largeText = loc.largeText;
  const ai = s?.aiPreferences || {};
  if (ai.explainLevel === 'clinical' || ai.explainLevel === 'simple') out.explainLevel = ai.explainLevel;
  if (ai.outputDepth === 'concise' || ai.outputDepth === 'comprehensive') out.outputDepth = ai.outputDepth;
  if (Array.isArray(s?.dependents)) out.dependents = s.dependents;
  const ep = s?.emergencyProtocols || {};
  if (Array.isArray(ep.contacts)) out.emergencyContacts = ep.contacts;
  if (typeof ep.autoAlertsEnabled === 'boolean') out.autoAlertsEnabled = ep.autoAlertsEnabled;
  return out;
}

/** An id for a new dependent or contact (React Native has no crypto.randomUUID). */
export const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/** The PATCH body for the settings that changed. The server stores each field on its own, so only these are touched. */
export function toServerPayload(v: SettingsValues, keys: (keyof SettingsValues)[]): SettingsPayload {
  const has = (k: keyof SettingsValues) => keys.includes(k);
  const p: SettingsPayload = {};
  if (has('explainLevel') || has('outputDepth')) {
    p.aiPreferences = {};
    if (has('explainLevel')) p.aiPreferences.explainLevel = v.explainLevel;
    if (has('outputDepth')) p.aiPreferences.outputDepth = v.outputDepth;
  }
  if (has('dependents')) p.dependents = v.dependents;
  if (has('emergencyContacts') || has('autoAlertsEnabled')) {
    p.emergencyProtocols = {};
    if (has('emergencyContacts')) p.emergencyProtocols.contacts = v.emergencyContacts;
    if (has('autoAlertsEnabled')) p.emergencyProtocols.autoAlertsEnabled = v.autoAlertsEnabled;
  }
  if (has('measurement') || has('language') || has('highContrast') || has('largeText')) {
    p.localization = {};
    if (has('measurement')) p.localization.measurementStandard = v.measurement;
    if (has('language')) p.localization.language = v.language;
    if (has('highContrast')) p.localization.highContrast = v.highContrast;
    if (has('largeText')) p.localization.largeText = v.largeText;
  }
  return p;
}

/** Why a birth date cannot be saved, or '' when it can (or is empty). The server stores whatever it is sent, so the check is here. */
export function birthDateProblem(dob: string, today = new Date()): string {
  if (!dob) return '';
  const when = /^\d{4}-\d{2}-\d{2}$/.test(dob) ? new Date(`${dob}T00:00:00Z`) : null;
  if (!when || Number.isNaN(when.getTime()) || when.toISOString().slice(0, 10) !== dob) return 'Enter the date of birth as YYYY-MM-DD, for example 2014-03-27.';
  if (when > today || when.getUTCFullYear() < 1900) return 'That date of birth is not possible.';
  return '';
}

/** Why a new dependent cannot be saved, or '' when it can. */
export function dependentProblem(d: { name: string; dob: string }, today = new Date()): string {
  return d.name.trim() ? birthDateProblem(d.dob, today) : 'Enter a name.';
}

export function contactProblem(c: { name: string; phone: string }): string {
  if (!c.name.trim()) return 'Enter a name.';
  const digits = c.phone.replace(/\D/g, '');
  if (digits.length < 5 || digits.length > 15 || /[^\d\s+().-]/.test(c.phone)) return 'Enter a phone number, with the country code if it is abroad.';
  return '';
}

/** A link that opens the phone dialler for a number typed with spaces, dashes or brackets. */
export const telUrl = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
