const LABELS = {
  nl: {
    profile: 'Profielrichting', all: 'Alle projecten', cyber: 'Cybersecurity',
    automation: 'Automatisering', electrical: 'Elektrotechniek', search: 'Zoek projecten…',
    sort: 'Sorteren', recent: 'Recent bijgewerkt', stars: 'Meeste sterren', name: 'Naam A–Z',
    share: 'Deel deze weergave', copy: 'Kopieer link', copied: 'Link gekopieerd',
    projects: 'projecten', updated: 'Bijgewerkt', language: 'Taal', topics: 'Onderwerpen',
    skills: 'Vaardigheden uit projecten', timeline: 'Recente projectactiviteit',
    noResults: 'Geen projecten gevonden voor deze selectie.', refreshed: 'Brondata vernieuwd',
    allSkills: 'Vaardigheden worden afgeleid van repositorytaal en onderwerpen; dit is geen vaardigheidsmeting.',
    noDescription: 'Geen beschrijving beschikbaar', starsLabel: 'sterren',
  },
  en: {
    profile: 'Profile focus', all: 'All projects', cyber: 'Cybersecurity',
    automation: 'Automation', electrical: 'Electrical engineering', search: 'Search projects…',
    sort: 'Sort by', recent: 'Recently updated', stars: 'Most stars', name: 'Name A–Z',
    share: 'Share this view', copy: 'Copy link', copied: 'Link copied',
    projects: 'projects', updated: 'Updated', language: 'Language', topics: 'Topics',
    skills: 'Project-backed skills', timeline: 'Recent project activity',
    noResults: 'No projects found for this selection.', refreshed: 'Source data refreshed',
    allSkills: 'Skills are inferred from repository languages and topics; this is not a skill-level assessment.',
    noDescription: 'No description available', starsLabel: 'stars',
  },
  de: {
    profile: 'Profilfokus', all: 'Alle Projekte', cyber: 'Cybersicherheit',
    automation: 'Automatisierung', electrical: 'Elektrotechnik', search: 'Projekte suchen…',
    sort: 'Sortieren', recent: 'Zuletzt aktualisiert', stars: 'Meiste Sterne', name: 'Name A–Z',
    share: 'Diese Ansicht teilen', copy: 'Link kopieren', copied: 'Link kopiert',
    projects: 'Projekte', updated: 'Aktualisiert', language: 'Sprache', topics: 'Themen',
    skills: 'Durch Projekte belegte Kenntnisse', timeline: 'Letzte Projektaktivität',
    noResults: 'Keine Projekte für diese Auswahl gefunden.', refreshed: 'Quelldaten aktualisiert',
    allSkills: 'Kenntnisse werden aus Repository-Sprache und Themen abgeleitet; dies ist keine Kompetenzbewertung.',
    noDescription: 'Keine Beschreibung verfügbar', starsLabel: 'Sterne',
  },
  fr: {
    profile: 'Orientation du profil', all: 'Tous les projets', cyber: 'Cybersécurité',
    automation: 'Automatisation', electrical: 'Électrotechnique', search: 'Rechercher des projets…',
    sort: 'Trier par', recent: 'Mis à jour récemment', stars: 'Plus d’étoiles', name: 'Nom A–Z',
    share: 'Partager cette vue', copy: 'Copier le lien', copied: 'Lien copié',
    projects: 'projets', updated: 'Mis à jour', language: 'Langage', topics: 'Sujets',
    skills: 'Compétences illustrées par les projets', timeline: 'Activité récente des projets',
    noResults: 'Aucun projet trouvé pour cette sélection.', refreshed: 'Données source actualisées',
    allSkills: 'Les compétences sont déduites du langage et des sujets des dépôts ; ce n’est pas une mesure du niveau.',
    noDescription: 'Aucune description disponible', starsLabel: 'étoiles',
  },
};

const normalize = value => String(value ?? '').toLowerCase();
const hasValue = value =>
  value !== null &&
  value !== undefined &&
  !(typeof value === 'string' && ['', 'n/a', 'na', 'unknown', 'null', '-'].includes(value.trim().toLowerCase()));

export function isAvailableValue(value) {
  return hasValue(value);
}

export function classifyRepo(repo) {
  const text = normalize([
    repo?.name,
    repo?.description,
    repo?.language,
    ...(Array.isArray(repo?.topics) ? repo.topics : []),
  ].join(' '));
  const categories = [];
  if (/security|cyber|pwn|pentest|wifi|sdr|ctf|vulnerab|audit|exploit|burp/.test(text)) {
    categories.push('cyber');
  }
  if (/automat|script|shell|bash|python|tooling|installer|workflow|control-center|notify/.test(text)) {
    categories.push('automation');
  }
  if (/electri|solar|electro|wiring|nen.?1010|installation/.test(text)) {
    categories.push('electrical');
  }
  return categories.length ? categories : ['other'];
}

export function filterAndSortRepos(repos, { profile = 'all', query = '', sort = 'recent' } = {}) {
  const safeRepos = Array.isArray(repos) ? repos.filter(repo => repo && !repo.fork) : [];
  const filtered = safeRepos.filter(repo => {
    const matchesProfile = profile === 'all' || classifyRepo(repo).includes(profile);
    const haystack = normalize([
      repo.name, repo.description, repo.language,
      ...(Array.isArray(repo.topics) ? repo.topics : []),
    ].join(' '));
    return matchesProfile && haystack.includes(normalize(query).trim());
  });
  return filtered.sort((a, b) => {
    if (sort === 'name') return String(a.name || '').localeCompare(String(b.name || ''));
    if (sort === 'stars') return (Number(b.stars) || 0) - (Number(a.stars) || 0);
    return (Date.parse(b.updated_at || '') || 0) - (Date.parse(a.updated_at || '') || 0);
  });
}

export function buildSkillProjectMap(repos) {
  const map = new Map();
  (Array.isArray(repos) ? repos : []).forEach(repo => {
    if (!repo || repo.fork) return;
    const skills = new Set([
      hasValue(repo.language) && repo.language !== 'Unknown' ? repo.language : null,
      ...(Array.isArray(repo.topics) ? repo.topics : []),
    ].filter(Boolean));
    skills.forEach(skill => {
      const key = String(skill);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(repo);
    });
  });
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}

const escapeHtml = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const validDate = value => {
  if (!hasValue(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

function dateLabel(value, locale) {
  const date = validDate(value);
  return date ? date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
}

export function renderDynamicProjects({ container, repos, skills = {}, generatedAt, lang = 'nl' }) {
  if (!container) return;
  const t = LABELS[lang] || LABELS.nl;
  const locale = ({ nl: 'nl-NL', en: 'en-GB', de: 'de-DE', fr: 'fr-FR' })[lang] || 'nl-NL';
  const params = new URLSearchParams(window.location.search);
  const state = {
    profile: ['all', 'cyber', 'automation', 'electrical'].includes(params.get('profile')) ? params.get('profile') : 'all',
    query: params.get('q') || '',
    sort: ['recent', 'stars', 'name'].includes(params.get('sort')) ? params.get('sort') : 'recent',
  };

  const refreshUrl = () => {
    const url = new URL(window.location.href);
    state.profile === 'all' ? url.searchParams.delete('profile') : url.searchParams.set('profile', state.profile);
    state.query ? url.searchParams.set('q', state.query) : url.searchParams.delete('q');
    state.sort === 'recent' ? url.searchParams.delete('sort') : url.searchParams.set('sort', state.sort);
    window.history.replaceState({}, '', url);
    const shareInput = container.querySelector('[data-share-url]');
    if (shareInput) shareInput.value = url.href;
  };

  container.innerHTML = `
    <div class="dynamic-project-controls" aria-label="${escapeHtml(t.profile)}">
      <label>${escapeHtml(t.profile)}
        <select data-profile>
          <option value="all">${escapeHtml(t.all)}</option>
          <option value="cyber">${escapeHtml(t.cyber)}</option>
          <option value="automation">${escapeHtml(t.automation)}</option>
          <option value="electrical">${escapeHtml(t.electrical)}</option>
        </select>
      </label>
      <label class="dynamic-search-label">${escapeHtml(t.search)}
        <input type="search" data-query placeholder="${escapeHtml(t.search)}" value="${escapeHtml(state.query)}" />
      </label>
      <label>${escapeHtml(t.sort)}
        <select data-sort>
          <option value="recent">${escapeHtml(t.recent)}</option>
          <option value="stars">${escapeHtml(t.stars)}</option>
          <option value="name">${escapeHtml(t.name)}</option>
        </select>
      </label>
    </div>
    <div class="dynamic-share">
      <input data-share-url aria-label="${escapeHtml(t.share)}" readonly />
      <button type="button" class="dynamic-share-button" data-copy>${escapeHtml(t.copy)}</button>
      <span class="dynamic-copy-status" aria-live="polite"></span>
    </div>
    <div class="dynamic-stats" data-dynamic-stats></div>
    <div class="dynamic-project-results" data-results></div>
    <section class="dynamic-insights" aria-label="${escapeHtml(t.skills)}">
      <h3>${escapeHtml(t.skills)}</h3>
      <p class="about-text">${escapeHtml(t.allSkills)}</p>
      <div class="dynamic-skill-map" data-skill-map></div>
    </section>
    <section class="dynamic-insights" aria-label="${escapeHtml(t.timeline)}">
      <h3>${escapeHtml(t.timeline)}</h3>
      <div class="dynamic-timeline" data-timeline></div>
    </section>
    <p class="section-updated" data-source-freshness></p>
  `;

  const profileSelect = container.querySelector('[data-profile]');
  const queryInput = container.querySelector('[data-query]');
  const sortSelect = container.querySelector('[data-sort]');
  profileSelect.value = state.profile;
  sortSelect.value = state.sort;

  const drawResults = () => {
    state.profile = profileSelect.value;
    state.query = queryInput.value;
    state.sort = sortSelect.value;
    const filtered = filterAndSortRepos(repos, state);
    const result = container.querySelector('[data-results]');
    const stats = container.querySelector('[data-dynamic-stats]');
    stats.textContent = `${filtered.length} ${t.projects}`;
    result.innerHTML = filtered.length ? filtered.map(repo => {
      const categories = classifyRepo(repo).map(key => t[key] || key).join(' · ');
      const updated = dateLabel(repo.updated_at, locale);
      const topics = (Array.isArray(repo.topics) ? repo.topics : []).slice(0, 5)
        .map(topic => `<span class="repo-topic">${escapeHtml(topic)}</span>`).join('');
      return `<article class="dynamic-project-card">
        <div class="dynamic-project-heading">
          <a href="${escapeHtml(repo.url || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name || 'Untitled project')}</a>
          <span class="dynamic-project-stars">${Number(repo.stars) > 0 ? `★ ${Number(repo.stars)}` : ''}</span>
        </div>
        <p>${escapeHtml(hasValue(repo.description) ? repo.description : t.noDescription)}</p>
        <div class="dynamic-project-meta">
          ${hasValue(repo.language) && repo.language !== 'Unknown' ? `<span>${escapeHtml(t.language)}: ${escapeHtml(repo.language)}</span>` : ''}
          ${updated ? `<span>${escapeHtml(t.updated)}: ${escapeHtml(updated)}</span>` : ''}
        </div>
        <div class="project-tech">${topics}<span class="dynamic-category">${escapeHtml(categories)}</span></div>
      </article>`;
    }).join('') : `<p class="about-text">${escapeHtml(t.noResults)}</p>`;
    const skillMap = buildSkillProjectMap(filtered);
    container.querySelector('[data-skill-map]').innerHTML = skillMap.length
      ? skillMap.slice(0, 18).map(([skill, projects]) => `<div class="dynamic-skill-row"><span>${escapeHtml(skill)}</span><span>${projects.length} ${t.projects}</span></div>`).join('')
      : `<p class="about-text">${escapeHtml(t.noResults)}</p>`;
    const timeline = filtered.filter(repo => validDate(repo.updated_at))
      .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)).slice(0, 5);
    container.querySelector('[data-timeline]').innerHTML = timeline.length
      ? timeline.map(repo => `<div class="dynamic-timeline-item"><span class="dynamic-timeline-dot"></span><div><strong>${escapeHtml(repo.name || '')}</strong><span>${escapeHtml(dateLabel(repo.updated_at, locale))}</span></div></div>`).join('')
      : `<p class="about-text">${escapeHtml(t.noResults)}</p>`;
    const freshness = dateLabel(generatedAt, locale);
    container.querySelector('[data-source-freshness]').textContent = freshness ? `${t.refreshed}: ${freshness}` : '';
    refreshUrl();
  };

  profileSelect.addEventListener('change', drawResults);
  queryInput.addEventListener('input', drawResults);
  sortSelect.addEventListener('change', drawResults);
  container.querySelector('[data-copy]').addEventListener('click', async () => {
    const input = container.querySelector('[data-share-url]');
    const status = container.querySelector('.dynamic-copy-status');
    try {
      await navigator.clipboard.writeText(input.value);
      status.textContent = t.copied;
    } catch {
      input.focus();
      input.select();
      status.textContent = input.value;
    }
  });
  drawResults();
}
