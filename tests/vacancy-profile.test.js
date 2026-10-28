import { describe, expect, it } from 'vitest';
import { getProjectFilterForRole, getVacancyProfile } from '../src/vacancy-profile.js';

describe('vacancy-specific CV profiles', () => {
  it('provides localized profiles with truthful, focused summaries', () => {
    expect(getVacancyProfile('automation', 'nl').title).toContain('Automatisering');
    expect(getVacancyProfile('cyber', 'en').title).toContain('Cybersecurity');
    expect(getVacancyProfile('electrical', 'de').label).toContain('Elektrotechnik');
    expect(getVacancyProfile('support', 'fr').label).toContain('Support');
  });

  it('maps role profiles to the existing project categories', () => {
    expect(getProjectFilterForRole('automation')).toBe('automation');
    expect(getProjectFilterForRole('cyber')).toBe('cyber');
    expect(getProjectFilterForRole('electrical')).toBe('electrical');
    expect(getProjectFilterForRole('software')).toBe('all');
    expect(getProjectFilterForRole('unknown')).toBe('all');
  });

  it('falls back to the general profile for unknown keys and languages', () => {
    expect(getVacancyProfile('unknown', 'nl').key).toBe('general');
    expect(getVacancyProfile('automation', 'xx').title).toBe(getVacancyProfile('automation', 'nl').title);
  });
});
