# Portfolio 2.0 — Roadmap

This roadmap prioritizes verifiable evidence, data quality and accessibility. Statuses are updated as work is completed; no outcome or skill level is assumed without evidence.

## Sprint 1 — Reliable data and statistics

- [x] Count only GitHub contribution events in the heatmap; repository creation/update timestamps are not contributions.
- [x] Add 30-, 90- and 365-day heatmap periods.
- [x] Label the public-events data coverage limitation clearly.
- [x] Increase the retained public-event sample from 20 to 100; the API still limits historical coverage, so the heatmap labels this limitation.
- [ ] Add a data-quality report for source freshness, missing fields and invalid records.
- [ ] Review profile fetchers and distinguish unavailable data from genuine zero values.

Acceptance: activity totals are derived only from contribution events; source coverage and freshness are visible; missing values are not presented as zero.

## Sprint 2 — Evidence-based project case studies

- [x] Select three representative projects from verified repositories.
- [x] Document problem, approach, technologies and verifiable workflow for each; avoid unsupported impact claims.
- [x] Link each case to its repository, technical case study and available development visualization/documentation.
- [x] Separate repository maintenance and personal changes from the work of other contributors.
- [x] Publish standalone case-study pages in Dutch, English, German and French.

Acceptance: each case has traceable evidence and clearly separates facts from explanatory context.

## Sprint 3 — Skills and recruiter experience

- [x] Add evidence-backed filters for Automation, Software Development, Linux & Networking, Cybersecurity and Integrations.
- [x] Link each demonstrated skill to concrete project case studies or repository code.
- [ ] Add a Data Analytics filter only when relevant SQL, BI or analysis work can be linked as concrete evidence.
- [ ] Improve terminal commands, keyboard history and completion.
- [ ] Refine Recruiter Mode and role-specific CV output using verified source data.

Acceptance: skills are described through evidence, not arbitrary proficiency percentages; interactive features work on keyboard and mobile.

## Sprint 4 — Quality and performance

- [ ] Audit keyboard navigation, screen-reader labels and color contrast.
- [ ] Test narrow mobile layouts and touch targets.
- [ ] Review loading performance, image delivery and service-worker behavior.
- [x] Add end-to-end and regression tests for the multilingual case-study pages and skill evidence filters.
- [ ] Review SEO metadata and privacy implications.

Acceptance: CI passes, key journeys work on mobile and desktop, and no personal data is sent to third-party analytics without explicit configuration.

## Recently completed

- PR #8: conceptual Control Center architecture overview.
- PR #9: three standalone multilingual technical project case studies, Vite multi-page build support, sitemap entries and browser coverage.
- PR #10: multilingual skill evidence explorer with category filters, project links and evidence-boundary tests.
- GitHub profile README: aligned the introduction and project highlights with the evidence available in the portfolio.

## Existing functionality to build on

The repository already contains dynamic project filtering, vacancy matching with evidence categories, conceptual workflow demos, Recruiter Mode and browser-local interaction counters. These should be improved rather than duplicated.
