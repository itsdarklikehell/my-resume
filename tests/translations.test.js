import { describe, expect, it } from 'vitest';
import { getTranslations } from '../src/i18n/get-translations.js';
import { translations } from '../src/i18n/translations.js';

describe('translation fallback', () => {
  it('uses Dutch text when a selected locale is missing a key', () => {
    const merged = getTranslations('fr', {
      nl: { greeting: 'Hallo', shared: 'Gedeeld' },
      fr: { greeting: 'Bonjour' },
    });

    expect(merged.greeting).toBe('Bonjour');
    expect(merged.shared).toBe('Gedeeld');
  });

  it('handles an unknown locale by falling back to Dutch', () => {
    expect(getTranslations('xx', { nl: { greeting: 'Hallo' } })).toEqual({
      greeting: 'Hallo',
    });
  });

  it('includes the Dutch category B license label used by the page', () => {
    expect(translations.nl.cert_b_role).toBeTruthy();
  });

  it('provides translated platform and repository labels in every supported locale', () => {
    const keys = [
      'platform_tryhackme', 'platform_ctftime', 'platform_itchio',
      'platform_hackthebox', 'platform_microsoft', 'platform_codewars',
      'platform_devto', 'platform_leetcode', 'platform_stackoverflow',
      'platform_cards', 'level', 'reputation_points', 'repo_stars',
      'repo_forks', 'repo_language', 'repo_updated', 'repo_topics',
      'repo_no_desc', 'repos_none', 'show_more', 'show_less',
      'auto_sort_on', 'auto_sort_off',
    ];
    for (const locale of ['nl', 'en', 'de', 'fr']) {
      for (const key of keys) {
        expect(translations[locale][key], `${locale}.${key}`).toBeTruthy();
      }
    }
  });

  it('keeps the Dutch category B license label available', () => {
    expect(translations.nl.cert_b_role).toBeTruthy();
  });

});