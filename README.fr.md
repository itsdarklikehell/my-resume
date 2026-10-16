# my-resume

Un site CV bilingue (NL/EN) — désormais multilingue (NL/EN/DE/FR) — mis à jour en direct, construit sur une seule page HTML statique. Hébergé sur GitHub Pages à https://itsdarklikehell.github.io/my-resume/.

---

## Fonctionnalités

### Structure du site
- **CV sur une seule page** — tout sur une seule page HTML statique avec une mise en page basée sur des cartes.
- **Design responsive** — fonctionne sur ordinateur et mobile ; CSS optimisé pour l'impression et l'export PDF.
- **Aucune étape de build** — HTML/CSS/JS pur, servi directement depuis GitHub Pages.

### Langues (i18n)
- **4 langues** : Néerlandais (nl), Anglais (en), Allemand (de), Français (fr).
- **Sélecteur de langue** — alterne nl → en → de → fr avec persistance `localStorage`.
- **Override par paramètre d'URL** — `?lang=de` force une langue et contourne la persistance.
- **Détection automatique** — la langue du navigateur est utilisée lors de la première visite (de/fr/en reviennent à nl par défaut).
- Tout le texte de l'interface, les entrées de chronologie, les certificats, les boutons et les horodatages de section sont traduits via des clés `data-i18n` (157 clés par langue, couverture à 100 %).
- Boutons de téléchargement/impression dépendants de la langue (NL et EN uniquement pour l'impression du CV ; téléchargement JSON pour toutes les langues).

### Palettes de couleurs
- **Cyclateur de palettes** — le bouton parcourt : défaut → nord → dracula → solarized → ocean → défaut.
- **Persistance `localStorage`** — votre dernier choix est mémorisé.
- Appliqué via des surcharges CSS `data-palette` sur l'élément racine.

### Thème
- **Basculement Clair/Sombre** avec persistance `localStorage`.
- Indépendant du cyclateur de palettes ; les deux peuvent être combinés.

### Données mises à jour en direct
- **Cartes de plateforme** — statistiques en direct scrapées quotidiennement via GitHub Actions depuis 10 plateformes :
  - TryHackMe (avec badges bronze/argent/or et matrice de compétences)
  - CTFtime
  - itch.io
  - Codewars
  - DEV.to
  - Stack Overflow
  - GitHub (repos publics, étoiles, abonnés)
  - HackTheBox (nécessite `HACKTHEBOX_API_KEY`)
  - CyLab Academy (nécessite `CYLAB_API_KEY`)
  - Microsoft Learn (nécessite `MICROSOFTLEARN_API_KEY`)
- **Vitrine de dépôts GitHub** — dépôts non-fork automatiquement classés par catégorie (IA & Agents, Sécurité, DevOps & Outils, Jeux & TTRPG, Web & Frontend, Autres), top 3 par catégorie trié par étoiles, statut actif/inactif.
- **Matrice de compétences** — matrice de compétences mise à jour en direct depuis les données du profil TryHackMe.
- **Réalisations** — succès GitHub (Centurion, Prolific, Builder, etc.) et badges Microsoft Learn.
- **Horodatages de section** — horodatages « Dernière mise à jour » sur chaque section axée sur les données, remplis à partir de `generated_at`.
- **Rafraîchissement quotidien** — workflow GitHub Actions (`update-data.yml`) s'exécute tous les jours à 06:00 UTC pour scraper les données des plateformes ; un garde-fou `has_data` empêche les échecs CI d'écraser les bonnes données locales.

### Sections
1. **Hero** — nom, titre, courte introduction, informations de contact.
2. **À propos de moi** — courte biographie.
3. **Expérience** — chronologie de travail de 23 entrées avec rôle, entreprise, période et description.
4. **Formation** — Friesche Poort (Tweewielerherstel Monteur) et Friesland College (Monteur Sterkstroom Installaties).
5. **Projets** — vitrine de dépôts GitHub catégorisée.
6. **Dépôts GitHub** — mêmes données que Projets, section dédiée.
7. **En vedette** — dépôts épinglés avec statut actif/inactif.
8. **Réalisations** — badges GitHub et Microsoft Learn.
9. **Cartes de plateforme** — statistiques en direct des plateformes externes.
10. **Profils** — profils liés (GitHub, TryHackMe, CTFtime, itch.io, Codewars, DEV.to, Stack Overflow, Microsoft Learn).
11. **Certificats et parcours** — Professional Scrum Master, VCA, Fietstechnicus, MSI, Elektrotechniek, permis AM.
12. **Gource** — vidéo de visualisation de l'historique des commits GitHub.
13. **Télécharger le CV** — export PDF basé sur l'impression (NL/EN) + téléchargement JSON.
14. **Partager** — partage LinkedIn, Twitter/X, WhatsApp.
15. **Contact** — formulaire de contact par e-mail.
16. **Barre latérale** — tags d'expertise, Langues (NL/DE/EN avec niveaux : Moedertaal/Basis/Professioneel).

### Technique
- **SEO** — balises Open Graph, Twitter Cards, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `browserconfig.xml`, `humans.txt`, `.well-known/security.txt`.
- **Service Worker** — `/my-resume/sw.js` pour la mise en cache hors ligne des ressources principales.
- **Données structurées** — schéma `application/ld+json` Person avec nom, e-mail, adresse, langues et compétences.
- **Page 404 personnalisée** — `404.html`.
- **CI** — validation HTML de base et vérification des liens brisés lors d'un push/PR.

---

## Structure du dépôt

```
my-resume/
├── README.md                 # Anglais (langue principale)
├── README.nl.md              # Néerlandais
├── README.de.md              # Allemand
├── README.fr.md              # Français
├── CHANGELOG.md              # Toutes les modifications notables
├── CONTRIBUTING.md           # Directives de contribution
├── DEPLOY.md                 # Guide de déploiement
├── SECURITY.md               # Politique de sécurité
├── AGENTS.md                 # Directives d'interaction avec les agents IA
├── CODEOWNERS                # Propriétaires de code
├── index.html                # Page CV principale (fichier HTML statique unique)
├── 404.html                  # Page 404 personnalisée
├── sw.js                     # Service Worker
├── site.webmanifest          # Manifeste PWA
├── robots.txt                # SEO
├── sitemap.xml               # SEO
├── humans.txt                # Humans.txt
├── .well-known/security.txt  # Contact de sécurité
├── favicon-16.png            # Favicon 16x16
├── favicon-32.png            # Favicon 32x32
├── apple-touch-icon.png      # Icône tactile Apple
├── og-image.png              # Image Open Graph
├── gource.mp4                # Vidéo de visualisation Gource
├── github-data.json          # Données GitHub en direct (mis à jour automatiquement)
├── profile-data.json         # Données de plateforme en direct (mis à jour automatiquement)
├── scripts/
│   ├── fetch_github_data.py  # Récupère les données GitHub
│   └── fetch_profile_data.py # Récupère les données de plateforme
└── .github/
    └── workflows/
        ├── update-data.yml   # Scrape de données quotidien (06:00 UTC)
        ├── gource.yml        # Visualisation Gource
        └── ci.yml            # Vérifications CI
```

---

## Contact

- **Téléphone** : +31 6 3606 5494
- **E-mail** : bauke.molenaar@gmail.com
- **Localisation** : Leeuwarden, Pays-Bas
- **Site** : https://itsdarklikehell.github.io/my-resume/

---

## Licence

Ceci est un dépôt de CV personnel. Tous droits réservés.
