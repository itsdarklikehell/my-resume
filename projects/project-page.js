import { projectPages, ui } from './project-pages.js';

const root = document.querySelector('[data-project-page]');
const slug = root?.dataset.projectPage;
const params = new URLSearchParams(window.location.search);
const supported = ['nl', 'en', 'de', 'fr'];
const requested = params.get('lang');
const lang = supported.includes(requested) ? requested : 'nl';
const page = projectPages[slug]?.[lang] || projectPages[slug]?.nl;
const labels = ui[lang] || ui.nl;

if (!root || !page) {
  document.querySelector('main')?.replaceChildren(Object.assign(document.createElement('p'), {
    textContent: 'Project page not found.',
  }));
} else {
  document.documentElement.lang = lang;
  document.title = `${page.title} | Bauke Molenaar`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', page.intro);
  const setText = (selector, value) => {
    const node = root.querySelector(selector);
    if (node) node.textContent = value;
  };
  setText('[data-field="eyebrow"]', page.eyebrow);
  setText('[data-field="title"]', page.title);
  setText('[data-field="intro"]', page.intro);
  setText('[data-field="problem-title"]', page.problemTitle);
  setText('[data-field="problem"]', page.problem);
  setText('[data-field="approach-title"]', page.approachTitle);
  setText('[data-field="approach"]', page.approach);
  setText('[data-field="stack-title"]', page.stackTitle);
  setText('[data-field="evidence-title"]', page.evidenceTitle);
  setText('[data-field="evidence"]', page.evidence);
  setText('[data-field="role-title"]', page.roleTitle);
  setText('[data-field="role"]', page.role);
  setText('[data-field="caution-title"]', page.cautionTitle);
  setText('[data-field="caution"]', page.caution);
  setText('[data-field="footer"]', page.footer);
  setText('[data-field="back"]', page.backLabel);
  setText('[data-field="language-label"]', labels.language);
  root.querySelector('.project-page-header')?.setAttribute('aria-label', labels.back);
  root.querySelector('[data-field="links"]')?.setAttribute('aria-label', labels.resources || labels.evidence);
  setText('[data-label="challenge"]', labels.challenge);
  setText('[data-label="approach"]', labels.approach);
  setText('[data-label="steps"]', labels.steps);
  setText('[data-label="stack"]', labels.stack);
  setText('[data-label="evidence"]', labels.evidence);
  setText('[data-label="role"]', labels.role);
  setText('[data-label="caution"]', labels.caution);
  const steps = root.querySelector('[data-field="steps"]');
  page.steps.forEach(([title, description]) => {
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    const body = document.createElement('p');
    heading.textContent = title;
    body.textContent = description;
    item.append(heading, body);
    steps?.append(item);
  });
  const stack = root.querySelector('[data-field="stack"]');
  page.stack.forEach(label => {
    const item = document.createElement('li');
    item.textContent = label;
    stack?.append(item);
  });
  const links = [
    { href: root.dataset.repo, label: page.repoLabel },
    { href: root.dataset.readme, label: page.docsLabel },
    { href: root.dataset.media, label: page.mediaLabel },
  ];
  const linkList = root.querySelector('[data-field="links"]');
  links.forEach(link => {
    if (!link.href) return;
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = link.label;
    linkList?.append(anchor);
  });
  const back = root.querySelector('[data-field="back"]');
  if (back) back.href = `../index.html?lang=${lang}#projects-section`;
  const select = root.querySelector('select');
  if (select) {
    select.value = lang;
    select.addEventListener('change', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', select.value);
      window.location.href = url.toString();
    });
  }
}
