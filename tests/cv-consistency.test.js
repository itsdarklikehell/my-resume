import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

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

  it('offers one language-neutral JSON download and one current-language print action', async () => {
    const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
    expect((html.match(/data-action="download-json"/g) || [])).toHaveLength(1);
    expect((html.match(/data-action="print-cv"/g) || [])).toHaveLength(1);
    expect(html).toContain('data-i18n="print_cv"');
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
});
