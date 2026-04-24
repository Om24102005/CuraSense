import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c2454f2e`;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`API Error (${endpoint}):`, error);
      return { error: error.error || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(`Network Error (${endpoint}):`, error);
    return { error: 'Network error. Please check your connection.' };
  }
}

// Symptom Analysis
export async function analyzeSymptoms(symptoms: string[]) {
  return fetchAPI('/analyze-symptoms', {
    method: 'POST',
    body: JSON.stringify({ symptoms }),
  });
}

// Image Analysis
export async function analyzeImage(imageType: string, imageData: string) {
  return fetchAPI('/analyze-image', {
    method: 'POST',
    body: JSON.stringify({ imageType, imageData }),
  });
}

// Report Analysis
export async function analyzeReport(reportText: string) {
  return fetchAPI('/analyze-report', {
    method: 'POST',
    body: JSON.stringify({ reportText }),
  });
}

// Save Prediction
export async function savePrediction(prediction: any) {
  return fetchAPI('/save-prediction', {
    method: 'POST',
    body: JSON.stringify(prediction),
  });
}

// Get All Predictions
export async function getPredictions() {
  return fetchAPI<{ predictions: any[] }>('/predictions', {
    method: 'GET',
  });
}

// Delete Prediction
export async function deletePrediction(id: string) {
  return fetchAPI(`/predictions/${id}`, {
    method: 'DELETE',
  });
}

// Sign Up
export async function signUp(email: string, password: string, name: string) {
  return fetchAPI('/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

// Health Check
export async function healthCheck() {
  return fetchAPI('/health', {
    method: 'GET',
  });
}