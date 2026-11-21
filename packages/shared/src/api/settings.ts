import { fetchAPI } from './client';

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
