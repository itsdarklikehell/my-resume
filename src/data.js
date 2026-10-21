        export function normalizeGitHubData(raw) {
            if (!raw || typeof raw !== 'object') return null;
            const s = (raw.stats && typeof raw.stats === 'object') ? raw.stats : {};
            const inner = (s.stats && typeof s.stats === 'object') ? s.stats : s;
            const num = v => (typeof v === 'number' && isFinite(v)) ? v : 0;

            const repos = Array.isArray(s.repos) ? s.repos
                        : (Array.isArray(raw.repos) ? raw.repos : []);
            const contributions = Array.isArray(s.contributions) ? s.contributions
                                : (Array.isArray(raw.contributions) ? raw.contributions : []);
            const skills = (s.skills && typeof s.skills === 'object' && !Array.isArray(s.skills)) ? s.skills
                         : ((raw.skills && typeof raw.skills === 'object' && !Array.isArray(raw.skills)) ? raw.skills : {});
            const user = (raw.user && typeof raw.user === 'object') ? raw.user
                        : ((raw.github_user && typeof raw.github_user === 'object') ? raw.github_user : {});

            const starsFromRepos = repos.reduce((a, r) => a + num(r && r.stars), 0);
            const forks = repos.filter(r => r && r.fork);
            const own = repos.filter(r => r && !r.fork);
            const langsFromSkills = Object.keys(skills).length;

            return {
                stats: {
                    repos: repos,
                    skills: skills,
                    contributions: contributions,
                    stats: {
                        total_repos: num(inner.total_repos) || repos.length,
                        total_stars: num(inner.total_stars) || starsFromRepos,
                        languages: num(inner.languages) || langsFromSkills,
                        // Eigen werk vs forks: de CV toont eigen werk, forks zijn context
                        own_repos: num(inner.own_repos) || own.length,
                        fork_repos: num(inner.fork_repos) || forks.length,
                        own_stars: num(inner.own_stars) || own.reduce((a, r) => a + num(r && r.stars), 0),
                        fork_stars: num(inner.fork_stars) || forks.reduce((a, r) => a + num(r && r.stars), 0),
                        total_forks: num(inner.total_forks) || own.reduce((a, r) => a + num(r && r.forks), 0)
                    }
                },
                user: {
                    followers: num(user.followers),
                    following: num(user.following),
                    total_repos: num(user.total_repos) || repos.length
                },
                generated_at: raw.generated_at || null
            };
        }
