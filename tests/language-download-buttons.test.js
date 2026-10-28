import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('language-specific download buttons', () => {
  it('shows Dutch actions only in Dutch and English actions otherwise', async () => {
    const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

    expect(css).toContain('html[lang="nl"] .download-btn.lang-en');
    expect(css).toContain('html:not([lang="nl"]) .download-btn.lang-nl');
    expect(css).toContain('display: none !important;');
  });
});
