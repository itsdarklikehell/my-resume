const DAY_MS = 24 * 60 * 60 * 1000;
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isPresent = value => value !== null && value !== undefined && value !== '' && value !== 'N/A';

function freshness(timestamp, now) {
  if (!timestamp) return { status: 'unknown', ageDays: null };
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return { status: 'unknown', ageDays: null };
  const age = now.getTime() - parsed.getTime();
  if (age < 0) return { status: 'future', ageDays: 0 };
  const ageDays = Math.floor(age / DAY_MS);
  return { status: ageDays <= 7 ? 'fresh' : 'stale', ageDays };
}

function countPresentFields(value) {
  if (!isRecord(value)) return 0;
  return Object.values(value).filter(isPresent).length;
}

function inspectRepositories(repos) {
  let missingFields = 0;
  let invalidRecords = 0;
  repos.forEach(repo => {
    if (!isRecord(repo)) {
      invalidRecords += 1;
      return;
    }
    ['name', 'url', 'updated_at', 'stars'].forEach(field => {
      if (!isPresent(repo[field])) missingFields += 1;
    });
    if (isPresent(repo.url)) {
      try {
        const url = new URL(repo.url);
        if (url.protocol !== 'https:' || url.hostname !== 'github.com' || !/^\/[\w.-]+\/[\w.-]+\/?$/.test(url.pathname)) {
          invalidRecords += 1;
        }
      } catch {
        invalidRecords += 1;
      }
    }
    if (isPresent(repo.updated_at) && Number.isNaN(new Date(repo.updated_at).getTime())) {
      invalidRecords += 1;
    }
    if (repo.stars !== undefined && repo.stars !== null &&
        (!Number.isInteger(repo.stars) || repo.stars < 0)) {
      invalidRecords += 1;
    }
  });
  return { missingFields, invalidRecords };
}

function inspectContributions(contributions) {
  let missingFields = 0;
  let invalidRecords = 0;
  contributions.forEach(item => {
    if (!isRecord(item)) {
      invalidRecords += 1;
      return;
    }
    if (!isPresent(item.repo)) missingFields += 1;
    if (!isPresent(item.type)) missingFields += 1;
    if (!isPresent(item.url)) missingFields += 1;
    if (!isPresent(item.date)) missingFields += 1;
    else if (Number.isNaN(new Date(item.date).getTime())) invalidRecords += 1;
    if (isPresent(item.url)) {
      try {
        const url = new URL(item.url);
        if (url.protocol !== 'https:' || url.hostname !== 'github.com') invalidRecords += 1;
      } catch {
        invalidRecords += 1;
      }
    }
  });
  return { missingFields, invalidRecords };
}

function normalizeSourceStatus(sourceStatus) {
  if (!isRecord(sourceStatus)) return [];
  return Object.entries(sourceStatus).map(([name, value]) => ({
    name,
    status: isRecord(value) && typeof value.status === 'string' ? value.status : 'unknown',
    recordCount: isRecord(value) && Number.isInteger(value.record_count) ? value.record_count : null,
    availableFields: isRecord(value) && Number.isInteger(value.available_fields) ? value.available_fields : null,
    retained: Boolean(isRecord(value) && value.retained),
    checkedAt: isRecord(value) ? value.checked_at || null : null,
    lastSuccessfulAt: isRecord(value) ? value.last_successful_at || null : null,
  }));
}

function sourceFreshness(sources, fallbackTimestamp, now) {
  if (!sources.length) return freshness(fallbackTimestamp, now);
  const successful = sources
    .map(source => source.lastSuccessfulAt)
    .filter(value => value && !Number.isNaN(new Date(value).getTime()))
    .sort((left, right) => new Date(left) - new Date(right));
  return successful.length ? freshness(successful[0], now) : { status: 'unknown', ageDays: null };
}

export function analyzeDataQuality({ githubData = null, profileData = null, now = new Date() } = {}) {
  const currentTime = now instanceof Date ? now : new Date(now);
  const reposAvailable = githubData?.availability
    ? Boolean(githubData.availability.repos)
    : Array.isArray(githubData?.stats?.repos);
  const contributionsAvailable = githubData?.availability
    ? Boolean(githubData.availability.contributions)
    : Array.isArray(githubData?.stats?.contributions);
  const repos = reposAvailable && Array.isArray(githubData?.stats?.repos)
    ? githubData.stats.repos
    : [];
  const contributions = contributionsAvailable && Array.isArray(githubData?.stats?.contributions)
    ? githubData.stats.contributions
    : [];
  const repoQuality = inspectRepositories(repos);
  const contributionQuality = inspectContributions(contributions);
  const profilePlatforms = isRecord(profileData)
    ? Object.entries(profileData).filter(([key, value]) =>
      key !== 'generated_at' && key !== 'source_status' && isRecord(value))
    : [];
  const profilePlatformsWithData = profilePlatforms.filter(([, value]) => countPresentFields(value) > 0).length;
  const githubSources = normalizeSourceStatus(githubData?.source_status);
  const profileSources = normalizeSourceStatus(profileData?.source_status);
  const totalMissingFields = repoQuality.missingFields + contributionQuality.missingFields;
  const totalInvalidRecords = repoQuality.invalidRecords + contributionQuality.invalidRecords;

  return {
    githubFreshness: sourceFreshness(githubSources, githubData?.generated_at, currentTime),
    profileFreshness: sourceFreshness(profileSources, profileData?.generated_at, currentTime),
    githubGeneratedAt: githubData?.generated_at || null,
    profileGeneratedAt: profileData?.generated_at || null,
    githubSources,
    profileSources,
    sourceStatusKnown: githubSources.length > 0 || profileSources.length > 0,
    repositories: reposAvailable ? repos.length : null,
    contributions: contributionsAvailable ? contributions.length : null,
    profilePlatformCount: profilePlatforms.length,
    profilePlatformsWithData,
    missingFields: totalMissingFields,
    invalidRecords: totalInvalidRecords,
    unavailableSources: [...githubSources, ...profileSources]
      .filter(source => source.status === 'unavailable').length,
    retainedSources: [...githubSources, ...profileSources]
      .filter(source => source.retained || source.status === 'retained').length,
  };
}
