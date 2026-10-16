# my-resume

Een tweetalige (NL/EN) — inmiddels meertalige (NL/EN/DE/FR) — live-updating cv-website gebouwd als één statische HTML-pagina. Gehost op GitHub Pages via https://itsdarklikehell.github.io/my-resume/.

---

## Kenmerken

### Site-opbouw
- **Eénpagina cv** — alles op één statische HTML-pagina met een kaartengebaseerde lay-out.
- **Responsief ontwerp** — werkt op desktop en mobiel; printvriendelijke CSS voor PDF-export.
- **Geen build-stap** — pure HTML/CSS/JS, rechtstreeks geserveerd vanaf GitHub Pages.

### Talen (i18n)
- **4 talen**: Nederlands (nl), Engels (en), Duits (de), Frans (fr).
- **Talenwisselaar** — wisselt nl → en → de → fr met `localStorage`-behoud.
- **URL-parameter-override** — `?lang=de` forceert een taal en omzeilt behoud.
- **Automatische detectie** — browser-taal wordt bij eerste bezoek gebruikt (de/fr/en vallen terug op nl).
- Alle UI-tekst, timeline-items, certificaten, knoppen en sectie-tijdstempels zijn vertaald via `data-i18n`-sleutels (157 sleutels per taal, 100% dekking).
- Taalbewuste download/afdrukknoppen (alleen NL en EN voor cv-afdruk; JSON-download voor alle talen).

### Kleurenpaletten
- **Palet-cycler** — knop cycleert door: standaard → nord → dracula → solarized → ocean → standaard.
- **`localStorage`-behoud** — jouw laatste keuze wordt onthouden.
- Pas toe via `data-palette`-CSS-overschrijvingen op het hoofdelement.

### Thema
- **Donker/Licht-modus wisselaar** met `localStorage`-behoud.
- Onafhankelijk van de palet-cycler; beide kunnen gecombineerd worden.

### Live-updating data
- **Platformkaarten** — live statistieken dagelijks gescraped via GitHub Actions van 10 platformen:
  - TryHackMe (met brons/zilver/goud badges en vaardighedenmatrix)
  - CTFtime
  - itch.io
  - Codewars
  - DEV.to
  - Stack Overflow
  - GitHub (publieke repos, sterren, volgers)
  - HackTheBox (vereist `HACKTHEBOX_API_KEY`)
  - CyLab Academy (vereist `CYLAB_API_KEY`)
  - Microsoft Learn (vereist `MICROSOFTLEARN_API_KEY`)
- **GitHub Repos Showcase** — niet-gekloonde repos automatisch gecategoriseerd (AI & Agents, Security, DevOps & Tools, Gaming & TTRPG, Web & Frontend, Other), top 3 per categorie gesorteerd op sterren, actief/inactief-status.
- **Vaardighedenmatrix** — live-updating vaardighedenmatrix vanuit TryHackMe-profielgegevens.
- **Prestaties** — GitHub-prestaties (Centurion, Prolific, Builder, enz.) en Microsoft Learn-badges.
- **Sectie-tijdstempels** — "Laatst bijgewerkt"-tijdstempels op elke data-gedreven sectie, ingevuld vanuit `generated_at`.
- **Dagelijkse vernieuwing** — GitHub Actions-werkstroom (`update-data.yml`) draait elke dag om 06:00 UTC om platformgegevens te scrapen; een `has_data`-bewaking voorkomt dat CI-fouten goede lokale gegevens overschrijven.

### Secties
1. **Hero** — naam, titel, korte intro, contactgegevens.
2. **Over mij** — korte bio.
3. **Ervaring** — 23-items werk-tijdlijn met rol, bedrijf, periode en beschrijving.
4. **Opleiding** — Friesche Poort (Tweewielerherstel Monteur) en Friesland College (Monteur Sterkstroom Installaties).
5. **Projecten** — gecategoriseerde GitHub-repo-showcase.
6. **GitHub Repositories** — dezelfde data als Projecten, aparte sectie.
7. **Featured** — vastgezette repos met actief/inactief-status.
8. **Prestaties** — GitHub- en Microsoft Learn-badges.
9. **Platformkaarten** — live statistieken van externe platformen.
10. **Profielen** — gelinkte profielen (GitHub, TryHackMe, CTFtime, itch.io, Codewars, DEV.to, Stack Overflow, Microsoft Learn).
11. **Certificaten & Paden** — Professional Scrum Master, VCA, Fietstechnicus, MSI, Elektrotechniek, AM-rijbewijs.
12. **Gource** — videovisualisatie van GitHub-commitgeschiedenis.
13. **Download cv** — printgebaseerde PDF-export (NL/EN) + JSON-download.
14. **Delen** — LinkedIn, Twitter/X, WhatsApp-delen.
15. **Contact** — e-mailcontactformulier.
16. **Zijbalk** — expertise-tags, talen (NL/DE/EN met niveaus: Moedertaal/Basis/Professioneel).

### Techniek
- **SEO** — Open Graph-tags, Twitter-cards, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `browserconfig.xml`, `humans.txt`, `.well-known/security.txt`.
- **Service Worker** — `/my-resume/sw.js` voor offline-caching van kernassets.
- **Gestructureerde data** — `application/ld+json` Person-schema met naam, e-mail, adres, talen en vaardigheden.
- **Aangepaste 404-pagina** — `404.html`.
- **CI** — basis-HTML-validatie en gebroken-linkcontroles bij push/PR.

---

## Repositiestructuur

```
my-resume/
├── README.md                 # Engels (hoofdtalen)
├── README.nl.md              # Nederlands
├── README.de.md              # Duits
├── README.fr.md              # Frans
├── CHANGELOG.md              # Alle opmerkelijke wijzigingen
├── CONTRIBUTING.md           # Bijdragerichtlijnen
├── DEPLOY.md                 # Implementatiehandleiding
├── SECURITY.md               # Beveiligingsbeleid
├── AGENTS.md                 # AI-agent-interactierichtlijnen
├── CODEOWNERS                # Code-eigendom
├── index.html                # Hoofdpagina cv (één statisch HTML-bestand)
├── 404.html                  # Aangepaste 404-pagina
├── sw.js                     # Service worker
├── site.webmanifest          # PWA-manifest
├── robots.txt                # SEO
├── sitemap.xml               # SEO
├── humans.txt                # Humans.txt
├── .well-known/security.txt  # Beveiligingscontact
├── favicon-16.png            # Favicon 16x16
├── favicon-32.png            # Favicon 32x32
├── apple-touch-icon.png      # Apple touch icon
├── og-image.png              # Open Graph-afbeelding
├── gource.mp4                # Gource-visualisatiefilm
├── github-data.json          # Live GitHub-gegevens (automatisch bijgewerkt)
├── profile-data.json         # Live platform-gegevens (automatisch bijgewerkt)
├── scripts/
│   ├── fetch_github_data.py  # Haalt GitHub-gegevens op
│   └── fetch_profile_data.py # Haalt platform-gegevens op
└── .github/
    └── workflows/
        ├── update-data.yml   # Dagelijkse gegevens-scrape (06:00 UTC)
        ├── gource.yml        # Gource-visualisatie
        └── ci.yml            # CI-controles
```

---

## Contact

- **Telefoon**: +31 6 3606 5494
- **E-mail**: bauke.molenaar@gmail.com
- **Locatie**: Leeuwarden, Nederland
- **Site**: https://itsdarklikehell.github.io/my-resume/

---

## Licentie

Dit is een persoonlijk cv-repository. Alle rechten voorbehouden.
