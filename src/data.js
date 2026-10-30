export function normalizeGitHubData(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

  const statsSource = raw.stats && typeof raw.stats === 'object' ? raw.stats : {};
  const nestedStats = statsSource.stats && typeof statsSource.stats === 'object'
    ? statsSource.stats
    : statsSource;
  const reposPresent = Array.isArray(statsSource.repos) || Array.isArray(raw.repos);
  const contributionsPresent = Array.isArray(statsSource.contributions) || Array.isArray(raw.contributions);
  const skillsPresent = (
    statsSource.skills && typeof statsSource.skills === 'object' && !Array.isArray(statsSource.skills)
  ) || (
    raw.skills && typeof raw.skills === 'object' && !Array.isArray(raw.skills)
  );

  const repos = Array.isArray(statsSource.repos)
    ? statsSource.repos
    : Array.isArray(raw.repos) ? raw.repos : [];
  const contributions = Array.isArray(statsSource.contributions)
    ? statsSource.contributions
    : Array.isArray(raw.contributions) ? raw.contributions : [];
  const skills = statsSource.skills && typeof statsSource.skills === 'object' && !Array.isArray(statsSource.skills)
    ? statsSource.skills
    : raw.skills && typeof raw.skills === 'object' && !Array.isArray(raw.skills) ? raw.skills : {};
  const user = raw.user && typeof raw.user === 'object'
    ? raw.user
    : raw.github_user && typeof raw.github_user === 'object' ? raw.github_user : {};

  const sourceStatus = raw.source_status && typeof raw.source_status === 'object'
    ? raw.source_status
    : null;
  const repoSources = sourceStatus
    ? [sourceStatus.user_repositories, sourceStatus.organization_repositories].filter(Boolean)
    : [];
  const reposSourceAvailable = sourceStatus
    ? repoSources.some(source => source.status === 'ok' || (source.retained && repos.length > 0))
    : reposPresent;
  const contributionsSourceAvailable = sourceStatus
    ? Boolean(sourceStatus.contributions && (
      sourceStatus.contributions.status === 'ok' ||
      (sourceStatus.contributions.retained && contributions.length > 0)
    ))
    : contributionsPresent;
  const userSourceAvailable = sourceStatus
    ? Boolean(sourceStatus.user_profile && (
      sourceStatus.user_profile.status === 'ok' ||
      (sourceStatus.user_profile.retained && Object.keys(user).length > 0)
    ))
    : Object.keys(user).length > 0;

  const numberOrNull = value => (
    typeof value === 'number' && Number.isFinite(value) ? value : null
  );
  const sum = (items, field) => {
    const values = items.map(item => numberOrNull(item && item[field]));
    if (values.some(value => value === null)) return null;
    return values.reduce((total, value) => total + value, 0);
  };
  const forks = repos.filter(repo => repo && repo.fork);
  const own = repos.filter(repo => repo && !repo.fork);
  const derived = (value, fallback) => numberOrNull(value) ?? fallback;

  return {
    stats: {
      repos,
      skills,
      contributions,
      stats: {
        total_repos: reposSourceAvailable ? derived(nestedStats.total_repos, repos.length) : null,
        total_stars: reposSourceAvailable ? derived(nestedStats.total_stars, sum(repos, 'stars')) : null,
        languages: skillsPresent && reposSourceAvailable ? derived(nestedStats.languages, Object.keys(skills).length) : null,
        own_repos: reposSourceAvailable ? derived(nestedStats.own_repos, own.length) : null,
        fork_repos: reposSourceAvailable ? derived(nestedStats.fork_repos, forks.length) : null,
        own_stars: reposSourceAvailable ? derived(nestedStats.own_stars, sum(own, 'stars')) : null,
        fork_stars: reposSourceAvailable ? derived(nestedStats.fork_stars, sum(forks, 'stars')) : null,
        total_forks: reposSourceAvailable ? derived(nestedStats.total_forks, sum(own, 'forks')) : null,
      },
    },
    user: {
      followers: userSourceAvailable ? numberOrNull(user.followers) : null,
      following: userSourceAvailable ? numberOrNull(user.following) : null,
      total_repos: userSourceAvailable ? numberOrNull(user.total_repos ?? user.public_repos) : null,
    },
    generated_at: raw.generated_at || null,
    source_status: sourceStatus,
    availability: {
      repos: reposSourceAvailable,
      contributions: contributionsSourceAvailable,
      skills: skillsPresent && reposSourceAvailable,
      user: userSourceAvailable,
    },
  };
}
