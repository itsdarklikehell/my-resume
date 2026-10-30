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
          expect(proof.href).toMatch(/^(https:\\/\\/|projects\\/)/);
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


const repos = [
  {
    name: 'python-toolkit',
    description: 'Automation utilities',
    language: 'Python',
    stars: 12,
    updated_at: '2026-10-27T12:00:00Z',
    topics: ['automation'],
    url: 'https://github.com/example/python-toolkit',
  },
  {
    name: 'shell-scripts',
    description: 'Linux helpers',
    language: 'Shell',
    stars: 3,
    updated_at: '2026-10-20T12:00:00Z',
    topics: ['linux'],
    url: 'https://github.com/example/shell-scripts',
  },
  {
    name: 'forked',
    fork: true,
    stars: 1000,
    updated_at: '2026-10-28T12:00:00Z',
    url: 'https://github.com/example/forked',
  },
  {
    name: 'unsafe-link',
    stars: 999,
    updated_at: '2026-10-28T12:00:00Z',
    url: 'javascript:alert(1)',
  },
];

describe('portfolio enhancements', () => {
  it('selects top case studies from own repositories with safe URLs', () => {
    expect(selectCaseStudyRepos(repos).map(repo => repo.name)).toEqual([
      'python-toolkit',
      'shell-scripts',
    ]);
  });

  it('matches vacancy requirements against project evidence without inventing SQL experience', () => {
    const matches = buildVacancyMatch('We need Python, Docker and SQL experience.', repos, {});
    expect(matches.find(item => item.skill === 'Python').status).toBe('evidence');
    expect(matches.find(item => item.skill === 'Docker').status).toBe('related');
    expect(matches.find(item => item.skill === 'SQL').status).toBe('missing');
  });

  it('uses platform activity as a related signal rather than project evidence', () => {
    const matches = buildVacancyMatch('Experience with Burp Suite.', [], {
      tryhackme: { top_tools: 'Burp Suite, Wireshark' },
    });
    expect(matches).toHaveLength(1);
    expect(matches[0].skill).toBe('Burp Suite');
    expect(matches[0].status).toBe('related');
    expect(matches[0].platformEvidence).toBe(true);
  });

  it('orders development milestones by valid repository update date', () => {
    const milestones = getDevelopmentMilestones([
      repos[0],
      repos[1],
      { name: 'invalid-date', updated_at: 'not-a-date', url: 'https://github.com/example/invalid' },
    ]);
    expect(milestones.map(item => item.name)).toEqual(['python-toolkit', 'shell-scripts']);
  });

  it('provides safe, interactive conceptual workflows for supported directions', () => {
    expect(getWorkflow('cyber').steps.length).toBeGreaterThan(2);
    expect(getWorkflow('unknown').label).toBe('Automatisering');
    expect(getWorkflow('electrical').intro).toContain('controlelijst');
  });

  it('maps supported skills to verifiable project evidence in all site languages', () => {
    for (const lang of ['nl', 'en', 'de', 'fr']) {
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

  it('returns no vacancy matches for blank input', () => {
    expect(buildVacancyMatch('   ', repos, {})).toEqual([]);
  });
});
