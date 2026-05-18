# Heúrēka Marketing

**Application web marketing complète pour Les Gestions Heúrēka**
Saint-Jean-sur-Richelieu, Québec | Rénovation résidentielle

---

## Description

Heúrēka Marketing est une application web qui agit comme un département marketing
complet pour Les Gestions Heúrēka. L'utilisateur voit une interface moderne et
professionnelle — Google Sheets fonctionne en arrière-plan comme base de données
invisible.

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | HTML / CSS / JavaScript (SPA) |
| Backend | Google Apps Script (Web App) |
| Base de données | Google Sheets |
| Stockage photos | Google Drive |
| IA | Claude API (claude-sonnet-4-20250514) |
| Emails | Gmail via Apps Script |
| Versioning | GitHub |

## Modules

| # | Module | Statut |
|---|--------|--------|
| 1 | Tableau de bord | ✅ |
| 2 | Générateur de projet terminé | ✅ |
| 3 | Calendrier de publication | ✅ |
| 4 | TikTok Tendances 🔥 | ✅ |
| 5 | Banque de contenu | ✅ |
| 6 | Demande d'avis Google | ✅ |
| 7 | Intégration Pipeline | ✅ |
| 8 | Contenu saisonnier | ✅ |
| 9 | Rapport mensuel | ✅ |
| 10 | Promotions saisonnières | ✅ |

## Structure des fichiers

```
heureka-marketing-app/
├── frontend/
│   ├── index.html              # Application principale
│   ├── css/
│   │   └── styles.css          # Styles (thème noir & or)
│   └── js/
│       ├── api.js              # Couche API → Apps Script
│       ├── app.js              # Gestionnaire principal
│       ├── dashboard.js        # Module 1
│       ├── generator.js        # Module 2
│       ├── calendar.js         # Module 3
│       ├── trending.js         # Module 4
│       ├── content-bank.js     # Module 5
│       ├── reviews.js          # Module 6
│       ├── seasonal.js         # Module 8
│       ├── reports.js          # Module 9
│       └── promotions.js       # Module 10
├── backend/
│   ├── Code.gs                 # Router principal
│   ├── claude.gs               # Intégration Claude API
│   ├── sheets.gs               # CRUD Google Sheets
│   ├── pipeline.gs             # Sync app Pipeline
│   ├── triggers.gs             # Automatisations
│   └── appsscript.json         # Manifeste Apps Script
├── scrapers/
│   └── tiktok-trends.gs        # Scraper tendances (intégré dans triggers.gs)
├── prompts/
│   ├── facebook-post.md        # Guide prompt Facebook
│   ├── tiktok-script.md        # Guide prompt TikTok
│   ├── blog-article.md         # Guide prompt blogue
│   ├── gallery-description.md  # Guide prompt galerie
│   ├── tiktok-trends.md        # Guide prompt tendances
│   ├── monthly-report.md       # Guide prompt rapport
│   ├── review-request.md       # Guide prompt avis
│   └── seasonal-content.md     # Guide prompt saisonnier
└── docs/
    ├── README.md               # Ce fichier
    └── setup.md                # Guide de déploiement complet
```

## Automatisations

| Trigger | Fréquence | Action |
|---------|-----------|--------|
| Scraping TikTok | Lundi 7h00 | Analyse tendances + email résumé |
| Rappel publications | Dimanche 10h00 | Email avec posts de la semaine |
| Rapport mensuel | 1er du mois 8h00 | Email de rappel pour saisir stats |
| Sync Pipeline | Toutes les heures | Importe projets terminés |
| Suggestions saisonnières | 1er mars/juin/sept/déc | Email avec idées de la saison |

## Intégration Pipeline

Le projet Pipeline ("heureka-pipeline") utilise le Google Sheet
**"Gestions Heuréka Base de données"**.

La synchronisation fonctionne par lecture directe entre les deux Sheets :
1. Apps Script lit le Sheet Pipeline toutes les heures
2. Projets avec statut "Gagné" ou "Chantier terminé" sont importés
3. Une notification email est envoyée
4. Le badge dans l'app indique les nouveaux projets

## Contacts

- **Entreprise:** Les Gestions Heúrēka
- **Email:** daphou8844@gmail.com
- **RBQ:** 5818-7162-01
- **Site:** gestionsheureka.net

## Déploiement

Voir [docs/setup.md](setup.md) pour le guide complet.
