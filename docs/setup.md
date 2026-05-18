# Guide de configuration — Heúrēka Marketing

## Étape 1 : Créer le Google Sheet

1. Ouvrir Google Drive → Nouveau → Google Sheets
2. Nommer le fichier **"Heúrēka Marketing — Base de données"**
3. Créer les onglets suivants (en cliquant sur + en bas) :
   - `Projets`
   - `Contenu généré`
   - `Calendrier`
   - `Clients`
   - `Tendances TikTok`
   - `Statistiques`
   - `Pipeline Sync`
   - `Config`

4. Dans chaque onglet, créer la première ligne (en-têtes) :

**Projets:**
`ID | Date | Type | Ville | Durée | Description | Client | Email | Tel | Photos | Statut | Source | PipelineID`

**Contenu généré:**
`ID | ProjetID | Date | Type | Ville | Plateforme | Aperçu | ContenuComplet | Statut | DatePublication`

**Calendrier:**
`ID | ContenuID | Plateforme | Titre | DatePublication | Heure | Statut`

**Clients:**
`ID | ProjetID | Nom | Email | Tel | Type | Ville | DateContact | DemandeStatut | AvisRecu | DateAvis`

**Tendances TikTok:**
`ID | DateMiseAJour | Sons | Formats | Scripts | Hashtags`

**Statistiques:**
`ID | Année | Mois | VuesFacebook | VuesTikTok | AbonnésFB | AbonnésTT | NouveauxAvis | PostsPubliés | Leads | Analyse | PlanMoisSuivant`

**Pipeline Sync:**
`ID | PipelineID | Nom | Type | Ville | DateDebut | DateFin | Valeur | StatutSync | DateReception`

5. **Copier l'ID du Sheet** depuis l'URL :
   `https://docs.google.com/spreadsheets/d/[CECI EST L'ID]/edit`

---

## Étape 2 : Créer le projet Apps Script

1. Dans le Google Sheet → Extensions → Apps Script
2. Supprimer le code par défaut (fonction myFunction)
3. Créer des fichiers dans Apps Script :
   - Renommer `Code.gs` et coller le contenu de `/backend/Code.gs`
   - Créer `claude.gs` et coller le contenu de `/backend/claude.gs`
   - Créer `sheets.gs` et coller le contenu de `/backend/sheets.gs`
   - Créer `pipeline.gs` et coller le contenu de `/backend/pipeline.gs`
   - Créer `triggers.gs` et coller le contenu de `/backend/triggers.gs`

4. **Fichier `appsscript.json`** :
   - Activer "Afficher le fichier manifeste" dans les paramètres
   - Remplacer le contenu par le fichier `/backend/appsscript.json`

---

## Étape 3 : Configurer les propriétés du script

Dans Apps Script → Paramètres du projet → Propriétés du script :

| Propriété | Valeur |
|-----------|--------|
| `SPREADSHEET_ID` | L'ID de votre Google Sheet (étape 1) |
| `CLAUDE_API_KEY` | Votre clé API Claude (console.anthropic.com) |
| `PIPELINE_SHEET_ID` | L'ID du Sheet Pipeline : `Gestions Heuréka Base de données` |
| `GOOGLE_BUSINESS_LINK` | Votre lien de review Google Business |

**Trouver l'ID du Sheet Pipeline:**
Ouvrir le Sheet "Gestions Heuréka Base de données" → copier l'ID dans l'URL.

---

## Étape 4 : Déployer comme Web App

1. Dans Apps Script → Déployer → Nouveau déploiement
2. Type : **Application Web**
3. Exécuter en tant que : **Moi (votre compte)**
4. Accès : **Tout le monde (même anonyme)**
5. Cliquer sur **Déployer**
6. **Copier l'URL** fournie (format: `https://script.google.com/macros/s/.../exec`)

---

## Étape 5 : Configurer l'interface web

1. Ouvrir `frontend/index.html` dans un navigateur
2. Une popup de configuration apparaît
3. Coller l'URL Apps Script de l'étape 4
4. Cliquer Sauvegarder

---

## Étape 6 : Initialiser les triggers automatiques

1. Dans Apps Script → Exécuter → `createAllTriggers`
2. Autoriser les permissions demandées
3. Vérifier dans Déclencheurs que 5 triggers sont créés

---

## Étape 7 : Vérifier l'intégration Pipeline

1. Dans le Sheet Pipeline ("Gestions Heuréka Base de données"), noter le nom de l'onglet qui contient les chantiers
2. Si différent de "Chantiers", modifier la constante `PIPELINE_SHEET_NAME` dans `pipeline.gs`
3. Vérifier les noms des colonnes : Statut, Client, Type, Ville, Date début, Date fin
4. Ajuster la constante `PIPELINE_STATUS_COLUMN` si nécessaire

---

## Étape 8 : Déployer sur GitHub Pages (optionnel)

```bash
cd C:\heureka-marketing
git init
git add .
git commit -m "Initial commit — Heúrēka Marketing"
git branch -M main
git remote add origin https://github.com/daphou8844/heureka-marketing-app.git
git push -u origin main
```

Activer GitHub Pages sur la branche `main`, dossier `/frontend`.

URL finale : `https://daphou8844.github.io/heureka-marketing-app/`

---

## Obtenir la clé API Claude

1. Aller sur https://console.anthropic.com
2. API Keys → Create Key
3. Copier la clé (commence par `sk-ant-...`)
4. L'ajouter dans les propriétés du script (étape 3)

**Coût estimé :** ~0.50-2.00$ CAD par projet généré (claude-sonnet-4)
