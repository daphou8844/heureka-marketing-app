// ============================================
// SETUP.GS — Installation automatique complète
// Exécuter setupAll() UNE SEULE FOIS après avoir
// collé tous les fichiers .gs dans Apps Script
// ============================================

function setupAll() {
  Logger.log('🚀 Démarrage de l\'installation Heúrēka Marketing...');

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Créer tous les onglets avec leurs en-têtes
  createSheet(ss, 'Projets', [
    'ID', 'Date', 'Type', 'Ville', 'Durée', 'Description',
    'Client', 'Email', 'Tel', 'Photos', 'Statut', 'Source', 'PipelineID'
  ]);

  createSheet(ss, 'Contenu généré', [
    'ID', 'ProjetID', 'Date', 'Type', 'Ville', 'Plateforme',
    'Aperçu', 'ContenuComplet', 'Statut', 'DatePublication'
  ]);

  createSheet(ss, 'Calendrier', [
    'ID', 'ContenuID', 'Plateforme', 'Titre', 'DatePublication', 'Heure', 'Statut'
  ]);

  createSheet(ss, 'Clients', [
    'ID', 'ProjetID', 'Nom', 'Email', 'Tel', 'Type', 'Ville',
    'DateContact', 'DemandeStatut', 'AvisRecu', 'DateAvis'
  ]);

  createSheet(ss, 'Tendances TikTok', [
    'ID', 'DateMiseAJour', 'Sons', 'Formats', 'Scripts', 'Hashtags'
  ]);

  createSheet(ss, 'Statistiques', [
    'ID', 'Année', 'Mois', 'VuesFacebook', 'VuesTikTok', 'AbonnésFB',
    'AbonnésTT', 'NouveauxAvis', 'PostsPubliés', 'Leads', 'Analyse', 'PlanMoisSuivant'
  ]);

  createSheet(ss, 'Pipeline Sync', [
    'ID', 'PipelineID', 'Nom', 'Type', 'Ville',
    'DateDebut', 'DateFin', 'Valeur', 'StatutSync', 'DateReception'
  ]);

  createSheet(ss, 'Config', ['Clé', 'Valeur']);

  // Supprimer l'onglet vide par défaut (Sheet1) s'il existe
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Feuille 1') || ss.getSheetByName('Feuille1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  // Sauvegarder l'ID du spreadsheet dans les propriétés du script
  const ssId = ss.getId();
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ssId);

  // Créer les triggers automatiques
  setupTriggers();

  Logger.log('');
  Logger.log('✅ Installation terminée!');
  Logger.log('📋 ID du Spreadsheet: ' + ssId);
  Logger.log('');
  Logger.log('📌 PROCHAINES ÉTAPES:');
  Logger.log('1. Aller dans Paramètres du projet → Propriétés du script');
  Logger.log('2. Ajouter : PIPELINE_SHEET_ID = ID du sheet "Gestions Heuréka Base de données"');
  Logger.log('3. Ajouter : GOOGLE_BUSINESS_LINK = votre lien de review Google (optionnel)');
  Logger.log('4. Déployer → Nouveau déploiement → Application Web');
  Logger.log('5. Copier l\'URL et la coller dans l\'app frontend');
  Logger.log('');
  Logger.log('✨ Aucune clé API requise — génération par templates incluse!');

  SpreadsheetApp.getUi().alert(
    '✅ Installation réussie!\n\n' +
    'ID du Sheet sauvegardé automatiquement.\n\n' +
    'Prochaine étape :\n' +
    'Extensions → Apps Script → Paramètres du projet\n' +
    '→ Ajouter PIPELINE_SHEET_ID (ID de votre Sheet Pipeline)\n' +
    '→ Ajouter GOOGLE_BUSINESS_LINK (optionnel)\n\n' +
    'Aucune clé Claude API nécessaire — zéro coût!'
  );
}

function createSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    Logger.log('📄 Onglet créé: ' + name);
  } else {
    Logger.log('📄 Onglet existant mis à jour: ' + name);
  }

  // Écrire les en-têtes
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);

  // Formater les en-têtes
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1A1A1A');
  headerRange.setFontColor('#D4AF37');
  sheet.setFrozenRows(1);

  // Ajuster la largeur des colonnes automatiquement
  sheet.autoResizeColumns(1, headers.length);

  return sheet;
}

function setupTriggers() {
  // Supprimer les anciens triggers
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  // Lundi 7h — TikTok trends
  ScriptApp.newTrigger('weeklyTikTokScrape')
    .timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).create();

  // Dimanche 10h — rappel publications
  ScriptApp.newTrigger('sendWeeklyPublicationReminder')
    .timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(10).create();

  // 1er du mois 8h — rapport mensuel
  ScriptApp.newTrigger('generateMonthlyReportAuto')
    .timeBased().onMonthDay(1).atHour(8).create();

  // Toutes les heures — sync Pipeline
  ScriptApp.newTrigger('autoSyncPipeline')
    .timeBased().everyHours(1).create();

  // Chaque jour 9h — vérification saisons
  ScriptApp.newTrigger('checkSeasonalSuggestions')
    .timeBased().everyDays(1).atHour(9).create();

  Logger.log('⏰ 5 triggers automatiques créés');
}

// Utilitaire : afficher l'URL de déploiement actuelle
function showDeploymentUrl() {
  const url = ScriptApp.getService().getUrl();
  if (url) {
    SpreadsheetApp.getUi().alert('URL de votre Web App:\n\n' + url + '\n\nCopiez cette URL dans votre app frontend.');
    Logger.log('URL Web App: ' + url);
  } else {
    SpreadsheetApp.getUi().alert('Pas encore déployé.\n\nAllez dans: Déployer → Nouveau déploiement → Application Web');
  }
}

// Utilitaire : tester la génération de contenu (sans IA)
function testContentGeneration() {
  const sample = generateProjectContent({
    type: 'Portes et fenêtres',
    ville: 'Saint-Jean-sur-Richelieu',
    duree: '3 jours',
    client: 'Famille Tremblay',
    description: 'Remplacement de 8 fenêtres double vitrage dans une maison de plain-pied.'
  });
  Logger.log('--- POST FACEBOOK ---\n' + sample.facebook);
  SpreadsheetApp.getUi().alert('✅ Génération OK!\n\nVoir le log Apps Script pour un exemple de contenu généré.');
}

// Utilitaire : tester la connexion Pipeline
function testPipelineConnection() {
  try {
    const result = syncPipeline();
    SpreadsheetApp.getUi().alert(
      '✅ Connexion Pipeline OK!\n\n' +
      'Nouveaux projets trouvés: ' + result.newProjects + '\n' +
      (result.message ? 'Message: ' + result.message : '')
    );
  } catch (err) {
    SpreadsheetApp.getUi().alert('❌ Erreur connexion Pipeline:\n\n' + err.message);
  }
}
