// The history record the Node API stores for each finished analysis, and the numbers and dates the Dashboard and History screens show.
// Ported from the website's Dashboard and History screens (which keep their own copy). Self-contained: no imports, so Node can run its tests.

export type PredictionType = 'symptom' | 'image' | 'report';
export type Urgency = 'low' | 'medium' | 'high' | 'emergency';

export interface Prediction {
  id: string;
  type: PredictionType;
  timestamp: Date;
  diagnosis: string;
  confidence: number;
  details: string;
  recommendations: string[];
  liked?: boolean;
  urgency?: Urgency;
  conditions?: { name: string; probability: number }[];
  biomarkers?: { name: string; value: number | string; unit?: string; status?: string; normal_min?: number; normal_max?: number }[];
  scanSections?: { title?: string; findings?: string[] }[];
}

export const TYPE_LABELS: Record<PredictionType, string> = { symptom: 'Symptom Analysis', image: 'Image Analysis', report: 'Report Analysis' };
export const TYPE_COLORS: Record<PredictionType, string> = { symptom: '#0ea5e9', image: '#8b5cf6', report: '#ec4899' };

/** One record as the API returns it (Mongo's _id, the date as a string) to the shape the screens use. */
export function normalizePrediction(raw: any): Prediction {
  const urgency = ['low', 'medium', 'high', 'emergency'].includes(raw?.urgency) ? raw.urgency : undefined;
  return {
    ...raw,
    id: String(raw?._id ?? raw?.id ?? ''),
    type: ['symptom', 'image', 'report'].includes(raw?.type) ? raw.type : 'symptom',
    timestamp: new Date(raw?.timestamp),
    diagnosis: String(raw?.diagnosis ?? ''),
    confidence: Number(raw?.confidence) || 0,
    details: String(raw?.details ?? ''),
    recommendations: Array.isArray(raw?.recommendations) ? raw.recommendations : [],
    urgency,
    conditions: Array.isArray(raw?.conditions) ? raw.conditions : [],
    biomarkers: Array.isArray(raw?.biomarkers) ? raw.biomarkers : [],
    scanSections: Array.isArray(raw?.scanSections) ? raw.scanSections : [],
  };
}

export interface Summary {
  total: number;
  today: number;
  avgConfidence: number;
  byType: Partial<Record<PredictionType, number>>;
  mostUsed: PredictionType | null;
  latest: Date | null;
}

/** The numbers on the Dashboard and the History header. `today` counts by the device's local calendar day. */
export function summarize(items: Prediction[], now: Date = new Date()): Summary {
  const byType: Summary['byType'] = {};
  for (const p of items) byType[p.type] = (byType[p.type] || 0) + 1;
  const ranked = (Object.entries(byType) as [PredictionType, number][]).sort((a, b) => b[1] - a[1]);
  const valid = items.map((p) => p.timestamp).filter((d) => !isNaN(d.getTime()));
  return {
    total: items.length,
    today: items.filter((p) => p.timestamp.toDateString() === now.toDateString()).length,
    avgConfidence: items.length ? Math.round(items.reduce((s, p) => s + p.confidence, 0) / items.length) : 0,
    byType,
    mostUsed: ranked[0]?.[0] ?? null,
    latest: valid.length ? new Date(Math.max(...valid.map((d) => d.getTime()))) : null,
  };
}

// null and undefined are "no date" (new Date(null) would be 1 January 1970)
const asDate = (d: Date | string | number | null | undefined) => (d instanceof Date ? d : d == null ? new Date(NaN) : new Date(d));

/** "Just now", "5m ago", "3h ago", "2d ago", and an actual date after a week. */
export function formatRelative(date: Date | string | number | null | undefined, now: Date = new Date()): string {
  const d = asDate(date);
  if (isNaN(d.getTime())) return '—';
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000), hrs = Math.floor(diff / 3600000), days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatAbsolute(date: Date | string | number | null | undefined): string {
  const d = asDate(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
