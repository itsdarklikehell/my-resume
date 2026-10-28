import { filterAndSortRepos } from './dynamic-profile.js';

const PROFILES = {
  general: {
    projectFilter: 'all',
    nl: { label: 'Algemeen profiel', title: 'Techniek, ICT & probleemoplossing', summary: 'Praktisch ingestelde technisch professional met ervaring in elektrische installaties en zonnepanelen, aangevuld met zelfstandig aangeleerde programmeerkennis en interesse in ICT.', skills: ['Elektrotechniek', 'Python', 'Shell/Bash', 'JavaScript/TypeScript', 'Probleemoplossing'] },
    en: { label: 'General profile', title: 'Technology, IT & problem-solving', summary: 'Hands-on technical professional experienced in electrical installations and solar panels, complemented by self-taught programming skills and an interest in IT.', skills: ['Electrical engineering', 'Python', 'Shell/Bash', 'JavaScript/TypeScript', 'Problem-solving'] },
    de: { label: 'Allgemeines Profil', title: 'Technik, IT & Problemlösung', summary: 'Praxisorientierter technischer Mitarbeiter mit Erfahrung in Elektroinstallationen und Solaranlagen sowie selbst erlernten Programmierkenntnissen und Interesse an IT.', skills: ['Elektrotechnik', 'Python', 'Shell/Bash', 'JavaScript/TypeScript', 'Problemlösung'] },
    fr: { label: 'Profil général', title: 'Technique, informatique et résolution de problèmes', summary: 'Professionnel technique pratique, expérimenté en installations électriques et panneaux solaires, avec des compétences en programmation autodidacte et un intérêt pour l’informatique.', skills: ['Électrotechnique', 'Python', 'Shell/Bash', 'JavaScript/TypeScript', 'Résolution de problèmes'] },
  },
  automation: {
    projectFilter: 'automation',
    nl: { label: 'Automatisering & tooling', title: 'Automatisering, scripts & tooling', summary: 'Zelfstandig aangeleerde programmeerkennis in Shell/Bash, Python en JavaScript/TypeScript, gecombineerd met technische praktijkervaring en aandacht voor procesverbetering.', skills: ['Shell/Bash', 'Python', 'JavaScript/TypeScript', 'Linux', 'GitHub Actions'] },
    en: { label: 'Automation & tooling', title: 'Automation, scripts & tooling', summary: 'Self-taught programming skills in Shell/Bash, Python and JavaScript/TypeScript, combined with hands-on technical experience and a focus on process improvement.', skills: ['Shell/Bash', 'Python', 'JavaScript/TypeScript', 'Linux', 'GitHub Actions'] },
    de: { label: 'Automatisierung & Tools', title: 'Automatisierung, Skripte & Tools', summary: 'Selbst erlernte Programmierkenntnisse in Shell/Bash, Python und JavaScript/TypeScript, kombiniert mit praktischer technischer Erfahrung und Fokus auf Prozessverbesserung.', skills: ['Shell/Bash', 'Python', 'JavaScript/TypeScript', 'Linux', 'GitHub Actions'] },
    fr: { label: 'Automatisation et outils', title: 'Automatisation, scripts et outils', summary: 'Compétences en programmation autodidacte avec Shell/Bash, Python et JavaScript/TypeScript, associées à une expérience technique pratique et à l’amélioration des processus.', skills: ['Shell/Bash', 'Python', 'JavaScript/TypeScript', 'Linux', 'GitHub Actions'] },
  },
  software: {
    projectFilter: 'all',
    nl: { label: 'ICT & software', title: 'Software, programmeren & technisch inzicht', summary: 'ICT-profiel in ontwikkeling met zelfstandig aangeleerde kennis van Python, JavaScript/TypeScript en Shell/Bash. Praktische technische ervaring ondersteunt een gestructureerde aanpak van problemen.', skills: ['Python', 'JavaScript', 'TypeScript', 'Shell/Bash', 'GitHub'] },
    en: { label: 'IT & software', title: 'Software, programming & technical thinking', summary: 'Developing IT profile with self-taught knowledge of Python, JavaScript/TypeScript and Shell/Bash. Practical technical experience supports a structured approach to problem-solving.', skills: ['Python', 'JavaScript', 'TypeScript', 'Shell/Bash', 'GitHub'] },
    de: { label: 'IT & Software', title: 'Software, Programmierung & technisches Denken', summary: 'IT-Profil im Aufbau mit selbst erlernten Kenntnissen in Python, JavaScript/TypeScript und Shell/Bash. Praktische technische Erfahrung unterstützt eine strukturierte Problemlösung.', skills: ['Python', 'JavaScript', 'TypeScript', 'Shell/Bash', 'GitHub'] },
    fr: { label: 'Informatique et logiciel', title: 'Logiciel, programmation et réflexion technique', summary: 'Profil informatique en développement, avec des connaissances autodidactes en Python, JavaScript/TypeScript et Shell/Bash. L’expérience technique pratique favorise une approche structurée des problèmes.', skills: ['Python', 'JavaScript', 'TypeScript', 'Shell/Bash', 'GitHub'] },
  },
  cyber: {
    projectFilter: 'cyber',
    nl: { label: 'Cybersecurity', title: 'Cybersecurity & technische analyse', summary: 'Cybersecurity-enthousiasteling met zelfstandig ontwikkelde ICT-kennis en interesse in securitytools, Linux en technische analyse. Projecten hieronder geven concrete aanknopingspunten om te bekijken.', skills: ['Linux', 'Python', 'Shell/Bash', 'Security', 'Technische analyse'] },
    en: { label: 'Cybersecurity', title: 'Cybersecurity & technical analysis', summary: 'Cybersecurity enthusiast with self-developed IT knowledge and an interest in security tools, Linux and technical analysis. Projects below provide concrete examples to explore.', skills: ['Linux', 'Python', 'Shell/Bash', 'Security', 'Technical analysis'] },
    de: { label: 'Cybersicherheit', title: 'Cybersicherheit & technische Analyse', summary: 'Cybersecurity-Enthusiast mit selbst erworbenen IT-Kenntnissen und Interesse an Sicherheitstools, Linux und technischer Analyse. Die Projekte unten bieten konkrete Beispiele.', skills: ['Linux', 'Python', 'Shell/Bash', 'Sicherheit', 'Technische Analyse'] },
    fr: { label: 'Cybersécurité', title: 'Cybersécurité et analyse technique', summary: 'Passionné de cybersécurité, avec des connaissances informatiques autodidactes et un intérêt pour les outils de sécurité, Linux et l’analyse technique. Les projets ci-dessous donnent des exemples concrets.', skills: ['Linux', 'Python', 'Shell/Bash', 'Sécurité', 'Analyse technique'] },
  },
  electrical: {
    projectFilter: 'electrical',
    nl: { label: 'Elektrotechniek', title: 'Elektrotechniek & installatietechniek', summary: 'Praktisch ervaren monteur met ervaring in sterkstroominstallaties, zonnepanelen en elektrotechnische montage. Combineert nauwkeurig werken met technisch inzicht en brede interesse in ICT.', skills: ['Sterkstroominstallaties', 'Zonnepanelen', 'Bekabeling', 'Installatietechniek', 'Technisch oplossen'] },
    en: { label: 'Electrical engineering', title: 'Electrical & installation engineering', summary: 'Hands-on technician experienced in power installations, solar panels and electrical assembly. Combines careful work with technical insight and a broad interest in IT.', skills: ['Power installations', 'Solar panels', 'Wiring', 'Installation work', 'Troubleshooting'] },
    de: { label: 'Elektrotechnik', title: 'Elektro- & Installationstechnik', summary: 'Praxisorientierter Monteur mit Erfahrung in Starkstrominstallationen, Solaranlagen und Elektromontage. Verbindet sorgfältiges Arbeiten mit technischem Verständnis und IT-Interesse.', skills: ['Starkstrominstallationen', 'Solaranlagen', 'Verkabelung', 'Installationstechnik', 'Fehlerbehebung'] },
    fr: { label: 'Électrotechnique', title: 'Électricité et installations techniques', summary: 'Technicien pratique expérimenté en installations électriques de puissance, panneaux solaires et montage électrique. Allie rigueur, compréhension technique et intérêt pour l’informatique.', skills: ['Installations électriques', 'Panneaux solaires', 'Câblage', 'Installations techniques', 'Dépannage'] },
  },
  support: {
    projectFilter: 'all',
    nl: { label: 'IT-support & beheer', title: 'Technische ondersteuning & troubleshooting', summary: 'Technisch professional met ervaring in installatie en onderhoud van computernetwerken en telecommunicatie, aangevuld met zelfstudie in Linux, scripting en programmeertalen.', skills: ['Troubleshooting', 'Computernetwerken', 'Linux', 'Shell/Bash', 'Python'] },
    en: { label: 'IT support & operations', title: 'Technical support & troubleshooting', summary: 'Technical professional with experience installing and maintaining computer networks and telecommunications, complemented by self-study in Linux, scripting and programming languages.', skills: ['Troubleshooting', 'Computer networks', 'Linux', 'Shell/Bash', 'Python'] },
    de: { label: 'IT-Support & Betrieb', title: 'Technischer Support & Fehlerbehebung', summary: 'Technischer Mitarbeiter mit Erfahrung bei Installation und Wartung von Computernetzwerken und Telekommunikation sowie selbst erlernten Kenntnissen in Linux, Skripting und Programmierung.', skills: ['Fehlerbehebung', 'Computernetzwerke', 'Linux', 'Shell/Bash', 'Python'] },
    fr: { label: 'Support informatique', title: 'Assistance technique et dépannage', summary: 'Professionnel technique ayant une expérience dans l’installation et la maintenance de réseaux informatiques et télécommunications, complétée par l’autoformation en Linux, scripts et programmation.', skills: ['Dépannage', 'Réseaux informatiques', 'Linux', 'Shell/Bash', 'Python'] },
  },
};

const UI = {
  nl: { select: 'Richt dit CV op een vacature', evidence: 'Projecten als onderbouwing', note: 'Profieltekst en volgorde worden aangepast; je werkervaring en kwalificaties blijven ongewijzigd.', noProjects: 'Er zijn geen passende openbare projecten gevonden; bekijk alle projecten hieronder.' },
  en: { select: 'Tailor this CV to a job type', evidence: 'Projects as evidence', note: 'The summary and section order adapt; your work history and qualifications remain unchanged.', noProjects: 'No matching public projects found; see all projects below.' },
  de: { select: 'Lebenslauf auf eine Stelle ausrichten', evidence: 'Projekte als Beleg', note: 'Profiltext und Reihenfolge passen sich an; Berufserfahrung und Qualifikationen bleiben unverändert.', noProjects: 'Keine passenden öffentlichen Projekte gefunden; siehe alle Projekte unten.' },
  fr: { select: 'Adapter ce CV à un poste', evidence: 'Projets à l’appui', note: 'Le résumé et l’ordre des sections changent ; l’expérience et les qualifications restent inchangées.', noProjects: 'Aucun projet public correspondant ; consultez tous les projets ci-dessous.' },
};

export function getVacancyProfile(key = 'general', lang = 'nl') {
  const profile = PROFILES[key] || PROFILES.general;
  return { key: PROFILES[key] ? key : 'general', projectFilter: profile.projectFilter, ...profile[lang in profile ? lang : 'nl'] };
}

export function getProjectFilterForRole(key) {
  return (PROFILES[key] || PROFILES.general).projectFilter;
}

export function renderVacancyProfile({ container, repos = [], lang = 'nl' }) {
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  let selected = params.get('role') || 'general';
  if (!PROFILES[selected]) selected = 'general';
  const locale = UI[lang] ? lang : 'nl';
  const ui = UI[locale];
  const render = () => {
    const profile = getVacancyProfile(selected, locale);
    const filtered = filterAndSortRepos(repos, { profile: profile.projectFilter, sort: 'recent' }).slice(0, 3);
    container.innerHTML = `
      <div class="vacancy-profile-controls">
        <label for="vacancy-profile-select">${ui.select}</label>
        <select id="vacancy-profile-select" data-vacancy-role>
          ${Object.entries(PROFILES).map(([key, item]) => `<option value="${key}" ${key === selected ? 'selected' : ''}>${item[locale]?.label || item.nl.label}</option>`).join('')}
        </select>
      </div>
      <h3>${profile.title}</h3>
      <p class="vacancy-profile-summary">${profile.summary}</p>
      <div class="vacancy-profile-skills" aria-label="${profile.skills.join(', ')}">${profile.skills.map(skill => `<span class="vacancy-profile-chip">${skill}</span>`).join('')}</div>
      <p><strong>${ui.evidence}</strong></p>
      <div class="vacancy-profile-evidence">${filtered.length ? filtered.map(repo => `<a href="${safeProjectUrl(repo.url)}" target="_blank" rel="noopener noreferrer">${escapeText(repo.name || 'Project')}</a>`).join('') : `<span>${ui.noProjects}</span>`}</div>
      <p class="vacancy-profile-note">${ui.note}</p>
    `;
    const roleSelect = container.querySelector('[data-vacancy-role]');
    roleSelect.addEventListener('change', () => {
      selected = roleSelect.value;
      const url = new URL(window.location.href);
      selected === 'general' ? url.searchParams.delete('role') : url.searchParams.set('role', selected);
      window.history.replaceState({}, '', url);
      render();
      const projectFilter = getProjectFilterForRole(selected);
      const projectSelect = document.querySelector('#projects-container [data-profile]');
      if (projectSelect) {
        projectSelect.value = projectFilter;
        projectSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      window.dispatchEvent(new CustomEvent('resume-profile-change', { detail: { profile: projectFilter, role: selected } }));
    });
  };
  render();
  if (selected !== 'general') {
    const projectSelect = document.querySelector('#projects-container [data-profile]');
    const projectFilter = getProjectFilterForRole(selected);
    if (projectSelect && projectSelect.value !== projectFilter) {
      projectSelect.value = projectFilter;
      projectSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
    window.dispatchEvent(new CustomEvent('resume-profile-change', { detail: { profile: projectFilter, role: selected } }));
  }
}
function safeProjectUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:' ? url.href : '#';
  } catch { return '#'; }
}
function escapeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
