import { fetchAPI } from './client';

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
