# my-resume

A bilingual (NL/EN) — now multilingual (NL/EN/DE/FR) — live-updating CV/resume site built as a single static HTML page. Hosted on GitHub Pages at https://itsdarklikehell.github.io/my-resume/.

---

## Features

### Site structure
- **Single-page CV** — everything on one static HTML page with a clean card-based layout.
- **Responsive design** — works on desktop and mobile; print-friendly CSS for PDF export.
- **No build step** — pure HTML/CSS/JS, served directly from GitHub Pages.

### Languages (i18n)
- **4 languages**: Nederlands (nl), English (en), Deutsch (de), Français (fr).
- **Language toggle** — cycles nl → en → de → fr with `localStorage` persistence.
- **URL parameter override** — `?lang=de` forces a language and bypasses persistence.
- **Auto-detect** — browser language used on first visit (de/fr/en fall back to nl).
- All UI text, timeline entries, certificates, buttons, and section timestamps are translated via `data-i18n` keys (157 keys per language, 100% coverage).
- Language‑aware download/print buttons (NL and EN only for CV print; JSON download shown for all).

### Color palettes
- **Palette cycler** — button cycles through: default → nord → dracula → solarized → ocean → default.
- **`localStorage` persistence** — your last palette choice is remembered.
- Applied via `data-palette` CSS overrides on the root element.

### Theme
- **Dark/Light mode toggle** with `localStorage` persistence.
- Independent from the palette cycler; both can be combined.

### Live-updating data
- **Platform cards** — live stats scraped daily via GitHub Actions from 10 platforms:
  - TryHackMe (with bronze/silver/gold badges and skill matrix)
  - CTFtime
  - itch.io
  - Codewars
  - DEV.to
  - Stack Overflow
  - GitHub (public repos, stars, followers)
  - HackTheBox (requires `HACKTHEBOX_API_KEY`)
  - CyLab Academy (requires `CYLAB_API_KEY`)
  - Microsoft Learn (requires `MICROSOFTLEARN_API_KEY`)
- **GitHub Repos Showcase** — non-fork repos auto-categorized (AI & Agents, Security, DevOps & Tools, Gaming & TTRPG, Web & Frontend, Other), top 3 per category sorted by stars, active/inactive status.
- **Skill matrix** — live-updating skill matrix from TryHackMe profile data.
- **Achievements** — GitHub achievements (Centurion, Prolific, Builder, etc.) and Microsoft Learn badges.
- **Section timestamps** — "Last updated" timestamps on every data-driven section, populated from `generated_at`.
- **Daily refresh** — GitHub Actions workflow (`update-data.yml`) runs every day at 06:00 UTC to scrape platform data; a `has_data` guard prevents CI failures from overwriting good local data.

### Sections
1. **Hero** — name, title, short intro, contact info.
2. **About Me** — short bio.
3. **Experience** — 23-item work timeline with role, company, period, and description.
4. **Education** — Friesche Poort (Tweewielerherstel Monteur) and Friesland College (Monteur Sterkstroom Installaties).
5. **Projects** — categorized GitHub repos showcase.
6. **GitHub Repositories** — same data as Projects, dedicated section.
7. **Featured** — pinned repos with active/inactive status.
8. **Achievements** — GitHub and Microsoft Learn badges.
9. **Platform Cards** — live stats from external platforms.
10. **Profiles** — linked profiles (GitHub, TryHackMe, CTFtime, itch.io, Codewars, DEV.to, Stack Overflow, Microsoft Learn).
11. **Certificates & Paths** — Professional Scrum Master, VCA, Fietstechnicus, MSI, Elektrotechniek, AM rijbewijs.
12. **Gource** — video visualization of GitHub commit history.
13. **Download CV** — print-based PDF export (NL/EN) + JSON download.
14. **Share** — LinkedIn, Twitter/X, WhatsApp sharing.
15. **Contact** — email contact form.
16. **Sidebar** — Expertise tags, Languages (NL/DE/EN with levels: Moedertaal/Basis/Professioneel).

### Technical
- **SEO** — Open Graph tags, Twitter cards, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `browserconfig.xml`, `humans.txt`, `.well-known/security.txt`.
- **Service Worker** — `/my-resume/sw.js` for offline caching of core assets.
- **Structured data** — `application/ld+json` Person schema with name, email, address, languages, and skills.
- **Custom 404 page** — `404.html`.
- **CI** — basic HTML validation and broken-link checks on push/PR.

---

## Repository structure

```
my-resume/
├── README.md                 # English (main)
├── README.nl.md              # Dutch
├── README.de.md              # German
├── README.fr.md              # French
├── CHANGELOG.md              # All notable changes
├── CONTRIBUTING.md           # Contribution guidelines
├── DEPLOY.md                 # Deployment guide
├── SECURITY.md               # Security policy
├── AGENTS.md                 # AI agent interaction guidelines
├── CODEOWNERS                # Code ownership
├── index.html                # Main CV page (single static HTML file)
├── 404.html                  # Custom 404 page
├── sw.js                     # Service worker
├── site.webmanifest          # PWA manifest
├── robots.txt                # SEO
├── sitemap.xml               # SEO
├── humans.txt                # Humans.txt
├── .well-known/security.txt  # Security contact
├── favicon-16.png            # Favicon 16x16
├── favicon-32.png            # Favicon 32x32
├── apple-touch-icon.png      # Apple touch icon
├── og-image.png              # Open Graph image
├── gource.mp4                # Gource visualization video
├── github-data.json          # Live GitHub data (auto-updated)
├── profile-data.json         # Live platform data (auto-updated)
├── scripts/
│   ├── fetch_github_data.py  # Fetches GitHub data
│   └── fetch_profile_data.py # Fetches platform data
└── .github/
    └── workflows/
        ├── update-data.yml   # Daily data scrape (06:00 UTC)
        ├── gource.yml        # Gource visualization
        └── ci.yml            # CI checks
```

---

## Contact

- **Phone**: +31 6 3606 5494
- **Email**: bauke.molenaar@gmail.com
- **Location**: Leeuwarden, Netherlands
- **Site**: https://itsdarklikehell.github.io/my-resume/

---

## License

This is a personal CV/resume repository. All rights reserved.
