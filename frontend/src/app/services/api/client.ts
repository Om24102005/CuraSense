// Default to the Node API port (5001). The Python AI service runs on
// 8000 and is reached via VITE_API_BASE_URL, NOT this constant.
const API_BASE_URL = import.meta.env.VITE_NODE_BASE_URL || 'http://localhost:5001';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const getAuthHeaders = () => {
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
