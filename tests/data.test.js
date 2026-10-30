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

  it('distinguishes unavailable empty payloads from successful zero-record responses', () => {
    const unavailable = normalizeGitHubData({
      repos: [],
      contributions: [],
      skills: {},
      user: {},
      source_status: {
        user_repositories: { status: 'unavailable', record_count: 0, retained: false },
        organization_repositories: { status: 'unavailable', record_count: 0, retained: false },
        contributions: { status: 'unavailable', record_count: 0, retained: false },
        user_profile: { status: 'unavailable', record_count: 0, retained: false },
      },
    });
    expect(unavailable.availability.repos).toBe(false);
    expect(unavailable.availability.contributions).toBe(false);
    expect(unavailable.stats.stats.total_repos).toBeNull();
    expect(unavailable.user.followers).toBeNull();

    const emptyButAvailable = normalizeGitHubData({
      repos: [],
      contributions: [],
      skills: {},
      user: { followers: 0, following: 0, public_repos: 0 },
      source_status: {
        user_repositories: { status: 'ok', record_count: 0 },
        organization_repositories: { status: 'ok', record_count: 0 },
        contributions: { status: 'ok', record_count: 0 },
        user_profile: { status: 'ok', record_count: 1 },
      },
    });
    expect(emptyButAvailable.availability.repos).toBe(true);
    expect(emptyButAvailable.availability.contributions).toBe(true);
    expect(emptyButAvailable.stats.stats.total_repos).toBe(0);
    expect(emptyButAvailable.user.followers).toBe(0);
  });

  it('does not count missing per-repository metrics as zero', () => {
    const normalized = normalizeGitHubData({
      repos: [
        { name: 'known', stars: 0, forks: 0 },
        { name: 'unknown' },
      ],
    });
    expect(normalized.stats.stats.total_repos).toBe(2);
    expect(normalized.stats.stats.total_stars).toBeNull();
    expect(normalized.stats.stats.own_stars).toBeNull();
    expect(normalized.stats.stats.total_forks).toBeNull();
  });

  it('does not infer personal repository totals from a mixed repository list', () => {
    const normalized = normalizeGitHubData({ repos: [{ name: 'org-project' }] });
    expect(normalized.stats.stats.total_repos).toBe(1);
    expect(normalized.user.total_repos).toBeNull();
  });

  it('derives zero counts only from an explicitly available empty collection', () => {
    const normalized = normalizeGitHubData({ repos: [], contributions: [] });

    expect(normalized.stats.stats.total_repos).toBe(0);
    expect(normalized.stats.stats.total_stars).toBe(0);
    expect(normalized.stats.stats.own_repos).toBe(0);
    expect(normalized.availability.repos).toBe(true);
  });
});
