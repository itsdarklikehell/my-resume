const LABELS = {
  nl: {
    title: 'Interactieve portfolio-terminal',
    intro: 'Probeer een commando. Alles draait lokaal in je browser.',
    placeholder: 'Typ een commando…',
    run: 'Uitvoeren',
    prompt: 'bauke@portfolio:~$',
    help: 'Beschikbare commando’s: help, about, skills, projects, contact, clear',
    empty: 'Typ help om de beschikbare commando’s te zien.',
    about: 'Technisch professional met ervaring in elektrotechniek en een groeiende focus op software, automatisering en cybersecurity.',
    skills: 'Python · Shell/Bash · JavaScript/TypeScript · Linux · GitHub Actions · Automation · Cybersecurity',
    contact: 'Contact: bauke.molenaar@gmail.com · GitHub: github.com/itsdarklikehell',
    unknown: 'Onbekend commando. Typ help voor opties.',
    noProjects: 'Geen projectgegevens beschikbaar.',
  },
  en: {
    title: 'Interactive portfolio terminal',
    intro: 'Try a command. Everything runs locally in your browser.',
    placeholder: 'Enter a command…',
    run: 'Run',
    prompt: 'bauke@portfolio:~$',
    help: 'Available commands: help, about, skills, projects, contact, clear',
    empty: 'Type help to see available commands.',
    about: 'Technical professional with an electrical engineering background and a growing focus on software, automation and cybersecurity.',
    skills: 'Python · Shell/Bash · JavaScript/TypeScript · Linux · GitHub Actions · Automation · Cybersecurity',
    contact: 'Contact: bauke.molenaar@gmail.com · GitHub: github.com/itsdarklikehell',
    unknown: 'Unknown command. Type help to see options.',
    noProjects: 'No project data available.',
  },
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

export function renderInteractiveTerminal({ container, repos = [], lang = 'nl' }) {
  if (!container) return;
  const t = LABELS[lang] || LABELS.nl;
  container.innerHTML = '<h2 id="portfolio-terminal-title">' + escapeHtml(t.title) + '</h2>' +
    '<p class="about-text">' + escapeHtml(t.intro) + '</p>' +
    '<div class="portfolio-terminal" data-terminal>' +
      '<div class="portfolio-terminal-bar"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span><span class="portfolio-terminal-prompt">portfolio.sh</span></div>' +
      '<div class="portfolio-terminal-output" data-terminal-output aria-live="polite"><p>' + escapeHtml(t.empty) + '</p></div>' +
      '<form class="portfolio-terminal-form" data-terminal-form>' +
        '<label for="portfolio-terminal-input">' + escapeHtml(t.prompt) + '</label>' +
        '<input id="portfolio-terminal-input" data-terminal-input autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="80" placeholder="' + escapeHtml(t.placeholder) + '" aria-label="' + escapeHtml(t.placeholder) + '">' +
        '<button type="submit" class="download-btn">' + escapeHtml(t.run) + '</button>' +
      '</form>' +
    '</div>';

  const form = container.querySelector('[data-terminal-form]');
  const input = container.querySelector('[data-terminal-input]');
  const output = container.querySelector('[data-terminal-output]');
  const projects = (Array.isArray(repos) ? repos : []).filter(repo => repo && !repo.fork).slice(0, 5);

  form.addEventListener('submit', event => {
    event.preventDefault();
    const raw = input.value.trim();
    const command = raw.toLowerCase().split(/\s+/)[0];
    if (command === 'clear') {
      output.replaceChildren();
      input.value = '';
      return;
    }

    const lines = [];
    if (!command) lines.push(t.empty);
    else if (command === 'help') lines.push(t.help);
    else if (command === 'about') lines.push(t.about);
    else if (command === 'skills') lines.push(t.skills);
    else if (command === 'contact') lines.push(t.contact);
    else if (command === 'projects') {
      if (!projects.length) lines.push(t.noProjects);
      else projects.forEach(repo => lines.push((repo.name || 'Project') + (repo.language ? ' — ' + repo.language : '')));
    } else lines.push(t.unknown);

    const entry = document.createElement('div');
    entry.className = 'portfolio-terminal-entry';
    const prompt = document.createElement('span');
    prompt.className = 'portfolio-terminal-command';
    prompt.textContent = t.prompt + ' ' + raw;
    entry.append(prompt);
    lines.forEach(line => {
      const paragraph = document.createElement('p');
      paragraph.textContent = line;
      entry.append(paragraph);
    });
    output.append(entry);
    output.scrollTop = output.scrollHeight;
    input.value = '';
  });
}
