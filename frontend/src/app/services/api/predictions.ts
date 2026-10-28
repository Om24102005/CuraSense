import { fetchAPI } from './client';

// ── Analysis ──────────────────────────────────────────────────────────────────

export async function analyzeSymptoms(symptoms: string[]) {
  return fetchAPI('/analyze-symptoms', { method: 'POST', body: JSON.stringify({ symptoms }) });
}

export async function analyzeImage(imageType: string, imageData: string) {
  return fetchAPI('/analyze-image', { method: 'POST', body: JSON.stringify({ imageType, imageData }) });
}

export async function analyzeReport(reportText: string) {
  return fetchAPI('/analyze-report', { method: 'POST', body: JSON.stringify({ reportText }) });
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
