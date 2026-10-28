import { fetchAPI, postForm } from './client';

// ── Analysis ──────────────────────────────────────────────────────────────────

/* All AI calls go through the Node gateway, which holds the gateway secret
   and applies per-user rate limits and upload validation. Responses keep the
   Python gateway's shape ({ status, analysis } / { status, vision_analysis }). */

export async function analyzeSymptoms(symptoms: string | string[]) {
  return fetchAPI<any>('/analyze-symptoms', { method: 'POST', body: JSON.stringify({ symptoms }) });
}

export async function analyzeImage(file: File, scanType: string) {
  const fd = new FormData();
  fd.append('scan_type', scanType);
  fd.append('file', file);
  return postForm<any>('/analyze-image', fd);
}

export async function analyzeReportText(reportText: string) {
  return fetchAPI<any>('/analyze-report', { method: 'POST', body: JSON.stringify({ reportText }) });
}

export async function analyzeReportFile(file: File) {
  const fd = new FormData();
  fd.append('file', file);
  return postForm<any>('/analyze-report', fd);
}

// ── Predictions ───────────────────────────────────────────────────────────────

export async function savePrediction(prediction: any) {
  return fetchAPI('/save-prediction', { method: 'POST', body: JSON.stringify(prediction) });
}

export async function getPredictions() {
  return fetchAPI<{ predictions: any[] }>('/predictions', { method: 'GET' });
}

export async function deletePrediction(id: string) {
  return fetchAPI(`/predictions/${id}`, { method: 'DELETE' });
}
