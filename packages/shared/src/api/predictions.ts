import { fetchAPI, postForm } from './client';

// ── Analysis ──────────────────────────────────────────────────────────────────

/* All AI calls go through the Node gateway, which holds the gateway secret
   and applies per-user rate limits and upload validation. Responses keep the
   Python gateway's shape ({ status, analysis } / { status, vision_analysis }). */

/** A file to upload: a browser File, or on a phone the { uri, name, type } the picker returns (React Native's FormData reads the file from the uri). */
export type UploadFile = File | { uri: string; name: string; type: string };

export async function analyzeSymptoms(symptoms: string | string[]) {
  return fetchAPI<any>('/analyze-symptoms', { method: 'POST', body: JSON.stringify({ symptoms }) });
}

/** scanType is the modality (xray, ct, mri, ...); study is the full name the user picked; regions the body regions it covers. */
export async function analyzeImage(file: UploadFile, scanType: string, study = '', context = '', regions = '') {
  const fd = new FormData();
  fd.append('scan_type', scanType);
  fd.append('study', study);
  fd.append('regions', regions);
  fd.append('context', context);
  fd.append('file', file as Blob);
  return postForm<any>('/analyze-image', fd);
}

export async function analyzeReportText(reportText: string, context = '') {
  return fetchAPI<any>('/analyze-report', { method: 'POST', body: JSON.stringify({ reportText, context }) });
}

export async function analyzeReportFile(file: UploadFile, context = '') {
  const fd = new FormData();
  fd.append('context', context);
  fd.append('file', file as Blob);
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
