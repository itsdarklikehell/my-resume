import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // Clear once per isolated test page, not on every same-tab navigation.
    if (sessionStorage.getItem('__portfolio_e2e_initialized') !== 'true') {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('__portfolio_e2e_initialized', 'true');
    }
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

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('.lang-toggle').click();
  await expect(page.locator('#lang-label')).toHaveText('EN');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('.theme-toggle').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', initialTheme || '');

  await page.evaluate(() => window.scrollTo(0, 0));
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

test('interactive terminal supports safe commands and clear', async ({ page }) => {
  await page.goto('?lang=nl');
  const terminal = page.locator('[data-terminal]');
  await expect(terminal).toBeVisible({ timeout: 20_000 });
  const input = page.locator('[data-terminal-input]');
  const output = page.locator('[data-terminal-output]');

  await input.fill('help');
  await input.press('Enter');
  await expect(output).toContainText('help, about, skills, projects, contact, clear');

  await input.fill('skills');
  await input.press('Enter');
  await expect(output).toContainText('Python');
  await expect(output).toContainText('Cybersecurity');

  await input.fill('<img src=x onerror=alert(1)>');
  await input.press('Enter');
  await expect(output).toContainText(/Onbekend commando|Unknown command/);
  await expect(output.locator('img')).toHaveCount(0);

  await input.fill('clear');
  await input.press('Enter');
  await expect(output.locator('.portfolio-terminal-entry')).toHaveCount(0);
});

test('donut centre label stays centred on desktop and mobile', async ({ page }) => {
  await page.goto('?lang=nl');
  const chart = page.locator('#donut-chart');
  await expect(chart.locator('.donut-center')).toBeVisible();

  const geometry = await chart.evaluate(element => {
    const chartRect = element.getBoundingClientRect();
    const centerRect = element.querySelector('.donut-center').getBoundingClientRect();
    return {
      chartX: chartRect.left + chartRect.width / 2,
      chartY: chartRect.top + chartRect.height / 2,
      labelX: centerRect.left + centerRect.width / 2,
      labelY: centerRect.top + centerRect.height / 2,
    };
  });
  expect(Math.abs(geometry.chartX - geometry.labelX)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.chartY - geometry.labelY)).toBeLessThanOrEqual(1);
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


test('technical project case study pages load and switch languages', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const cases = [
    ['pwnagotchi-control-center.html', 'Pwnagotchi Control Center'],
    ['pwnagotchi-plugins.html', 'Pwnagotchi Plugins'],
    ['pwnspeaker.html', 'Pwnspeaker & Pwnassistant'],
  ];

  for (const [path, title] of cases) {
    await page.goto(`projects/${path}?lang=nl`);
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.locator('[data-field="steps"] li')).toHaveCount(4);
    await expect(page.locator('[data-field="links"] a')).toHaveCount(3);
    await page.locator('select[aria-label="Language"]').selectOption('en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.locator('[data-field="back"]')).toHaveAttribute('href', '../index.html?lang=en#projects-section');
  }

  expect(pageErrors, 'unexpected project page browser errors').toEqual([]);
});


test('project case studies preserve the saved theme and palette', async ({ page }) => {
  await page.goto('?lang=nl');
  await page.locator('.theme-toggle').click();
  await page.locator('.palette-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'nord');

  await page.goto('projects/pwnagotchi-control-center.html?lang=nl');
  await expect(page.locator('h1')).toHaveText('Pwnagotchi Control Center');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'nord');
});


test('skill evidence explorer filters by project-backed category', async ({ page }) => {
  await page.goto('?lang=nl');
  await expect(page.getByRole('heading', { name: 'Vaardigheden met projectbewijs' })).toBeVisible({ timeout: 20_000 });
  const cards = page.locator('[data-skill-evidence-card]');
  await expect(cards).toHaveCount(11);

  await page.locator('[data-skill-filter="automation"]').click();
  await expect(page.locator('[data-skill-filter="automation"]')).toHaveAttribute('aria-pressed', 'true');
  const visibleCategories = await cards.evaluateAll(elements =>
    elements.filter(element => !element.hidden).map(element => element.dataset.skillCategory)
  );
  expect(visibleCategories.length).toBeGreaterThan(0);
  expect(visibleCategories.every(category => category === 'automation')).toBe(true);

  await page.locator('[data-skill-filter="all"]').click();
  await expect(cards).toHaveCount(11);
  const visibleCount = await cards.evaluateAll(elements => elements.filter(element => !element.hidden).length);
  expect(visibleCount).toBe(11);
});


test('data quality report exposes freshness and validation metrics', async ({ page }) => {
  await page.goto('?lang=nl');
  const report = page.locator('[data-quality-report]');
  await expect(report).toBeVisible({ timeout: 20_000 });
  await expect(report.getByRole('heading', { name: 'Datakwaliteit & herkomst' })).toBeVisible();
  await expect(report.getByText('GitHub-gegevens')).toBeVisible();
  await expect(report.getByText('Profielbronnen')).toBeVisible();
  await expect(report.getByText('Ontbrekende velden')).toBeVisible();
  await expect(report.getByText('Ongeldige records')).toBeVisible();
});
