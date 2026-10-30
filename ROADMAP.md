# Portfolio 2.0 — Roadmap

This roadmap prioritizes verifiable evidence, data quality and accessibility. Statuses are updated as work is completed; no outcome or skill level is assumed without evidence.

## Sprint 1 — Reliable data and statistics

- [x] Count only GitHub contribution events in the heatmap; repository creation/update timestamps are not contributions.
- [x] Add 30-, 90- and 365-day heatmap periods.
- [x] Label the public-events data coverage limitation clearly.
- [ ] Expand the GitHub activity source beyond the current recent-events sample where the API and permissions allow it.
- [ ] Add a data-quality report for source freshness, missing fields and invalid records.
- [ ] Review profile fetchers and distinguish unavailable data from genuine zero values.

Acceptance: activity totals are derived only from contribution events; source coverage and freshness are visible; missing values are not presented as zero.

## Sprint 2 — Evidence-based project case studies

- [ ] Select three representative projects from verified repositories.
- [ ] Document problem, approach, technologies, challenges and verifiable outcome for each.
- [ ] Link each case to repository, demo and documentation where available.
- [ ] Do not invent impact metrics or claim unverified project ownership.

Acceptance: each case has traceable evidence and clearly separates facts from explanatory context.

## Sprint 3 — Skills and recruiter experience

- [ ] Expand the skill explorer with Data Analytics, Automation, Development and Cybersecurity filters.
- [ ] Link skills to repositories and project evidence.
- [ ] Improve terminal commands, keyboard history and completion.
- [ ] Refine Recruiter Mode and role-specific CV output using verified source data.

Acceptance: skills are described through evidence, not arbitrary proficiency percentages; interactive features work on keyboard and mobile.

## Sprint 4 — Quality and performance

- [ ] Audit keyboard navigation, screen-reader labels and color contrast.
- [ ] Test narrow mobile layouts and touch targets.
- [ ] Review loading performance, image delivery and service-worker behavior.
- [ ] Add end-to-end and regression tests for the new interactions.
- [ ] Review SEO metadata and privacy implications.

Acceptance: CI passes, key journeys work on mobile and desktop, and no personal data is sent to third-party analytics without explicit configuration.

## Existing functionality to build on

The repository already contains dynamic project filtering, vacancy matching with evidence categories, conceptual workflow demos, Recruiter Mode and browser-local interaction counters. These should be improved rather than duplicated.
