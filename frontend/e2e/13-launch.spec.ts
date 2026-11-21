import { test, expect } from '@playwright/test';
import { E2E } from '../playwright.config';
import { errorsOf, newUser, signedInAs, totp, trackErrors } from './helpers';

/* What a public launch adds: the privacy notice, consent before the first analysis, and deleting your own account. */

const newSession = async (request: Parameters<typeof import('./helpers').apiSession>[0]) => {
  const user = newUser('launch');
  const reg = await (await request.post(`${E2E.api}/register`, { data: { name: user.name, email: user.email, password: user.password } })).json();
  const bearer = { Authorization: `Bearer ${reg.setupToken}` };
  const setup = await (await request.post(`${E2E.api}/totp-setup`, { headers: bearer })).json();
  const done = await (await request.post(`${E2E.api}/totp-verify`, { headers: bearer, data: { code: totp(setup.manualSecret) } })).json();
  return { token: done.token as string, user: done.user, password: user.password, secret: setup.manualSecret as string };
};

test('the privacy notice is public, names the operator, and names no AI vendor or model', async ({ page }) => {
  trackErrors(page);
  await page.addInitScript(() => sessionStorage.setItem('cs_booted', '1'));
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: 'Privacy notice' })).toBeVisible();
  const text = await page.locator('.legal').innerText();
  expect(text).toContain('Omendar Singh');
  expect(text).toMatch(/third-party AI service provider/);
  expect(text).toMatch(/outside your country/);
  expect(text).not.toMatch(/deepseek|mistral|groq|llama|pixtral|hugging ?face|openai|gpt|claude|gemini/i);
  expect(errorsOf(page)).toEqual([]);
});

test('the tools stay behind consent until it is given, and it is remembered', async ({ page, request }) => {
  trackErrors(page);
  const s = await newSession(request);
  await signedInAs(page, s);
  await page.goto('/');
  await page.getByRole('button', { name: 'Analyze', exact: true }).first().click();
  const gate = page.locator('[data-consent]');
  await expect(gate).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Symptoms' })).toHaveCount(0);
  const go = gate.getByRole('button', { name: 'Agree and continue' });
  await expect(go).toBeDisabled();
  await gate.getByRole('checkbox').check();
  await go.click();
  await expect(page.getByRole('tab', { name: 'Symptoms' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Analyze', exact: true }).first().click();
  await expect(page.getByRole('tab', { name: 'Symptoms' })).toBeVisible();
  await expect(gate).toHaveCount(0);
});

test('an account can be deleted with the password and code: signed out, and it can no longer sign in', async ({ page, request }) => {
  trackErrors(page);
  const s = await newSession(request);
  await signedInAs(page, s);
  await page.goto('/');
  await page.locator('[data-nav-id="settings"]').click();
  await page.getByRole('button', { name: 'Delete my account' }).click();
  await page.getByLabel('Password to confirm').fill('wrong-password');
  await page.getByLabel('Authenticator code').fill('000000');
  await page.getByRole('button', { name: 'Delete permanently' }).click();
  await expect(page.getByText('The password is not right.')).toBeVisible();

  await page.getByLabel('Password to confirm').fill(s.password);
  await page.getByLabel('Authenticator code').fill(totp(s.secret));
  await page.getByRole('button', { name: 'Delete permanently' }).click();
  await expect(page.getByRole('button', { name: 'Sign up' }).first()).toBeVisible({ timeout: 20_000 });
  expect(await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('curasense_pred_') || k === 'curasense_token'))).toEqual([]);
  const login = await request.post(`${E2E.api}/login`, { data: { email: s.user.email, password: s.password } });
  expect(login.status()).toBe(400);
});

test('a session that the server has ended signs the page out', async ({ page, request }) => {
  const s = await newSession(request);
  await request.post(`${E2E.api}/api/user/password`, { headers: { Authorization: `Bearer ${s.token}` }, data: { currentPassword: s.password, newPassword: 'E2e-Another-Pass1!' } });
  await signedInAs(page, s);
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Sign up' }).first()).toBeVisible({ timeout: 20_000 });
  expect(await page.evaluate(() => localStorage.getItem('curasense_token'))).toBeNull();
});
