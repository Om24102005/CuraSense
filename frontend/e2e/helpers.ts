import { expect, type Page } from '@playwright/test';
import { authenticator } from 'otplib';

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

/** Wait for the boot/intro overlays to clear: the nav only becomes usable after them. */
export async function waitForApp(page: Page) {
  await expect(page.getByRole('button', { name: 'Dashboard' }).first()).toBeVisible({ timeout: 20_000 });
}

/** Sign up through the UI, finishing 2FA setup. Returns the user with its TOTP secret. */
export async function signUp(page: Page, user: TestUser): Promise<TestUser> {
  trackErrors(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Create an account' }).click();
  await page.getByPlaceholder('Full name').fill(user.name);
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder(/^Password/).fill(user.password);
  await page.getByRole('button', { name: /Continue/ }).click();

  await expect(page.getByText('Scan with Google Authenticator')).toBeVisible();
  const key = page.getByText(/Can't scan/).locator('xpath=following-sibling::button');
  const secret = ((await key.innerText()) || '').replace(/[^A-Z2-7]/gi, '').toUpperCase();
  expect(secret.length).toBeGreaterThanOrEqual(16);

  await page.getByPlaceholder('123 456').fill(totp(secret));
  await page.getByRole('button', { name: /Verify & finish sign-up/ }).click();
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
  await page.getByPlaceholder('123 456').fill(totp(user.secret!));
  await page.getByRole('button', { name: /Verify & sign in/ }).click();
  await waitForApp(page);
}
