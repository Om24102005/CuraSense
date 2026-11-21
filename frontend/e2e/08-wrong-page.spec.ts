import { test, expect, type Page } from '@playwright/test';
import { newUser, signUp, errorsOf } from './helpers';

/* Each analysis page analyses only its own kind of content. When the AI service refuses a file
   (the fake gateway refuses anything named "wrong-page"), the page shows why and offers the right page. */

test.describe.configure({ mode: 'serial' });
let page: Page;

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

test.beforeAll(async ({ browser }) => {
  page = await (await browser.newContext()).newPage();
  await signUp(page, newUser('wrongpage'));
  await page.getByRole('button', { name: 'Analyze', exact: true }).first().click();
});
test.afterAll(async () => { await page.context().close(); });

test('a file that is not a scan is refused on Scans, with a button to the right page', async () => {
  await page.getByRole('tab', { name: 'Scans' }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'wrong-page.png', mimeType: 'image/png', buffer: PNG });
  await page.getByRole('button', { name: 'Analyze with AI' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Not analysed' })).toBeVisible();
  await expect(page.getByText(/E2E refusal/)).toBeVisible();
  await expect(page.getByText('E2E imaging analysis')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open Reports page' }).click();
  await expect(page.getByPlaceholder(/Paste your lab report here/)).toBeVisible();
});

test('a scan uploaded on Reports is refused, with a button to Scans', async () => {
  await page.getByRole('button', { name: /UPLOAD FILE/ }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'wrong-page.txt', mimeType: 'text/plain', buffer: Buffer.from('CT head without contrast') });
  await page.getByRole('button', { name: 'Analyze Report' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Not analysed' })).toBeVisible();
  await expect(page.getByText('E2E lab assessment')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open Scans page' }).click();
  await expect(page.getByRole('button', { name: 'Analyze with AI' })).toBeVisible();
});

test('DICOM is accepted on Scans, and refused on Reports with a button to Scans', async () => {
  const dicom = Buffer.concat([Buffer.alloc(128), Buffer.from('DICM'), Buffer.alloc(64)]);
  await page.getByRole('tab', { name: 'Scans' }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'ct-head.dcm', mimeType: 'application/dicom', buffer: dicom });
  await expect(page.getByText('ct-head.dcm')).toBeVisible();
  await page.getByRole('button', { name: 'Analyze with AI' }).click();
  await expect(page.getByText(/E2E imaging analysis/)).toBeVisible();

  await page.getByRole('tab', { name: 'Reports' }).click();
  await page.getByRole('button', { name: /UPLOAD FILE/ }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'ct-head.dcm', mimeType: 'application/dicom', buffer: dicom });
  await expect(page.getByRole('alert').filter({ hasText: 'Not analysed' })).toBeVisible();
  await page.getByRole('button', { name: 'Open Scans page' }).click();
  await expect(page.getByRole('button', { name: 'Analyze with AI' })).toBeVisible();
});

test('a ZIP of a whole study is accepted on Scans, and the body regions of the selected study go with it', async () => {
  await page.getByRole('tab', { name: 'Reports' }).click(); // leaving the tab clears the file list
  await page.getByRole('tab', { name: 'Scans' }).click();
  const zip = Buffer.concat([Buffer.from('PK\x03\x04'), Buffer.alloc(64)]);
  await page.locator('input[type=file]').setInputFiles({ name: 'study.zip', mimeType: 'application/zip', buffer: zip });
  await expect(page.getByText('study.zip')).toBeVisible();
  await page.getByRole('button', { name: 'Analyze with AI' }).click();
  await expect(page.getByText(/E2E imaging analysis/)).toBeVisible();
  const sent = await (await fetch('http://localhost:8101/_last-imaging')).json(); // what reached the AI service, through Node
  expect(sent).toMatchObject({ scan_type: 'xray', regions: 'chest' });             // the default study is Chest X-Ray
});

test('text that is not symptoms is refused on Symptoms', async () => {
  await page.getByRole('tab', { name: 'Symptoms' }).click();
  await page.getByPlaceholder(/pressure behind eyes/).fill('wrong-page lab values');
  await page.getByPlaceholder(/pressure behind eyes/).press('Enter');
  await page.getByRole('button', { name: 'Analyze Symptoms' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Not analysed' })).toBeVisible();
  await expect(page.getByText(/E2E assessment/)).toHaveCount(0);
});

test('no uncaught errors or console errors during the run', async () => {
  expect(errorsOf(page)).toEqual([]);
});
