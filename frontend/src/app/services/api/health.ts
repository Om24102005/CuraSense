import { fetchAPI } from './client';

export async function healthCheck() {
  return fetchAPI('/health', { method: 'GET' });
}
