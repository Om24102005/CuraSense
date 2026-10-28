import { test, expect, type Page } from '@playwright/test';
import { newUser, signUp, errorsOf, expectedErrors } from './helpers';

test.describe.configure({ mode: 'serial' });
let page: Page;

// 1×1 PNG: enough for the gateway's byte-level type check.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

test.beforeAll(async ({ browser }) => {
  page = await (await browser.newContext()).newPage();
  await signUp(page, newUser('analysis'));
});
test.afterAll(async () => { await page.context().close(); });

const goAnalyze = async (tab: 'Symptoms' | 'Scans' | 'Reports') => {
  await page.getByRole('button', { name: 'Analyze', exact: true }).first().click();
  await page.getByRole('tab', { name: tab }).click();
};

test('symptom triage returns a result from the AI gateway', async () => {
  await goAnalyze('Symptoms');
  await page.getByText('Fever', { exact: true }).first().click();
  await page.getByRole('button', { name: 'Analyze Symptoms' }).click();
  await expect(page.getByText(/E2E assessment/)).toBeVisible({ timeout: 20_000 });
});

test('lab report (pasted text) returns a result', async () => {
  await goAnalyze('Reports');
  await page.getByPlaceholder(/Paste your lab report here/).fill('Hemoglobin 13.2 g/dL (12-16)\nWBC 6.1 x10^9/L');
  await page.getByRole('button', { name: 'Analyze Report' }).click();
  await expect(page.getByText(/E2E lab assessment/)).toBeVisible({ timeout: 20_000 });
});

test('image upload returns a result', async () => {
  await goAnalyze('Scans');
  await page.locator('input[type=file]').setInputFiles({ name: 'chest.png', mimeType: 'image/png', buffer: PNG });
  await page.getByRole('button', { name: 'Analyze with AI' }).click();
  await expect(page.getByText(/E2E imaging analysis/)).toBeVisible({ timeout: 20_000 });
});

test('image upload with a disguised non-image is rejected, not analysed', async () => {
  await goAnalyze('Scans');
  await page.getByRole('button', { name: /Clear|Remove/i }).first().click().catch(() => {});
  await page.locator('input[type=file]').setInputFiles({ name: 'fake.png', mimeType: 'image/png', buffer: Buffer.from('MZ not an image at all') });
  await page.getByRole('button', { name: 'Analyze with AI' }).click();
  await expect(page.getByText(/E2E imaging analysis/)).toHaveCount(0);
  await expect(page.locator('text=/Unsupported file type|failed|error|offline/i').first()).toBeVisible({ timeout: 20_000 });
  expectedErrors(page, /All scans failed to analyze/); // the app logs this on purpose
});

test('history lists the saved analyses, they persist server-side, and the dashboard counts them', async () => {
  await page.getByRole('button', { name: 'History', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Analysis History', level: 2 })).toBeVisible();
  await expect(page.locator('#page-content')).toContainText(/Common cold|Hemoglobin|assessment|Symptom|Report/i);

  // Saved in MongoDB through the Node API, not just in local cache.
  const count = await page.evaluate(async (api) => {
    const r = await fetch(`${api}/predictions`, { headers: { Authorization: `Bearer ${localStorage.getItem('curasense_token')}` } });
    return (await r.json()).predictions.length;
  }, 'http://localhost:5101');
  expect(count).toBeGreaterThanOrEqual(3);

  await page.getByRole('button', { name: 'Dashboard', exact: true }).first().click();
  await expect(page.getByText('Total Analyses')).toBeVisible();
  await expect(page.locator('#page-content')).not.toContainText('No analyses yet');
});

test('no uncaught errors or console errors during the run', async () => {
  expect(errorsOf(page)).toEqual([]);
});
