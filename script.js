import { translations } from './src/i18n/translations.js';

// --- state ---
let currentLang = 'nl';
let githubData = null;
let profileData = null;

// --- language detection from URL or browser ---
const urlParams = new URLSearchParams(window.location.search);
const urlLang = urlParams.get('lang');

function detectLang() {
  const nav = navigator.language || navigator.userLanguage || 'nl';
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('fr')) return 'fr';
  if (nav.startsWith('en')) return 'en';
  return 'nl';
}

function applyLang(lang) {
  currentLang = lang;
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const labelEl = document.getElementById('lang-label');
  if (labelEl) labelEl.textContent = lang.toUpperCase();

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  document.documentElement.lang = currentLang;
  localStorage.setItem('lang', currentLang);
  if (githubData && profileData) {
    renderAll();
    renderPlatformCards();
    renderSkillMatrix();
  }
  document.querySelectorAll('.show-more-btn').forEach(updateToggleLabel);
  const sortButton = document.getElementById('skill-sort-toggle');
  if (sortButton) sortButton.textContent = skillSortLabel();
}

function toggleLang() {
  const order = ['nl', 'en', 'de', 'fr'];
  const idx = order.indexOf(currentLang);
  const next = order[(idx + 1) % order.length];
  applyLang(next);
}

// --- theme ---
function toggleTheme() {
  const el = document.documentElement;
  const cur = el.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  el.setAttribute('data-theme', next);
  document.querySelector('.theme-toggle').textContent =
    next === 'light' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
}

// --- palette ---
function togglePalette() {
  const el = document.documentElement;
  const cur = el.getAttribute('data-palette') || '';
  const palettes = ['', 'nord', 'dracula', 'solarized', 'ocean'];
  const idx = palettes.indexOf(cur);
  const next = palettes[(idx + 1) % palettes.length];
  if (next) {
    el.setAttribute('data-palette', next);
  } else {
    el.removeAttribute('data-palette');
  }
  localStorage.setItem('palette', next || '');
}

// --- language color for repo chips ---
function getLangColor(language) {
  const colors = {
    JavaScript: '#f7df1e',
    Python: '#3776ab',
    TypeScript: '#3178c6',
    Shell: '#4ecdc4',
    HTML: '#e34c26',
    CSS: '#264de4',
    Lua: '#2a2258',
    Rust: '#dea584',
  };
  return colors[language] || '#9ca3b4';
}

// --- render functions ---
function renderProjects() {
  const container = document.getElementById('projects-container');
  const repos = gRepos();
  if (!container || !repos || !repos.length) {
    if (container)
      container.innerHTML =
        '<p class="about-text">' +
        (translations[currentLang].repos_none || 'No repositories found') +
        '</p>';
    return;
  }
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const own = repos
    .filter(r => !r.fork)
    .sort((a, b) => (b.stars || 0) - (a.stars || 0));
  const top = own.slice(0, 6);
  const html = top
    .map(repo => {
      const langColor = repo.language ? getLangColor(repo.language) : '#9ca3b4';
      const topicsHtml = (repo.topics || [])
        .slice(0, 3)
        .map(tag => `<span class="repo-topic">${escapeHtml(tag)}</span>`)
        .join('');
      const desc = repo.description
        ? escapeHtml(repo.description)
        : t.repo_no_desc;
      return `<div class="repo-card">
                <a href="${encodeURI(repo.url)}" target="_blank" rel="noopener" style="text-decoration: none; color: inherit; display: block;">
                    <div class="repo-header">
                        <div class="repo-name">${escapeHtml(repo.name)}</div>
                        <div class="repo-meta">
                            ${repo.stars ? `<span class="repo-stars">⭐ ${Number(repo.stars)}</span>` : ''}
                        </div>
                    </div>
                    ${desc ? `<div class="repo-desc">${desc}</div>` : ''}
                    <div class="repo-footer">
                        ${repo.language && repo.language !== 'Unknown' ? `<span class="repo-lang" style="color:${langColor};">● ${escapeHtml(repo.language)}</span>` : ''}
                        ${topicsHtml}
                    </div>
                </a>
            </div>`;
    })
    .join('');
  container.innerHTML = html;
  setSectionTimestamp('projects', githubData ? githubData.generated_at : null);
}

function renderSkills() {
  const container = document.getElementById('skills-container');
  const skills = gSkills();
  if (!container || !skills) return;
  const entries = Object.entries(skills);
  if (window.autoSortSkills !== false) {
    entries.sort((a, b) => (b[1].percentage || 0) - (a[1].percentage || 0));
  }
  const html = entries
    .map(([lang, data]) => {
      const pct = data.percentage || 0;
      return `<div class="skill-item">
                <div class="skill-name">${escapeHtml(lang)}</div>
                <div class="skill-bar"><div class="skill-fill" style="width:${pct}%;"></div></div>
                <div class="skill-value">${data.repos || 0} repos (${pct}%)</div>
            </div>`;
    })
    .join('');
  container.innerHTML = html;
  setSectionTimestamp('skills', githubData ? githubData.generated_at : null);
}

function renderStats() {
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const st = gTotals();
  const elRepos = document.getElementById('stat-repos');
  const elStars = document.getElementById('stat-stars');
  const elLangs = document.getElementById('stat-langs');
  const elFollowing = document.getElementById('stat-following');
  const elFollowers = document.getElementById('stat-followers');
  if (elRepos) elRepos.textContent = st.own_repos != null ? st.own_repos : 0;
  if (elStars) elStars.textContent = st.own_stars != null ? st.own_stars : 0;
  if (elLangs)
    elLangs.textContent =
      st.languages != null ? st.languages : Object.keys(gSkills()).length;
  if (elFollowing)
    elFollowing.textContent =
      githubData && githubData.user && githubData.user.following != null
        ? githubData.user.following
        : 0;
  if (elFollowers)
    elFollowers.textContent =
      githubData && githubData.user && githubData.user.followers != null
        ? githubData.user.followers
        : 0;
  const note = document.getElementById('stats-note');
  if (note)
    note.textContent =
      t.last_refreshed + ': ' + (githubData ? githubData.generated_at : '—');
  setSectionTimestamp('stats', githubData ? githubData.generated_at : null);
}

function renderContributions() {
  const container = document.getElementById('contributions-container');
  const contributions = gContributions();
  if (!container || !contributions || !contributions.length) {
    if (container)
      container.innerHTML = '<p class="about-text">No recent activity.</p>';
    return;
  }
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const html = contributions
    .slice(0, 10)
    .map(c => {
      const action = t[c.action] || c.action;
      const repo = escapeHtml(c.repo || '');
      return `<div class="contribution-item">
                <span class="contrib-action">${action}</span>
                <span class="contrib-repo">${repo}</span>
            </div>`;
    })
    .join('');
  container.innerHTML = html;
  setSectionTimestamp(
    'contributions',
    githubData ? githubData.generated_at : null
  );
}

function renderContributionHeatmap() {
  const container = document.getElementById('contribution-heatmap');
  const contributions = gContributions();
  if (!container || !contributions || !contributions.length) {
    if (container)
      container.innerHTML = '<p class="about-text">No contribution data.</p>';
    return;
  }
  const byDay = {};
  contributions.forEach(c => {
    const day = (c.date || '').slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  });
  const days = Object.entries(byDay).sort();
  const max = Math.max(...days.map(d => d[1]), 1);
  const html = days
    .map(([day, count]) => {
      const intensity = Math.round((count / max) * 100);
      return `<div class="heatmap-cell" style="opacity:${intensity / 100};" title="${escapeHtml(day)}: ${count}"></div>`;
    })
    .join('');
  container.innerHTML = '<div class="heatmap-grid">' + html + '</div>';
  setSectionTimestamp('heatmap', githubData ? githubData.generated_at : null);
}

function renderAchievements() {
  const container = document.getElementById('achievements-container');
  if (!container || !profileData) return;
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const items = [];
  const thm = profileData.tryhackme;
  const ms = profileData.microsoft;
  if (thm && thm.badges && thm.badges !== 'N/A') {
    items.push({
      label: t.ach_thm_bronze_n || 'TryHackMe Badge',
      value: thm.badges,
    });
  }
  if (ms && ms.badges && ms.badges !== 'N/A') {
    items.push({
      label: t.ach_ms_badges_n || 'Microsoft Learn Badges',
      value: ms.badges,
    });
  }
  if (!items.length) {
    container.innerHTML =
      '<p class="about-text">No achievements available.</p>';
    return;
  }
  const html = items
    .map(
      it =>
        `<div class="achievement-item"><div class="ach-label">${escapeHtml(it.label)}</div><div class="ach-value">${escapeHtml(it.value)}</div></div>`
    )
    .join('');
  container.innerHTML = html;
  setSectionTimestamp('achievements', profileData.generated_at || null);
}

function renderProfiles() {
  const container = document.getElementById('profiles-container');
  if (!container || !profileData) return;
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const links = [];
  if (profileData.github)
    links.push({ name: 'GitHub', url: profileData.github });
  if (profileData.tryhackme_url)
    links.push({ name: 'TryHackMe', url: profileData.tryhackme_url });
  if (!links.length) {
    container.innerHTML =
      '<p class="about-text">' +
      (t.profiles_unavailable || 'Profile statistics temporarily unavailable') +
      '</p>';
    return;
  }
  const html = links
    .map(
      l =>
        `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener" class="profile-link">${escapeHtml(l.name)}</a>`
    )
    .join('');
  container.innerHTML = html;
  setSectionTimestamp('profiles', profileData.generated_at || null);
}

function renderPlatformCards() {
  const container = document.getElementById('platform-cards-container');
  if (!container || !profileData) return;
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const platforms = [
    {
      key: 'tryhackme',
      label: t.platform_tryhackme || 'TryHackMe',
      icon: '🎯',
      data: profileData.tryhackme,
    },
    {
      key: 'ctftime',
      label: t.platform_ctftime || 'CTFtime',
      icon: '🚩',
      data: profileData.ctftime,
    },
    {
      key: 'itchio',
      label: t.platform_itchio || 'itch.io',
      icon: '🎮',
      data: profileData.itchio,
    },
    {
      key: 'codewars',
      label: t.platform_codewars || 'Codewars',
      icon: '⚔️',
      data: profileData.codewars,
    },
    {
      key: 'devto',
      label: t.platform_devto || 'DEV.to',
      icon: '📝',
      data: profileData.devto,
    },
    {
      key: 'stackoverflow',
      label: t.platform_stackoverflow || 'Stack Overflow',
      icon: '❓',
      data: profileData.stackoverflow,
    },
    {
      key: 'stackapps',
      label: t.platform_stackapps || 'Stack Apps',
      icon: '🧩',
      data: profileData.stackapps,
    },
    {
      key: 'microsoft',
      label: t.platform_microsoft || 'Microsoft Learn',
      icon: '🟦',
      data: profileData.microsoft,
    },
  ];
  const html = platforms
    .map(p => {
      if (!p.data) return '';
      const d = p.data;
      const hasReal = Object.values(d).some(
        v => v && v !== 'N/A' && v !== '0' && v !== 0
      );
      if (!hasReal) return '';
      let fieldRows = '';
      for (const [k, v] of Object.entries(d)) {
        if (v && v !== 'N/A' && k !== 'github') {
          fieldRows += `<div class="field-row"><span class="field-key">${escapeHtml(k)}:</span> <span class="field-val">${escapeHtml(v)}</span></div>`;
        }
      }
      const refreshed = d.generated_at
        ? new Date(d.generated_at).toLocaleDateString()
        : '';
      return `<div class="platform-card" style="border-left: 4px solid var(--accent);">
                <div class="card-header">
                    <div class="card-icon" style="color: var(--accent);">${p.icon}</div>
                    <div class="card-name">${p.label}</div>
                </div>
                <details class="stats-popup">
                    <summary style="cursor:pointer;font-size:.8rem;opacity:.8;">📊 ${t.stats || 'Stats'}</summary>
                    ${fieldRows}
                </details>
                <div class="card-footer">${t.last_refreshed || 'Last refreshed'}: ${refreshed}</div>
            </div>`;
    })
    .join('');
  container.innerHTML =
    html || '<p class="about-text">No platform data available.</p>';
  setSectionTimestamp('platform-cards', profileData.generated_at || null);
}
function renderSkillMatrix() {
  const container = document.getElementById('skill-matrix-container');
  if (!container || !profileData) return;

  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const thm =
    profileData && profileData.tryhackme ? profileData.tryhackme : null;
  const matrix =
    thm && thm.skill_matrix && thm.skill_matrix !== 'N/A'
      ? thm.skill_matrix.split(', ').filter(Boolean)
      : [];

  if (matrix.length === 0) {
    container.innerHTML =
      '<div class="skill-matrix-empty">' +
      (t.skill_matrix_unavailable || 'No skill matrix data available') +
      '</div>';
    return;
  }

  const labels = {
    'Entry level': t.skill_entry_level || 'Entry level',
    Foundational: t.skill_foundational || 'Foundational',
    'Security Analyst': t.skill_security_analyst || 'Security Analyst',
    'Penetration Tester': t.skill_penetration_tester || 'Penetration Tester',
    'Security Engineer': t.skill_security_engineer || 'Security Engineer',
  };

  const colors = {
    'Entry level': '#4ecdc4',
    Foundational: '#45b7d1',
    'Security Analyst': '#96ceb4',
    'Penetration Tester': '#ffeead',
    'Security Engineer': '#ff6b6b',
  };

  let html = '<div class="skill-matrix-grid">';
  matrix.forEach(level => {
    html +=
      '<div class="skill-matrix-cell">' +
      '<div class="skill-level">' +
      escapeHtml(level) +
      '</div>' +
      '<span class="skill-label">' +
      (labels[level] || level) +
      '</span>' +
      '</div>';
  });
  html += '</div>';

  html +=
    '<p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem;">' +
    (t.skill_matrix_source || 'Source: TryHackMe live profile data') +
    '</p>';

  container.innerHTML = html;
  setSectionTimestamp(
    'skill-matrix',
    profileData ? profileData.generated_at : null
  );
}
// Normaliseer beide JSON-vormen (flat en nested) naar één canonieke structuur.
// Garandeert altijd: stats.repos (array), stats.skills (object),
// stats.contributions (array), stats.stats {total_repos,total_stars,languages}.
function normalizeGitHubData(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw.stats && typeof raw.stats === 'object' ? raw.stats : {};
  const inner = s.stats && typeof s.stats === 'object' ? s.stats : s;
  const num = v => (typeof v === 'number' && isFinite(v) ? v : 0);

  const repos = Array.isArray(s.repos)
    ? s.repos
    : Array.isArray(raw.repos)
      ? raw.repos
      : [];
  const contributions = Array.isArray(s.contributions)
    ? s.contributions
    : Array.isArray(raw.contributions)
      ? raw.contributions
      : [];
  const skills =
    s.skills && typeof s.skills === 'object' && !Array.isArray(s.skills)
      ? s.skills
      : raw.skills &&
          typeof raw.skills === 'object' &&
          !Array.isArray(raw.skills)
        ? raw.skills
        : {};
  const user =
    raw.user && typeof raw.user === 'object'
      ? raw.user
      : raw.github_user && typeof raw.github_user === 'object'
        ? raw.github_user
        : {};

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
        own_stars:
          num(inner.own_stars) ||
          own.reduce((a, r) => a + num(r && r.stars), 0),
        fork_stars:
          num(inner.fork_stars) ||
          forks.reduce((a, r) => a + num(r && r.stars), 0),
        total_forks:
          num(inner.total_forks) ||
          own.reduce((a, r) => a + num(r && r.forks), 0),
      },
    },
    user: {
      followers: num(user.followers),
      following: num(user.following),
      total_repos: num(user.total_repos) || repos.length,
    },
    generated_at: raw.generated_at || null,
  };
}

// Accessors — na normalizeGitHubData is de vorm canoniek, dus deze
// hoeven geen fallbacks meer te doen. Eén plek i.p.v. tien inline checks.
const gRepos = () =>
  (githubData && githubData.stats && githubData.stats.repos) || [];
const gSkills = () =>
  (githubData && githubData.stats && githubData.stats.skills) || {};
const gContributions = () =>
  (githubData && githubData.stats && githubData.stats.contributions) || [];
const gTotals = () =>
  (githubData && githubData.stats && githubData.stats.stats) || {};
const gOwnRepos = () => {
  const t = gTotals();
  return t.own_repos != null
    ? t.own_repos
    : gRepos().filter(r => !r.fork).length;
};
const gOwnStars = () => {
  const t = gTotals();
  return t.own_stars != null ? t.own_stars : 0;
};

// Toon een foutbanner zonder de pagina te slopen
function showDataError(msg) {
  let el = document.getElementById('data-error-banner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'data-error-banner';
    el.style.cssText =
      'position:fixed;bottom:1rem;left:1rem;right:1rem;max-width:520px;margin:0 auto;background:#7f1d1d;color:#fff;padding:0.6rem 0.9rem;border-radius:8px;font-size:0.8rem;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.4);display:flex;justify-content:space-between;align-items:center;';
    document.body.appendChild(el);
  }
  el.innerHTML =
    '<span>⚠️ </span>' +
    msg +
    '<button aria-label=\"Close\" style=\"background:transparent;border:none;color:#fff;font-size:1.2rem;cursor:pointer;\">&times;</button>';
  const closeBtn = el.querySelector('button');
  if (closeBtn) {
    closeBtn.onclick = () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 15000);
}

// Vervang alleen containers die NOG in hun placeholder-staat staan,
// zodat een fout nooit al gerenderde inhoud wist.
function setFallbackForPlaceholders() {
  const placeholders = [
    ['projects-container', 'Loading projects...'],
    ['skills-container', 'Loading skills...'],
    ['contributions-container', 'Loading activity...'],
    ['contribution-heatmap', 'Loading heatmap...'],
    ['achievements-container', 'Loading achievements...'],
    ['profiles-container', 'Loading profiles...'],
  ];
  placeholders.forEach(([id, placeholder]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const txt = (el.textContent || '').trim();
    const hasContent = el.children.length > 0 && txt.indexOf('Loading') === -1;
    if (!hasContent || txt === placeholder || txt === '') {
      // Veilig: statische literal, geen gebruikersdata
      if (!hasContent)
        el.innerHTML = '<p class="about-text">Unable to load live data</p>';
    }
  });
}

// Escape voor waarden die uit de GitHub-API komen (beschrijvingen, topics,
// repo-namen). Die zijn door de gebruiker zelf te beïnvloeden, dus we
// renderen ze nooit ruw in innerHTML.
function escapeHtml(v) {
  if (v == null) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Uitgelicht werk: top-3 originele projecten op impact (sterren, dan forks).
// Bewust vóór de categorielijst, zodat het beste werk niet verdwijnt
// tussen honderden repos in de categorieën.
function renderFeatured() {
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const section = document.getElementById('featured-section');
  const container = document.getElementById('featured-container');
  if (!section || !container) return;

  const repos = gRepos();
  if (!repos || !repos.length) {
    section.style.display = 'none';
    return;
  }

  const own = repos.filter(r => r && !r.fork);
  if (!own.length) {
    section.style.display = 'none';
    return;
  }

  const score = r => (r.stars || 0) * 10 + (r.forks || 0);
  const top = own
    .slice()
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
  if (!top.length || score(top[0]) === 0) {
    section.style.display = 'none';
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  container.innerHTML = top
    .map(
      (r, i) => `
                <div class="project-item" style="border-left: 3px solid var(--accent); padding-left: 0.75rem; margin-bottom: 1rem;">
                    <div class="project-title">
                        <span style="margin-right: 0.35rem;">${medals[i]}</span>
                        <a href="${encodeURI(r.url || '#')}" target="_blank" rel="noopener" style="color: inherit; text-decoration: none;">${escapeHtml(r.name)}</a>
                        ${r.stars ? `<span style="color: var(--accent2); font-size: 0.8rem; margin-left: 0.4rem;">⭐ ${Number(r.stars) || 0}</span>` : ''}
                        ${r.forks ? `<span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 0.4rem;">🍴 ${Number(r.forks) || 0}</span>` : ''}
                    </div>
                    <div class="project-desc">${escapeHtml(r.description)}</div>
                    <div class="project-tech">
                        ${r.language && r.language !== 'Unknown' ? `<span>${escapeHtml(r.language)}</span>` : ''}
                        ${(r.topics || [])
                          .slice(0, 3)
                          .map(t => `<span>${escapeHtml(t)}</span>`)
                          .join('')}
                    </div>
                </div>
            `
    )
    .join('');

  // Compacte cijferregel — het enige cijfer dat de CV-PDF toont, want
  // Live Activity en Profielen zijn scherm-only.
  const statsEl = document.getElementById('featured-stats');
  if (statsEl) {
    const st = gTotals();
    const sk =
      (githubData && githubData.stats && githubData.stats.skills) || {};
    const nOwn = gOwnRepos();
    const nStars = gOwnStars();
    const nForks = st.total_forks || 0;
    const nLangs = st.languages || Object.keys(sk).length;
    statsEl.textContent = (t.featured_stats || '')
      .replace('{own}', nOwn)
      .replace('{stars}', nStars)
      .replace('{forks}', nForks)
      .replace('{langs}', nLangs);
  }
  setSectionTimestamp('featured', githubData.generated_at);
  section.style.display = '';
}

// Toon de certificaten-sectie alleen als er items in staan.
// Zo blijft de CV netjes zolang de lijst nog niet is aangevuld.
function renderCertificates() {
  const section = document.getElementById('certificates-section');
  const container = document.getElementById('certificates-container');
  if (!section || !container) return;
  const hasItems = container.querySelectorAll('.timeline-item').length > 0;
  section.style.display = hasItems ? '' : 'none';
}

// GitHub Repos Showcase: top repositories by stars with full details.
function renderGitHubRepos() {
  const container = document.getElementById('repos-showcase-container');
  const repos = gRepos();
  if (!repos || !repos.length) {
    container.innerHTML =
      '<p class="about-text">' +
      (translations[currentLang].repos_none || 'No repositories found') +
      '</p>';
    return;
  }

  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  // Sort by stars desc, filter out forks first (own repos), then show top 12
  const own = repos
    .filter(r => !r.fork)
    .sort((a, b) => (b.stars || 0) - (a.stars || 0));
  const top = own.slice(0, 12);

  if (!top.length) {
    container.innerHTML =
      '<p class="about-text">' +
      (translations[currentLang].repos_none || 'No repositories found') +
      '</p>';
    return;
  }

  const html = top
    .map(repo => {
      const langColor = repo.language ? getLangColor(repo.language) : '#9ca3b4';
      const updated = repo.updated_at
        ? new Date(repo.updated_at).toLocaleDateString(
            currentLang === 'nl' ? 'nl-NL' : 'en-US'
          )
        : '';
      const topicsHtml = (repo.topics || [])
        .slice(0, 4)
        .map(tag => `<span class="repo-topic">${escapeHtml(tag)}</span>`)
        .join('');
      const desc = repo.description
        ? escapeHtml(repo.description)
        : t.repo_no_desc;
      return `<div class="repo-card">
                    <a href="${encodeURI(repo.url)}" target="_blank" rel="noopener" style="text-decoration: none; color: inherit; display: block;">
                        <div class="repo-header">
                            <div class="repo-name">${escapeHtml(repo.name)}</div>
                            <div class="repo-meta">
                                ${repo.stars ? `<span class="repo-stars">⭐ ${Number(repo.stars)}</span>` : ''}
                            </div>
                        </div>
                        ${desc ? `<div class="repo-desc">${desc}</div>` : ''}
                        <div class="repo-footer">
                            ${repo.language && repo.language !== 'Unknown' ? `<span class="repo-lang" style="color:${langColor};">● ${escapeHtml(repo.language)}</span>` : ''}
                            ${updated ? `<span class="repo-updated">${updated}</span>` : ''}
                            ${topicsHtml}
                        </div>
                    </a>
                </div>`;
    })
    .join('');

  container.innerHTML = html;
  setSectionTimestamp('repos', githubData.generated_at);
}

// Gource project activity video: hides itself if gource.mp4 isn't available.
function renderGource() {
  const section = document.getElementById('gource-section');
  const video = document.querySelector('#gource-section video');
  if (!section || !video) return;

  // Check whether gource.mp4 exists via HEAD request
  fetch('gource.mp4', { method: 'HEAD', cache: 'no-cache' })
    .then(r => {
      if (r.ok) {
        section.style.display = '';
      } else {
        section.style.display = 'none';
      }
    })
    .catch(() => {
      section.style.display = 'none';
    });
}

// Skill proficiency badges: 1-5 scale for GitHub languages.
function renderProficiency() {
  const section = document.getElementById('proficiency-section');
  const container = document.getElementById('proficiency-container');
  if (!section || !container) return;
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const skills =
    githubData.stats && githubData.stats.skills ? githubData.stats.skills : {};
  const items = Object.entries(skills).sort(
    (a, b) => (b[1].percentage || 0) - (a[1].percentage || 0)
  );
  if (!items.length) {
    container.innerHTML =
      '<p class="about-text">' +
      (t.proficiency_empty || 'No proficiency data available') +
      '</p>';
    section.style.display = '';
    return;
  }
  const html = items
    .slice(0, 10)
    .map(([name, data]) => {
      const pct = Math.round(data.percentage || 0);
      const level =
        pct >= 80 ? 5 : pct >= 60 ? 4 : pct >= 40 ? 3 : pct >= 20 ? 2 : 1;
      return `<div class="card">
                    <div class="card-header">
                        <div class="card-icon">${escapeHtml(name.charAt(0))}</div>
                        <div class="card-name">${escapeHtml(name)}</div>
                    </div>
                    <div class="profile-proficiency">
                        <div class="profile-proficiency-bar-wrap">
                            <div class="profile-proficiency-bar" style="width:${pct}%"></div>
                        </div>
                        <div class="profile-proficiency-level">${level}</div>
                    </div>
                </div>`;
    })
    .join('');
  container.innerHTML = html;
  setSectionTimestamp('proficiency', githubData.generated_at);
  section.style.display = '';
}

// DEV.to articles.
function renderArticles() {
  console.log('DBG-ART step0 entry');
  const section = document.getElementById('articles-section');
  console.log('DBG-ART step1 section=', !!section);
  const container = document.getElementById('articles-container');
  console.log('DBG-ART step2 container=', !!container);
  if (!section || !container) return;
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  console.log('DBG-ART step3 t=', !!t, 'currentLang=', currentLang);
  const articles =
    profileData &&
    profileData.devto &&
    Array.isArray(profileData.devto.articles)
      ? profileData.devto.articles
      : [];
  console.log('DBG-ART step4 articles=', JSON.stringify(articles));
  if (!articles || articles.length === 0) {
    container.innerHTML =
      '<p class="about-text">' +
      (t.writing_articles_empty || 'No articles available') +
      '</p>';
    section.style.display = '';
    return;
  }
  console.log('DBG-ART step5 before map');
  const html = articles
    .slice(0, 5)
    .map(a => {
      const date = a.published_at
        ? new Date(a.published_at).toLocaleDateString(
            currentLang === 'nl' ? 'nl-NL' : 'en-US'
          )
        : '';
      return `<div class="card article-item">
                    <a href="${escapeHtml(a.url || '#')}" target="_blank" rel="noopener">
                        <div class="card-header">
                            <div class="card-icon">📝</div>
                            <div class="card-name">${escapeHtml(a.title || 'Untitled')}</div>
                        </div>
                        <div class="about-text">${escapeHtml(a.excerpt || a.summary || '')}</div>
                        ${date ? `<div class="card-footer">${escapeHtml(date)}</div>` : ''}
                    </a>
                </div>`;
    })
    .join('');
  container.innerHTML = html;
  setSectionTimestamp('articles', profileData.generated_at);
  section.style.display = '';
}

// itch.io games/projects.
function renderItchioGames() {
  const section = document.getElementById('itchio-section');
  const container = document.getElementById('itchio-container');
  if (!section || !container) return;
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const games =
    profileData && profileData.itchio && Array.isArray(profileData.itchio.games)
      ? profileData.itchio.games
      : [];
  if (!games || games.length === 0) {
    container.innerHTML =
      '<p class="about-text">' +
      (t.itchio_games_empty || 'No itch.io games available') +
      '</p>';
    section.style.display = '';
    return;
  }
  const html = games
    .slice(0, 3)
    .map(g => {
      const desc = g.description
        ? escapeHtml(g.description)
        : t.itchio_games_empty;
      return `<div class="card itchio-item">
                    <a href="${escapeHtml(g.url || '#')}" target="_blank" rel="noopener">
                        <div class="card-header">
                            <div class="card-icon">🎮</div>
                            <div class="card-name">${escapeHtml(g.title || 'Untitled')}</div>
                        </div>
                        <div class="about-text">${desc}</div>
                    </a>
                </div>`;
    })
    .join('');
  container.innerHTML = html;
  setSectionTimestamp('itchio', profileData.generated_at);
  section.style.display = '';
}

// Volunteer & community activities.
function renderVolunteer() {
  const section = document.getElementById('volunteer-section');
  const container = document.getElementById('volunteer-container');
  if (!section || !container) return;
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const items =
    profileData &&
    profileData.volunteer &&
    Array.isArray(profileData.volunteer.activities)
      ? profileData.volunteer.activities
      : [];
  if (!items || items.length === 0) {
    container.innerHTML =
      '<p class="about-text">' +
      (t.volunteer_empty || 'No volunteer activity available') +
      '</p>';
    section.style.display = '';
    return;
  }
  const html = items
    .slice(0, 5)
    .map(v => {
      const date = v.date ? escapeHtml(v.date) : '';
      return `<div class="card volunteer-item">
                    <div class="card-header">
                        <div class="card-icon">🤝</div>
                        <div class="card-name">${escapeHtml(v.title || 'Volunteer Activity')}</div>
                    </div>
                    <div class="about-text">${escapeHtml(v.description || '')}</div>
                    ${date ? `<div class="card-footer">${escapeHtml(date)}</div>` : ''}
                </div>`;
    })
    .join('');
  container.innerHTML = html;
  setSectionTimestamp('volunteer', profileData.generated_at);
  section.style.display = '';
}

// Courses & learning paths.
function renderCourses() {
  const section = document.getElementById('courses-section');
  const container = document.getElementById('courses-container');
  if (!section || !container) return;
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const items =
    profileData &&
    profileData.courses &&
    Array.isArray(profileData.courses.paths)
      ? profileData.courses.paths
      : [];
  if (!items || items.length === 0) {
    container.innerHTML =
      '<p class="about-text">' +
      (t.courses_empty || 'No courses available') +
      '</p>';
    section.style.display = '';
    return;
  }
  const html = items
    .slice(0, 5)
    .map(c => {
      const date = c.completed_at ? escapeHtml(c.completed_at) : '';
      return `<div class="card course-item">
                    <div class="card-header">
                        <div class="card-icon">📚</div>
                        <div class="card-name">${escapeHtml(c.title || 'Course')}</div>
                    </div>
                    <div class="about-text">${escapeHtml(c.description || '')}</div>
                    ${date ? `<div class="card-footer">${escapeHtml(date)}</div>` : ''}
                </div>`;
    })
    .join('');
  container.innerHTML = html;
  setSectionTimestamp('courses', profileData.generated_at);
  section.style.display = '';
}

// Helper: set "last updated" timestamp beneath a live-data block.
function setSectionTimestamp(containerId, timestamp) {
  const el = document.getElementById(containerId + '-updated');
  if (!el) return;
  if (timestamp) {
    const date = new Date(timestamp);
    const t = { ...translations.nl, ...(translations[currentLang] || {}) };
    el.textContent =
      (t.last_updated || 'Last updated') +
      ': ' +
      date.toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US') +
      ' ' +
      date.toLocaleTimeString(currentLang === 'nl' ? 'nl-NL' : 'en-US');
  } else {
    el.textContent = '';
  }
}

function renderAll() {
  const steps = [
    ['featured', renderFeatured],
    ['certificates', renderCertificates],
    ['projects', renderProjects],
    ['repos', renderGitHubRepos],
    ['gource', renderGource],
    ['skills', renderSkills],
    ['donut', renderDonut],
    ['stats', renderStats],
    ['contributions', renderContributions],
    ['heatmap', renderContributionHeatmap],
    ['achievements', renderAchievements],
    ['profiles', renderProfiles],
    ['proficiency', renderProficiency],
    ['articles', renderArticles],
    ['itchio', renderItchioGames],
    ['volunteer', renderVolunteer],
    ['courses', renderCourses],
  ];
  const failed = [];
  steps.forEach(([name, fn]) => {
    try {
      fn();
    } catch (e) {
      failed.push(name);
      console.error('Render stap mislukt: ' + name, e);
    }
  });
  // Dynamic footer "last edited" date from profile data
  const footerUpdated = document.getElementById('footer-updated');
  if (footerUpdated && profileData && profileData.generated_at) {
    const t = { ...translations.nl, ...(translations[currentLang] || {}) };
    const date = new Date(
      profileData && profileData.generated_at
        ? profileData.generated_at
        : Date.now()
    );
    footerUpdated.textContent =
      (t.last_updated || 'Last updated') +
      ': ' +
      date.toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US') +
      ' ' +
      date.toLocaleTimeString(currentLang === 'nl' ? 'nl-NL' : 'en-US');
  } else if (footerUpdated) {
    footerUpdated.textContent = '';
  }
  // Dynamic hero "last updated" badge
  const heroUpdated = document.getElementById('hero-updated');
  if (heroUpdated && profileData && profileData.generated_at) {
    const t = { ...translations.nl, ...(translations[currentLang] || {}) };
    const date = new Date(
      profileData && profileData.generated_at
        ? profileData.generated_at
        : Date.now()
    );
    heroUpdated.textContent =
      (t.last_updated || 'Last updated') +
      ': ' +
      date.toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US') +
      ' ' +
      date.toLocaleTimeString(currentLang === 'nl' ? 'nl-NL' : 'en-US');
  } else if (heroUpdated) {
    heroUpdated.textContent = '';
  }
  setSectionTimestamp('gource', githubData.generated_at);
  return failed;
}

async function loadGitHubData() {
  try {
    const resp = await fetch('github-data.json', { cache: 'no-cache' });
    if (!resp.ok) throw new Error('github-data.json HTTP ' + resp.status);
    const raw = await resp.json();
    githubData = normalizeGitHubData(raw);
    if (!githubData) throw new Error('onverwachte datastructuur');

    console.log(
      'GitHub data loaded from github-data.json:',
      gRepos().length,
      'repos'
    );
  } catch (e) {
    console.error('Failed to load GitHub data:', e);
    showDataError(
      'Live data kon niet geladen worden: ' + (e && e.message ? e.message : e)
    );
    setFallbackForPlaceholders();
    return;
  }
}

async function loadProfileData() {
  try {
    const response = await fetch('profile-data.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    profileData = await response.json();
    renderAchievements();
    renderPlatformCards();
    renderSkillMatrix();
  } catch (e) {
    console.error('Failed to load profile data:', e);
    showDataError(
      'Profielgegevens konden niet geladen worden: ' +
        (e && e.message ? e.message : e)
    );
    setFallbackForPlaceholders();
    const matrix = document.getElementById('skill-matrix-container');
    if (matrix && (matrix.textContent || '').includes('Loading')) {
      matrix.innerHTML = '<p class="about-text">Profielgegevens tijdelijk niet beschikbaar</p>';
    }
  }
}

// Initialize
// ?lang=nl|en heeft voorrang: de PDF-generator rendert via een verse
// Chrome-instantie zonder localStorage, dus de taal moet via de URL mee.
// Ook handig als deelbare taalspecifieke link.
const supportedLanguages = ['nl', 'en', 'de', 'fr'];
const storedLang = localStorage.getItem('lang');
const savedLang = supportedLanguages.includes(urlLang)
  ? urlLang
  : supportedLanguages.includes(storedLang)
    ? storedLang
    : detectLang();
applyLang(savedLang);

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
document.querySelector('.theme-toggle').textContent =
  savedTheme === 'light' ? '☀️' : '🌙';

const savedPalette = localStorage.getItem('palette');
if (savedPalette) {
  document.documentElement.setAttribute('data-palette', savedPalette);
}

// Donut chart
function renderDonut() {
  const skills = gSkills();
  if (!skills) return;
  const total = Object.values(skills).reduce((sum, s) => sum + s.repos, 0);
  const colors = {
    Shell: '#4ecdc4',
    Python: '#3776ab',
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#264de4',
  };
  const langNames = {
    Shell: 'Shell/Bash',
    Python: 'Python',
    JavaScript: 'JavaScript',
    TypeScript: 'TypeScript',
    HTML: 'HTML',
    CSS: 'CSS',
  };
  const chart = document.getElementById('donut-chart');
  const legend = document.getElementById('donut-legend');
  if (!chart || !legend) return;
  const size = 180,
    radius = 70,
    strokeWidth = 25;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  let svg =
    '<svg width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 ' +
    size +
    ' ' +
    size +
    '">';
  let skillEntries = Object.entries(skills);
  if (window.autoSortSkills !== false)
    skillEntries = skillEntries
      .slice()
      .sort((a, b) => b[1].percentage - a[1].percentage);
  for (const [lang, data] of skillEntries) {
    const percentage = data.repos / total;
    const dashLength = percentage * circumference;
    const color = colors[lang] || '#9ca3b4';
    svg +=
      '<circle cx="' +
      size / 2 +
      '" cy="' +
      size / 2 +
      '" r="' +
      radius +
      '" fill="none" stroke="' +
      color +
      '" stroke-width="' +
      strokeWidth +
      '" stroke-dasharray="' +
      dashLength +
      ' ' +
      (circumference - dashLength) +
      '" stroke-dashoffset="' +
      -offset +
      '" />';
    offset += dashLength;
  }
  svg += '</svg>';
  chart.innerHTML =
    svg +
    '<div class="donut-center"><div class="donut-total">' +
    total +
    '</div><div class="donut-label">' +
    (currentLang === 'nl' ? 'Repos' : 'Repos') +
    '</div></div>';
  legend.innerHTML = skillEntries
    .map(
      ([lang, data]) =>
        '<div class="legend-item"><div class="legend-color" style="background: ' +
        (colors[lang] || '#9ca3b4') +
        ';"></div><span class="legend-label">' +
        (langNames[lang] || lang) +
        '</span><span class="legend-value">' +
        data.repos +
        ' repos (' +
        data.percentage +
        '%)</span></div>'
    )
    .join('');
}

function downloadJSON() {
  const s = githubData && githubData.stats ? githubData.stats : {};
  const data = {
    name: 'Bauke Molenaar',
    title: 'Technisch professional',
    email: 'bauke.molenaar@gmail.com',
    phone: '+31 6 3606 5494',
    github: 'https://github.com/itsdarklikehell',
    tryhackme: 'https://tryhackme.com/p/SgtStroopwafel',
    hackthebox:
      'https://profile.hackthebox.com/profile/01a0f22b-f959-73b9-925c-c2e2e350db97',
    cylab: 'https://learn.cylabacademy.org/users/SgtStroopwafel',
    skills: s.skills || {},
    repos: s.repos || [],
    generated_at:
      (githubData && githubData.generated_at) || new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bauke-molenaar-cv.json';
  a.click();
  URL.revokeObjectURL(url);
}

function toggleExperience(btn) {
  const card = btn.closest('section.card');
  card.classList.toggle('expanded');
  updateToggleLabel(btn);
}
window.toggleExperience = toggleExperience;
window.downloadJSON = downloadJSON;

// Toggle buttons show "Show more"/"Show less" depending on whether the
// list they belong to is currently expanded, in the active language.
// Buttons that control a container other than their own section name
// it via data-toggle-target.
function updateToggleLabel(btn) {
  // The skill-sort button reuses the .show-more-btn styling but shows
  // the sort state instead of a show-more label.
  if (btn.id === 'skill-sort-toggle') {
    btn.textContent = skillSortLabel();
    return;
  }
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  const target = btn.getAttribute('data-toggle-target');
  const expanded = target
    ? !!document.getElementById(target)?.classList.contains('expanded')
    : !!btn.closest('section.card')?.classList.contains('expanded');
  btn.textContent = expanded
    ? t.show_less || 'Show less'
    : t.show_more || 'Show more';
}
window.updateToggleLabel = updateToggleLabel;

window.autoSortSkills = localStorage.getItem('autoSortSkills') !== 'false';
function toggleSkillSort() {
  window.autoSortSkills = !window.autoSortSkills;
  localStorage.setItem('autoSortSkills', window.autoSortSkills);
  const btn = document.getElementById('skill-sort-toggle');
  if (btn) btn.textContent = skillSortLabel();
  renderSkills();
}
window.toggleSkillSort = toggleSkillSort;

// The sort button reflects the persisted preference, in the active
// language — not a hardcoded "Auto-sort: ON".
function skillSortLabel() {
  const t = { ...translations.nl, ...(translations[currentLang] || {}) };
  return window.autoSortSkills
    ? t.auto_sort_on || 'Auto-sort: ON'
    : t.auto_sort_off || 'Auto-sort: OFF';
}
window.skillSortLabel = skillSortLabel;

function toggleSkillsMore(btn) {
  const c = document.getElementById('skills-container');
  c.classList.toggle('expanded');
  updateToggleLabel(btn);
}
window.toggleSkillsMore = toggleSkillsMore;

function sendEmail(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value,
    email = form.email.value,
    message = form.message.value;
  const subject = encodeURIComponent('CV aanvraag van ' + name);
  const body = encodeURIComponent(
    'Naam: ' + name + '\nE-mail: ' + email + '\n\nBericht:\n' + message
  );
  window.location.href =
    'mailto:bauke.molenaar@gmail.com?subject=' + subject + '&body=' + body;
}

loadGitHubData()
  .then(() => {
    return loadProfileData();
  })
  .then(() => {
    const failed = renderAll();
    if (failed.length) {
      showDataError(
        'Sommige secties konden niet getoond worden: ' + failed.join(', ')
      );
      setFallbackForPlaceholders();
    }
  });

// Wire interactive toggles (runs after DOM is parsed due to defer)
(function () {
  function bind() {
    const langBtn = document.querySelector('.lang-toggle');
    if (langBtn) langBtn.addEventListener('click', toggleLang);
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    const paletteBtn = document.querySelector('.palette-toggle');
    if (paletteBtn) paletteBtn.addEventListener('click', togglePalette);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
