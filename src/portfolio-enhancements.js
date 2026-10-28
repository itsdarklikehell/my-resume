const ROLE_LINKS = [
  ['general', 'Algemeen'],
  ['automation', 'Automatisering'],
  ['software', 'Software / ICT'],
  ['cyber', 'Cybersecurity'],
  ['electrical', 'Elektrotechniek'],
  ['support', 'IT-support'],
];

const SKILL_CATALOG = [
  { label: 'Python', aliases: ['python'], cv: true },
  { label: 'JavaScript', aliases: ['javascript', 'js'], cv: true },
  { label: 'TypeScript', aliases: ['typescript', 'ts'], cv: true },
  { label: 'Shell/Bash', aliases: ['shell', 'bash', 'scripting'], cv: true },
  { label: 'Linux', aliases: ['linux', 'ubuntu', 'debian'], cv: true },
  { label: 'Docker', aliases: ['docker', 'containerization', 'containers'], cv: true },
  { label: 'GitHub Actions', aliases: ['github actions', 'ci/cd', 'continuous integration'], cv: true },
  { label: 'Git', aliases: ['git', 'version control', 'versionbeheer'], cv: true },
  { label: 'HTML/CSS', aliases: ['html', 'css', 'responsive design'], cv: true },
  { label: 'Cybersecurity', aliases: ['cybersecurity', 'cyber security', 'penetration testing', 'pentesting', 'security testing'], cv: true },
  { label: 'Wi-Fi auditing', aliases: ['wi-fi auditing', 'wifi auditing', 'wireless security', 'pwnagotchi'], cv: false },
  { label: 'Burp Suite', aliases: ['burp suite', 'burpsuite'], cv: false },
  { label: 'Automation', aliases: ['automation', 'automatisering', 'scripting', 'workflow automation'], cv: true },
  { label: 'Elektrotechniek', aliases: ['electrical engineering', 'elektrotechniek', 'electrical installations', 'elektro-installaties'], cv: true },
  { label: 'Zonnepanelen', aliases: ['solar panels', 'zonnepanelen', 'photovoltaic', 'pv systems'], cv: true },
  { label: 'NEN 1010', aliases: ['nen 1010'], cv: true },
  { label: 'Probleemoplossing', aliases: ['troubleshooting', 'problem solving', 'probleemoplossing', 'root cause analysis'], cv: true },
  { label: 'Testing', aliases: ['testing', 'tests', 'unit testing', 'test automation'], cv: false },
  { label: 'SQL', aliases: ['sql', 'postgresql', 'mysql'], cv: false },
  { label: 'REST APIs', aliases: ['rest api', 'rest apis', 'api integration'], cv: false },
  { label: 'Networking', aliases: ['networking', 'netwerken', 'tcp/ip', 'dns', 'routing'], cv: true },
];

const FLOWS = {
  automation: {
    label: 'Automatisering',
    intro: 'Een veilige, generieke workflow voor herhaalbare automatisering.',
    steps: [
      ['Input controleren', 'Controleer parameters, paden en vereiste bestanden voordat een taak start.'],
      ['Voorwaarden valideren', 'Stop vroeg bij ontbrekende invoer en geef een begrijpelijke foutmelding.'],
      ['Taak uitvoeren', 'Voer één afgebakende stap uit en vermijd onnodige wijzigingen.'],
      ['Resultaat verifiëren', 'Controleer exitcode, verwachte output en log alleen noodzakelijke informatie.'],
    ],
  },
  cyber: {
    label: 'Cybersecurity',
    intro: 'Een defensieve workflow voor geautoriseerde beveiligingsbeoordelingen.',
    steps: [
      ['Scope en toestemming', 'Leg systemen, tijdvenster en expliciete toestemming vast vóór onderzoek.'],
      ['Inventariseren', 'Breng assets en blootgestelde diensten in kaart binnen de afgesproken scope.'],
      ['Bevindingen valideren', 'Verifieer signalen voorzichtig en beperk impact; vermijd destructieve tests.'],
      ['Rapporteren en herstellen', 'Beschrijf impact, bewijs, prioriteit en een concrete herstelmaatregel.'],
    ],
  },
  electrical: {
    label: 'Elektrotechniek',
    intro: 'Een algemene controlelijst; volg altijd toepasselijke normen en werkafspraken.',
    steps: [
      ['Werkvoorbereiding', 'Controleer opdracht, schema, materiaal en relevante veiligheidsmaatregelen.'],
      ['Veiligstellen', 'Maak de installatie veilig volgens de geldende procedure en controleer dit.'],
      ['Uitvoering', 'Werk volgens schema, voorschriften en de vereiste kwaliteitscontroles.'],
      ['Meten en opleveren', 'Voer vereiste metingen uit, documenteer resultaten en draag de installatie over.'],
    ],
  },
};

const LABELS = {
  nl: {
    cases: 'Project-casestudy’s', casesIntro: 'Automatisch samengesteld uit bestaande repositorygegevens. Resultaten of impact worden niet verondersteld.',
    facts: 'Controleerbare projectgegevens', openRepo: 'Bekijk repository', language: 'Taal', stars: 'Stars', updated: 'Laatst bijgewerkt', topics: 'Onderwerpen',
    matcher: 'Vacature-match met bewijs', matcherIntro: 'Plak een vacaturetekst. De vergelijking draait lokaal in je browser; de tekst wordt niet verstuurd of opgeslagen.',
    pasteJob: 'Vacaturetekst', matchButton: 'Vergelijk vaardigheden', evidence: 'Projectbewijs gevonden', related: 'Gerelateerd in profiel/cv', missing: 'Niet teruggevonden in huidige gegevens', noSkills: 'Geen bekende vaardigheden uit de vacaturetekst herkend. Probeer een tekst met concrete technologieën of functie-eisen.',
    demo: 'Interactieve technische workflow', demoIntro: 'Kies een richting en klik op de stappen om de aanpak te bekijken. Dit is een conceptuele demo, geen live systeemactie.',
    roles: 'Kies functiegerichte introductie', recruiter: 'Recruiter-modus', recruiterOn: 'Recruiter-modus aan', recruiterOff: 'Recruiter-modus uit', recruiterNote: 'Toont de kerninformatie, projecten en contactopties; verbergt ondersteunende details.',
    history: 'Ontwikkeling door de tijd', historyIntro: 'Gebaseerd op repositorymetadata (laatste update), niet op een volledige commitgeschiedenis.',
    analytics: 'Privacyvriendelijke lokale statistieken', analyticsIntro: 'Telt interacties alleen in deze browser. Er wordt niets naar een server of analyticsdienst verstuurd.',
    interactions: 'Lokale interacties', export: 'Exporteer JSON', reset: 'Wis lokale statistieken', analyticsReset: 'Lokale statistieken gewist.', noRepos: 'Geen projectgegevens beschikbaar.', noHistory: 'Geen geldige update-datums gevonden.',
    requirement: 'Vaardigheid', status: 'Beoordeling', proof: 'Voorbeelden', localOnly: 'Lokaal verwerkt — vacaturetekst wordt niet bewaard.',
    workflowStep: 'Stap', choose: 'Kies workflow', noMatch: 'Geen directe projectverwijzing gevonden.',
  },
  en: {
    cases: 'Project case studies', casesIntro: 'Generated from existing repository data. Outcomes and impact are not assumed.',
    facts: 'Verifiable project details', openRepo: 'View repository', language: 'Language', stars: 'Stars', updated: 'Last updated', topics: 'Topics',
    matcher: 'Job match with evidence', matcherIntro: 'Paste a job description. Matching runs locally in your browser; the text is not sent or stored.',
    pasteJob: 'Job description', matchButton: 'Compare skills', evidence: 'Project evidence found', related: 'Related in profile/CV', missing: 'Not found in current data', noSkills: 'No known skills were detected. Try including concrete technologies or job requirements.',
    demo: 'Interactive technical workflow', demoIntro: 'Choose a direction and select steps to inspect the approach. This is a conceptual demo, not a live system action.',
    roles: 'Choose a role-focused introduction', recruiter: 'Recruiter mode', recruiterOn: 'Recruiter mode on', recruiterOff: 'Recruiter mode off', recruiterNote: 'Prioritizes summary, projects and contact details while hiding supporting sections.',
    history: 'Development over time', historyIntro: 'Based on repository metadata (last update), not a complete commit history.',
    analytics: 'Privacy-friendly local statistics', analyticsIntro: 'Counts interactions only in this browser. Nothing is sent to a server or analytics service.',
    interactions: 'Local interactions', export: 'Export JSON', reset: 'Clear local statistics', analyticsReset: 'Local statistics cleared.', noRepos: 'No project data available.', noHistory: 'No valid update dates found.',
    requirement: 'Skill', status: 'Assessment', proof: 'Examples', localOnly: 'Processed locally — job description is not retained.',
    workflowStep: 'Step', choose: 'Choose workflow', noMatch: 'No direct project reference found.',
  },
  de: {
    cases: 'Projekt-Fallstudien', casesIntro: 'Automatisch aus vorhandenen Repository-Daten erstellt. Ergebnisse werden nicht unterstellt.',
    facts: 'Nachprüfbare Projektdaten', openRepo: 'Repository ansehen', language: 'Sprache', stars: 'Stars', updated: 'Zuletzt aktualisiert', topics: 'Themen',
    matcher: 'Stellenabgleich mit Belegen', matcherIntro: 'Stellentext einfügen. Der Abgleich läuft lokal im Browser; der Text wird weder gesendet noch gespeichert.',
    pasteJob: 'Stellentext', matchButton: 'Fähigkeiten vergleichen', evidence: 'Projektbeleg gefunden', related: 'Im Profil/Lebenslauf verwandt', missing: 'In den aktuellen Daten nicht gefunden', noSkills: 'Keine bekannten Fähigkeiten erkannt. Füge konkrete Technologien oder Anforderungen ein.',
    demo: 'Interaktiver technischer Workflow', demoIntro: 'Richtung wählen und Schritte anklicken. Dies ist eine konzeptionelle Demo, keine Live-Aktion.',
    roles: 'Berufsbezogene Einführung wählen', recruiter: 'Recruiter-Modus', recruiterOn: 'Recruiter-Modus aktiv', recruiterOff: 'Recruiter-Modus aus', recruiterNote: 'Priorisiert Kurzprofil, Projekte und Kontakt; Zusatzbereiche werden ausgeblendet.',
    history: 'Entwicklung im Zeitverlauf', historyIntro: 'Basiert auf Repository-Metadaten (letzte Aktualisierung), nicht auf der vollständigen Commit-Historie.',
    analytics: 'Datenschutzfreundliche lokale Statistik', analyticsIntro: 'Zählt Interaktionen nur in diesem Browser. Es werden keine Daten an Server oder Analysedienste gesendet.',
    interactions: 'Lokale Interaktionen', export: 'JSON exportieren', reset: 'Lokale Statistik löschen', analyticsReset: 'Lokale Statistik gelöscht.', noRepos: 'Keine Projektdaten verfügbar.', noHistory: 'Keine gültigen Aktualisierungsdaten gefunden.',
    requirement: 'Fähigkeit', status: 'Bewertung', proof: 'Beispiele', localOnly: 'Lokal verarbeitet — der Stellentext wird nicht gespeichert.',
    workflowStep: 'Schritt', choose: 'Workflow wählen', noMatch: 'Kein direkter Projektbeleg gefunden.',
  },
  fr: {
    cases: 'Études de cas de projets', casesIntro: 'Générées à partir des données existantes des dépôts. Aucun résultat n’est supposé.',
    facts: 'Détails vérifiables', openRepo: 'Voir le dépôt', language: 'Langage', stars: 'Stars', updated: 'Dernière mise à jour', topics: 'Sujets',
    matcher: 'Correspondance avec preuves', matcherIntro: 'Collez une offre. La comparaison se fait localement dans votre navigateur ; le texte n’est ni envoyé ni stocké.',
    pasteJob: 'Description du poste', matchButton: 'Comparer les compétences', evidence: 'Preuve de projet trouvée', related: 'Élément connexe dans le profil/CV', missing: 'Introuvable dans les données actuelles', noSkills: 'Aucune compétence connue détectée. Ajoutez des technologies ou exigences concrètes.',
    demo: 'Workflow technique interactif', demoIntro: 'Choisissez un domaine et cliquez sur les étapes. Ceci est une démo conceptuelle, pas une action système réelle.',
    roles: 'Choisir une introduction par poste', recruiter: 'Mode recruteur', recruiterOn: 'Mode recruteur activé', recruiterOff: 'Mode recruteur désactivé', recruiterNote: 'Met en avant le résumé, les projets et le contact ; masque les sections secondaires.',
    history: 'Évolution dans le temps', historyIntro: 'Basé sur les métadonnées des dépôts (dernière mise à jour), pas sur un historique complet des commits.',
    analytics: 'Statistiques locales respectueuses de la vie privée', analyticsIntro: 'Compte les interactions dans ce navigateur uniquement. Aucune donnée n’est envoyée à un serveur ou service analytique.',
    interactions: 'Interactions locales', export: 'Exporter JSON', reset: 'Effacer les statistiques locales', analyticsReset: 'Statistiques locales effacées.', noRepos: 'Aucune donnée de projet disponible.', noHistory: 'Aucune date de mise à jour valide trouvée.',
    requirement: 'Compétence', status: 'Évaluation', proof: 'Exemples', localOnly: 'Traité localement — le texte de l’offre n’est pas conservé.',
    workflowStep: 'Étape', choose: 'Choisir un workflow', noMatch: 'Aucune référence directe à un projet.',
  },
};

let analyticsPageViewRecorded = false;
let analyticsClickTrackingInstalled = false;

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

const safeUrl = value => {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
};

const validDate = value => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalized = value => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function repoText(repo) {
  return [repo?.name, repo?.description, repo?.language, ...(Array.isArray(repo?.topics) ? repo.topics : [])].join(' ').toLowerCase();
}

export function selectCaseStudyRepos(repos, limit = 3) {
  return (Array.isArray(repos) ? repos : [])
    .filter(repo => repo && !repo.fork && safeUrl(repo.url))
    .slice()
    .sort((a, b) => (Number(b.stars) || 0) - (Number(a.stars) || 0) || (Date.parse(b.updated_at) || 0) - (Date.parse(a.updated_at) || 0))
    .slice(0, Math.max(0, limit));
}

export function buildVacancyMatch(jobText, repos = [], profileData = {}) {
  const text = normalized(jobText);
  if (!text.trim()) return [];
  const safeRepos = (Array.isArray(repos) ? repos : []).filter(repo => repo && !repo.fork);
  const platforms = profileData && typeof profileData === 'object' ? profileData : {};
  const platformText = Object.values(platforms).filter(value => value && typeof value === 'object')
    .flatMap(value => Object.entries(value).filter(([key]) => !['github', 'generated_at'].includes(key)).map(([, value]) => String(value)))
    .join(' ').toLowerCase();
  return SKILL_CATALOG.filter(skill => skill.aliases.some(alias => text.includes(normalized(alias))))
    .map(skill => {
      const matchingRepos = safeRepos.filter(repo => skill.aliases.some(alias => repoText(repo).includes(normalized(alias))));
      const platformEvidence = skill.aliases.some(alias => platformText.includes(normalized(alias)));
      const status = matchingRepos.length ? 'evidence' : (skill.cv || platformEvidence) ? 'related' : 'missing';
      return { skill: skill.label, status, repos: matchingRepos.slice(0, 3), platformEvidence };
    });
}

export function getDevelopmentMilestones(repos, limit = 8) {
  return (Array.isArray(repos) ? repos : [])
    .filter(repo => repo && !repo.fork && validDate(repo.updated_at) && safeUrl(repo.url))
    .slice()
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
    .slice(0, limit)
    .map(repo => ({
      name: repo.name || 'Repository',
      url: safeUrl(repo.url),
      updatedAt: repo.updated_at,
      stars: Number(repo.stars) || 0,
      language: repo.language || '',
    }));
}

export function getWorkflow(name) {
  return FLOWS[name] || FLOWS.automation;
}

function getLocalAnalytics() {
  try {
    const parsed = JSON.parse(localStorage.getItem('resume-local-analytics-v1') || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function recordLocalEvent(eventName) {
  try {
    const events = getLocalAnalytics();
    events[eventName] = (Number(events[eventName]) || 0) + 1;
    localStorage.setItem('resume-local-analytics-v1', JSON.stringify(events));
    return events;
  } catch {
    return {};
  }
}

function totalEvents(events) {
  return Object.values(events).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

export function renderPortfolioEnhancements({ container, repos = [], profileData = {}, lang = 'nl' }) {
  if (!container) return;
  const t = LABELS[lang] || LABELS.nl;
  const locale = ({ nl: 'nl-NL', en: 'en-GB', de: 'de-DE', fr: 'fr-FR' })[lang] || 'nl-NL';
  const caseStudies = selectCaseStudyRepos(repos);
  const milestones = getDevelopmentMilestones(repos);
  const params = new URLSearchParams(window.location.search);
  const currentRole = params.get('role') || 'general';
  const recruiterInitiallyOn = params.get('recruiter') === '1' || localStorage.getItem('resume-recruiter-mode') === 'true';

  const terminalLabels = lang === 'nl'
    ? { title: 'Interactieve portfolio-terminal', intro: 'Probeer een commando. Alles draait lokaal in je browser.', placeholder: 'Typ een commando…', run: 'Uitvoeren', help: 'Beschikbare commando’s: help, about, skills, projects, contact, clear', prompt: 'bauke@portfolio:~
      <h2 id="portfolio-cases-title">${escapeHtml(t.cases)}</h2>
      <p class="about-text">${escapeHtml(t.casesIntro)}</p>
      <div class="portfolio-case-grid">
        ${caseStudies.length ? caseStudies.map(repo => {
          const link = safeUrl(repo.url);
          const topics = (Array.isArray(repo.topics) ? repo.topics : []).slice(0, 6);
          return `<article class="portfolio-case-card">
            <h3>${escapeHtml(repo.name || 'Project')}</h3>
            <p>${escapeHtml(repo.description || 'No repository description is available.')}</p>
            <div class="portfolio-evidence">
              ${repo.language && repo.language !== 'Unknown' ? `<span class="repo-topic">${escapeHtml(t.language)}: ${escapeHtml(repo.language)}</span>` : ''}
              <span class="repo-topic">${escapeHtml(t.stars)}: ${Number(repo.stars) || 0}</span>
              ${validDate(repo.updated_at) ? `<span class="repo-topic">${escapeHtml(t.updated)}: ${escapeHtml(validDate(repo.updated_at).toLocaleDateString(locale))}</span>` : ''}
              ${topics.map(topic => `<span class="repo-topic">${escapeHtml(topic)}</span>`).join('')}
            </div>
            <details><summary>${escapeHtml(t.facts)}</summary>
              <p class="about-text">${escapeHtml(repo.description || 'No description in repository metadata.')}</p>
              <p class="about-text">${escapeHtml(t.topics)}: ${escapeHtml(topics.join(', ') || '—')}</p>
              <p class="about-text">Repository metadata is evidence of project presence, not a measurement of proficiency or project impact.</p>
            </details>
            <a class="portfolio-text-link" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t.openRepo)} ↗</a>
          </article>`;
        }).join('') : `<p class="about-text">${escapeHtml(t.noRepos)}</p>`}
      </div>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-matcher-title">
      <h2 id="portfolio-matcher-title">${escapeHtml(t.matcher)}</h2>
      <p class="about-text">${escapeHtml(t.matcherIntro)}</p>
      <form data-vacancy-matcher>
        <label class="portfolio-label" for="portfolio-job-text">${escapeHtml(t.pasteJob)}</label>
        <textarea id="portfolio-job-text" rows="5" maxlength="20000" data-job-text placeholder="Python, Linux, automation…"></textarea>
        <div class="portfolio-match-actions"><button class="download-btn" type="submit">${escapeHtml(t.matchButton)}</button><span class="about-text">${escapeHtml(t.localOnly)}</span></div>
      </form>
      <div data-match-results aria-live="polite"></div>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-demo-title">
      <h2 id="portfolio-demo-title">${escapeHtml(t.demo)}</h2>
      <p class="about-text">${escapeHtml(t.demoIntro)}</p>
      <div class="portfolio-demo-controls" role="group" aria-label="${escapeHtml(t.choose)}">
        ${Object.entries(FLOWS).map(([key, flow]) => `<button type="button" class="portfolio-demo-choice" data-demo-flow="${key}" aria-pressed="${key === 'automation'}">${escapeHtml(flow.label)}</button>`).join('')}
      </div>
      <p class="about-text" data-demo-intro>${escapeHtml(FLOWS.automation.intro)}</p>
      <div class="portfolio-demo-flow" data-demo-steps></div>
      <div class="portfolio-demo-detail" data-demo-detail aria-live="polite"></div>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-roles-title">
      <h2 id="portfolio-roles-title">${escapeHtml(t.roles)}</h2>
      <nav class="portfolio-role-links" aria-label="${escapeHtml(t.roles)}">
        ${ROLE_LINKS.map(([role, label]) => `<a href="?role=${encodeURIComponent(role)}" ${role === currentRole ? 'aria-current="page"' : ''}>${escapeHtml(label)}</a>`).join('')}
      </nav>
    </section>

    <section class="portfolio-enhancement-block portfolio-recruiter-panel" aria-labelledby="portfolio-recruiter-title">
      <h2 id="portfolio-recruiter-title">${escapeHtml(t.recruiter)}</h2>
      <p class="about-text">${escapeHtml(t.recruiterNote)}</p>
      <button type="button" class="download-btn" data-recruiter-toggle aria-pressed="false"></button>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-history-title">
      <h2 id="portfolio-history-title">${escapeHtml(t.history)}</h2>
      <p class="about-text">${escapeHtml(t.historyIntro)}</p>
      <ol class="portfolio-history">
        ${milestones.length ? milestones.map(item => `<li><time datetime="${escapeHtml(item.updatedAt)}">${escapeHtml(validDate(item.updatedAt).toLocaleDateString(locale))}</time><div><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a><p class="about-text">${escapeHtml(item.language || '—')} · ${Number(item.stars)} ${escapeHtml(t.stars.toLowerCase())}</p></div></li>`).join('') : `<li>${escapeHtml(t.noHistory)}</li>`}
      </ol>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-analytics-title">
      <h2 id="portfolio-analytics-title">${escapeHtml(t.analytics)}</h2>
      <p class="about-text">${escapeHtml(t.analyticsIntro)}</p>
      <p class="portfolio-local-count"><strong data-local-event-total>0</strong> <span>${escapeHtml(t.interactions)}</span></p>
      <div class="portfolio-match-actions">
        <button type="button" class="download-btn" data-analytics-export>${escapeHtml(t.export)}</button>
        <button type="button" class="download-btn portfolio-secondary" data-analytics-reset>${escapeHtml(t.reset)}</button>
      </div>
      <p class="about-text" data-analytics-status aria-live="polite"></p>
    </section>
  `;

  const terminalForm = container.querySelector('[data-terminal-form]');
  const terminalInput = container.querySelector('[data-terminal-input]');
  const terminalOutput = container.querySelector('[data-terminal-output]');
  const terminalProjects = selectCaseStudyRepos(repos, 5);
  const runTerminalCommand = rawCommand => {
    const command = rawCommand.trim().toLowerCase().split(/\\s+/)[0];
    const lines = [];
    if (!command) lines.push(terminalLabels.empty);
    else if (command === 'help') lines.push(terminalLabels.help);
    else if (command === 'about') lines.push(terminalLabels.about);
    else if (command === 'skills') lines.push('Python · Shell/Bash · JavaScript/TypeScript · Linux · GitHub Actions · Automation · Cybersecurity');
    else if (command === 'projects') {
      if (!terminalProjects.length) lines.push(t.noRepos);
      else terminalProjects.forEach(repo => lines.push((repo.name || 'Project') + (repo.language ? ' — ' + repo.language : '')));
    } else if (command === 'contact') lines.push(terminalLabels.contact);
    else if (command === 'clear') { terminalOutput.replaceChildren(); return; }
    else lines.push(terminalLabels.unknown);
    const entry = document.createElement('div');
    entry.className = 'portfolio-terminal-entry';
    const prompt = document.createElement('span');
    prompt.className = 'portfolio-terminal-command';
    prompt.textContent = terminalLabels.prompt + ' ' + (rawCommand || 'help');
    entry.append(prompt);
    lines.forEach(line => {
      const outputLine = document.createElement('p');
      outputLine.textContent = line;
      entry.append(outputLine);
    });
    terminalOutput.append(entry);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };
  terminalForm.addEventListener('submit', event => {
    event.preventDefault();
    const command = terminalInput.value;
    runTerminalCommand(command);
    if (command.trim()) updateAnalyticsTotal(recordLocalEvent('terminal_command_' + command.trim().toLowerCase().split(/\\s+/)[0].replace(/[^a-z0-9_-]/g, '').slice(0, 24)));
    terminalInput.value = '';
  });

  const analyticsTotal = container.querySelector('[data-local-event-total]');
  const updateAnalyticsTotal = events => { if (analyticsTotal) analyticsTotal.textContent = String(totalEvents(events)); };
  updateAnalyticsTotal(getLocalAnalytics());
  if (!analyticsPageViewRecorded) {
    updateAnalyticsTotal(recordLocalEvent('role_view_' + currentRole));
    analyticsPageViewRecorded = true;
  }
  if (!analyticsClickTrackingInstalled) {
    document.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link) return;
      const inlineAction = link.getAttribute('onclick') || '';
      let eventName = null;
      if (/\.pdf(?:$|[?#])/i.test(link.href)) eventName = 'cv_pdf_download';
      else if (inlineAction.includes('downloadJSON')) eventName = 'cv_json_download';
      else if (inlineAction.includes('window.print')) eventName = 'cv_print';
      else if (link.closest('.portfolio-role-links')) eventName = 'role_link_clicked';
      else if (link.closest('#projects-container, #repos-showcase-container, #featured-container, #portfolio-enhancements')) eventName = 'project_or_evidence_opened';
      else if (link.closest('#profiles-container, #platform-cards-container')) eventName = 'profile_link_opened';
      if (eventName) updateAnalyticsTotal(recordLocalEvent(eventName));
    }, true);
    analyticsClickTrackingInstalled = true;
  }

  const recruiterButton = container.querySelector('[data-recruiter-toggle]');
  const setRecruiterMode = enabled => {
    document.body.classList.toggle('recruiter-mode', enabled);
    recruiterButton.setAttribute('aria-pressed', String(enabled));
    recruiterButton.textContent = enabled ? t.recruiterOn : t.recruiterOff;
    document.documentElement.dataset.recruiterMode = String(enabled);
    try { localStorage.setItem('resume-recruiter-mode', String(enabled)); } catch { /* private browsing */ }
    const url = new URL(window.location.href);
    enabled ? url.searchParams.set('recruiter', '1') : url.searchParams.delete('recruiter');
    window.history.replaceState({}, '', url);
  };
  setRecruiterMode(recruiterInitiallyOn);
  recruiterButton.addEventListener('click', () => {
    const enabled = !document.body.classList.contains('recruiter-mode');
    setRecruiterMode(enabled);
    updateAnalyticsTotal(recordLocalEvent(enabled ? 'recruiter_mode_on' : 'recruiter_mode_off'));
  });

  const demoButtons = [...container.querySelectorAll('[data-demo-flow]')];
  const renderFlow = key => {
    const flow = getWorkflow(key);
    demoButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demoFlow === key)));
    container.querySelector('[data-demo-intro]').textContent = flow.intro;
    container.querySelector('[data-demo-steps]').innerHTML = flow.steps.map(([title], index) => `<button type="button" class="portfolio-demo-step" data-demo-step="${index}" aria-pressed="${index === 0}"><span>${index + 1}</span> ${escapeHtml(title)}</button>`).join('');
    container.querySelector('[data-demo-detail]').textContent = flow.steps[0][1];
    container.querySelectorAll('[data-demo-step]').forEach(button => button.addEventListener('click', () => {
      const selected = Number(button.dataset.demoStep);
      container.querySelectorAll('[data-demo-step]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      container.querySelector('[data-demo-detail]').textContent = flow.steps[selected][1];
      updateAnalyticsTotal(recordLocalEvent('demo_step_opened'));
    }));
  };
  demoButtons.forEach(button => button.addEventListener('click', () => {
    renderFlow(button.dataset.demoFlow);
    updateAnalyticsTotal(recordLocalEvent('demo_flow_' + button.dataset.demoFlow));
  }));
  renderFlow('automation');

  const matcher = container.querySelector('[data-vacancy-matcher]');
  matcher.addEventListener('submit', event => {
    event.preventDefault();
    const jobText = container.querySelector('[data-job-text]').value;
    const results = buildVacancyMatch(jobText, repos, profileData);
    const resultsContainer = container.querySelector('[data-match-results]');
    if (!results.length) {
      resultsContainer.innerHTML = `<p class="about-text">${escapeHtml(t.noSkills)}</p>`;
      return;
    }
    const statusLabels = { evidence: t.evidence, related: t.related, missing: t.missing };
    resultsContainer.innerHTML = `<div class="portfolio-match-summary"><strong>${results.filter(item => item.status === 'evidence').length}</strong> ${escapeHtml(t.evidence)} · <strong>${results.filter(item => item.status === 'related').length}</strong> ${escapeHtml(t.related)} · <strong>${results.filter(item => item.status === 'missing').length}</strong> ${escapeHtml(t.missing)}</div>
      <div class="portfolio-match-list">${results.map(item => {
        const refs = item.repos.map(repo => {
          const url = safeUrl(repo.url);
          return url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name)}</a>` : '';
        }).filter(Boolean).join(', ');
        return `<div class="portfolio-match-row" data-status="${item.status}"><strong>${escapeHtml(item.skill)}</strong><span>${escapeHtml(statusLabels[item.status])}</span><div>${refs || (item.platformEvidence ? 'Platform activity signal' : escapeHtml(t.noMatch))}</div></div>`;
      }).join('')}</div>`;
    updateAnalyticsTotal(recordLocalEvent('vacancy_match_run'));
  });

  container.querySelector('[data-analytics-export]').addEventListener('click', () => {
    const data = { scope: 'this-browser-only', exported_at: new Date().toISOString(), events: getLocalAnalytics() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-local-analytics.json';
    link.click();
    URL.revokeObjectURL(url);
  });
  container.querySelector('[data-analytics-reset]').addEventListener('click', () => {
    try { localStorage.removeItem('resume-local-analytics-v1'); } catch { /* private browsing */ }
    updateAnalyticsTotal({});
    container.querySelector('[data-analytics-status]').textContent = t.analyticsReset;
  });
  // No external analytics endpoint is configured; events remain in this browser.
}
, about: 'Technisch professional met ervaring in elektrotechniek en een groeiende focus op software, automatisering en cybersecurity.', contact: 'Contact: bauke.molenaar@gmail.com · GitHub: github.com/itsdarklikehell', empty: 'Typ help om de beschikbare commando’s te zien.', unknown: 'Onbekend commando. Typ help voor opties.' }
    : { title: 'Interactive portfolio terminal', intro: 'Try a command. Everything runs locally in your browser.', placeholder: 'Enter a command…', run: 'Run', help: 'Available commands: help, about, skills, projects, contact, clear', prompt: 'bauke@portfolio:~
      <h2 id="portfolio-cases-title">${escapeHtml(t.cases)}</h2>
      <p class="about-text">${escapeHtml(t.casesIntro)}</p>
      <div class="portfolio-case-grid">
        ${caseStudies.length ? caseStudies.map(repo => {
          const link = safeUrl(repo.url);
          const topics = (Array.isArray(repo.topics) ? repo.topics : []).slice(0, 6);
          return `<article class="portfolio-case-card">
            <h3>${escapeHtml(repo.name || 'Project')}</h3>
            <p>${escapeHtml(repo.description || 'No repository description is available.')}</p>
            <div class="portfolio-evidence">
              ${repo.language && repo.language !== 'Unknown' ? `<span class="repo-topic">${escapeHtml(t.language)}: ${escapeHtml(repo.language)}</span>` : ''}
              <span class="repo-topic">${escapeHtml(t.stars)}: ${Number(repo.stars) || 0}</span>
              ${validDate(repo.updated_at) ? `<span class="repo-topic">${escapeHtml(t.updated)}: ${escapeHtml(validDate(repo.updated_at).toLocaleDateString(locale))}</span>` : ''}
              ${topics.map(topic => `<span class="repo-topic">${escapeHtml(topic)}</span>`).join('')}
            </div>
            <details><summary>${escapeHtml(t.facts)}</summary>
              <p class="about-text">${escapeHtml(repo.description || 'No description in repository metadata.')}</p>
              <p class="about-text">${escapeHtml(t.topics)}: ${escapeHtml(topics.join(', ') || '—')}</p>
              <p class="about-text">Repository metadata is evidence of project presence, not a measurement of proficiency or project impact.</p>
            </details>
            <a class="portfolio-text-link" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t.openRepo)} ↗</a>
          </article>`;
        }).join('') : `<p class="about-text">${escapeHtml(t.noRepos)}</p>`}
      </div>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-matcher-title">
      <h2 id="portfolio-matcher-title">${escapeHtml(t.matcher)}</h2>
      <p class="about-text">${escapeHtml(t.matcherIntro)}</p>
      <form data-vacancy-matcher>
        <label class="portfolio-label" for="portfolio-job-text">${escapeHtml(t.pasteJob)}</label>
        <textarea id="portfolio-job-text" rows="5" maxlength="20000" data-job-text placeholder="Python, Linux, automation…"></textarea>
        <div class="portfolio-match-actions"><button class="download-btn" type="submit">${escapeHtml(t.matchButton)}</button><span class="about-text">${escapeHtml(t.localOnly)}</span></div>
      </form>
      <div data-match-results aria-live="polite"></div>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-demo-title">
      <h2 id="portfolio-demo-title">${escapeHtml(t.demo)}</h2>
      <p class="about-text">${escapeHtml(t.demoIntro)}</p>
      <div class="portfolio-demo-controls" role="group" aria-label="${escapeHtml(t.choose)}">
        ${Object.entries(FLOWS).map(([key, flow]) => `<button type="button" class="portfolio-demo-choice" data-demo-flow="${key}" aria-pressed="${key === 'automation'}">${escapeHtml(flow.label)}</button>`).join('')}
      </div>
      <p class="about-text" data-demo-intro>${escapeHtml(FLOWS.automation.intro)}</p>
      <div class="portfolio-demo-flow" data-demo-steps></div>
      <div class="portfolio-demo-detail" data-demo-detail aria-live="polite"></div>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-roles-title">
      <h2 id="portfolio-roles-title">${escapeHtml(t.roles)}</h2>
      <nav class="portfolio-role-links" aria-label="${escapeHtml(t.roles)}">
        ${ROLE_LINKS.map(([role, label]) => `<a href="?role=${encodeURIComponent(role)}" ${role === currentRole ? 'aria-current="page"' : ''}>${escapeHtml(label)}</a>`).join('')}
      </nav>
    </section>

    <section class="portfolio-enhancement-block portfolio-recruiter-panel" aria-labelledby="portfolio-recruiter-title">
      <h2 id="portfolio-recruiter-title">${escapeHtml(t.recruiter)}</h2>
      <p class="about-text">${escapeHtml(t.recruiterNote)}</p>
      <button type="button" class="download-btn" data-recruiter-toggle aria-pressed="false"></button>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-history-title">
      <h2 id="portfolio-history-title">${escapeHtml(t.history)}</h2>
      <p class="about-text">${escapeHtml(t.historyIntro)}</p>
      <ol class="portfolio-history">
        ${milestones.length ? milestones.map(item => `<li><time datetime="${escapeHtml(item.updatedAt)}">${escapeHtml(validDate(item.updatedAt).toLocaleDateString(locale))}</time><div><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a><p class="about-text">${escapeHtml(item.language || '—')} · ${Number(item.stars)} ${escapeHtml(t.stars.toLowerCase())}</p></div></li>`).join('') : `<li>${escapeHtml(t.noHistory)}</li>`}
      </ol>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-analytics-title">
      <h2 id="portfolio-analytics-title">${escapeHtml(t.analytics)}</h2>
      <p class="about-text">${escapeHtml(t.analyticsIntro)}</p>
      <p class="portfolio-local-count"><strong data-local-event-total>0</strong> <span>${escapeHtml(t.interactions)}</span></p>
      <div class="portfolio-match-actions">
        <button type="button" class="download-btn" data-analytics-export>${escapeHtml(t.export)}</button>
        <button type="button" class="download-btn portfolio-secondary" data-analytics-reset>${escapeHtml(t.reset)}</button>
      </div>
      <p class="about-text" data-analytics-status aria-live="polite"></p>
    </section>
  `;

  const analyticsTotal = container.querySelector('[data-local-event-total]');
  const updateAnalyticsTotal = events => { if (analyticsTotal) analyticsTotal.textContent = String(totalEvents(events)); };
  updateAnalyticsTotal(getLocalAnalytics());
  if (!analyticsPageViewRecorded) {
    updateAnalyticsTotal(recordLocalEvent('role_view_' + currentRole));
    analyticsPageViewRecorded = true;
  }
  if (!analyticsClickTrackingInstalled) {
    document.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link) return;
      const inlineAction = link.getAttribute('onclick') || '';
      let eventName = null;
      if (/\.pdf(?:$|[?#])/i.test(link.href)) eventName = 'cv_pdf_download';
      else if (inlineAction.includes('downloadJSON')) eventName = 'cv_json_download';
      else if (inlineAction.includes('window.print')) eventName = 'cv_print';
      else if (link.closest('.portfolio-role-links')) eventName = 'role_link_clicked';
      else if (link.closest('#projects-container, #repos-showcase-container, #featured-container, #portfolio-enhancements')) eventName = 'project_or_evidence_opened';
      else if (link.closest('#profiles-container, #platform-cards-container')) eventName = 'profile_link_opened';
      if (eventName) updateAnalyticsTotal(recordLocalEvent(eventName));
    }, true);
    analyticsClickTrackingInstalled = true;
  }

  const recruiterButton = container.querySelector('[data-recruiter-toggle]');
  const setRecruiterMode = enabled => {
    document.body.classList.toggle('recruiter-mode', enabled);
    recruiterButton.setAttribute('aria-pressed', String(enabled));
    recruiterButton.textContent = enabled ? t.recruiterOn : t.recruiterOff;
    document.documentElement.dataset.recruiterMode = String(enabled);
    try { localStorage.setItem('resume-recruiter-mode', String(enabled)); } catch { /* private browsing */ }
    const url = new URL(window.location.href);
    enabled ? url.searchParams.set('recruiter', '1') : url.searchParams.delete('recruiter');
    window.history.replaceState({}, '', url);
  };
  setRecruiterMode(recruiterInitiallyOn);
  recruiterButton.addEventListener('click', () => {
    const enabled = !document.body.classList.contains('recruiter-mode');
    setRecruiterMode(enabled);
    updateAnalyticsTotal(recordLocalEvent(enabled ? 'recruiter_mode_on' : 'recruiter_mode_off'));
  });

  const demoButtons = [...container.querySelectorAll('[data-demo-flow]')];
  const renderFlow = key => {
    const flow = getWorkflow(key);
    demoButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demoFlow === key)));
    container.querySelector('[data-demo-intro]').textContent = flow.intro;
    container.querySelector('[data-demo-steps]').innerHTML = flow.steps.map(([title], index) => `<button type="button" class="portfolio-demo-step" data-demo-step="${index}" aria-pressed="${index === 0}"><span>${index + 1}</span> ${escapeHtml(title)}</button>`).join('');
    container.querySelector('[data-demo-detail]').textContent = flow.steps[0][1];
    container.querySelectorAll('[data-demo-step]').forEach(button => button.addEventListener('click', () => {
      const selected = Number(button.dataset.demoStep);
      container.querySelectorAll('[data-demo-step]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      container.querySelector('[data-demo-detail]').textContent = flow.steps[selected][1];
      updateAnalyticsTotal(recordLocalEvent('demo_step_opened'));
    }));
  };
  demoButtons.forEach(button => button.addEventListener('click', () => {
    renderFlow(button.dataset.demoFlow);
    updateAnalyticsTotal(recordLocalEvent('demo_flow_' + button.dataset.demoFlow));
  }));
  renderFlow('automation');

  const matcher = container.querySelector('[data-vacancy-matcher]');
  matcher.addEventListener('submit', event => {
    event.preventDefault();
    const jobText = container.querySelector('[data-job-text]').value;
    const results = buildVacancyMatch(jobText, repos, profileData);
    const resultsContainer = container.querySelector('[data-match-results]');
    if (!results.length) {
      resultsContainer.innerHTML = `<p class="about-text">${escapeHtml(t.noSkills)}</p>`;
      return;
    }
    const statusLabels = { evidence: t.evidence, related: t.related, missing: t.missing };
    resultsContainer.innerHTML = `<div class="portfolio-match-summary"><strong>${results.filter(item => item.status === 'evidence').length}</strong> ${escapeHtml(t.evidence)} · <strong>${results.filter(item => item.status === 'related').length}</strong> ${escapeHtml(t.related)} · <strong>${results.filter(item => item.status === 'missing').length}</strong> ${escapeHtml(t.missing)}</div>
      <div class="portfolio-match-list">${results.map(item => {
        const refs = item.repos.map(repo => {
          const url = safeUrl(repo.url);
          return url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name)}</a>` : '';
        }).filter(Boolean).join(', ');
        return `<div class="portfolio-match-row" data-status="${item.status}"><strong>${escapeHtml(item.skill)}</strong><span>${escapeHtml(statusLabels[item.status])}</span><div>${refs || (item.platformEvidence ? 'Platform activity signal' : escapeHtml(t.noMatch))}</div></div>`;
      }).join('')}</div>`;
    updateAnalyticsTotal(recordLocalEvent('vacancy_match_run'));
  });

  container.querySelector('[data-analytics-export]').addEventListener('click', () => {
    const data = { scope: 'this-browser-only', exported_at: new Date().toISOString(), events: getLocalAnalytics() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-local-analytics.json';
    link.click();
    URL.revokeObjectURL(url);
  });
  container.querySelector('[data-analytics-reset]').addEventListener('click', () => {
    try { localStorage.removeItem('resume-local-analytics-v1'); } catch { /* private browsing */ }
    updateAnalyticsTotal({});
    container.querySelector('[data-analytics-status]').textContent = t.analyticsReset;
  });
  // No external analytics endpoint is configured; events remain in this browser.
}
, about: 'Technical professional with an electrical engineering background and a growing focus on software, automation and cybersecurity.', contact: 'Contact: bauke.molenaar@gmail.com · GitHub: github.com/itsdarklikehell', empty: 'Type help to see available commands.', unknown: 'Unknown command. Type help to see options.' };

  container.innerHTML = `
    <section class="portfolio-enhancement-block portfolio-terminal-block" aria-labelledby="portfolio-terminal-title">
      <h2 id="portfolio-terminal-title">${escapeHtml(terminalLabels.title)}</h2>
      <p class="about-text">${escapeHtml(terminalLabels.intro)}</p>
      <div class="portfolio-terminal" data-terminal>
        <div class="portfolio-terminal-bar"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span><span class="portfolio-terminal-prompt">portfolio.sh</span></div>
        <div class="portfolio-terminal-output" data-terminal-output aria-live="polite"><p>${escapeHtml(terminalLabels.empty)}</p></div>
        <form class="portfolio-terminal-form" data-terminal-form>
          <label for="portfolio-terminal-input">${escapeHtml(terminalLabels.prompt)}</label>
          <input id="portfolio-terminal-input" data-terminal-input autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="80" placeholder="${escapeHtml(terminalLabels.placeholder)}" aria-label="${escapeHtml(terminalLabels.placeholder)}">
          <button type="submit" class="download-btn">${escapeHtml(terminalLabels.run)}</button>
        </form>
      </div>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-cases-title">
      <h2 id="portfolio-cases-title">${escapeHtml(t.cases)}</h2>
      <p class="about-text">${escapeHtml(t.casesIntro)}</p>
      <div class="portfolio-case-grid">
        ${caseStudies.length ? caseStudies.map(repo => {
          const link = safeUrl(repo.url);
          const topics = (Array.isArray(repo.topics) ? repo.topics : []).slice(0, 6);
          return `<article class="portfolio-case-card">
            <h3>${escapeHtml(repo.name || 'Project')}</h3>
            <p>${escapeHtml(repo.description || 'No repository description is available.')}</p>
            <div class="portfolio-evidence">
              ${repo.language && repo.language !== 'Unknown' ? `<span class="repo-topic">${escapeHtml(t.language)}: ${escapeHtml(repo.language)}</span>` : ''}
              <span class="repo-topic">${escapeHtml(t.stars)}: ${Number(repo.stars) || 0}</span>
              ${validDate(repo.updated_at) ? `<span class="repo-topic">${escapeHtml(t.updated)}: ${escapeHtml(validDate(repo.updated_at).toLocaleDateString(locale))}</span>` : ''}
              ${topics.map(topic => `<span class="repo-topic">${escapeHtml(topic)}</span>`).join('')}
            </div>
            <details><summary>${escapeHtml(t.facts)}</summary>
              <p class="about-text">${escapeHtml(repo.description || 'No description in repository metadata.')}</p>
              <p class="about-text">${escapeHtml(t.topics)}: ${escapeHtml(topics.join(', ') || '—')}</p>
              <p class="about-text">Repository metadata is evidence of project presence, not a measurement of proficiency or project impact.</p>
            </details>
            <a class="portfolio-text-link" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t.openRepo)} ↗</a>
          </article>`;
        }).join('') : `<p class="about-text">${escapeHtml(t.noRepos)}</p>`}
      </div>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-matcher-title">
      <h2 id="portfolio-matcher-title">${escapeHtml(t.matcher)}</h2>
      <p class="about-text">${escapeHtml(t.matcherIntro)}</p>
      <form data-vacancy-matcher>
        <label class="portfolio-label" for="portfolio-job-text">${escapeHtml(t.pasteJob)}</label>
        <textarea id="portfolio-job-text" rows="5" maxlength="20000" data-job-text placeholder="Python, Linux, automation…"></textarea>
        <div class="portfolio-match-actions"><button class="download-btn" type="submit">${escapeHtml(t.matchButton)}</button><span class="about-text">${escapeHtml(t.localOnly)}</span></div>
      </form>
      <div data-match-results aria-live="polite"></div>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-demo-title">
      <h2 id="portfolio-demo-title">${escapeHtml(t.demo)}</h2>
      <p class="about-text">${escapeHtml(t.demoIntro)}</p>
      <div class="portfolio-demo-controls" role="group" aria-label="${escapeHtml(t.choose)}">
        ${Object.entries(FLOWS).map(([key, flow]) => `<button type="button" class="portfolio-demo-choice" data-demo-flow="${key}" aria-pressed="${key === 'automation'}">${escapeHtml(flow.label)}</button>`).join('')}
      </div>
      <p class="about-text" data-demo-intro>${escapeHtml(FLOWS.automation.intro)}</p>
      <div class="portfolio-demo-flow" data-demo-steps></div>
      <div class="portfolio-demo-detail" data-demo-detail aria-live="polite"></div>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-roles-title">
      <h2 id="portfolio-roles-title">${escapeHtml(t.roles)}</h2>
      <nav class="portfolio-role-links" aria-label="${escapeHtml(t.roles)}">
        ${ROLE_LINKS.map(([role, label]) => `<a href="?role=${encodeURIComponent(role)}" ${role === currentRole ? 'aria-current="page"' : ''}>${escapeHtml(label)}</a>`).join('')}
      </nav>
    </section>

    <section class="portfolio-enhancement-block portfolio-recruiter-panel" aria-labelledby="portfolio-recruiter-title">
      <h2 id="portfolio-recruiter-title">${escapeHtml(t.recruiter)}</h2>
      <p class="about-text">${escapeHtml(t.recruiterNote)}</p>
      <button type="button" class="download-btn" data-recruiter-toggle aria-pressed="false"></button>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-history-title">
      <h2 id="portfolio-history-title">${escapeHtml(t.history)}</h2>
      <p class="about-text">${escapeHtml(t.historyIntro)}</p>
      <ol class="portfolio-history">
        ${milestones.length ? milestones.map(item => `<li><time datetime="${escapeHtml(item.updatedAt)}">${escapeHtml(validDate(item.updatedAt).toLocaleDateString(locale))}</time><div><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a><p class="about-text">${escapeHtml(item.language || '—')} · ${Number(item.stars)} ${escapeHtml(t.stars.toLowerCase())}</p></div></li>`).join('') : `<li>${escapeHtml(t.noHistory)}</li>`}
      </ol>
    </section>

    <section class="portfolio-enhancement-block" aria-labelledby="portfolio-analytics-title">
      <h2 id="portfolio-analytics-title">${escapeHtml(t.analytics)}</h2>
      <p class="about-text">${escapeHtml(t.analyticsIntro)}</p>
      <p class="portfolio-local-count"><strong data-local-event-total>0</strong> <span>${escapeHtml(t.interactions)}</span></p>
      <div class="portfolio-match-actions">
        <button type="button" class="download-btn" data-analytics-export>${escapeHtml(t.export)}</button>
        <button type="button" class="download-btn portfolio-secondary" data-analytics-reset>${escapeHtml(t.reset)}</button>
      </div>
      <p class="about-text" data-analytics-status aria-live="polite"></p>
    </section>
  `;

  const analyticsTotal = container.querySelector('[data-local-event-total]');
  const updateAnalyticsTotal = events => { if (analyticsTotal) analyticsTotal.textContent = String(totalEvents(events)); };
  updateAnalyticsTotal(getLocalAnalytics());
  if (!analyticsPageViewRecorded) {
    updateAnalyticsTotal(recordLocalEvent('role_view_' + currentRole));
    analyticsPageViewRecorded = true;
  }
  if (!analyticsClickTrackingInstalled) {
    document.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link) return;
      const inlineAction = link.getAttribute('onclick') || '';
      let eventName = null;
      if (/\.pdf(?:$|[?#])/i.test(link.href)) eventName = 'cv_pdf_download';
      else if (inlineAction.includes('downloadJSON')) eventName = 'cv_json_download';
      else if (inlineAction.includes('window.print')) eventName = 'cv_print';
      else if (link.closest('.portfolio-role-links')) eventName = 'role_link_clicked';
      else if (link.closest('#projects-container, #repos-showcase-container, #featured-container, #portfolio-enhancements')) eventName = 'project_or_evidence_opened';
      else if (link.closest('#profiles-container, #platform-cards-container')) eventName = 'profile_link_opened';
      if (eventName) updateAnalyticsTotal(recordLocalEvent(eventName));
    }, true);
    analyticsClickTrackingInstalled = true;
  }

  const recruiterButton = container.querySelector('[data-recruiter-toggle]');
  const setRecruiterMode = enabled => {
    document.body.classList.toggle('recruiter-mode', enabled);
    recruiterButton.setAttribute('aria-pressed', String(enabled));
    recruiterButton.textContent = enabled ? t.recruiterOn : t.recruiterOff;
    document.documentElement.dataset.recruiterMode = String(enabled);
    try { localStorage.setItem('resume-recruiter-mode', String(enabled)); } catch { /* private browsing */ }
    const url = new URL(window.location.href);
    enabled ? url.searchParams.set('recruiter', '1') : url.searchParams.delete('recruiter');
    window.history.replaceState({}, '', url);
  };
  setRecruiterMode(recruiterInitiallyOn);
  recruiterButton.addEventListener('click', () => {
    const enabled = !document.body.classList.contains('recruiter-mode');
    setRecruiterMode(enabled);
    updateAnalyticsTotal(recordLocalEvent(enabled ? 'recruiter_mode_on' : 'recruiter_mode_off'));
  });

  const demoButtons = [...container.querySelectorAll('[data-demo-flow]')];
  const renderFlow = key => {
    const flow = getWorkflow(key);
    demoButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demoFlow === key)));
    container.querySelector('[data-demo-intro]').textContent = flow.intro;
    container.querySelector('[data-demo-steps]').innerHTML = flow.steps.map(([title], index) => `<button type="button" class="portfolio-demo-step" data-demo-step="${index}" aria-pressed="${index === 0}"><span>${index + 1}</span> ${escapeHtml(title)}</button>`).join('');
    container.querySelector('[data-demo-detail]').textContent = flow.steps[0][1];
    container.querySelectorAll('[data-demo-step]').forEach(button => button.addEventListener('click', () => {
      const selected = Number(button.dataset.demoStep);
      container.querySelectorAll('[data-demo-step]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      container.querySelector('[data-demo-detail]').textContent = flow.steps[selected][1];
      updateAnalyticsTotal(recordLocalEvent('demo_step_opened'));
    }));
  };
  demoButtons.forEach(button => button.addEventListener('click', () => {
    renderFlow(button.dataset.demoFlow);
    updateAnalyticsTotal(recordLocalEvent('demo_flow_' + button.dataset.demoFlow));
  }));
  renderFlow('automation');

  const matcher = container.querySelector('[data-vacancy-matcher]');
  matcher.addEventListener('submit', event => {
    event.preventDefault();
    const jobText = container.querySelector('[data-job-text]').value;
    const results = buildVacancyMatch(jobText, repos, profileData);
    const resultsContainer = container.querySelector('[data-match-results]');
    if (!results.length) {
      resultsContainer.innerHTML = `<p class="about-text">${escapeHtml(t.noSkills)}</p>`;
      return;
    }
    const statusLabels = { evidence: t.evidence, related: t.related, missing: t.missing };
    resultsContainer.innerHTML = `<div class="portfolio-match-summary"><strong>${results.filter(item => item.status === 'evidence').length}</strong> ${escapeHtml(t.evidence)} · <strong>${results.filter(item => item.status === 'related').length}</strong> ${escapeHtml(t.related)} · <strong>${results.filter(item => item.status === 'missing').length}</strong> ${escapeHtml(t.missing)}</div>
      <div class="portfolio-match-list">${results.map(item => {
        const refs = item.repos.map(repo => {
          const url = safeUrl(repo.url);
          return url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name)}</a>` : '';
        }).filter(Boolean).join(', ');
        return `<div class="portfolio-match-row" data-status="${item.status}"><strong>${escapeHtml(item.skill)}</strong><span>${escapeHtml(statusLabels[item.status])}</span><div>${refs || (item.platformEvidence ? 'Platform activity signal' : escapeHtml(t.noMatch))}</div></div>`;
      }).join('')}</div>`;
    updateAnalyticsTotal(recordLocalEvent('vacancy_match_run'));
  });

  container.querySelector('[data-analytics-export]').addEventListener('click', () => {
    const data = { scope: 'this-browser-only', exported_at: new Date().toISOString(), events: getLocalAnalytics() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-local-analytics.json';
    link.click();
    URL.revokeObjectURL(url);
  });
  container.querySelector('[data-analytics-reset]').addEventListener('click', () => {
    try { localStorage.removeItem('resume-local-analytics-v1'); } catch { /* private browsing */ }
    updateAnalyticsTotal({});
    container.querySelector('[data-analytics-status]').textContent = t.analyticsReset;
  });
  // No external analytics endpoint is configured; events remain in this browser.
}
