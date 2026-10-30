import { describe, expect, it } from 'vitest';
import { normalizeGitHubData } from '../src/data.js';

describe('normalizeGitHubData', () => {
  it('preserves genuine zero values', () => {
    const normalized = normalizeGitHubData({
      user: { followers: 0, following: 0, public_repos: 0 },
      repos: [],
      contributions: [],
      skills: {},
      stats: { total_repos: 0, total_stars: 0, languages: 0 },
    });

    expect(normalized.stats.stats.total_repos).toBe(0);
    expect(normalized.stats.stats.total_stars).toBe(0);
    expect(normalized.stats.stats.own_repos).toBe(0);
    expect(normalized.user.followers).toBe(0);
    expect(normalized.user.following).toBe(0);
    expect(normalized.availability).toEqual({
      repos: true,
      contributions: true,
      skills: true,
      user: true,
    });
  });

  it('keeps missing metrics unavailable instead of coercing them to zero', () => {
    const normalized = normalizeGitHubData({ generated_at: '2026-10-30T12:00:00Z' });

    expect(normalized.stats.stats.total_repos).toBeNull();
    expect(normalized.stats.stats.total_stars).toBeNull();
    expect(normalized.stats.stats.own_repos).toBeNull();
    expect(normalized.stats.stats.own_stars).toBeNull();
    expect(normalized.user.followers).toBeNull();
    expect(normalized.user.following).toBeNull();
    expect(normalized.availability).toEqual({
      repos: false,
      contributions: false,
      skills: false,
      user: false,
    });
  });

  it('derives zero counts only from an explicitly available empty collection', () => {
    const normalized = normalizeGitHubData({ repos: [], contributions: [] });

    expect(normalized.stats.stats.total_repos).toBe(0);
    expect(normalized.stats.stats.total_stars).toBe(0);
    expect(normalized.stats.stats.own_repos).toBe(0);
    expect(normalized.availability.repos).toBe(true);
  });
});
