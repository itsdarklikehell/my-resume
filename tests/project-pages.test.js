import { describe, expect, it } from 'vitest';
import { projectPages, ui } from '../projects/project-pages.js';

const languages = ['nl', 'en', 'de', 'fr'];
const projects = ['pwnagotchi-control-center', 'pwnagotchi-plugins', 'pwnspeaker'];

describe('technical project case studies', () => {
  it('provides complete content for all supported languages', () => {
    for (const slug of projects) {
      for (const lang of languages) {
        const page = projectPages[slug][lang];
        expect(page.title).toBeTruthy();
        expect(page.intro).toBeTruthy();
        expect(page.problem).toBeTruthy();
        expect(page.approach).toBeTruthy();
        expect(page.steps.length).toBeGreaterThanOrEqual(3);
        expect(page.stack.length).toBeGreaterThanOrEqual(3);
        expect(page.evidence).toBeTruthy();
        expect(page.role).toBeTruthy();
        expect(page.caution).toBeTruthy();
        expect(page.repoLabel).toBeTruthy();
        expect(page.docsLabel).toBeTruthy();
      }
    }
  });

  it('provides navigation labels for every supported language', () => {
    for (const lang of languages) {
      expect(ui[lang].language).toBeTruthy();
      expect(ui[lang].challenge).toBeTruthy();
      expect(ui[lang].steps).toBeTruthy();
      expect(ui[lang].resources).toBeTruthy();
    }
  });

  it('keeps the plugin collection ownership distinction explicit', () => {
    expect(projectPages['pwnagotchi-plugins'].nl.role).toContain('meerdere ontwikkelaars');
    expect(projectPages['pwnagotchi-plugins'].en.role).toContain('multiple developers');
  });
});
