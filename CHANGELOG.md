# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Color palette cycler: default → nord → dracula → solarized → ocean → default via `data-palette` CSS overrides with `localStorage` persistence (`togglePalette()`).
- Palette toggle button positioned under the light/dark theme toggle (CSS `top: 5rem; right: 1.5rem`).
- Last Updated timestamps on every data-driven section, populated from `profileData.generated_at` via `id="footer-updated"` and `setSectionTimestamp()`.
- Certificate i18n keys for all certificate entries (cert_psm, cert_vca, cert_ft, cert_msi, cert_et, cert_am) in NL/EN/DE/FR.
- Fixed doubled language levels: replaced "Goed Goed"/"Redelijk Redelijk" with `data-i18n="lang_native">Moedertaal`, `lang_basic>Basis`, `lang_professional>Professioneel`.
- Replaced dead PDF download links with `onclick="window.print()"` print-based PDF buttons (NL/EN) using `javascript:void(0)` hrefs.
- Mobile CSS `.timeline-item` rules (`padding: 0.6rem`, tighter font sizes) inside `@media (max-width: 640px)` for the expanded 23-item experience timeline.
- Full i18n coverage for DE (German) and FR (French) — 157 keys each, 100% coverage of all HTML `data-i18n` keys.
- NL translation completed — all 157 HTML i18n keys covered (235 keys total).
- 4-language toggle cycles nl → en → de → fr via `toggleLang()`.
- `detectLang()` supports de/fr browser language detection.
- `toggleLang()` cycles nl→en→de→fr; `applyLang()` handles `.lang-de`/`.lang-fr` visibility for download buttons.
- `data-i18n` keys added to all 19 previously untranslated timeline entries.
- `data-i18n` keys added to print/share buttons (print_cv_nl/en, share_linkedin/twitter/whatsapp).
- Schema.org structured data (`application/ld+json`) with Person type, including knowsLanguage (Nederlands, Duits, Engels).
- Service Worker at `/my-resume/sw.js` with `/my-resume/` prefixed cached URLs.
- Custom 404 page (`404.html`).
- SEO files: `robots.txt`, `sitemap.xml`, `site.webmanifest`, `browserconfig.xml`, `humans.txt`, `.well-known/security.txt`.
- CODEOWNERS to define code ownership.
- GitHub Repos Showcase section with auto-categorized repos (AI & Agents, Security, DevOps & Tools, Gaming & TTRPG, Web & Frontend, Other).
- Gource visualization section (`gource.mp4`).
- Skill matrix section from TryHackMe profile data.
- TryHackMe badges (bronze/silver/gold) in achievements section.
- Microsoft Learn badges in achievements section.
- Expertise tags sidebar section (NEN 1010, Metrekasten, Bekabeling, Multimeter, Isolatietester, Zonnepanelen, Sterkstroom).
- Languages section (NL/DE/EN with levels).
- Location set to Leeuwarden, Netherlands.

### Changed
- README.md rewritten in English (main language); created README.nl.md, README.de.md, README.fr.md.
- Footer date replaced hardcoded "Last page edit 2026-10-14 10:01" with dynamic `id="footer-updated"` span.
- Download CV section changed from dead PDF links to print-based buttons.
- CONTRIBUTING.md updated with language-aware button guidance for all 4 languages.
- DEPLOY.md updated with palette and 4-language testing instructions.

### Fixed
- NL missing 81 i18n keys after DE/FR addition — all missing keys added; verified 157/157 HTML keys covered in all 4 languages.
- Palette toggle overlapped theme toggle on mobile at `top: 2.75rem` — moved to `top: 5rem`.
- JavaScript syntax errors from erroneous `\n` sequences resolved.

## [1.0.0] - 2026-10-11
### Added
- Initial release of the resume site.
