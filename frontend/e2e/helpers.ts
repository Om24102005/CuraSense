import { expect, type APIRequestContext, type Page } from '@playwright/test';
import { authenticator } from 'otplib';
import { E2E } from '../playwright.config';

/** Uncaught page errors and console errors seen per page. Expected HTTP 4xx noise from negative tests is filtered. */
const seen = new WeakMap<Page, string[]>();
export function trackErrors(page: Page) {
  if (seen.has(page)) return;
  const errs: string[] = [];
  seen.set(page, errs);
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/Failed to load resource/.test(t)) return;
    errs.push(`console.error: ${t.slice(0, 200)}`);
  });
}
/** Drop errors a test deliberately provokes (so they are not mistaken for regressions). */
export function expectedErrors(page: Page, re: RegExp) {
  const errs = seen.get(page);
  if (errs) for (let i = errs.length - 1; i >= 0; i--) if (re.test(errs[i])) errs.splice(i, 1);
}
export const errorsOf = (page: Page) => seen.get(page) ?? [];

export interface TestUser { name: string; email: string; password: string; secret?: string }

export const newUser = (tag = 'user'): TestUser => ({
  name: `E2E ${tag}`, email: `e2e-${tag}-${Date.now()}@example.com`, password: 'E2e-Passw0rd!',
});

export const totp = (secret: string) => authenticator.generate(secret);

/** Type a 6-digit code into the six code boxes. The sixth digit submits by itself, so there is no Verify click to make. */
export const fillCode = (page: Page, code: string) => page.getByLabel('6-digit code').fill(code);

/** Paste text into the focused code boxes the way a browser does: one paste event carrying the clipboard text. */
export const pasteCode = (page: Page, text: string) => page.getByLabel('6-digit code').evaluate((el, t) => {
  (el as HTMLInputElement).focus();
  const data = new DataTransfer();
  data.setData('text/plain', t);
  el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
}, text);

/** Wait for the boot/intro overlays to clear: the nav only becomes usable after them. */
export async function waitForApp(page: Page) {
  await expect(page.getByRole('button', { name: 'Dashboard' }).first()).toBeVisible({ timeout: 20_000 });
}

/** Sign up through the UI, finishing 2FA setup. Returns the user with its TOTP secret. */
export async function signUp(page: Page, user: TestUser, openForm?: () => Promise<void>): Promise<TestUser> {
  trackErrors(page);
  await page.goto('/');
  await (openForm ? openForm() : page.getByRole('button', { name: 'Sign up' }).click());
  await page.getByPlaceholder('Full name').fill(user.name);
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder(/^Password/).fill(user.password);
  await page.getByRole('button', { name: /Continue/ }).click();

  await expect(page.getByText('Scan with Google Authenticator')).toBeVisible();
  const key = page.getByText(/Can't scan/).locator('xpath=following-sibling::button');
  const secret = ((await key.innerText()) || '').replace(/[^A-Z2-7]/gi, '').toUpperCase();
  expect(secret.length).toBeGreaterThanOrEqual(16);

  await fillCode(page, totp(secret));
  await waitForApp(page);
  return { ...user, secret };
}

/** Log in through the UI with email, password and the 2FA code. */
export async function logIn(page: Page, user: TestUser) {
  trackErrors(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in' }).first().click();
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.locator('form').getByRole('button', { name: /Sign in/ }).click();
  await expect(page.getByText('Enter your 6-digit code')).toBeVisible();
  await fillCode(page, totp(user.secret!));
  await waitForApp(page);
}

/** A signed-in session made straight through the API (sign up, authenticator setup, first code), for tests that are not about signing in. */
export async function apiSession(request: APIRequestContext, tag = 'api') {
  const user = newUser(tag);
  const reg = await (await request.post(`${E2E.api}/register`, { data: { name: user.name, email: user.email, password: user.password } })).json();
  const bearer = { Authorization: `Bearer ${reg.setupToken}` };
  const setup = await (await request.post(`${E2E.api}/totp-setup`, { headers: bearer })).json();
  const done = await (await request.post(`${E2E.api}/totp-verify`, { headers: bearer, data: { code: totp(setup.manualSecret) } })).json();
  expect(done.token, 'the API gave a session').toBeTruthy();
  return { token: done.token as string, user: done.user };
}

/** Put a session in the browser before the first page load, and skip the first-visit intro. Only the first load: a later reload
 *  (signing out reloads the page) must not bring the session back. */
export const signedInAs = (page: Page, s: { token: string; user: unknown }) =>
  page.addInitScript(([t, u]) => {
    if (sessionStorage.getItem('e2e_seeded')) return;
    sessionStorage.setItem('e2e_seeded', '1');
    localStorage.setItem('curasense_token', t as string); localStorage.setItem('curasense_user', JSON.stringify(u)); sessionStorage.setItem('cs_booted', '1');
  }, [s.token, s.user]);
