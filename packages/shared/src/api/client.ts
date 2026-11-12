// The Node API (default port 5001). Every request, including AI analysis,
// goes through it; the Python AI service is never called from a client.
//
// Platform-neutral: the website and the phone app each call configureApi() once, with their own API address and
// their own token store (localStorage on the web, the Keychain or Keystore on a phone, which is async).
export interface ApiConfig {
  baseUrl: string;
  /** The signed-in user's token, or null. */
  getToken: () => string | null | Promise<string | null>;
}

let config: ApiConfig = { baseUrl: 'http://localhost:5001', getToken: () => null };

export const configureApi = (next: Partial<ApiConfig>) => { config = { ...config, ...next }; };

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await config.getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders()),
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

/** multipart POST (uploads). The runtime sets the boundary, so no Content-Type here. */
export async function postForm<T>(endpoint: string, body: FormData): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${config.baseUrl}${endpoint}`, { method: 'POST', headers: (await getAuthHeaders()) as HeadersInit, body });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.error || `HTTP ${response.status}` };
    }
    return { data: await response.json() };
  } catch {
    return { error: 'Network error. Please check your connection.' };
  }
}
