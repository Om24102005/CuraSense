import { fetchAPI } from './client';

export async function login(credentials: any) {
  return fetchAPI<{ token?: string; user?: any; requiresTotp?: boolean; totpToken?: string; requiresTotpSetup?: boolean; setupToken?: string }>('/login', {
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
