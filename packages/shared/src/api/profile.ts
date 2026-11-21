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
  return fetchAPI<{ success: boolean; token?: string }>('/api/user/password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/** Permanently delete the signed-in account and its saved analyses. */
export async function deleteAccount(password: string, code: string) {
  return fetchAPI<{ success: boolean }>('/api/user/delete-account', {
    method: 'POST',
    body: JSON.stringify({ password, code }),
  });
}

/** Whether this account has agreed to the current privacy notice. */
export async function getConsent() {
  return fetchAPI<{ accepted: boolean; version: string }>('/api/user/consent');
}

export async function giveConsent() {
  return fetchAPI<{ accepted: boolean; version: string }>('/api/user/consent', {
    method: 'POST',
    body: JSON.stringify({ accepted: true }),
  });
}
