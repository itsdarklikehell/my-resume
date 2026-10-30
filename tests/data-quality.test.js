import { describe, expect, it } from 'vitest';
import { analyzeDataQuality } from '../src/data-quality.js';

describe('data quality report', () => {
  it('reports freshness, missing fields and invalid records', () => {
    const report = analyzeDataQuality({
      now: new Date('2026-10-30T12:00:00Z'),
      githubData: {
        generated_at: '2026-10-29T12:00:00Z',
        availability: { repos: true, contributions: true },
        stats: {
          repos: [
            { name: 'valid', url: 'https://github.com/owner/valid', updated_at: '2026-10-20T00:00:00Z', stars: 0 },
            { name: 'invalid', url: 'javascript:alert(1)', updated_at: 'not-a-date', stars: -1 },
            { name: '', url: '', updated_at: '' },
          ],
          contributions: [{ repo: '', date: 'bad-date' }],
        },
      },
      profileData: {
        generated_at: '2026-10-01T12:00:00Z',
        tryhackme: { points: 0, xp: '0' },
        hackthebox: { points: 'N/A', xp: 'N/A' },
      },
    });

    expect(report.githubFreshness.status).toBe('fresh');
    expect(report.profileFreshness.status).toBe('stale');
    expect(report.repositories).toBe(3);
    expect(report.contributions).toBe(1);
    expect(report.missingFields).toBeGreaterThan(0);
    expect(report.invalidRecords).toBeGreaterThanOrEqual(4);
    expect(report.profilePlatformCount).toBe(2);
    expect(report.profilePlatformsWithData).toBe(1);
  });

  it('distinguishes successful empty sources from unavailable sources', () => {
    const report = analyzeDataQuality({
      githubData: {
        generated_at: '2026-10-30T12:00:00Z',
        availability: { repos: true, contributions: false },
        stats: { repos: [], contributions: [] },
        source_status: {
          user_repositories: { status: 'ok', record_count: 0 },
          organization_repositories: { status: 'unavailable', record_count: 0, retained: true },
        },
      },
      profileData: {
        source_status: {
          tryhackme: { status: 'empty', available_fields: 0 },
        },
      },
      now: new Date('2026-10-30T12:00:00Z'),
    });

    expect(report.repositories).toBe(0);
    expect(report.contributions).toBeNull();
    expect(report.sourceStatusKnown).toBe(true);
    expect(report.unavailableSources).toBe(1);
    expect(report.retainedSources).toBe(1);
    expect(report.githubSources[0].recordCount).toBe(0);
    expect(report.profileSources[0].recordCount).toBe(0);
  });

  it('does not invent per-source status for legacy snapshots', () => {
    const report = analyzeDataQuality({ githubData: { stats: { repos: [] } }, profileData: {} });
    expect(report.sourceStatusKnown).toBe(false);
    expect(report.githubFreshness.status).toBe('unknown');
  });
});
