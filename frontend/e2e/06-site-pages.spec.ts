import { test, expect } from '@playwright/test';
import { trackErrors, errorsOf, newUser, signUp } from './helpers';

const noise = (e: string) => !/GSAP target|GL Driver|THREE\.Clock/.test(e);

test('navbar: Platform, Approach and Access are real pages with their own title, heading and active state', async ({ page }) => {
  trackErrors(page);
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  const pages: [string, string, RegExp, RegExp][] = [
    ['Platform', '/platform', /Platform — CuraSense/, /Symptoms, scans and lab reports/],
    ['Approach', '/approach', /Approach — CuraSense/, /From raw input to an answer/],
    ['Access', '/access', /Access — CuraSense/, /Join in a minute/],
  ];
  for (const [label, path, title, h1] of pages) {
    await nav.getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
    await expect(nav.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
  }
  await page.goBack();
  await expect(page).toHaveURL(/\/approach$/);
  await page.getByRole('link', { name: 'CuraSense, home' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#section-hero')).toBeVisible();
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('deep link: /access loads on its own and shows the live system check', async ({ page }) => {
  trackErrors(page);
  await page.goto('/access');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Join in a minute/);
  const live = page.locator('.pg-status .pg-live');
  await expect(live).toContainText('All systems operational', { timeout: 20_000 });
  await expect(live).toContainText('AI engine');
  await page.getByRole('button', { name: /Does it cost anything/ }).click();
  await expect(page.getByText('no payment details are requested')).toBeHidden();   // collapsed again (it started open)
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('home doors: "Read a scan" opens sign-up with its intent, and the intent survives sign-up into the Analyze page', async ({ page }) => {
  const user = await signUp(page, newUser('intent'), async () => {
    await page.getByRole('button', { name: /Read a scan/ }).click();
    await expect(page.getByText('Next up:')).toContainText('Read a scan');
  });
  expect(user.secret).toBeTruthy();
  await expect(page.getByRole('tab', { name: /Scans/i })).toHaveAttribute('data-state', 'active');
  expect(await page.evaluate(() => location.pathname)).toBe('/');
  expect(errorsOf(page).filter(noise)).toEqual([]);
});

test('phone layout: the menu drawer opens, navigates and closes', async ({ page }) => {
  trackErrors(page);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
  await page.getByRole('button', { name: 'Open menu' }).click();
  const drawer = page.locator('#site-drawer');
  await expect(drawer.getByRole('link', { name: /Approach/ })).toBeVisible();
  await drawer.getByRole('link', { name: /Approach/ }).click();
  await expect(page).toHaveURL(/\/approach$/);
  await expect(drawer).toBeHidden();
  expect(errorsOf(page).filter(noise)).toEqual([]);
});
