const API_BASE_URL = 'http://localhost:5000';

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
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: 'Network error. Please check your connection.' };
  }
}

export async function login(credentials: any) {
  return fetchAPI('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(userData: any) {
  return fetchAPI('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function forgotPassword(email: string) {
  return fetchAPI('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function analyzeSymptoms(symptoms: string[]) {
  return fetchAPI('/analyze-symptoms', {
    method: 'POST',
    body: JSON.stringify({ symptoms }),
  });
}

export async function analyzeImage(imageType: string, imageData: string) {
  return fetchAPI('/analyze-image', {
    method: 'POST',
    body: JSON.stringify({ imageType, imageData }),
  });
}

export async function analyzeReport(reportText: string) {
  return fetchAPI('/analyze-report', {
    method: 'POST',
    body: JSON.stringify({ reportText }),
  });
}

export async function savePrediction(prediction: any) {
  return fetchAPI('/save-prediction', {
    method: 'POST',
    body: JSON.stringify(prediction),
  });
}

export async function getPredictions() {
  return fetchAPI<{ predictions: any[] }>('/predictions', {
    method: 'GET',
  });
}

export async function deletePrediction(id: string) {
  return fetchAPI(`/predictions/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminStats() {
  return fetchAPI<any>('/admin/stats', {
    method: 'GET',
  });
}

export async function getAdminUsers() {
  return fetchAPI<any>('/admin/users', {
    method: 'GET',
  });
}

export async function deleteAdminUser(id: string) {
  return fetchAPI(`/admin/users/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminPredictions() {
  return fetchAPI<any>('/admin/predictions', {
    method: 'GET',
  });
}

export async function healthCheck() {
  return fetchAPI('/health', {
    method: 'GET',
  });
}