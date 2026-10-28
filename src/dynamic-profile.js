const LABELS = {
  nl: {
    profile: 'Profielrichting', all: 'Alle projecten', cyber: 'Cybersecurity', other: 'Overig',
    automation: 'Automatisering', electrical: 'Elektrotechniek', search: 'Zoek projecten…',
    sort: 'Sorteren', recent: 'Recent bijgewerkt', stars: 'Meeste sterren', name: 'Naam A–Z',
    share: 'Deel deze weergave', copy: 'Kopieer link', copied: 'Link gekopieerd',
    projects: 'projecten', updated: 'Bijgewerkt', language: 'Taal', topics: 'Onderwerpen',
    skills: 'Vaardigheden uit projecten', timeline: 'Recente projectactiviteit',
    noResults: 'Geen projecten gevonden voor deze selectie.', refreshed: 'Brondata vernieuwd',
    allSkills: 'Vaardigheden worden afgeleid van repositorytaal en onderwerpen; dit is geen vaardigheidsmeting.', period: 'Activiteitsperiode', allTime: 'Alle beschikbare datums', last30: 'Afgelopen 30 dagen', last90: 'Afgelopen 90 dagen', last365: 'Afgelopen 12 maanden', stale: 'Brongegevens zijn mogelijk verouderd', unknownFreshness: 'Verversingsdatum van bron onbekend', thm: 'TryHackMe-activiteitssignalen', rooms: 'rooms afgerond', paths: 'paden afgerond', noTimeline: 'Geen projectupdates in deze periode.',
    noDescription: 'Geen beschrijving beschikbaar', starsLabel: 'sterren',
  },
  en: {
    profile: 'Profile focus', all: 'All projects', cyber: 'Cybersecurity', other: 'Other',
    automation: 'Automation', electrical: 'Electrical engineering', search: 'Search projects…',
    sort: 'Sort by', recent: 'Recently updated', stars: 'Most stars', name: 'Name A–Z',
    share: 'Share this view', copy: 'Copy link', copied: 'Link copied',
    projects: 'projects', updated: 'Updated', language: 'Language', topics: 'Topics',
    skills: 'Project-backed skills', timeline: 'Recent project activity',
    noResults: 'No projects found for this selection.', refreshed: 'Source data refreshed',
    allSkills: 'Skills are inferred from repository languages and topics; this is not a skill-level assessment.', period: 'Activity period', allTime: 'All available dates', last30: 'Last 30 days', last90: 'Last 90 days', last365: 'Last 12 months', stale: 'Source data may be outdated', unknownFreshness: 'Source refresh date unavailable', thm: 'TryHackMe activity signals', rooms: 'rooms completed', paths: 'paths completed', noTimeline: 'No project updates in this period.',
    noDescription: 'No description available', starsLabel: 'stars',
  },
  de: {
    profile: 'Profilfokus', all: 'Alle Projekte', cyber: 'Cybersicherheit', other: 'Sonstige',
    automation: 'Automatisierung', electrical: 'Elektrotechnik', search: 'Projekte suchen…',
    sort: 'Sortieren', recent: 'Zuletzt aktualisiert', stars: 'Meiste Sterne', name: 'Name A–Z',
    share: 'Diese Ansicht teilen', copy: 'Link kopieren', copied: 'Link kopiert',
    projects: 'Projekte', updated: 'Aktualisiert', language: 'Sprache', topics: 'Themen',
    skills: 'Durch Projekte belegte Kenntnisse', timeline: 'Letzte Projektaktivität',
    noResults: 'Keine Projekte für diese Auswahl gefunden.', refreshed: 'Quelldaten aktualisiert',
    allSkills: 'Kenntnisse werden aus Repository-Sprache und Themen abgeleitet; dies ist keine Kompetenzbewertung.', period: 'Aktivitätszeitraum', allTime: 'Alle verfügbaren Daten', last30: 'Letzte 30 Tage', last90: 'Letzte 90 Tage', last365: 'Letzte 12 Monate', stale: 'Quelldaten sind möglicherweise veraltet', unknownFreshness: 'Aktualisierungsdatum unbekannt', thm: 'TryHackMe-Aktivitätssignale', rooms: 'abgeschlossene Räume', paths: 'abgeschlossene Pfade', noTimeline: 'Keine Projektaktualisierungen in diesem Zeitraum.',
    noDescription: 'Keine Beschreibung verfügbar', starsLabel: 'Sterne',
  },
  fr: {
    profile: 'Orientation du profil', all: 'Tous les projets', cyber: 'Cybersécurité', other: 'Autres',
    automation: 'Automatisation', electrical: 'Électrotechnique', search: 'Rechercher des projets…',
    sort: 'Trier par', recent: 'Mis à jour récemment', stars: 'Plus d’étoiles', name: 'Nom A–Z',
    share: 'Partager cette vue', copy: 'Copier le lien', copied: 'Lien copié',
    projects: 'projets', updated: 'Mis à jour', language: 'Langage', topics: 'Sujets',
    skills: 'Compétences illustrées par les projets', timeline: 'Activité récente des projets',
    noResults: 'Aucun projet trouvé pour cette sélection.', refreshed: 'Données source actualisées',
    allSkills: 'Les compétences sont déduites du langage et des sujets des dépôts ; ce n’est pas une mesure du niveau.', period: 'Période d’activité', allTime: 'Toutes les dates disponibles', last30: '30 derniers jours', last90: '90 derniers jours', last365: '12 derniers mois', stale: 'Les données source sont peut-être obsolètes', unknownFreshness: 'Date d’actualisation inconnue', thm: 'Indicateurs d’activité TryHackMe', rooms: 'salles terminées', paths: 'parcours terminés', noTimeline: 'Aucune mise à jour de projet pendant cette période.',
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

export function getFreshnessState(generatedAt, now = Date.now(), maxAgeDays = 7) {
  if (!validDate(generatedAt)) return 'unknown';
  const age = now - validDate(generatedAt).getTime();
  if (age < -60 * 60 * 1000) return 'unknown';
  return age > maxAgeDays * 86400000 ? 'stale' : 'fresh';
}

export function getTimelineRepos(repos, period = 'all', now = Date.now()) {
  const safe = (Array.isArray(repos) ? repos : []).filter(repo => repo && !repo.fork && validDate(repo.updated_at));
  const days = ({ '30d': 30, '90d': 90, '365d': 365 })[period];
  const selected = days ? safe.filter(repo => Date.parse(repo.updated_at) >= now - days * 86400000) : safe;
  return selected.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
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

const safeHref = value => {
  if (!value) return '#';
  try {
    const url = new URL(String(value || ''), window.location.href);
    return url.protocol === 'https:' ? url.href : '#';
  } catch {
    return '#';
  }
};

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

export function renderDynamicProjects({ container, repos, generatedAt, profileData = null, lang = 'nl' }) {
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
      <div class="dynamic-timeline-heading"><label>${escapeHtml(t.period)} <select data-timeline-period><option value="all">${escapeHtml(t.allTime)}</option><option value="30d">${escapeHtml(t.last30)}</option><option value="90d">${escapeHtml(t.last90)}</option><option value="365d">${escapeHtml(t.last365)}</option></select></label></div>
      <div class="dynamic-timeline" data-timeline></div>
    </section>
    <section class="dynamic-insights" aria-label="${escapeHtml(t.thm)}"><h3>${escapeHtml(t.thm)}</h3><div data-thm-signals></div></section>
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
          <a href="${escapeHtml(safeHref(repo.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name || 'Untitled project')}</a>
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
      ? skillMap.slice(0, 18).map(([skill, projects]) => `<div class="dynamic-skill-row"><span>${escapeHtml(skill)}</span><span class="dynamic-skill-projects">${projects.slice(0, 4).map(repo => `<a href="${escapeHtml(safeHref(repo.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name || 'Project')}</a>`).join('')}</span></div>`).join('')
      : `<p class="about-text">${escapeHtml(t.noResults)}</p>`;
    const timelineSelect = container.querySelector('[data-timeline-period]');
    const drawTimeline = () => {
      const timeline = getTimelineRepos(filtered, timelineSelect.value).slice(0, 12);
      container.querySelector('[data-timeline]').innerHTML = timeline.length
        ? timeline.map(repo => `<div class="dynamic-timeline-item"><span class="dynamic-timeline-dot"></span><div><strong><a href="${escapeHtml(safeHref(repo.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name || '')}</a></strong><span>${escapeHtml(dateLabel(repo.updated_at, locale))}</span></div></div>`).join('')
        : `<p class="about-text">${escapeHtml(t.noTimeline)}</p>`;
    };
    drawTimeline();
    const thm = profileData && profileData.tryhackme ? profileData.tryhackme : {};
    const thmBits = [];
    if (hasValue(thm.rank)) thmBits.push(`<span class="repo-topic">Rank: ${escapeHtml(thm.rank)}</span>`);
    if (hasValue(thm.rooms_completed)) thmBits.push(`<span class="repo-topic">${escapeHtml(thm.rooms_completed)} ${escapeHtml(t.rooms)}</span>`);
    if (hasValue(thm.paths_completed)) thmBits.push(`<span class="repo-topic">${escapeHtml(thm.paths_completed)} ${escapeHtml(t.paths)}</span>`);
    if (hasValue(thm.top_tools)) thmBits.push(...String(thm.top_tools).split(/,\s*/).filter(hasValue).slice(0, 8).map(tool => `<span class="repo-topic">${escapeHtml(tool)}</span>`));
    container.querySelector('[data-thm-signals]').innerHTML = thmBits.length ? thmBits.join('') : `<p class="about-text">${escapeHtml(t.noResults)}</p>`;
    const freshnessState = getFreshnessState(generatedAt);
    const freshness = dateLabel(generatedAt, locale);
    const freshnessEl = container.querySelector('[data-source-freshness]');
    freshnessEl.textContent = freshness ? `${t.refreshed}: ${freshness}${freshnessState === 'stale' ? ' · ' + t.stale : ''}` : t.unknownFreshness;
    freshnessEl.dataset.freshness = freshnessState;
    refreshUrl();
    window.dispatchEvent(new CustomEvent('resume-profile-change', { detail: { profile: state.profile } }));
  };

  profileSelect.addEventListener('change', drawResults);
  container.querySelector('[data-timeline-period]').addEventListener('change', drawResults);
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
