import { test, expect } from '@playwright/test';
import { trackErrors, errorsOf } from './helpers';

// The landing page's living cell is decorative: it must render (or fall back) without breaking the page,
// and its caption must follow the scroll.
test('landing: cell scene (or its fallback) mounts and the caption follows scroll', async ({ page }) => {
  trackErrors(page);
  await page.goto('/');
  await expect(page.locator('#section-hero')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-page-scene="welcome"] canvas, .cs-cell-fallback').first()).toBeAttached({ timeout: 15_000 });
  await page.evaluate(() => document.getElementById('reel-approach')!.scrollIntoView({ block: 'center' }));
  await expect(page.getByText('03 / 07 · Approach')).toBeVisible({ timeout: 10_000 });
  await page.evaluate(() => document.getElementById('reel-problem')!.scrollIntoView({ block: 'center' }));
  await expect(page.getByText('02 / 07 · Problem')).toBeVisible({ timeout: 10_000 });
  expect(errorsOf(page).filter((e) => !/GSAP target|GL Driver|THREE\.Clock/.test(e))).toEqual([]);
});

// Navbar: one-word system status (green ACTIVE when every service is up) with a hover list of what is running,
// and Sign in / Sign up buttons that open the auth dialog on top of whatever page you are on.
test('landing: status pill lists the systems on hover; Sign up opens the dialog and Close dismisses it', async ({ page }) => {
  trackErrors(page);
  await page.goto('/');
  const pill = page.getByRole('button', { name: /System status/ });
  await expect(pill).toHaveText('ACTIVE', { timeout: 20_000 });
  await pill.hover();
  const pop = page.getByRole('region', { name: 'System status details' });
  await expect(pop).toBeVisible();
  for (const name of ['API gateway', 'AI engine', 'Patient database']) await expect(pop.getByText(name)).toBeVisible();
  await page.mouse.move(5, 400);
  await expect(pop).toBeHidden();

  await page.getByRole('button', { name: 'Sign up' }).click();
  const dialog = page.getByRole('dialog', { name: 'Create your CuraSense account' });
  await expect(dialog).toBeVisible();
  await expect(page.getByPlaceholder('Full name')).toBeFocused();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
  expect(errorsOf(page).filter((e) => !/GSAP target|GL Driver|THREE\.Clock/.test(e))).toEqual([]);
});

// Leaving Home only pauses and hides the cell: coming back must not rebuild its GPU resources (a 40 ms frame on every visit).
test('landing: the cell is kept, not rebuilt, when you leave Home and come back', async ({ page }) => {
  trackErrors(page);
  await page.goto('/');
  await expect(page.locator('[data-page-scene="welcome"] canvas, .cs-cell-fallback').first()).toBeAttached({ timeout: 15_000 });
  const canvas = page.locator('[data-page-scene="welcome"] canvas').first();
  test.skip(!(await canvas.count()), 'no WebGL in this browser: only the fallback is drawn');
  await canvas.evaluate((el) => { (el as HTMLCanvasElement & { __kept?: boolean }).__kept = true; });
  await page.getByRole('link', { name: 'Platform', exact: true }).first().click();
  await expect(page).toHaveURL(/\/platform$/);
  await expect(page.locator('.cell-host')).toHaveAttribute('data-off', 'true');   // paused and hidden, not removed
  await page.getByRole('link', { name: 'CuraSense, home' }).first().click();
  await expect(page.locator('.cell-host')).not.toHaveAttribute('data-off', 'true');
  expect(await page.locator('[data-page-scene="welcome"] canvas').first().evaluate((el) => (el as HTMLCanvasElement & { __kept?: boolean }).__kept)).toBe(true);
  expect(errorsOf(page).filter((e) => !/GSAP target|GL Driver|THREE\.Clock/.test(e))).toEqual([]);
});

// The page measures the screen's real refresh rate (animations/frameRate.ts) instead of assuming 60 Hz, and a healthy page
// never switches its effects down.
test('the refresh rate is measured and published on <html>; effects stay at full quality', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-hz', /^(30|48|50|60|72|75|90|100|120|144|165|240)$/, { timeout: 15_000 });
  await expect(page.locator('html')).not.toHaveAttribute('data-fx', /.*/);
});
