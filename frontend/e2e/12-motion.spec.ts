import { test, expect, type Page } from '@playwright/test';
import { apiSession, signedInAs, trackErrors, errorsOf } from './helpers';

/* The shared motion rules: controls stay cheap, a tap answers once, the header never moves layout, a menu survives a quick reopen. */
test.use({ reducedMotion: 'no-preference' });

const noise = (e: string) => !/GSAP target|GL Driver|THREE\.Clock/.test(e);
const open = async (page: Page, request: Parameters<typeof apiSession>[0], tag: string) => {
  trackErrors(page);
  await signedInAs(page, await apiSession(request, tag));
  await page.goto('/');
  await expect(page.locator('#page-content')).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('[data-welcome]')).toHaveCount(0, { timeout: 20_000 });
};
const tap = (page: Page, detail: number) => page.evaluate((d) => {
  document.querySelector('[data-nav-id="dashboard"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: d, clientX: 120, clientY: 40 }));
  return getComputedStyle(document.querySelector('[data-tap-ring]')!).visibility;
}, detail);

test('controls hold no compositor layer and never transition every property', async ({ page, request }) => {
  await open(page, request, 'motion-css');
  const style = await page.locator('[data-nav-id="dashboard"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return { willChange: s.willChange, transition: s.transitionProperty };
  });
  expect(style.willChange).toBe('auto');
  expect(style.transition.split(', ')).not.toContain('all');
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('a tap shows one ring that clears; a keyboard click and reduced motion show none', async ({ page, request }) => {
  await open(page, request, 'motion-ring');
  const ring = page.locator('[data-tap-ring]');
  await expect(ring).toHaveCount(1);
  expect(await tap(page, 1)).toBe('visible');
  await expect(ring).toBeHidden();
  expect(await tap(page, 0)).toBe('hidden');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => tap(page, 1)).toBe('hidden');
  await expect(ring).toHaveCount(1);
});

test('the header tightens with a transform and keeps its layout height', async ({ page, request }) => {
  await page.setViewportSize({ width: 1280, height: 420 });
  await open(page, request, 'motion-header');
  const header = page.locator('header').first();
  const before = await header.evaluate((el) => (el as HTMLElement).offsetHeight);
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect.poll(() => header.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeCloseTo(-8, 0);
  expect(await header.evaluate((el) => (el as HTMLElement).offsetHeight)).toBe(before);
});

test('closing and at once reopening the phone menu leaves it open', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, request, 'motion-drawer');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const drawer = page.locator('[data-drawer]');
  await expect(drawer).toBeVisible();
  await page.getByRole('button', { name: 'Close menu' }).click();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(500);   // past the end of the cancelled close
  await expect(drawer).toBeVisible();
  await expect(page.locator('[data-drawer-item]').first()).toBeVisible();
});

test('a link wipes the veil over the swap and clears it; back swaps at once', async ({ page }) => {
  trackErrors(page);
  await page.addInitScript(() => sessionStorage.setItem('cs_booted', '1'));
  await page.goto('/');
  const veil = page.locator('[data-route-veil]');
  await expect(veil).toBeHidden();
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Platform' }).click();
  await expect(page).toHaveURL(/\/platform$/);
  await expect(page.locator('#public-root')).toHaveAttribute('data-route', 'platform');
  await expect(page.locator('h1.pg-title')).toBeVisible();
  await expect(page.locator('h1.pg-title .ml-mask').first()).toBeVisible();   // the headline really is behind a mask
  await expect(veil).toBeHidden();
  await page.goBack();
  await expect(page.locator('#public-root')).toHaveAttribute('data-route', 'home');
  await expect(veil).toBeHidden();
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('the intro iris opens onto the page and leaves nothing covering it', async ({ page }) => {
  await page.goto('/');
  const intro = page.locator('[data-intro]');
  await expect(intro).toBeVisible();
  await page.getByRole('button', { name: 'Skip' }).click({ timeout: 3000 });
  await expect(intro).toHaveCount(0, { timeout: 4000 });
  await expect(page.locator('.hero-text').first()).toBeInViewport();
  await expect.poll(() => page.locator('.hero-text').first().evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeCloseTo(0, 0);
});
