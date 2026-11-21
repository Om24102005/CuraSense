// When a finished analysis counts as an emergency, for the prompt that offers to call for help.
import type { AnalysisResult } from './analysis.ts';
import { extractUrgency } from './scans.ts';

/**
 * The AI marked it EMERGENCY (symptoms, lab report), or a page of a scan is Critical or Emergency in the AI's own words.
 * "Concerning" (high) does not count: it means see a doctor today, and a prompt that fires often stops being read.
 */
export function isEmergency(r: Pick<AnalysisResult, 'urgency' | 'scanSections'>): boolean {
  if (r.urgency === 'emergency') return true;
  return (r.scanSections ?? []).some((s) => !s.refusal && ['Critical', 'Emergency'].includes(extractUrgency(s.content)?.label ?? ''));
}
