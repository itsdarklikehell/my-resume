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

  const numberOrNull = value => (
    typeof value === 'number' && Number.isFinite(value) ? value : null
  );
  const sum = (items, field) => items.reduce((total, item) => {
    const value = numberOrNull(item && item[field]);
    return total + (value ?? 0);
  }, 0);
  const forks = repos.filter(repo => repo && repo.fork);
  const own = repos.filter(repo => repo && !repo.fork);
  const derived = (value, fallback) => numberOrNull(value) ?? fallback;

  return {
    stats: {
      repos,
      skills,
      contributions,
      stats: {
        total_repos: derived(nestedStats.total_repos, reposPresent ? repos.length : null),
        total_stars: derived(nestedStats.total_stars, reposPresent ? sum(repos, 'stars') : null),
        languages: derived(nestedStats.languages, skillsPresent ? Object.keys(skills).length : null),
        own_repos: derived(nestedStats.own_repos, reposPresent ? own.length : null),
        fork_repos: derived(nestedStats.fork_repos, reposPresent ? forks.length : null),
        own_stars: derived(nestedStats.own_stars, reposPresent ? sum(own, 'stars') : null),
        fork_stars: derived(nestedStats.fork_stars, reposPresent ? sum(forks, 'stars') : null),
        total_forks: derived(nestedStats.total_forks, reposPresent ? sum(own, 'forks') : null),
      },
    },
    user: {
      followers: numberOrNull(user.followers),
      following: numberOrNull(user.following),
      total_repos: derived(user.total_repos ?? user.public_repos, reposPresent ? repos.length : null),
    },
    generated_at: raw.generated_at || null,
    source_status: raw.source_status && typeof raw.source_status === 'object' ? raw.source_status : null,
    availability: {
      repos: reposPresent,
      contributions: contributionsPresent,
      skills: skillsPresent,
      user: Object.keys(user).length > 0,
    },
  };
}
