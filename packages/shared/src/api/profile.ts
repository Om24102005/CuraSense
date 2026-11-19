import { fetchAPI } from './client';

/** Change the signed-in user's display name. The email is the account's identity and cannot be changed. */
export async function updateProfile(name: string) {
  return fetchAPI<{ user: { id: string; name: string; email: string; role: string } }>('/api/user/profile', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

/** Change the signed-in user's password; the server checks the current one. */
export async function changePassword(currentPassword: string, newPassword: string) {
  return fetchAPI<{ success: boolean }>('/api/user/password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
