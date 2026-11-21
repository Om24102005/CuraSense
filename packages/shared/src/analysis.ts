// Turns the AI gateway's answers into the result the app shows and saves to the history.
// Ported from the website's three analysis screens (SymptomChecker, ImageAnalysis, ReportAnalysis); the website still has its own copy.
// Self-contained on purpose: no imports, so Node can run its tests without a build step.

export type Urgency = 'low' | 'medium' | 'high' | 'emergency';

/** Set when the AI service refuses a text or file because it belongs on another analysis page (null page: not medical at all). */
export type Redirect = { page: 'symptoms' | 'scans' | 'reports' | null; scan_type?: string | null };
export interface Refusal { message: string; redirect?: Redirect | null }

export interface ScanSection {
  num: number;
  filename: string;
  content: string;
  detectedKind?: string;
  detectedConfidence?: number;
  refusal?: Refusal;
}

export interface AnalysisResult {
  diagnosis: string;
  /** Percent. For a scan: how sure the AI was about what kind of scan it is; null when nothing was analysed. */
  confidence: number | null;
  details: string;
  urgency?: Urgency;
  conditions?: { name: string; probability: number }[];
  biomarkers?: { name: string; value: number; unit: string; status: string; normal_min: number; normal_max: number }[];
  scanSections?: ScanSection[];
  recommendations: string[];
}

export type Mapped = { refusal: Refusal } | { result: AnalysisResult; save: boolean };

export const URGENCY_LEVELS: Record<Urgency, { label: string; color: string; sub: string }> = {
  low: { label: 'ALL CLEAR', color: '#10b981', sub: 'Self-care is appropriate.' },
  medium: { label: 'MONITOR', color: '#f59e0b', sub: 'See a doctor in the next day or two.' },
  high: { label: 'CONCERNING', color: '#f97316', sub: 'Consult a physician today.' },
  emergency: { label: 'EMERGENCY', color: '#ef4444', sub: 'Seek immediate medical attention.' },
};

const urgencyOf = (raw: unknown): Urgency => {
  const u = String(raw || 'medium').trim().toLowerCase();
  return (['low', 'medium', 'high', 'emergency'] as const).includes(u as Urgency) ? (u as Urgency) : 'medium';
};

/** The gateway puts the structured answer in data.analysis, or a JSON string in data.result when analysis has no assessment. */
const structured = (data: any): any => {
  let a = (data?.analysis || {}) as any;
  if (!a.assessment && data?.result) {
    try {
      const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      if (parsed && typeof parsed === 'object') a = parsed;
    } catch { /* plain text result: leave a as it is */ }
  }
  return a;
};

export function mapSymptoms(data: any): Mapped {
  const a = structured(data);
  if (a.redirect) return { refusal: { message: a.error, redirect: a.redirect } };

  const rawAssessment = String(a.assessment || '').trim();
  let assessmentText = rawAssessment;
  // If the model double-encoded the assessment as JSON, unwrap it
  if (rawAssessment.startsWith('{') || rawAssessment.startsWith('[')) {
    try {
      const inner = JSON.parse(rawAssessment);
      if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
        assessmentText = String(inner.assessment || inner.text || inner.content || inner.clinical_notes || rawAssessment).trim();
      }
    } catch { /* not JSON: use as it is */ }
  }
  const fallbackText = typeof data?.result === 'string' ? data.result.trim() : '';

  return {
    save: true,
    result: {
      diagnosis: 'SYMPTOM DIAGNOSED',
      confidence: typeof a.confidence === 'number' ? a.confidence : 80,
      details: assessmentText || fallbackText || 'Analysis complete. See conditions and recommendations below.',
      urgency: urgencyOf(a.urgency),
      conditions: Array.isArray(a.conditions) ? a.conditions : [],
      recommendations: Array.isArray(a.recommendations) && a.recommendations.length
        ? a.recommendations
        : ['Review AI notes carefully.', 'Monitor vitals.', 'Consult a physician if symptoms worsen.'],
    },
  };
}

export function mapReport(data: any): Mapped {
  const a = structured(data);
  if (a.redirect) return { refusal: { message: a.error, redirect: a.redirect } };

  if (a.error) {
    const details = typeof a.error === 'string' ? a.error : JSON.stringify(a.error);
    // A busy AI service is not the file's fault: say so, and do not send the user hunting for another format.
    const busy = /did not respond|try again in a minute|unavailable|took too long/i.test(details);
    return {
      save: false,
      result: {
        diagnosis: busy ? 'AI Service Busy' : 'Could Not Read Report',
        confidence: 0,
        details,
        urgency: 'low',
        recommendations: busy
          ? ['Nothing is wrong with your file. Wait a minute and press Analyze again.']
          : ['Try a clearer photo or a PDF, or paste the text directly. Word, Excel, text and ZIP files work too.'],
        biomarkers: [],
      },
    };
  }

  return {
    save: true,
    result: {
      diagnosis: 'CLINICAL LAB ANALYSIS',
      confidence: typeof a.confidence === 'number' ? a.confidence : 80,
      details: a.assessment || 'No assessment returned.',
      urgency: urgencyOf(a.urgency),
      recommendations: Array.isArray(a.recommendations) && a.recommendations.length ? a.recommendations : ['Review extracted values with a physician.'],
      biomarkers: Array.isArray(a.biomarkers) ? a.biomarkers : [],
    },
  };
}

/** `done` are the files the server answered for; `requested` is how many were sent, so a partial failure is reported. */
export function mapScans(done: { name: string; data: any }[], requested: number): { result: AnalysisResult; save: boolean } {
  const scanSections: ScanSection[] = done.map(({ name, data }, i) => {
    const va = data?.vision_analysis || {};
    return {
      num: i + 1,
      filename: name,
      content: va.analysis || va.error || 'No analysis returned.',
      detectedKind: va.detected_kind,
      detectedConfidence: va.detected_confidence,
      // The AI service refuses files that are not the selected kind of scan.
      refusal: va.error ? { message: va.error, redirect: va.redirect } : undefined,
    };
  });
  const analysed = scanSections.filter((s) => !s.refusal);

  const combined = scanSections.map((s) => `### ${s.num}. ${s.filename}\n\n${s.content}`).join('\n\n---\n\n');
  const failed = requested - done.length;
  const failureNote = failed > 0 ? `\n\n> ⚠ ${failed} file${failed > 1 ? 's' : ''} failed to analyze.` : '';

  // Confidence is how sure the AI was about what kind of scan this is. It is reported by the model, not made up.
  const confidence = analysed.length
    ? Math.round(analysed.reduce((sum, s) => sum + (s.detectedConfidence ?? 0), 0) / analysed.length)
    : null;

  return {
    save: analysed.length > 0,
    result: {
      diagnosis: analysed.length === 0
        ? 'Not Analysed'
        : requested > 1
          ? `Multi-Scan Radiology Assessment (${analysed.length}/${requested})`
          : 'AI Radiology Assessment',
      confidence,
      details: combined + failureNote,
      scanSections,
      recommendations: analysed.length === 0 ? [] : [
        'Review findings with a licensed radiologist.',
        'Cross-reference with patient medical history and clinical presentation.',
        requested > 1 ? 'Compare findings across all submitted scans for temporal trends.' : 'Follow up as indicated by urgency level.',
      ],
    },
  };
}

/** The history record the Node API stores for a finished analysis. */
export function toPrediction(type: 'symptom' | 'image' | 'report', result: AnalysisResult) {
  return { type, ...result, confidence: result.confidence ?? 0 };
}
