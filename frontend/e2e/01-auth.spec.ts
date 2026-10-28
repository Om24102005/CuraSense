import { test, expect } from '@playwright/test';
import { newUser, signUp, logIn, totp, waitForApp, errorsOf } from './helpers';

test.describe.configure({ mode: 'serial' });
let user = newUser('auth');

test.afterEach(async ({ page }) => { expect(errorsOf(page), 'uncaught/console errors').toEqual([]); });

test('sign up → 2FA setup lands on the dashboard', async ({ page }) => {
  user = await signUp(page, user);
  await expect(page.getByRole('heading', { name: /Welcome Back/ })).toBeVisible();
  expect(await page.evaluate(() => !!localStorage.getItem('curasense_token'))).toBe(true);
});

test('login requires the 2FA code', async ({ page }) => {
  await logIn(page, user);
  await expect(page.getByRole('heading', { name: /Welcome Back/ })).toBeVisible();
});

test('wrong password shows an error and no token', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in' }).first().click();
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill('definitely-wrong');
  await page.locator('form').getByRole('button', { name: /Sign in/ }).click();
  await expect(page.locator('text=/invalid|incorrect|wrong|failed/i').first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('curasense_token'))).toBeNull();
});

test('wrong 2FA code is rejected', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in' }).first().click();
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.locator('form').getByRole('button', { name: /Sign in/ }).click();
  await expect(page.getByText('Enter your 6-digit code')).toBeVisible();
  const good = totp(user.secret!);
  await page.getByPlaceholder('123 456').fill(good === '000000' ? '111111' : '000000');
  await page.getByRole('button', { name: /Verify & sign in/ }).click();
  await expect(page.locator('text=/invalid|incorrect|expired|failed/i').first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('curasense_token'))).toBeNull();
});

test('password reset: request → code → new password → login works', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in' }).first().click();
  await page.getByRole('button', { name: 'Forgot password?' }).click();
  await page.getByPlaceholder('Registered Email').fill(user.email);
  await page.getByRole('button', { name: /Send Code/ }).click();
  await expect(page.getByText('YOUR RESET CODE')).toBeVisible();
  const code = (await page.getByText('YOUR RESET CODE').locator('xpath=following-sibling::div[1]').innerText()).trim();
  await page.getByPlaceholder('6-digit code from email').fill(code);
  await page.getByRole('button', { name: /Verify Code/ }).click();
  const next = 'E2e-NewPassw0rd!';
  await page.getByPlaceholder('New Password (min 6)').fill(next);
  await page.getByPlaceholder('Confirm Password').fill(next);
  await page.getByRole('button', { name: /Reset Password/ }).click();
  await expect(page.getByText('PASSWORD UPDATED', { exact: true })).toBeVisible();
  user = { ...user, password: next };
  await logIn(page, user);
  await waitForApp(page);
});
