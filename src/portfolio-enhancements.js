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

const SKILL_EVIDENCE = [
  {
    label: 'Shell / Bash',
    category: 'automation',
    proofs: [{ project: 'Pwnagotchi Control Center', href: 'projects/pwnagotchi-control-center.html', detail: {
      nl: 'Menu-gestuurde scripts voor lokale opslaghandelingen en remote beheer via SSH.',
      en: 'Menu-driven scripts for local storage operations and remote management over SSH.',
      de: 'Menügesteuerte Skripte für lokale Speicheroperationen und Fernverwaltung über SSH.',
      fr: 'Scripts pilotés par menu pour les opérations de stockage locales et l’administration à distance via SSH.',
    }}],
  },
  {
    label: 'Linux',
    category: 'systems',
    proofs: [{ project: 'Pwnagotchi Control Center', href: 'projects/pwnagotchi-control-center.html', detail: {
      nl: 'Gedocumenteerde systeemtools zoals dd, mount, whiptail, wget en SSH in de beheerworkflow.',
      en: 'Documented system tools such as dd, mount, whiptail, wget and SSH in the management workflow.',
      de: 'Dokumentierte Systemwerkzeuge wie dd, mount, whiptail, wget und SSH im Verwaltungsablauf.',
      fr: 'Outils système documentés tels que dd, mount, whiptail, wget et SSH dans le flux de gestion.',
    }}],
  },
  {
    label: 'Networking',
    category: 'systems',
    proofs: [{ project: 'Pwnagotchi Control Center', href: 'projects/pwnagotchi-control-center.html', detail: {
      nl: 'Verbindingsscripts voor USB-Ethernet, Bluetooth PAN, Ethernet en WLAN, inclusief interface- en connectiviteitscontroles.',
      en: 'Connection scripts for USB-Ethernet, Bluetooth PAN, Ethernet and WLAN, including interface and connectivity checks.',
      de: 'Verbindungsskripte für USB-Ethernet, Bluetooth PAN, Ethernet und WLAN einschließlich Schnittstellen- und Verbindungstests.',
      fr: 'Scripts de connexion pour USB-Ethernet, Bluetooth PAN, Ethernet et WLAN, avec vérification des interfaces et de la connectivité.',
    }}],
  },
  {
    label: 'Python',
    category: 'development',
    proofs: [
      { project: 'Pwnagotchi Plugins', href: 'projects/pwnagotchi-plugins.html', detail: {
        nl: 'Python-plugincollectie met gedocumenteerde installatie, configuratie en onderhoud.',
        en: 'Python plugin collection with documented installation, configuration and maintenance.',
        de: 'Python-Plugin-Sammlung mit dokumentierter Installation, Konfiguration und Pflege.',
        fr: 'Collection de plugins Python avec installation, configuration et maintenance documentées.',
      }},
      { project: 'Pwnspeaker & Pwnassistant', href: 'projects/pwnspeaker.html', detail: {
        nl: 'Twee afzonderlijke Python-plugins voor tekst-naar-spraak en een agenda-spraakassistent.',
        en: 'Two separate Python plugins for text-to-speech and a calendar voice assistant.',
        de: 'Zwei separate Python-Plugins für Text-to-Speech und einen Kalender-Sprachassistenten.',
        fr: 'Deux plugins Python distincts pour la synthèse vocale et un assistant vocal de calendrier.',
      }},
    ],
  },
  {
    label: 'pytest',
    category: 'development',
    proofs: [{ project: 'Pwnagotchi Plugins', href: 'projects/pwnagotchi-plugins.html', detail: {
      nl: 'De repository beschrijft pytest-controles voor syntax, imports, pluginstructuur en TOML-configuratie.',
      en: 'The repository documents pytest checks for syntax, imports, plugin structure and TOML configuration.',
      de: 'Das Repository dokumentiert pytest-Prüfungen für Syntax, Imports, Pluginstruktur und TOML-Konfiguration.',
      fr: 'Le dépôt documente des tests pytest pour la syntaxe, les imports, la structure des plugins et la configuration TOML.',
    }}],
  },
  {
    label: 'GitHub Actions',
    category: 'automation',
    proofs: [
      { project: 'Pwnagotchi Plugins', href: 'projects/pwnagotchi-plugins.html', detail: {
        nl: 'Geautomatiseerde plugincontroles draaien via de CI-workflow van de repository.',
        en: 'Automated plugin checks run through the repository CI workflow.',
        de: 'Automatisierte Plugin-Prüfungen laufen über den CI-Workflow des Repositorys.',
        fr: 'Les vérifications automatisées des plugins sont exécutées par le workflow CI du dépôt.',
      }},
      { project: 'my-resume portfolio', href: 'https://github.com/itsdarklikehell/my-resume', detail: {
        nl: 'CI, kwaliteitscontroles en browser-tests voor de portfolio-website.',
        en: 'CI, quality checks and browser tests for the portfolio website.',
        de: 'CI-, Qualitäts- und Browser-Tests für die Portfolio-Website.',
        fr: 'CI, contrôles qualité et tests navigateur pour le portfolio.',
      }},
    ],
  },
  {
    label: 'JavaScript',
    category: 'development',
    proofs: [{ project: 'my-resume portfolio', href: 'https://github.com/itsdarklikehell/my-resume', detail: {
      nl: 'De portfolio gebruikt JavaScript-modules voor rendering, meertaligheid en interactieve onderdelen, met Vitest- en Playwright-tests.',
      en: 'The portfolio uses JavaScript modules for rendering, internationalization and interactive features, with Vitest and Playwright tests.',
      de: 'Das Portfolio verwendet JavaScript-Module für Rendering, Mehrsprachigkeit und Interaktionen sowie Vitest- und Playwright-Tests.',
      fr: 'Le portfolio utilise des modules JavaScript pour le rendu, l’internationalisation et les interactions, avec des tests Vitest et Playwright.',
    }}],
  },
  {
    label: 'Cybersecurity / Wi-Fi auditing',
    category: 'security',
    proofs: [{ project: 'Pwnagotchi Plugins', href: 'projects/pwnagotchi-plugins.html', detail: {
      nl: 'Plugincollectie voor Pwnagotchi-workflows rond Wi-Fi-auditing; de repository bevat werk van meerdere bijdragers.',
      en: 'Pwnagotchi plugin collection for Wi-Fi auditing workflows; the repository includes work from multiple contributors.',
      de: 'Pwnagotchi-Plugin-Sammlung für Wi-Fi-Auditing-Workflows; das Repository enthält Beiträge mehrerer Entwickler.',
      fr: 'Collection de plugins Pwnagotchi pour les workflows d’audit Wi-Fi ; le dépôt comprend le travail de plusieurs contributeurs.',
    }}],
  },
  {
    label: 'Google Calendar API & OAuth',
    category: 'integrations',
    proofs: [{ project: 'Pwnspeaker & Pwnassistant', href: 'projects/pwnspeaker.html', detail: {
      nl: 'Pwnassistant koppelt Google Calendar aan een spraakworkflow en vereist OAuth-autorisatie.',
      en: 'Pwnassistant connects Google Calendar to a voice workflow and requires OAuth authorization.',
      de: 'Pwnassistant verbindet Google Calendar mit einem Sprachworkflow und benötigt eine OAuth-Autorisierung.',
      fr: 'Pwnassistant relie Google Calendar à un workflow vocal et nécessite une autorisation OAuth.',
    }}],
  },
  {
    label: 'Text-to-speech & speech recognition',
    category: 'integrations',
    proofs: [{ project: 'Pwnspeaker & Pwnassistant', href: 'projects/pwnspeaker.html', detail: {
      nl: 'De repository documenteert text-to-speech, spraakherkenning en de bijbehorende systeempakketten.',
      en: 'The repository documents text-to-speech, speech recognition and the related system packages.',
      de: 'Das Repository dokumentiert Text-to-Speech, Spracherkennung und die zugehörigen Systempakete.',
      fr: 'Le dépôt documente la synthèse vocale, la reconnaissance vocale et les paquets système associés.',
    }}],
  },
  {
    label: 'TOML configuration',
    category: 'development',
    proofs: [
      { project: 'Pwnagotchi Plugins', href: 'projects/pwnagotchi-plugins.html', detail: {
        nl: 'Plugininstellingen en configuratievoorbeelden worden als TOML-bestanden beheerd en getest.',
        en: 'Plugin settings and configuration examples are maintained and tested as TOML files.',
        de: 'Plugin-Einstellungen und Konfigurationsbeispiele werden als TOML-Dateien verwaltet und getestet.',
        fr: 'Les paramètres et exemples de configuration des plugins sont gérés et testés sous forme de fichiers TOML.',
      }},
      { project: 'Pwnagotchi Control Center', href: 'projects/pwnagotchi-control-center.html', detail: {
        nl: 'De tool past config.toml lokaal en op afstand aan.',
        en: 'The tool edits config.toml locally and remotely.',
        de: 'Das Werkzeug bearbeitet config.toml lokal und aus der Ferne.',
        fr: 'L’outil modifie config.toml localement et à distance.',
      }},
    ],
  },
];

export function getSkillEvidence(lang = 'nl') {
  const locale = Object.prototype.hasOwnProperty.call(LABELS, lang) ? lang : 'nl';
  return SKILL_EVIDENCE.map(skill => ({
    label: skill.label,
    category: skill.category,
    proofs: skill.proofs.map(proof => ({
      project: proof.project,
      href: proof.href,
      detail: proof.detail[locale] || proof.detail.nl,
    })),
  }));
}

function createSkillEvidenceSection(lang) {
  const t = LABELS[lang] || LABELS.nl;
  const section = document.createElement('section');
  section.className = 'portfolio-enhancement-block';
  section.setAttribute('aria-labelledby', 'portfolio-skill-evidence-title');

  const heading = document.createElement('h2');
  heading.id = 'portfolio-skill-evidence-title';
  heading.textContent = t.skillEvidence;
  const intro = document.createElement('p');
  intro.className = 'about-text';
  intro.textContent = t.skillEvidenceIntro;
  section.append(heading, intro);

  const filters = [
    ['all', t.skillFilterAll],
    ['automation', t.skillFilterAutomation],
    ['development', t.skillFilterDevelopment],
    ['systems', t.skillFilterSystems],
    ['security', t.skillFilterSecurity],
    ['integrations', t.skillFilterIntegrations],
  ];
  const filterGroup = document.createElement('div');
  filterGroup.className = 'portfolio-skill-filters';
  filterGroup.setAttribute('role', 'group');
  filterGroup.setAttribute('aria-label', t.skillEvidenceFilters);
  filters.forEach(([key, label], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portfolio-skill-filter';
    button.dataset.skillFilter = key;
    button.setAttribute('aria-pressed', String(index === 0));
    button.textContent = label;
    filterGroup.append(button);
  });
  section.append(filterGroup);

  const grid = document.createElement('div');
  grid.className = 'portfolio-skill-evidence-grid';
  getSkillEvidence(lang).forEach(skill => {
    const card = document.createElement('article');
    card.className = 'portfolio-skill-evidence-card';
    card.dataset.skillEvidenceCard = '';
    card.dataset.skillCategory = skill.category;
    const title = document.createElement('h3');
    title.textContent = skill.label;
    const list = document.createElement('ul');
    skill.proofs.forEach(proof => {
      const item = document.createElement('li');
      const project = document.createElement('strong');
      project.textContent = proof.project;
      const detail = document.createElement('p');
      detail.textContent = proof.detail;
      const link = document.createElement('a');
      link.className = 'portfolio-text-link';
      link.href = proof.href;
      link.textContent = t.skillOpenCase + ' ↗';
      if (proof.href.startsWith('https:')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      item.append(project, detail, link);
      list.append(item);
    });
    card.append(title, list);
    grid.append(card);
  });
  section.append(grid);
  return section;
}

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
    skillEvidence: 'Vaardigheden met projectbewijs',
    skillEvidenceIntro: 'Technologieën die terug te vinden zijn in concrete projecten. Dit is projectbewijs, geen zelf toegekende niveaus of vaardigheidsscores.',
    skillEvidenceFilters: 'Filter projectbewijs op onderwerp',
    skillFilterAll: 'Alles',
    skillFilterAutomation: 'Automatisering',
    skillFilterDevelopment: 'Softwareontwikkeling',
    skillFilterSystems: 'Linux & netwerken',
    skillFilterSecurity: 'Cybersecurity',
    skillFilterIntegrations: 'Integraties',
    skillOpenCase: 'Bekijk projectbewijs',
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
    skillEvidence: 'Skills backed by project evidence',
    skillEvidenceIntro: 'Technologies that can be traced to concrete projects. This is project evidence, not self-assigned proficiency levels or scores.',
    skillEvidenceFilters: 'Filter project evidence by topic',
    skillFilterAll: 'All',
    skillFilterAutomation: 'Automation',
    skillFilterDevelopment: 'Software development',
    skillFilterSystems: 'Linux & networking',
    skillFilterSecurity: 'Cybersecurity',
    skillFilterIntegrations: 'Integrations',
    skillOpenCase: 'View project evidence',
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
    skillEvidence: 'Fähigkeiten mit Projektbelegen',
    skillEvidenceIntro: 'Technologien, die sich konkreten Projekten zuordnen lassen. Dies sind Projektbelege, keine selbst vergebenen Kenntnisstufen oder Bewertungen.',
    skillEvidenceFilters: 'Projektbelege nach Thema filtern',
    skillFilterAll: 'Alle',
    skillFilterAutomation: 'Automatisierung',
    skillFilterDevelopment: 'Softwareentwicklung',
    skillFilterSystems: 'Linux & Netzwerke',
    skillFilterSecurity: 'Cybersicherheit',
    skillFilterIntegrations: 'Integrationen',
    skillOpenCase: 'Projektbeleg ansehen',
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
    skillEvidence: 'Compétences étayées par des projets',
    skillEvidenceIntro: 'Technologies que l’on peut retrouver dans des projets concrets. Il s’agit de preuves de projet, pas de niveaux ou de scores auto-attribués.',
    skillEvidenceFilters: 'Filtrer les preuves par thème',
    skillFilterAll: 'Tout',
    skillFilterAutomation: 'Automatisation',
    skillFilterDevelopment: 'Développement logiciel',
    skillFilterSystems: 'Linux et réseaux',
    skillFilterSecurity: 'Cybersécurité',
    skillFilterIntegrations: 'Intégrations',
    skillOpenCase: 'Voir la preuve du projet',
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

  container.innerHTML = `
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

  const skillEvidenceSection = createSkillEvidenceSection(lang);
  const projectCasesSection = container.querySelector('#portfolio-cases-title')?.closest('.portfolio-enhancement-block');
  projectCasesSection?.after(skillEvidenceSection);

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

  const skillFilterButtons = [...container.querySelectorAll('[data-skill-filter]')];
  const skillEvidenceCards = [...container.querySelectorAll('[data-skill-evidence-card]')];
  skillFilterButtons.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.skillFilter;
    skillFilterButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    skillEvidenceCards.forEach(card => {
      card.hidden = selected !== 'all' && card.dataset.skillCategory !== selected;
    });
    updateAnalyticsTotal(recordLocalEvent('skill_evidence_filter_' + selected));
  }));

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
