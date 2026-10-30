import { describe, expect, it } from 'vitest';
import { buildContributionHeatmap, getContributionPeriodDays } from '../src/github-activity.js';

const now = Date.parse('2026-10-30T12:00:00Z');

describe('GitHub contribution heatmap', () => {
  it('counts contribution events only and ignores repository metadata', () => {
    const result = buildContributionHeatmap([
      { type: 'PushEvent', date: '2026-10-30T09:00:00Z' },
      { type: 'IssuesEvent', date: '2026-10-30T10:00:00Z' },
      { type: 'CreateEvent', date: '2026-10-29T10:00:00Z' },
      { type: 'PushEvent', date: 'not-a-date' },
      null,
    ], '30d', now);

    expect(result.totalActivities).toBe(3);
    expect(result.activeDays).toBe(2);
    expect(result.counts['2026-10-30']).toBe(2);
    expect(result.counts['2026-10-29']).toBe(1);
  });

  it('supports 30, 90 and 365 day periods', () => {
    expect(buildContributionHeatmap([], '30d', now).days).toHaveLength(30);
    expect(buildContributionHeatmap([], '90d', now).days).toHaveLength(90);
    expect(buildContributionHeatmap([], '365d', now).days).toHaveLength(365);
    expect(getContributionPeriodDays('365d')).toBe(365);
  });

  it('falls back to 30 days for an unknown period', () => {
    const result = buildContributionHeatmap([], 'all', now);
    expect(result.period).toBe('30d');
    expect(result.days).toHaveLength(30);
  });

  it('uses UTC calendar days consistently around midnight', () => {
    const result = buildContributionHeatmap([
      { date: '2026-10-29T23:59:59-02:00' },
    ], '30d', now);
    expect(result.counts['2026-10-30']).toBe(1);
  });
});
