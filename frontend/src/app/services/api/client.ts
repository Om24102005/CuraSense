// The Node API (default port 5001). Every request, including AI analysis,
// goes through it; the Python AI service is never called from the browser.
const API_BASE_URL = import.meta.env.VITE_NODE_BASE_URL || 'http://localhost:5001';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('curasense_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function fetchAPI<T>(
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

/** multipart POST (uploads). The browser sets the boundary, so no Content-Type here. */
export async function postForm<T>(endpoint: string, body: FormData): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', headers: getAuthHeaders() as HeadersInit, body });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.error || `HTTP ${response.status}` };
    }
    return { data: await response.json() };
  } catch {
    return { error: 'Network error. Please check your connection.' };
  }
}
