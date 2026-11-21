import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { E2E } from '../playwright.config';
import { newUser, signUp, logIn, waitForApp, errorsOf } from './helpers';

test.describe.configure({ mode: 'serial' });

const API = E2E.api;
const apiGet = (page: import('@playwright/test').Page, path: string) =>
  page.evaluate(async ([api, p]) => {
    const r = await fetch(`${api}${p}`, { headers: { Authorization: `Bearer ${localStorage.getItem('curasense_token')}` } });
    return r.status;
  }, [API, path]);

test.afterEach(async ({ page }) => { expect(errorsOf(page), 'uncaught/console errors').toEqual([]); });

test('session survives a reload; secure sign out clears it', async ({ page }) => {
  const user = await signUp(page, newUser('session'));
  await page.reload();
  await waitForApp(page);
  expect(await page.evaluate(() => !!localStorage.getItem('curasense_token'))).toBe(true);

  await page.getByRole('button', { name: new RegExp(`^${user.name.slice(0, 3)}`) }).first().click();
  await page.getByRole('button', { name: /Secure Sign Out/ }).click();
  await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('curasense_token'))).toBeNull();
});

test('ordinary users do not see the admin area and the API refuses them', async ({ page }) => {
  await signUp(page, newUser('plain'));
  await expect(page.getByRole('button', { name: 'Overwatch' })).toHaveCount(0);
  expect(await apiGet(page, '/admin/users')).toBe(403);
  expect(await apiGet(page, '/admin/stats')).toBe(403);
});

test('protected API routes refuse requests with no token', async ({ request }) => {
  for (const path of ['/predictions', '/api/user/settings', '/admin/users']) {
    expect((await request.get(`${API}${path}`)).status(), path).toBe(401);
  }
});

test('an admin sees Overwatch with live platform stats and the user list', async ({ page }) => {
  const user = await signUp(page, newUser('admin'));
  await page.evaluate(() => localStorage.clear());
  execFileSync('mongosh', ['--quiet', E2E.mongo, '--eval', `db.users.updateOne({ email: ${JSON.stringify(user.email)} }, { $set: { role: 'admin' } })`], { stdio: 'ignore' });

  await logIn(page, user);
  await page.getByRole('button', { name: 'Overwatch' }).first().click();
  await expect(page.getByText('Identities', { exact: true }).first()).toBeVisible();
  await expect(page.locator('#page-content')).toContainText(user.email, { timeout: 15_000 });
  expect(await apiGet(page, '/admin/stats')).toBe(200);
});
