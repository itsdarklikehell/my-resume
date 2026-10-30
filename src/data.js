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
        total_repos: derived(nestedStats.total_repos, reposSourceAvailable ? repos.length : null),
        total_stars: derived(nestedStats.total_stars, reposSourceAvailable ? sum(repos, 'stars') : null),
        languages: derived(nestedStats.languages, skillsPresent && reposSourceAvailable ? Object.keys(skills).length : null),
        own_repos: derived(nestedStats.own_repos, reposSourceAvailable ? own.length : null),
        fork_repos: derived(nestedStats.fork_repos, reposSourceAvailable ? forks.length : null),
        own_stars: derived(nestedStats.own_stars, reposSourceAvailable ? sum(own, 'stars') : null),
        fork_stars: derived(nestedStats.fork_stars, reposSourceAvailable ? sum(forks, 'stars') : null),
        total_forks: derived(nestedStats.total_forks, reposSourceAvailable ? sum(own, 'forks') : null),
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
