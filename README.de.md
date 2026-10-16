# my-resume

Eine zweisprachige (NL/EN) — mittlerweile mehrsprachige (NL/EN/DE/FR) — live-aktualisierte CV/Website als einzelne statische HTML-Seite. Gehost auf GitHub Pages unter https://itsdarklikehell.github.io/my-resume/.

---

## Funktionen

### Seitenstruktur
- **Einseitiger Lebenslauf** — alles auf einer statischen HTML-Seite mit kartenbasiertem Layout.
- **Responsives Design** — funktioniert auf Desktop und Mobilgeräten; druckfreundliches CSS für PDF-Export.
- **Kein Build-Schritt** — reines HTML/CSS/JS, direkt von GitHub Pages ausgeliefert.

### Sprachen (i18n)
- **4 Sprachen**: Niederländisch (nl), Englisch (en), Deutsch (de), Französisch (fr).
- **Sprachumschalter** — wechselt nl → en → de → fr mit `localStorage`-Speicherung.
- **URL-Parameter-Override** — `?lang=de` erzwingt eine Sprache und umgeht die Speicherung.
- **Automatische Erkennung** — Browser-Sprache wird beim ersten Besuch verwendet (de/fr/en fallen auf nl zurück).
- Alle UI-Texte, Zeitraumeinträge, Zertifikate, Schaltflächen und Abschnittszeitstempel sind über `data-i18n`-Schlüssel übersetzt (157 Schlüssel pro Sprache, 100% Abdeckung).
- Sprachabhängige Download-/Druckschaltflächen (nur NL und EN für CV-Druck; JSON-Download für alle Sprachen).

### Farbpaletten
- **Paletten-Cycler** — Schaltfläche durchläuft: Standard → nord → dracula → solarized → ocean → Standard.
- **`localStorage`-Speicherung** — Ihre letzte Auswahl wird gespeichert.
- Angewendet über `data-palette`-CSS-Überschreibungen auf dem Wurzelelement.

### Thema
- **Hell/Dark-Modus-Umschalter** mit `localStorage`-Speicherung.
- Unabhängig vom Paletten-Cycler; beide können kombiniert werden.

### Live-aktualisierte Daten
- **Plattform-Karten** — tägliche Live-Statistiken, die über GitHub Actions von 10 Plattformen gescraped werden:
  - TryHackMe (mit Bronze-/Silber-/Gold-Abzeichen und Skill-Matrix)
  - CTFtime
  - itch.io
  - Codewars
  - DEV.to
  - Stack Overflow
  - GitHub (öffentliche Repos, Sterne, Follower)
  - HackTheBox (benötigt `HACKTHEBOX_API_KEY`)
  - CyLab Academy (benötigt `CYLAB_API_KEY`)
  - Microsoft Learn (benötigt `MICROSOFTLEARN_API_KEY`)
- **GitHub-Repos-Showcase** — nicht-Geforkte Repos automatisch kategorisiert (AI & Agents, Security, DevOps & Tools, Gaming & TTRPG, Web & Frontend, Other), Top 3 pro Kategorie nach Sternen sortiert, aktiv/inaktiv-Status.
- **Skill-Matrix** — live-aktualisierte Skill-Matrix aus TryHackMe-Profildaten.
- **Erfolge** — GitHub-Erfolge (Centurion, Prolific, Builder usw.) und Microsoft Learn-Abzeichen.
- **Abschnitts-Zeitstempel** — „Zuletzt aktualisiert“-Zeitstempel auf jedem datengetriebenen Abschnitt, befüllt aus `generated_at`.
- **Tägliche Aktualisierung** — GitHub Actions-Workflow (`update-data.yml`) läuft täglich um 06:00 UTC, um Plattformdaten zu scrapen; ein `has_data`-Schutz verhindert, dass CI-Fehler gute lokale Daten überschreiben.

### Abschnitte
1. **Hero** — Name, Titel, kurze Einleitung, Kontaktinformationen.
2. **Über mich** — kurze Biografie.
3. **Erfahrung** — 23-Einträge-Arbeitszeitstrahl mit Rolle, Unternehmen, Zeitraum und Beschreibung.
4. **Ausbildung** — Friesche Poort (Tweewielerherstel Monteur) und Friesland College (Monteur Sterkstroom Installaties).
5. **Projekte** — kategorisiertes GitHub-Repo-Showcase.
6. **GitHub-Repositories** — gleiche Daten wie Projekte, separater Abschnitt.
7. **Featured** — angeheftete Repos mit aktiv/inaktiv-Status.
8. **Erfolge** — GitHub- und Microsoft Learn-Abzeichen.
9. **Plattform-Karten** — Live-Statistiken von externen Plattformen.
10. **Profile** — verlinkte Profile (GitHub, TryHackMe, CTFtime, itch.io, Codewars, DEV.to, Stack Overflow, Microsoft Learn).
11. **Zertifikate & Pfade** — Professional Scrum Master, VCA, Fietstechnicus, MSI, Elektrotechniek, AM-Führerschein.
12. **Gource** — Videovisualisierung des GitHub-Commit-Verlaufs.
13. **CV-Download** — druckbasierter PDF-Export (NL/EN) + JSON-Download.
14. **Teilen** — LinkedIn, Twitter/X, WhatsApp-Teilen.
15. **Kontakt** — E-Mail-Kontaktformular.
16. **Seitenleiste** — Expertise-Tags, Sprachen (NL/DE/EN mit Niveaus: Moedertaal/Basis/Professioneel).

### Technik
- **SEO** — Open Graph-Tags, Twitter Cards, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `browserconfig.xml`, `humans.txt`, `.well-known/security.txt`.
- **Service Worker** — `/my-resume/sw.js` für Offline-Caching von Kernressourcen.
- **Strukturierte Daten** — `application/ld+json` Person-Schema mit Name, E-Mail, Adresse, Sprachen und Fähigkeiten.
- **Benutzerdefinierte 404-Seite** — `404.html`.
- **CI** — Basis-HTML-Validierung und defekten-Link-Überprüfungen bei Push/PR.

---

## Repositoriestruktur

```
my-resume/
├── README.md                 # Englisch (Hauptsprache)
├── README.nl.md              # Niederländisch
├── README.de.md              # Deutsch
├── README.fr.md              # Französisch
├── CHANGELOG.md              # Alle bemerkenswerten Änderungen
├── CONTRIBUTING.md           # Beitragsrichtlinien
├── DEPLOY.md                 # Bereitstellungsanleitung
├── SECURITY.md               # Sicherheitsrichtlinie
├── AGENTS.md                 # KI-Agent-Interaktionsrichtlinien
├── CODEOWNERS                # Code-Eigentum
├── index.html                # Haupt-CV-Seite (einzelne statische HTML-Datei)
├── 404.html                  # Benutzerdefinierte 404-Seite
├── sw.js                     # Service Worker
├── site.webmanifest          # PWA-Manifest
├── robots.txt                # SEO
├── sitemap.xml               # SEO
├── humans.txt                # Humans.txt
├── .well-known/security.txt  # Sicherheitskontakt
├── favicon-16.png            # Favicon 16x16
├── favicon-32.png            # Favicon 32x32
├── apple-touch-icon.png      # Apple Touch Icon
├── og-image.png              # Open Graph-Bild
├── gource.mp4                # Gource-Visualisierungsvideo
├── github-data.json          # Live-GitHub-Daten (automatisch aktualisiert)
├── profile-data.json         # Live-Plattformdaten (automatisch aktualisiert)
├── scripts/
│   ├── fetch_github_data.py  # Ruft GitHub-Daten ab
│   └── fetch_profile_data.py # Ruft Plattformdaten ab
└── .github/
    └── workflows/
        ├── update-data.yml   # Täglicher Datenscrape (06:00 UTC)
        ├── gource.yml        # Gource-Visualisierung
        └── ci.yml            # CI-Prüfungen
```

---

## Kontakt

- **Telefon**: +31 6 3606 5494
- **E-Mail**: bauke.molenaar@gmail.com
- **Standort**: Leeuwarden, Niederlande
- **Website**: https://itsdarklikehell.github.io/my-resume/

---

## Lizenz

Dies ist ein persönlicher Lebenslauf-Repository. Alle Rechte vorbehalten.
