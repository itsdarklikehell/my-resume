import { describe, expect, it } from 'vitest';
import {
  buildSkillProjectMap,
  classifyRepo,
  filterAndSortRepos,
  isAvailableValue,
} from '../src/dynamic-profile.js';

const repos = [
  { name: 'pwnagotchi-plugins', description: 'Wi-Fi auditing and pentesting', language: 'Python', stars: 20, updated_at: '2026-10-20T10:00:00Z', topics: ['security', 'wifi'] },
  { name: 'automation-toolkit', description: 'Scripts for repetitive tasks', language: 'Shell', stars: 3, updated_at: '2026-10-26T10:00:00Z', topics: ['automation'] },
  { name: 'solar-install-helper', description: 'Electrical installation helper', language: 'Python', stars: 1, updated_at: '2026-10-22T10:00:00Z', topics: ['electrical'] },
  { name: 'forked-repo', fork: true, language: 'Python', stars: 100, updated_at: '2026-10-27T10:00:00Z' },
];

describe('dynamic profile data', () => {
  it('filters by profile and excludes forks', () => {
    expect(filterAndSortRepos(repos, { profile: 'cyber' }).map(repo => repo.name)).toEqual(['pwnagotchi-plugins']);
    expect(filterAndSortRepos(repos).some(repo => repo.fork)).toBe(false);
  });

  it('searches and sorts projects', () => {
    expect(filterAndSortRepos(repos, { query: 'toolkit' }).map(repo => repo.name)).toEqual(['automation-toolkit']);
    expect(filterAndSortRepos(repos, { sort: 'stars' })[0].name).toBe('pwnagotchi-plugins');
    expect(filterAndSortRepos(repos, { sort: 'name' })[0].name).toBe('automation-toolkit');
  });

  it('classifies repositories from language, topics, and descriptions', () => {
    expect(classifyRepo(repos[0])).toContain('cyber');
    expect(classifyRepo(repos[1])).toContain('automation');
    expect(classifyRepo(repos[2])).toContain('electrical');
  });

  it('maps repository languages and topics to concrete projects', () => {
    const map = buildSkillProjectMap(repos);
    expect(map.find(([skill]) => skill === 'Python')[1]).toHaveLength(2);
    expect(map.find(([skill]) => skill === 'security')[1][0].name).toBe('pwnagotchi-plugins');
  });

  it('recognizes placeholders as unavailable data', () => {
    expect(isAvailableValue('N/A')).toBe(false);
    expect(isAvailableValue('unknown')).toBe(false);
    expect(isAvailableValue(0)).toBe(true);
    expect(isAvailableValue('Python')).toBe(true);
  });
});
