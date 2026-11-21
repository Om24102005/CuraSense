import { test, expect, type Page } from '@playwright/test';
import { apiSession, signedInAs, trackErrors, errorsOf } from './helpers';

/* The website as it runs on a phone, and inside the iPhone and Android apps (Capacitor loads these same pages).
   Runs twice: in real WebKit (the "iphone" project, the engine behind every iPhone and the iOS app) and in Chromium
   (the "android" project). */

const noise = (e: string) => !/GSAP target|GL Driver|THREE\.Clock/.test(e);
/** How far the page is wider than the screen. Anything above 0 means it scrolls sideways. */
const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const openMenu = (page: Page) => page.getByRole('button', { name: 'Open menu' }).click();
const goTo = async (page: Page, label: string) => { await openMenu(page); await page.locator('[data-drawer-item]', { hasText: label }).first().click(); };

test('public pages fit the screen: nothing scrolls sideways', async ({ page }) => {
  trackErrors(page);
  for (const path of ['/', '/platform', '/approach', '/access']) {
    await page.goto(path);
    await expect(page.locator('h1').first()).toBeVisible();
    await page.waitForLoadState('networkidle');   // let lazy chunks finish: leaving the page mid-download is reported as an error by WebKit
    expect(await overflow(page), path).toBeLessThanOrEqual(0);
  }
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('signed in on a phone: every page fits, the menu reaches them all, and Sign out is in it', async ({ page, request }) => {
  trackErrors(page);
  await signedInAs(page, await apiSession(request, 'phone'));
  await page.goto('/');
  await expect(page.locator('#page-content')).toBeVisible({ timeout: 20_000 });
  for (const label of ['Dashboard', 'Analyze', 'History', 'Book Appointment', 'Settings']) {
    await goTo(page, label);
    await expect(page.locator('#page-content')).toBeVisible();
    expect(await overflow(page), label).toBeLessThanOrEqual(0);
  }
  await openMenu(page);
  await page.getByRole('button', { name: 'Sign out' }).click();   // the profile menu is desktop-only, so this is the only way out on a phone
  await expect(page.getByRole('button', { name: 'Sign up' }).first()).toBeVisible({ timeout: 20_000 });   // the public nav on a phone
  expect(await page.evaluate(() => localStorage.getItem('curasense_token'))).toBeNull();
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('the open menu closes with its own button, on the public site and signed in', async ({ page, request }) => {
  await page.addInitScript(() => sessionStorage.setItem('cs_booted', '1'));   // no first-visit intro in the way
  await page.goto('/');
  await openMenu(page);
  await page.getByRole('button', { name: 'Close menu' }).click();   // the click lands on the drawer if the drawer covers the header
  await expect(page.locator('#site-drawer')).toBeHidden();

  await signedInAs(page, await apiSession(request, 'close'));
  await page.goto('/');
  await expect(page.locator('#page-content')).toBeVisible({ timeout: 20_000 });
  await openMenu(page);
  await page.getByRole('button', { name: 'Close menu' }).click();
  await expect(page.locator('[data-drawer-item]').first()).toBeHidden();
});

test('the three Analyze tabs show their names on a phone, not only an icon', async ({ page, request }) => {
  await signedInAs(page, await apiSession(request, 'tabs'));
  await page.goto('/');
  await goTo(page, 'Analyze');
  for (const name of ['Symptoms', 'Scans', 'Reports']) await expect(page.getByRole('tab', { name })).toBeVisible();
});

test('a phone gets the lighter 3D profile, however many cores it reports', async ({ page }) => {
  await page.addInitScript(() => {   // a strong phone on paper: 10 cores, 8 GB
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 10 });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-tier', /^(low|mid)$/, { timeout: 20_000 });   // never 'high'
});

test('content starts below the notch and the status bar', async ({ page, request, browserName }) => {
  test.skip(browserName !== 'chromium', 'safe-area insets can only be emulated in Chromium');
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 59, bottom: 34, left: 0, right: 0 } });
  const y = async (selector: string) => (await page.locator(selector).first().boundingBox())!.y;

  await page.goto('/');
  expect(await y('.sn-brand'), 'public nav').toBeGreaterThanOrEqual(59);

  await signedInAs(page, await apiSession(request, 'notch'));
  await page.goto('/');
  await expect(page.locator('#page-content')).toBeVisible({ timeout: 20_000 });
  expect(await y('header [aria-label="Go to Dashboard"]'), 'signed-in header').toBeGreaterThanOrEqual(59);
});

test('a phone starts with no backdrop blur, on the dense surfaces', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('cs_booted', '1'));
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.fx)).toBe('2');
  expect(await page.locator('.sn').evaluate((el) => getComputedStyle(el).backdropFilter)).toMatch(/^(none|)$/);
});
