# My Resume — Digitale CV van Bauke Molenaar
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fitsdarklikehell.github.io%2Fmy-resume%2F)](https://itsdarklikehell.github.io/my-resume/)

Een moderne, tweetalige (NL/EN) digitale resume met live GitHub data, gebouwd als statische site.

## 🎥 Gource Visualization

De ontwikkelhistorie van dit project in een film:

<video src="https://raw.githubusercontent.com/itsdarklikehell/my-resume/main/gource.mp4" controls width="100%"></video>

*De video wordt automatisch gegenereerd door de [Gource workflow](.github/workflows/gource.yml) bij elke push.*

## 🚀 Live Site

**https://itsdarklikehell.github.io/my-resume/**

## ✨ Features

- **Tweetalig** (NL/EN) met automatische browser-taaldetectie
- **Live GitHub data** — projecten, skills, contributions (dagelijks geüpdatet)
- **Donut chart** met taalverdeling
- **Geanimeerde tijdlijn** voor werkervaring
- **Contact formulier** (mailto)
- **Download als JSON** voor ATS-systemen
- **Share knoppen** voor LinkedIn, Twitter, WhatsApp
- **Print-friendly** versie
- **Dark/Light/Auto** thema
- **Open Graph** meta-tags voor social media
- **PWA** manifest + favicons


## 🆕 Recent Updates

- Updated README with website badge and last verified timestamp


## 🏷️ Tags

- HTML5
- CSS3
- JavaScript
- GitHub Actions
- GitHub Pages
- PWA
- Open Graph
- Dark Mode
- Multilingual
- Live Data
- Donut Chart
- Timeline Animation
- Contact Form
- JSON Export
- Share Buttons
- Print Friendly
- Auto Theme
- Last Updated
- Gource Visualization

## 🛠️ Tech Stack

- HTML5 + CSS3 + JavaScript (geen frameworks)
- GitHub Actions voor automatische data-updates
- GitHub Pages voor hosting
- Gource voor visualisatie

## 📁 Structuur

```
├── index.html              # Hoofdpagina
├── github-data.json        # Live GitHub data (automatisch gegenereerd)
├── profile-data.json       # Handmatige profiel data (THM, HTB, CyLab)
├── profile.jpg            # Profielfoto
├── favicon-*.png          # Favicons
├── site.webmanifest       # PWA manifest
├── scripts/
│   └── fetch_github_data.py  # Script om GitHub data op te halen
└── .github/workflows/
    ├── update-data.yml    # Dagelijkse data-update workflow
    └── gource.yml        # Gource visualisatie workflow
```

## 🔄 Automatische Updates

De GitHub data wordt dagelijks om 06:00 UTC automatisch bijgewerkt door de `update-data.yml` workflow. De Gource video wordt bij elke push ververst.

## 📝 License

© 2026 Bauke Molenaar
