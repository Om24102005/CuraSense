// Default to the Node API port (5001). The Python AI service runs on
// 8000 and is reached via VITE_API_BASE_URL, NOT this constant.
const API_BASE_URL = import.meta.env.VITE_NODE_BASE_URL || 'http://localhost:5001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('curasense_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      } as HeadersInit,
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch {
    return { error: 'Network error. Please check your connection.' };
  }
}

export async function login(credentials: any) {
  return fetchAPI<{ token?: string; user?: any; requiresTotp?: boolean; totpToken?: string }>('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(userData: any) {
  return fetchAPI<{ setupToken?: string; requiresTotpSetup?: boolean; user?: any }>('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// ── 2FA (Google Authenticator / TOTP) ────────────────────────────────────────

export async function totpSetup(setupToken: string) {
  return fetchAPI<{ qrDataUrl: string; otpauthUrl: string; manualSecret: string; issuer: string; account: string }>(
    '/totp-setup',
    { method: 'POST', headers: { Authorization: `Bearer ${setupToken}` } }
  );
}

export async function totpVerify(setupToken: string, code: string) {
  return fetchAPI<{ token: string; user: any }>('/totp-verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${setupToken}` },
    body: JSON.stringify({ code }),
  });
}

export async function loginTotp(totpToken: string, code: string) {
  return fetchAPI<{ token: string; user: any }>('/login-totp', {
    method: 'POST',
    headers: { Authorization: `Bearer ${totpToken}` },
    body: JSON.stringify({ code }),
  });
}

// ── Password Reset ────────────────────────────────────────────────────────────

export async function forgotPassword(email: string) {
  return fetchAPI('/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function verifyResetCode(email: string, code: string) {
  return fetchAPI<{ valid: boolean; email: string }>('/verify-reset-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export async function resetPassword(email: string, code: string, password: string) {
  return fetchAPI<{ success: boolean; message: string }>('/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, code, password }),
  });
}

export async function resetPasswordWithToken(token: string, password: string) {
  return fetchAPI<{ success: boolean; message: string }>('/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

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

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAdminStats() {
  return fetchAPI<any>('/admin/stats', { method: 'GET' });
}

export async function getAdminUsers() {
  return fetchAPI<any>('/admin/users', { method: 'GET' });
}

export async function deleteAdminUser(id: string) {
  return fetchAPI(`/admin/users/${id}`, { method: 'DELETE' });
}

export async function getAdminPredictions() {
  return fetchAPI<any>('/admin/predictions', { method: 'GET' });
}

// ── User Settings ─────────────────────────────────────────────────────────────

/** Fetch the authenticated user's complete settings object from MongoDB. */
export async function getUserSettings() {
  return fetchAPI<{ settings: any }>('/api/user/settings', { method: 'GET' });
}

/**
 * Partially update the authenticated user's settings.
 * Only the provided sections are updated — other sections are untouched.
 */
export async function updateUserSettings(payload: any) {
  return fetchAPI<{ settings: any }>('/api/user/settings', {
    method: 'PATCH',
    body: JSON.stringify({ settings: payload }),
  });
}

// ── Wearable / Apple Health ───────────────────────────────────────────────────

export interface WearableData {
  restingHeartRate:     number | null;
  heartRateVariability: number | null;
  sleepDuration:        number | null;
  bloodOxygenAverage:   number | null;
  lastSyncedAt:         string | null;
}

export interface WearableSyncPayload {
  restingHeartRate?:     number;
  heartRateVariability?: number;
  sleepDuration?:        number;
  bloodOxygenAverage?:   number;
}

/**
 * Fetch the current wearable sync state and biometric data for the
 * authenticated user from MongoDB.
 */
export async function getWearableStatus() {
  return fetchAPI<{ wearableData: WearableData | null }>(
    '/api/wearables/apple-health/status',
    { method: 'GET' }
  );
}

/**
 * Post a biometric payload to the Apple Health sync endpoint.
 * In production this is called by the health aggregator webhook.
 * The Force Resync button triggers this to demonstrate the full pipeline.
 */
export async function syncAppleHealth(payload: WearableSyncPayload) {
  return fetchAPI<{ success: boolean; wearableData: WearableData }>(
    '/api/wearables/apple-health/sync',
    { method: 'POST', body: JSON.stringify(payload) }
  );
}

// ── Health ────────────────────────────────────────────────────────────────────

export async function healthCheck() {
  return fetchAPI('/health', { method: 'GET' });
}
