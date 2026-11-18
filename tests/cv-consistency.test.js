import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { deduplicateRepos, filterAndSortRepos } from '../src/dynamic-profile.js';

describe('CV page consistency', () => {
  it('keeps the published experience timeline at 17 entries', async () => {
    const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
    const start = html.indexOf('<h2 data-i18n="experience"');
    const end = html.indexOf('<h2 data-i18n="education"', start);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    const experience = html.slice(start, end);
    expect(experience.match(/class="timeline-item"/g) || []).toHaveLength(17);
  });

  it('bumps the service-worker cache so deployed app-shell and data assets refresh', async () => {
    const sw = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
    expect(sw).toContain("const CACHE_NAME = 'resume-cache-v11';");
  });

  it('uses semantic buttons for JSON download, print and copy actions', async () => {
    const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
    for (const action of ['download-json', 'print-cv', 'copy-link']) {
      expect(html).toMatch(new RegExp(`<button[^>]*data-action="${action}"`));
    }
    expect(html).not.toMatch(/<a[^>]*href="#"[^>]*data-action=/);
    expect(html).toContain('data-i18n="print_cv"');
  });

  it('exports normalized repository and skill data rather than nonexistent stats fields', async () => {
    const script = await readFile(new URL('../script.js', import.meta.url), 'utf8');
    expect(script).toContain('skills: gSkills() || {}');
    expect(script).toContain('repos: gRepos() || []');
    expect(script).toContain('profileData.source_status?.[p.key]');
    expect(script).toContain('last_successful_at');
    expect(script).toContain('no_successful_update');
    expect(script).not.toContain("opacity:.7;");
  });

  it('publishes refreshed data with retries instead of hiding git push failures', async () => {
    const workflow = await readFile(new URL('../.github/workflows/update-data.yml', import.meta.url), 'utf8');
    expect(workflow).toContain('group: update-data-main');
    expect(workflow).toContain('git rebase origin/main');
    expect(workflow).toContain('git push origin HEAD:main');
    expect(workflow).not.toContain('git push || true');
  });

  it('generates Dutch and English PDFs from explicit language URLs', async () => {
    const script = await readFile(new URL('../scripts/print-cv.mjs', import.meta.url), 'utf8');
    expect(script).toContain('bauke-molenaar-cv.pdf');
    expect(script).toContain('bauke-molenaar-cv-en.pdf');
    expect(script).toContain('target.searchParams.set("lang", output.lang)');
    const workflow = await readFile(new URL('../.github/workflows/generate-cv-pdfs.yml', import.meta.url), 'utf8');
    expect(workflow).toContain('cp profile-data.json github-data.json dist/');
    expect(workflow).toContain('git rebase "origin/$TARGET_BRANCH"');
    expect(workflow).toContain('Unable to publish regenerated PDFs after 3 attempts.');
  });

  it('updates the document language before printing the active translation', async () => {
    const script = await readFile(new URL('../script.js', import.meta.url), 'utf8');
    expect(script).toContain('applyLang(currentLang);');
    expect(script).toContain('document.documentElement.lang = currentLang;');
  });

  it('documents the same 17 experience entries in all README languages', async () => {
    for (const name of ['README.md', 'README.nl.md', 'README.de.md', 'README.fr.md']) {
      const readme = await readFile(new URL(`../${name}`, import.meta.url), 'utf8');
      expect(readme).toMatch(/17[^\n]*(?:item|items|entries|Einträge|entrées)/i);
      expect(readme).not.toMatch(/23[^\n]*(?:item|items|entries|Einträge|entrées)/i);
    }
  });
  it('translates every experience role and its description', async () => {
    const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
    const start = html.indexOf('<h2 data-i18n="experience"');
    const end = html.indexOf('<h2 data-i18n="education"', start);
    const experience = html.slice(start, end);
    const roles = [...experience.matchAll(/<div class="role"([^>]*)>/g)];
    expect(roles).toHaveLength(17);
    expect(roles.every(([, attributes]) => attributes.includes('data-i18n='))).toBe(true);
  });
  it('uses the complete telephone number in the clickable contact link', async () => {
    const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
    expect(html).toContain('href="tel:+31636065494"');
    expect(html).not.toContain('href="tel:+316****5494"');
  });

  it('keeps only one visible repository-card catalogue alongside curated case studies', async () => {
    const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
    expect(html).toContain('class="featured-project-grid"');
    expect(html).toContain('id="projects-container"');
    expect(html).toMatch(/id="featured-section"[^>]*hidden/);
    expect(html).toMatch(/id="repos-showcase-section" hidden/);
  });

  it('deduplicates repeated repository URLs without merging same-named repositories from different owners', () => {
    const entries = [
      { name: 'project', url: 'https://github.com/example/project' },
      { name: 'PROJECT', url: 'https://github.com/EXAMPLE/project.git/' },
      { name: 'project', url: 'https://github.com/another-owner/project' },
    ];
    expect(deduplicateRepos(entries)).toHaveLength(2);
    expect(filterAndSortRepos(entries)).toHaveLength(2);
  });

  it('gives every project case study a keyboard skip link and shared language control', async () => {
    for (const file of ['pwnagotchi-control-center.html', 'pwnagotchi-plugins.html', 'pwnspeaker.html']) {
      const html = await readFile(new URL('../projects/' + file, import.meta.url), 'utf8');
      expect(html).toContain('class="skip-link" href="#project-content"');
      expect(html).toContain('id="project-content" tabindex="-1"');
      expect(html).toContain('class="lang-toggle"');
      expect(html).not.toContain('<select aria-label="Language">');
    }
    const script = await readFile(new URL('../projects/project-page.js', import.meta.url), 'utf8');
    expect(script).toContain("const order = ['nl', 'en', 'de', 'fr']");
    expect(script).toContain("url.searchParams.set('lang', next)");
  });
});
