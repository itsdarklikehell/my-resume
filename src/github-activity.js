const PERIODS = { '30d': 30, '90d': 90, '365d': 365 };

export function buildContributionHeatmap(contributions, period = '30d', now = Date.now()) {
  const daysCount = PERIODS[period] || PERIODS['30d'];
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const days = [];

  for (let offset = daysCount - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setUTCDate(day.getUTCDate() - offset);
    days.push(day.toISOString().slice(0, 10));
  }

  const daySet = new Set(days);
  const counts = Object.fromEntries(days.map(day => [day, 0]));
  (Array.isArray(contributions) ? contributions : []).forEach(event => {
    if (!event || !event.date) return;
    const parsed = new Date(event.date);
    if (Number.isNaN(parsed.getTime())) return;
    const day = parsed.toISOString().slice(0, 10);
    if (daySet.has(day)) counts[day] += 1;
  });

  return {
    period: PERIODS[period] ? period : '30d',
    days,
    counts,
    totalActivities: days.reduce((total, day) => total + counts[day], 0),
    activeDays: days.filter(day => counts[day] > 0).length,
    maxCount: Math.max(1, ...days.map(day => counts[day])),
  };
}

export function getContributionPeriodDays(period = '30d') {
  return PERIODS[period] || PERIODS['30d'];
}
