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

test('moving between sign-in and sign-up slides the step in and leaves it clean, at one panel height', async ({ page }) => {
  trackErrors(page);
  await page.addInitScript(() => sessionStorage.setItem('cs_booted', '1'));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in' }).first().click();
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  await page.waitForTimeout(450);
  const height = () => page.locator('.ad-main').evaluate((el) => (el as HTMLElement).offsetHeight);
  const first = await height();
  await page.getByRole('button', { name: 'Create an account' }).click();
  await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
  await expect.poll(() => page.locator('.ad-step > *').first().evaluate((el) => (el as HTMLElement).style.transform)).toBe('');
  await expect.poll(() => page.locator('.ad-main').evaluate((el) => (el as HTMLElement).style.opacity)).toBe('');
  expect(await height()).toBe(first);
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('a result below the fold is fully visible without scrolling, and the hand-off cover clears', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await open(page, request, 'motion-result');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.locator('[data-drawer-item]', { hasText: 'Analyze' }).first().click();
  await page.getByRole('tab', { name: 'Reports' }).click();
  await page.getByPlaceholder(/Paste your lab report here/).fill('Hemoglobin 13.2 g/dL (12-16)');
  await page.getByRole('button', { name: 'Analyze Report' }).click();
  await expect(page.getByText(/E2E lab assessment/)).toBeAttached({ timeout: 20_000 });
  await expect(page.locator('.ls-exit')).toHaveCount(0);
  await expect.poll(() => page.locator('[data-result], [data-result] *').evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity !== '0'))).toBe(true);
  await expect.poll(() => page.locator('[data-result] > *').evaluateAll((els) => els.length > 0 && els.every((e) => getComputedStyle(e).opacity === '1'))).toBe(true);
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('switching tabs keeps the one WebGL canvas instead of making a new context', async ({ page, request }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await open(page, request, 'motion-canvas');
  const canvas = page.locator('[data-page-scene] canvas');
  await canvas.first().waitFor({ state: 'attached', timeout: 8000 }).catch(() => {});
  test.skip(await canvas.count() === 0, 'this browser draws no 3D scene');
  await canvas.first().evaluate((el) => { (window as any).__sceneCanvas = el; });
  await page.locator('[data-nav-id="history"]').click();
  await expect(page.locator('[data-page-scene="history"]')).toBeAttached();
  expect(await page.locator('[data-page-scene] canvas').evaluate((el) => el === (window as any).__sceneCanvas)).toBe(true);
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

/* The landing story: a scene may hold its blocks back until they are on screen, but never after, and never under reduced motion. */
const STORY = '.narrative-reel .reel-rise, .narrative-reel .reel-eyebrow, .narrative-reel .reel-lede, .approach-node, .nlp-tag, .lab-row, .img-box';
const heldBack = (page: Page) => page.evaluate((sel) => [...document.querySelectorAll(sel)].filter((el) => +getComputedStyle(el).opacity < 0.99).length, STORY);
const counters = (page: Page) => page.evaluate(() => [...document.querySelectorAll('.problem-counter')].map((el) => el.textContent!.trim()).join(','));

test('the story holds blocks back only until they are seen, and its figures end on the real numbers', async ({ page }) => {
  trackErrors(page);
  await page.addInitScript(() => sessionStorage.setItem('cs_booted', '1'));
  await page.goto('/');
  await expect(page.locator('#reel-problem')).toBeAttached({ timeout: 30_000 });
  expect(await heldBack(page)).toBeGreaterThan(0);   // below the fold: the entrance is armed
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } });
  await expect.poll(() => heldBack(page), { timeout: 8_000 }).toBe(0);
  await expect.poll(() => counters(page)).toBe('12,1,7,33');
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('reduced motion: the whole story is readable without scrolling to it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => sessionStorage.setItem('cs_booted', '1'));
  await page.goto('/');
  await expect(page.locator('#reel-problem')).toBeAttached({ timeout: 30_000 });
  expect(await heldBack(page)).toBe(0);
  expect(await counters(page)).toBe('12,1,7,33');
  expect(await page.locator('.narrative-reel .reel-line').first().evaluate((el) => getComputedStyle(el).transform)).toBe('none');
});
