import { test, expect, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { newUser, signUp, errorsOf, type TestUser } from './helpers';
import { E2E } from '../playwright.config';

/* Settings controls that used to do nothing, and a promise the website made without keeping it, are real now. */

test.describe.configure({ mode: 'serial' });
let page: Page;
let user: TestUser;

test.beforeAll(async ({ browser }) => {
  page = await (await browser.newContext()).newPage();
  user = await signUp(page, newUser('golive'));
  await page.getByRole('button', { name: 'Settings', exact: true }).first().click();
});
test.afterAll(async () => { await page.context().close(); });

const nav = (name: string) => page.getByRole('button', { name, exact: true }).first().click();
const nameInDatabase = (email: string) => execFileSync('mongosh', ['--quiet', E2E.mongo, '--eval', `print(db.users.findOne({ email: ${JSON.stringify(email)} }).name)`], { encoding: 'utf8' }).trim();

test('the name can be changed: saved on the server and shown in the header', async () => {
  const save = page.getByRole('button', { name: 'Save name' });
  await expect(save, 'nothing to save yet').toBeDisabled();
  await page.getByLabel('Full Name / Handle').fill('Asha Rao');
  await save.click();
  await expect(page.getByText('Name updated.')).toBeVisible();
  await expect(page.locator('header')).toContainText('Asha');
  expect(nameInDatabase(user.email)).toBe('Asha Rao');
  await page.reload();
  await expect(page.locator('header')).toContainText('Asha');
});

test('the password can be changed: a wrong current password is refused, the new one signs in, the old one does not', async () => {
  await nav('Settings');
  const update = page.getByRole('button', { name: 'Update password' });
  await expect(update).toBeDisabled();
  await page.getByLabel('Current Password').fill('not-my-password');
  await page.getByLabel('New Password').fill('A-new-Passw0rd!');
  await update.click();
  await expect(page.getByText('The current password is not right.')).toBeVisible();

  await page.getByLabel('Current Password').fill(user.password);
  await update.click();
  await expect(page.getByText(/Password updated/)).toBeVisible();
  const signIn = (password: string) => page.request.post(`${E2E.api}/login`, { data: { email: user.email, password } });
  expect((await signIn(user.password)).status(), 'the old password').toBe(400);
  expect((await signIn('A-new-Passw0rd!')).status(), 'the new password').toBe(200);
});

test('the wearable card says the readings are demo data, and no longer claims an Apple Watch', async () => {
  await expect(page.getByText(/these numbers are generated on this page, not read from a watch/)).toBeVisible();
  await expect(page.getByText('NO DATA').first(), 'the pill, then one per tile').toBeVisible();
  await page.getByRole('button', { name: 'Generate demo readings' }).click();
  await expect(page.getByText('DEMO DATA')).toBeVisible();
  await expect(page.getByText(/not real measurements/)).toBeVisible();
  await expect(page.getByText(/Force Resync|LIVE SYNCED|Apple Watch biometric pipeline/)).toHaveCount(0);
});

test('Auto-Alerts: an emergency result offers Call and Message for each contact; with the switch off, nothing appears', async () => {
  // One contact, then the switch (the first switch on the page; the others are in Localization).
  await page.getByRole('button', { name: 'Add Contact' }).click();
  await page.getByPlaceholder('e.g. Dr. Jane Smith').fill('Jane Smith');
  await page.getByPlaceholder('e.g. Mother, Cardiologist').fill('Sister');
  await page.getByPlaceholder('+1 (555) 000-0000').fill('+1 (555) 010-0100');
  await page.getByRole('button', { name: 'Add Contact' }).click();
  await expect(page.getByText('Jane Smith')).toBeVisible();
  const alerts = page.getByRole('switch').first();
  await alerts.click();
  await expect(alerts).toHaveAttribute('aria-checked', 'true');

  const analyse = async () => {
    await nav('Analyze');
    await page.getByRole('tab', { name: 'Symptoms' }).click();
    if (!(await page.getByText('✦ e2e-emergency chest pain').count())) {
      await page.getByPlaceholder(/pressure behind eyes/).fill('e2e-emergency chest pain');
      await page.getByPlaceholder(/pressure behind eyes/).press('Enter');
    }
    await page.getByRole('button', { name: 'Analyze Symptoms' }).click();
    await expect(page.getByText(/this looks like an emergency/)).toBeVisible({ timeout: 20_000 });
  };

  await analyse();
  const panel = page.getByTestId('emergency-panel');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('This result is marked EMERGENCY');
  await expect(panel).toContainText('Jane Smith');
  await expect(panel.locator('a[href="tel:+15550100100"]')).toHaveText(/Call/);
  await expect(panel.locator('a[href^="sms:+15550100100&body="]')).toHaveText(/Message/);

  await nav('Settings');
  await alerts.click();
  await expect(alerts).toHaveAttribute('aria-checked', 'false');
  await analyse();
  await expect(page.getByTestId('emergency-panel')).toHaveCount(0);
});

test('no uncaught errors or console errors during the run', async () => {
  expect(errorsOf(page)).toEqual([]);
});
