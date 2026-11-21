import fs from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { authenticator } from 'otplib';
import { errorsOf, fillCode, newUser, trackErrors, waitForApp } from './helpers';

/* The animations only exist with motion on; the rest of the suite runs with reduced motion and never sees them. */
test.use({ reducedMotion: 'no-preference', colorScheme: process.env.SCHEME === 'dark' ? 'dark' : 'light' });
test.describe.configure({ mode: 'serial' });

const noise = (e: string) => !/GSAP target|GL Driver|THREE\.Clock/.test(e);

/** Records which animation layer is on screen, in order, and whether the small one and the big one ever coexisted. */
const watchLayers = () => {
  const w = window as unknown as { __seq: string[]; __overlap: boolean };
  w.__seq = []; w.__overlap = false;
  const note = (name: string) => { if (w.__seq[w.__seq.length - 1] !== name) w.__seq.push(name); };
  new MutationObserver(() => {
    const small = document.querySelector('.ad-fx'), big = document.querySelector('[data-welcome]');
    if (small && big) w.__overlap = true;
    if (big) note('welcome'); else if (small) note(small.getAttribute('data-phase') || 'fx');
  }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-phase'] });
};

/** Optional filmstrip for eyes (slows the page down, so a run with it may time out): SHOTS=/some/dir SCHEME=dark npx playwright test e2e/07-arrival-animations.spec.ts -g sign-up */
function filmstrip(page: Page, name: string) {
  const dir = process.env.SHOTS;
  if (!dir) return () => {};
  fs.mkdirSync(`${dir}/${name}`, { recursive: true });
  let on = true, n = 0; const t0 = Date.now();
  (async () => { while (on) { await page.screenshot({ path: `${dir}/${name}/${String(n++).padStart(3, '0')}-${Date.now() - t0}.png` }).catch(() => {}); } })();
  return () => { on = false; };
}

let user = newUser('anim');

test('first visit: the intro plays, can be skipped, lands on the page, and does not repeat in the same session', async ({ page }) => {
  trackErrors(page);
  await page.goto('/');
  const intro = page.locator('[data-intro]');
  await expect(intro).toBeVisible();
  await expect(page.getByRole('button', { name: 'Skip' })).toBeVisible({ timeout: 3000 });
  await page.getByRole('button', { name: 'Skip' }).click();
  await expect(intro).toBeHidden({ timeout: 4000 });
  await expect(page.locator('#section-hero')).toBeVisible();
  await page.reload();
  await expect(page.locator('#section-hero')).toBeVisible();
  await expect(intro).toHaveCount(0);   // once per browser session
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('sign-up: loading, then one success tick, then (after the code) the big welcome alone; never both at once', async ({ page }) => {
  trackErrors(page);
  await page.addInitScript(watchLayers);
  await page.addInitScript(() => sessionStorage.setItem('cs_booted', '1'));   // this test is about the dialog, not the intro
  const stop = filmstrip(page, 'signup');
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await page.getByPlaceholder('Full name').fill(user.name);
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder(/^Password/).fill(user.password);
  await page.getByRole('button', { name: /Continue/ }).click();

  await expect(page.locator('.ad-fx[data-phase="loading"]')).toBeVisible();
  await expect(page.locator('.ad-fx[data-phase="success"]')).toContainText('Account created');
  await expect(page.getByText('Scan with Google Authenticator')).toBeVisible();
  await expect(page.locator('.ad-fx')).toHaveCount(0);

  const secret = ((await page.getByText(/Can't scan/).locator('xpath=following-sibling::button').innerText()) || '').replace(/[^A-Z2-7]/gi, '').toUpperCase();
  await fillCode(page, authenticator.generate(secret));   // the sixth digit submits by itself

  await expect(page.locator('[data-welcome]')).toBeVisible();
  if (await page.evaluate(() => (navigator.hardwareConcurrency ?? 8) > 4)) await expect(page.locator('[data-welcome] .wl-fx canvas')).toHaveCount(3);   // the animated background (cells, heartbeat, orbits); weak devices skip it
  await expect(page.locator('[data-welcome]')).toContainText(`Welcome to CuraSense, ${user.name.split(' ')[0]}`);
  await expect(page.locator('.ad-fx')).toHaveCount(0);                      // no small animation at the last step
  await waitForApp(page);
  await expect(page.locator('[data-welcome]')).toHaveCount(0, { timeout: 15_000 });
  stop();
  const w = await page.evaluate(() => { const x = window as unknown as { __seq: string[]; __overlap: boolean }; return { seq: x.__seq, overlap: x.__overlap }; });
  expect(w.seq).toEqual(['loading', 'success', 'welcome']);
  expect(w.overlap).toBe(false);
  user = { ...user, secret };
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('login: loading, tick, then the code and the big welcome; a reload plays only the short one', async ({ page }) => {
  trackErrors(page);
  await page.addInitScript(watchLayers);
  await page.addInitScript(() => sessionStorage.setItem('cs_booted', '1'));
  const stop = filmstrip(page, 'login');
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in' }).first().click();
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.locator('form').getByRole('button', { name: /Sign in/ }).click();
  await expect(page.locator('.ad-fx[data-phase="loading"]')).toBeVisible();
  await expect(page.locator('.ad-fx[data-phase="success"]')).toContainText('Password verified');
  await expect(page.getByText('Enter your 6-digit code')).toBeVisible();
  await fillCode(page, authenticator.generate(user.secret!));
  await expect(page.locator('[data-welcome]')).toContainText('Welcome back');
  await waitForApp(page);
  await expect(page.locator('[data-welcome]')).toHaveCount(0, { timeout: 15_000 });
  stop();
  const w = await page.evaluate(() => { const x = window as unknown as { __seq: string[]; __overlap: boolean }; return { seq: x.__seq, overlap: x.__overlap }; });
  expect(w.seq).toEqual(['loading', 'success', 'welcome']);
  expect(w.overlap).toBe(false);

  // saved session: the short welcome, then the dashboard
  await page.reload();
  await expect(page.locator('[data-welcome]')).toContainText('Welcome back');
  await expect(page.locator('.wl-fx')).toHaveCount(0);   // the short welcome is light: no background canvases
  await waitForApp(page);
  await expect(page.locator('[data-welcome]')).toHaveCount(0, { timeout: 8000 });
  expect(errorsOf(page).filter(noise)).toEqual([]);
});
