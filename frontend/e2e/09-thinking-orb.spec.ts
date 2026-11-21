import { test, expect, type Page } from '@playwright/test';
import { newUser, signUp, waitForApp, errorsOf } from './helpers';

/* While an analysis runs, the loading screen starts as a compact panel and, after a short wait, gives way to a full-screen page
   where the plasma orb glides over the user's own data (a lens), with a clock. The page is gone with the screen when the
   result arrives. Reduced motion, and a page that fails to download, keep the compact panel.
   The fake gateway holds any request that mentions "slow-please" until the test calls /_release, so the test can look
   at the loading screen as long as it needs. */

test.describe.configure({ mode: 'serial' });
let page: Page;

const release = async () => (await (await fetch('http://localhost:8101/_release')).json()).released as number;

test.beforeAll(async ({ browser }) => {
  page = await (await browser.newContext()).newPage();
  await signUp(page, newUser('orb'));
  await page.getByRole('button', { name: 'Analyze', exact: true }).first().click();
  await page.getByRole('tab', { name: 'Reports' }).click();
});
test.afterAll(async () => { await release(); await page.context().close(); });

const analyzeSlowReport = async () => {
  await page.getByPlaceholder(/Paste your lab report here/).fill('slow-please Hemoglobin 13.2 g/dL (12-16)');
  await page.getByRole('button', { name: 'Analyze Report' }).click();
  await expect(page.getByText('REPORT UNDER REVIEW...').first()).toBeVisible();
};

test('a slow analysis shows the reading lens on the loading screen, and it is gone when the result arrives', async () => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await analyzeSlowReport();
  const stage = page.locator('[data-loading-stage]');
  await expect(stage).toBeVisible({ timeout: 15_000 });                       // the scene replaces the compact panel after the short wait
  await expect(stage).toHaveAttribute('data-variant', 'reports');             // the Reports tab's own palette
  await expect(stage.getByText('REPORT UNDER REVIEW...')).toBeVisible();      // the message moves into the scene
  await expect(stage.getByText(/^\d+:\d{2} · /)).toBeVisible();               // and so does the elapsed clock
  await expect(stage.getByText(/Hemoglobin 13\.2/).first()).toBeAttached();   // the lens reads the user's own pasted report
  await expect(stage.locator('.pob-viewport')).toBeAttached({ timeout: 15_000 }); // the plasma orb is mounted (it draws, or this browser has no WebGL 2)
  expect(await release()).toBe(1);
  await expect(page.getByText(/E2E lab assessment/)).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('[data-loading-stage]')).toHaveCount(0);          // screen and scene are gone
  await expect(page.locator('canvas[aria-label^="Glass orb"]')).toHaveCount(0);
});

test('if the lens page cannot be downloaded the compact panel stays and the analysis still completes', async ({ browser }) => {
  // A fresh page of the same session: a module that is already loaded (or has already failed) is not fetched again.
  const ctx = await browser.newContext({ storageState: await page.context().storageState(), reducedMotion: 'no-preference' });
  const p = await ctx.newPage();
  await p.route('**/LoadingStage*', (route) => route.abort());
  await p.goto('/');
  await waitForApp(p);
  await p.getByRole('button', { name: 'Analyze', exact: true }).first().click();
  await p.getByRole('tab', { name: 'Reports' }).click();
  await p.getByPlaceholder(/Paste your lab report here/).fill('slow-please Hemoglobin 13.2 g/dL (12-16)');
  await p.getByRole('button', { name: 'Analyze Report' }).click();
  await expect(p.getByText('REPORT UNDER REVIEW...')).toBeVisible();
  await p.waitForTimeout(1_500);                                              // well past the scene's wait
  await expect(p.locator('[data-loading-stage]')).toHaveCount(0);
  await expect(p.getByText('REPORT UNDER REVIEW...')).toBeVisible();          // still the compact panel
  expect(await release()).toBe(1);
  await expect(p.getByText(/E2E lab assessment/)).toBeVisible({ timeout: 20_000 });
  await ctx.close();
});

test('with reduced motion the loading screen keeps the plain panel', async () => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await analyzeSlowReport();
  await page.waitForTimeout(1_200);                                           // well past the scene's wait
  await expect(page.locator('[data-loading-stage]')).toHaveCount(0);
  expect(await release()).toBe(1);
  await expect(page.getByText(/E2E lab assessment/)).toBeVisible({ timeout: 20_000 });
});

test('no uncaught errors or console errors during the run', async () => {
  expect(errorsOf(page).filter((e) => !/GL Driver/.test(e))).toEqual([]);
});
