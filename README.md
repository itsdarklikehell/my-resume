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


---

## GitHub Profile Stats

# Hi, I'm Bauke Molenaar 👋

**Cybersecurity Professional** · Leeuwarden, NL

Cybersecurity enthusiast and developer focused on offensive security, automation, and building tools that make security research faster and more accessible. I enjoy breaking things (ethically), writing clean code, and contributing to the security community.

## 🛠️ Skills & Technologies

### Security
![Burp Suite](https://img.shields.io/badge/Burp_Suite-FF6633?style=for-the-badge&logo=burpsuite&logoColor=white)
![Wireshark](https://img.shields.io/badge/Wireshark-1679A7?style=for-the-badge&logo=wireshark&logoColor=white)
![Nmap](https://img.shields.io/badge/Nmap-0E83CD?style=for-the-badge&logo=nmap&logoColor=white)
![Hydra](https://img.shields.io/badge/Hydra-8A2BE2?style=for-the-badge&logo=gnu-bash&logoColor=white)
![Volatility](https://img.shields.io/badge/Volatility-2E8B57?style=for-the-badge&logo=python&logoColor=white)
![Dirbuster](https://img.shields.io/badge/Dirbuster-808080?style=for-the-badge&logo=gnu-bash&logoColor=white)
![Kali Linux](https://img.shields.io/badge/Kali_Linux-557C94?style=for-the-badge&logo=kali-linux&logoColor=white)

### Languages
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Bash](https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📊 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=itsdarklikehell&show_icons=true&theme=radical&hide_border=true)
![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=itsdarklikehell&layout=compact&theme=radical&hide_border=true)

## 🏆 TryHackMe

[![TryHackMe](https://tryhackme-badges.s3.amazonaws.com/itsdarklikehell.png)](https://tryhackme.com/p/itsdarklikehell)

## 📫 Contact & Links

[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:itsdarklikehell@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-itsdarklikehell-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/itsdarklikehell)
[![TryHackMe](https://img.shields.io/badge/TryHackMe-itsdarklikehell-212C42?style=for-the-badge&logo=tryhackme&logoColor=white)](https://tryhackme.com/p/itsdarklikehell)
[![HackTheBox](https://img.shields.io/badge/HackTheBox-itsdarklikehell-9FEF00?style=for-the-badge&logo=hackthebox&logoColor=black)](https://app.hackthebox.com/profile/itsdarklikehell)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/itsdarklikehell)
[![itch.io](https://img.shields.io/badge/itch.io-itsdarklikehell-FA5C5C?style=for-the-badge&logo=itchdotio&logoColor=white)](https://itsdarklikehell.itch.io)
[![Codewars](https://img.shields.io/badge/Codewars-itsdarklikehell-B1361E?style=for-the-badge&logo=codewars&logoColor=white)](https://www.codewars.com/users/itsdarklikehell)

---

*Profile maintained with care. Feel free to reach out for collaboration or security discussions.*

