// Turns a finished analysis into plain text for the share sheet (Messages, Mail, Notes, a doctor's inbox).
import { URGENCY_LEVELS, type Urgency } from './analysis.ts';
import { TYPE_LABELS, type PredictionType } from './history.ts';

export const DISCLAIMER = 'AI-assisted information, not a medical diagnosis. Talk to a clinician about your results.';

/** What both a fresh result and a saved record have in common. */
export interface Shareable {
  type?: PredictionType;
  diagnosis: string;
  confidence?: number | null;
  urgency?: Urgency;
  details?: string;
  conditions?: { name: string; probability: number }[];
  biomarkers?: { name: string; value: number | string; unit?: string; status?: string }[];
  recommendations?: string[];
  timestamp?: Date;
}

/** The AI's markdown as plain text: no ** or #, headings in capitals, bullets as dashes. */
export function plainText(md: string): string {
  return md
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => {
      const t = line.trim();
      if (/^-{3,}$/.test(t)) return '';
      const heading = t.match(/^#{1,6}\s+(.*)$/);
      return (heading ? heading[1].toUpperCase() : t.replace(/^[*•]\s+/, '- ')).replace(/\*\*|__/g, '');
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function resultToText(r: Shareable): string {
  const head = [`CuraSense analysis${r.type ? `: ${TYPE_LABELS[r.type]}` : ''}`];
  if (r.timestamp && !Number.isNaN(r.timestamp.getTime())) head.push(r.timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  head.push(r.diagnosis);
  if (r.urgency) head.push(`Urgency: ${URGENCY_LEVELS[r.urgency].label}. ${URGENCY_LEVELS[r.urgency].sub}`);
  if (typeof r.confidence === 'number' && r.confidence > 0) head.push(`Confidence: ${r.confidence}%`);
  const parts = [head.join('\n')];
  if (r.details?.trim()) parts.push(plainText(r.details));
  if (r.conditions?.length) parts.push(['Possible conditions:', ...r.conditions.map((c) => `- ${c.name}: ${c.probability}%`)].join('\n'));
  if (r.biomarkers?.length) parts.push(['Lab values:', ...r.biomarkers.map((b) => `- ${b.name}: ${b.value}${b.unit ? ` ${b.unit}` : ''}${b.status ? ` (${b.status})` : ''}`)].join('\n'));
  if (r.recommendations?.length) parts.push(['Recommendations:', ...r.recommendations.map((x) => `- ${x}`)].join('\n'));
  parts.push(DISCLAIMER);
  return parts.join('\n\n');
}
