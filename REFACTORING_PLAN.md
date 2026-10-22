# Refactoring Plan — my-resume

## Goal
Modularize `script.js` (2205 lines, ~127 KB), remove inline event handlers from `index.html`, and introduce testing, linting, and a build pipeline — without changing the deployed static-site behavior on GitHub Pages.

## Current State (from file inspection)
- `script.js`: 2205 lines. ~968 lines are a single `const translations` i18n dictionary (nl/en/de/fr). The remainder is ~30 functions: `loadGitHubData`, `loadProfileData`, `normalizeGitHubData`, `render*`, `toggleTheme`, `togglePalette`, `toggleLang`, `applyLang`, `detectLang`, `downloadJSON`, `sendEmail`, `renderDonut`, etc. No modules, no classes, no `addEventListener` (all wiring via inline handlers).
- `index.html`: 9 inline `onclick` handlers (`toggleTheme`, `togglePalette`, `toggleLang`, `window.print`, `downloadJSON`) and 1 `onsubmit="sendEmail(event)"`.
- No `package.json`. Linting exists only ad-hoc in `ci-quality.yml` (eslint/stylelint/html-validate via npx). No tests, no bundler, no dev server.
- Data files: `github-data.json`, `profile-data.json` consumed at runtime.

## Proposed Architecture

### 1. Module layout (ES modules, no framework)
```
src/
  main.js                 # entry: wires events, boots data load
  i18n/
    translations.js       # export const translations = {...}
    lang.js               # detectLang, applyLang, toggleLang
  data/
    github.js             # fetch + normalize GitHub data
    profile.js            # fetch profile data
  render/
    stats.js, repos.js, featured.js, skills.js, donut.js,
    achievements.js, certificates.js, contributions.js,
    heatmap.js, gource.js, platformCards.js, profiles.js
  ui/
    theme.js              # toggleTheme, togglePalette
    export.js             # downloadJSON
    contact.js            # sendEmail
  utils/
    html.js               # escapeHtml
    time.js               # setSectionTimestamp
  sw.js                   # stays at root (service worker scope)
```
Each render module exports pure functions taking `(container, data, t)` and returns DOM updates; keeps global state (`githubData`, `profileData`, `currentLang`) in a small `state.js` store.

### 2. Remove inline handlers
- Delete all `onclick`/`onsubmit` attributes in `index.html`.
- In `main.js`, attach listeners via `document.querySelectorAll('[data-action]')` or IDs: `themeToggle.addEventListener('click', toggleTheme)`, etc.
- Add `type="module"` to the single `<script src="...">` tag; keep a small non-module fallback only if needed (GitHub Pages serves ES modules fine over HTTPS).
- CSP can drop `'unsafe-inline'` for scripts once inline handlers are gone.

### 3. Translations extraction
- Move the 968-line object verbatim into `src/i18n/translations.js` as `export default` / named export. No content changes; this alone shrinks `script.js` to ~1237 lines of logic and makes diffing translations trivial.

### 4. Testing
- Framework: Vitest + jsdom (lightweight, ESM-native, fast).
- Unit tests:
  - `normalizeGitHubData`, `getLangColor`, `escapeHtml`
  - `detectLang` with mocked `navigator`/URL
  - render functions with fixture data (snapshot-ish DOM assertions)
  - `downloadJSON` blob construction (mock URL.createObjectURL)
- E2E/smoke: Playwright (already used in update-data workflow) to load the built page and assert key sections render + language toggle works.
- Coverage target: 70% on `src/` (render modules may be lower initially).

### 5. Linting & formatting
- ESLint 9 flat config (`eslint.config.js`): `eslint:recommended` + `globals.browser`, rules: `no-unused-vars: error`, `no-undef`, `eqeqeq`, `prefer-const`, `no-var`.
- Prettier for formatting (2-space, single quotes, trailing commas) — run `prettier --write` once as a separate commit to avoid mixing with logic changes.
- Stylelint (already in CI) keep; html-validate (already in CI) keep.
- Add `npm run lint`, `npm run format`, `npm run test`.

### 6. Build pipeline
- Tooling: Vite (static-site friendly, zero-config for vanilla JS, fast HMR).
- `vite.config.js`: root `.`, build outDir `dist/`, assets in `assets/`, no framework plugin. Copy `*.json`, `*.pdf`, images, `sw.js`, `.well-known/` via `publicDir` or `vite-plugin-static-copy`.
- Scripts:
  - `npm run dev` — local dev server with HMR
  - `npm run build` — outputs `dist/`
  - `npm run preview` — preview built site
- GitHub Pages deploy: change `static.yml` to build first (`npm ci && npm run build`) and upload `dist/`. Keep `update-data.yml` committing JSON to repo root; build reads them from root (or move data fetch output into `public/`).
- Service worker: update cache list to new hashed asset names (Vite emits hashed filenames); use `vite-plugin-pwa` or keep manual with build-time manifest injection.

## Migration Steps (ordered, each a separate PR)
1. Add `package.json`, ESLint/Prettier/Vitest/Vite configs; wire `npm run lint`/`test` (no code changes yet). CI runs them.
2. Extract `translations` into `src/i18n/translations.js`; update `script.js` to import it; verify page identical.
3. Split functions into modules (data → render → ui → utils); `main.js` re-exports nothing, just boots. Keep a temporary `script.js` shim (`import './src/main.js'`) for backward compat with `index.html`.
4. Remove inline handlers; add event wiring in `main.js`; update CSP.
5. Add unit tests for utils + data normalization; then render tests.
6. Introduce Vite build; switch Pages deploy to `dist/`; keep raw-file fallback until verified.
7. Remove shim; update `index.html` script tag to `src/main.js` (built). Final cleanup.

## Risks / Notes
- GitHub data fetch (`update-data.yml`) writes to repo root; build must include those JSON files. Either keep them at root and configure Vite `publicDir: '.'` (excluding `.git`) or relocate fetch output to `public/data/`. Recommend the latter with a small path update in the Python scripts.
- Service worker caching of hashed assets needs care; test offline load after build.
- No framework = smaller bundle and preserves current look; trade-off is manual module discipline.
- Keep changes minimal per PR per AGENTS.md ("Minimal Impact").

## Success Criteria
- `script.js` (or its successor entry) < 200 lines; no file > 400 lines.
- Zero inline event handlers in `index.html`.
- `npm test` passes in CI; `npm run build` produces deployable `dist/`.
- Lighthouse scores unchanged (≥ current thresholds).
- Page behavior visually identical (manual smoke check + Playwright smoke).
