import { test, expect, type Page } from '@playwright/test';
import { newUser, signUp, errorsOf } from './helpers';

test.describe.configure({ mode: 'serial' });
let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await (await browser.newContext()).newPage();
  await signUp(page, newUser('booking'));
});
test.afterAll(async () => { await page.context().close(); });

const nav = (name: string) => page.getByRole('button', { name, exact: true }).first().click();

test('consultation booking: doctor → mode → slot → confirm', async () => {
  await nav('Book Appointment');
  await page.getByRole('button', { name: /SKIP & CONTINUE/ }).click();
  await page.getByText('Dr. Sarah Chen').first().click();
  await page.getByRole('button', { name: 'CONTINUE' }).click();
  await page.getByText('Online', { exact: true }).click();
  await page.getByRole('button', { name: 'CONTINUE' }).click();
  // First date tile, then first free slot.
  await page.locator('#page-content [data-lenis-prevent] > div').first().click();
  await page.getByText('09:00 AM', { exact: true }).click();
  await page.getByRole('button', { name: 'CONTINUE' }).click();
  await page.getByRole('button', { name: 'CONFIRM BOOKING' }).click();
  await expect(page.getByText('Booking Confirmed!')).toBeVisible({ timeout: 15_000 });
  // Baseline: bookings live in localStorage only (no backend endpoint exists yet).
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('curasense_bookings') || '[]'));
  expect(stored).toHaveLength(1);
});

test('view booking details shows the confirmed booking', async () => {
  await page.getByRole('button', { name: /View Booking Details/ }).click();
  await expect(page.locator('#page-content')).toContainText(/CONFIRMED/);
  await expect(page.locator('#page-content')).toContainText('Dr. Sarah Chen');
});

test('settings: a saved preference is stored on the server', async () => {
  await nav('Settings');
  await expect(page.getByRole('heading', { name: /Settings/ }).first()).toBeVisible();
  await page.getByRole('button', { name: /Imperial System/ }).click();
  await page.getByRole('button', { name: 'Save Settings' }).click();
  // Persisted through PATCH /api/user/settings, readable straight from the API.
  await expect.poll(async () => page.evaluate(async (api) => {
    const r = await fetch(`${api}/api/user/settings`, { headers: { Authorization: `Bearer ${localStorage.getItem('curasense_token')}` } });
    return JSON.stringify((await r.json()).settings || {});
  }, 'http://localhost:5101')).toMatch(/imperial/i);
});

test('wearable sync endpoint reports status for a logged-in user', async () => {
  const status = await page.evaluate(async (api) => {
    const r = await fetch(`${api}/api/wearables/apple-health/status`, { headers: { Authorization: `Bearer ${localStorage.getItem('curasense_token')}` } });
    return r.status;
  }, 'http://localhost:5101');
  expect(status).toBe(200);
});

test('no uncaught errors or console errors during the run', async () => {
  expect(errorsOf(page)).toEqual([]);
});
