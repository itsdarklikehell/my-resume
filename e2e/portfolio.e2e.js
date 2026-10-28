import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('home page loads key CV sections and enhancement controls', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('?lang=nl');
  await expect(page.locator('h1')).toContainText('Bauke Molenaar');
  await expect(page.locator('#portfolio-enhancements')).toBeVisible();
  await expect(page.locator('#portfolio-cases-title')).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('[data-vacancy-matcher]')).toBeVisible();
  await expect(page.locator('[data-demo-flow="cyber"]')).toBeVisible();
  await expect(page.locator('[data-recruiter-toggle]')).toBeVisible();

  expect(pageErrors, 'unexpected uncaught browser errors').toEqual([]);
});

test('language, theme and palette controls respond to clicks', async ({ page }) => {
  await page.goto('?lang=nl');
  await expect(page.locator('#portfolio-cases-title')).toBeVisible({ timeout: 20_000 });

  await page.locator('.lang-toggle').click();
  await expect(page.locator('#lang-label')).toHaveText('EN');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await page.locator('.theme-toggle').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', initialTheme || '');

  await page.locator('.palette-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'nord');
});

test('vacancy matcher returns local skill evidence without sending the text away', async ({ page }) => {
  await page.goto('?lang=nl');
  await expect(page.locator('[data-vacancy-matcher]')).toBeVisible({ timeout: 20_000 });
  await page.locator('[data-job-text]').fill('We zoeken iemand met Python, Linux en SQL.');
  await page.locator('[data-vacancy-matcher] button[type="submit"]').click();

  const results = page.locator('[data-match-results]');
  await expect(results).toContainText('Python');
  await expect(results).toContainText('Linux');
  await expect(results).toContainText('SQL');
  await expect(results.locator('.portfolio-match-row')).toHaveCount(3);
});

test('workflow demo changes direction and selected step', async ({ page }) => {
  await page.goto('?lang=nl');
  await expect(page.locator('[data-demo-flow="automation"]')).toBeVisible({ timeout: 20_000 });

  await page.locator('[data-demo-flow="cyber"]').click();
  await expect(page.locator('[data-demo-intro]')).toContainText('beveiligingsbeoordelingen');
  await page.locator('[data-demo-step="1"]').click();
  await expect(page.locator('[data-demo-detail]')).toContainText('assets');
  await expect(page.locator('[data-demo-step="1"]')).toHaveAttribute('aria-pressed', 'true');
});

test('recruiter mode toggles on and off accessibly', async ({ page }) => {
  await page.goto('?lang=nl');
  const toggle = page.locator('[data-recruiter-toggle]');
  await expect(toggle).toBeVisible({ timeout: 20_000 });

  await toggle.click();
  await expect(page.locator('body')).toHaveClass(/recruiter-mode/);
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');

  await toggle.click();
  await expect(page.locator('body')).not.toHaveClass(/recruiter-mode/);
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('vacancy profile links navigate to the requested role', async ({ page }) => {
  await page.goto('?lang=nl');
  await expect(page.locator('.portfolio-role-links')).toBeVisible({ timeout: 20_000 });
  await page.locator('.portfolio-role-links a[href="?role=cyber"]').click();
  await expect(page).toHaveURL(/[?&]role=cyber(?:&|$)/);
  await expect(page.locator('#vacancy-profile')).toBeVisible();
});

test('local analytics can be exported and reset', async ({ page }) => {
  await page.goto('?lang=nl');
  await expect(page.locator('[data-analytics-export]')).toBeVisible({ timeout: 20_000 });

  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-analytics-export]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('portfolio-local-analytics.json');

  await page.locator('[data-analytics-reset]').click();
  await expect(page.locator('[data-analytics-status]')).toContainText('gewist');
  await expect(page.locator('[data-local-event-total]')).toHaveText('0');
});

test('layout fits the viewport and links use safe schemes', async ({ page }) => {
  await page.goto('?lang=nl');
  await expect(page.locator('#portfolio-cases-title')).toBeVisible({ timeout: 20_000 });

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
    overflow: [...document.querySelectorAll('body *')].map(el => ({ tag: el.tagName, id: el.id, className: typeof el.className === 'string' ? el.className : '', right: Math.round(el.getBoundingClientRect().right), left: Math.round(el.getBoundingClientRect().left), width: Math.round(el.getBoundingClientRect().width) })).filter(el => el.right > document.documentElement.clientWidth + 1 || el.left < -1).slice(0, 12),
  }));
  expect(dimensions.content, 'horizontal page overflow: ' + JSON.stringify(dimensions.overflow)).toBeLessThanOrEqual(dimensions.viewport + 2);

  const unsafeLinks = await page.locator('a[href]').evaluateAll(links =>
    links.map(link => link.getAttribute('href') || '')
      .filter(href => /^(javascript:|data:)/i.test(href))
  );
  expect(unsafeLinks, 'unsafe links should not be present in rendered UI').toEqual([]);
});
