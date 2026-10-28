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
});
