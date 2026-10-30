import { describe, expect, it } from 'vitest';
import { getSkillEvidence } from '../src/portfolio-enhancements.js';

const languages = ['nl', 'en', 'de', 'fr'];

describe('project-backed skill evidence', () => {
  it('maps skills to verifiable evidence in all site languages', () => {
    for (const lang of languages) {
      const evidence = getSkillEvidence(lang);
      expect(evidence.length).toBeGreaterThan(5);
      for (const skill of evidence) {
        expect(skill.label.trim()).toBeTruthy();
        expect(['automation', 'development', 'systems', 'security', 'integrations']).toContain(skill.category);
        expect(skill.proofs.length).toBeGreaterThan(0);
        for (const proof of skill.proofs) {
          expect(proof.project.trim()).toBeTruthy();
          expect(proof.href).toMatch(/^(https:\/\/|projects\/)/);
          expect(proof.detail.trim()).toBeTruthy();
        }
      }
    }
  });

  it('does not imply SQL or BI experience without repository evidence', () => {
    const labels = getSkillEvidence('nl').map(skill => skill.label.toLowerCase());
    expect(labels).not.toContain('sql');
    expect(labels.some(label => /power.?bi|tableau|data analytics/.test(label))).toBe(false);
  });
});
