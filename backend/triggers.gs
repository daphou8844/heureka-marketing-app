// ============================================
// TRIGGERS.GS — Automatisations Apps Script
// ============================================

// Appeler cette fonction UNE SEULE FOIS pour créer tous les triggers
function createAllTriggers() {
  // Supprimer les triggers existants d'abord
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  // 1. Chaque lundi à 7h — Scraping tendances TikTok
  ScriptApp.newTrigger('weeklyTikTokScrape')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(7)
    .create();

  // 2. Chaque dimanche à 10h — Email rappel publications de la semaine
  ScriptApp.newTrigger('sendWeeklyPublicationReminder')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(10)
    .create();

  // 3. Le 1er de chaque mois — Rapport mensuel automatique
  ScriptApp.newTrigger('generateMonthlyReportAuto')
    .timeBased()
    .onMonthDay(1)
    .atHour(8)
    .create();

  // 4. Sync Pipeline — chaque heure
  ScriptApp.newTrigger('autoSyncPipeline')
    .timeBased()
    .everyHours(1)
    .create();

  // 5. Vérification saisons — 1er mars, juin, septembre, décembre
  ScriptApp.newTrigger('checkSeasonalSuggestions')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();

  Logger.log('✅ Tous les triggers créés avec succès');
}

// ============ TRIGGER: SCRAPING TIKTOK ============
function weeklyTikTokScrape() {
  Logger.log('🔥 Démarrage scraping TikTok — ' + new Date());
  try {
    triggerTrendsScrape();
    Logger.log('✅ Scraping TikTok terminé');
  } catch (err) {
    Logger.log('❌ Erreur scraping: ' + err.message);
  }
}

function triggerTrendsScrape() {
  // Scraping des sources publiques
  const rawTrends = scrapeAllSources();

  // Générer le contenu avec Claude
  const analysed = generateTikTokTrendsContent(rawTrends);

  // Sauvegarder dans le Sheet
  const id = generateId();
  const now = new Date().toISOString();
  const sheet = getSheet(SHEETS.TENDANCES);

  sheet.appendRow([
    id,
    now,
    JSON.stringify(analysed.sounds),
    JSON.stringify(analysed.formats),
    analysed.rawScripts,
    analysed.rawHashtags
  ]);

  // Envoyer l'email résumé
  sendTikTokSummaryEmail(analysed);

  return { success: true, data: { sounds: analysed.sounds, formats: analysed.formats, hashtags: analysed.rawHashtags.split('\n').filter(Boolean), lastUpdate: now } };
}

function scrapeAllSources() {
  const results = [];

  // Google Trends — Requêtes rénovation Québec
  try {
    const googleTrends = UrlFetchApp.fetch(
      'https://trends.google.com/trends/api/dailytrends?hl=fr-CA&tz=-300&geo=CA-QC&ns=15',
      { muteHttpExceptions: true }
    );
    if (googleTrends.getResponseCode() === 200) {
      results.push('=== GOOGLE TRENDS CANADA QC ===\n' + googleTrends.getContentText().substring(0, 2000));
    }
  } catch (_) {}

  // TikTok Creative Center — données publiques
  results.push(`=== TENDANCES RÉNOVATION TIKTOK (données connues) ===
Formats populaires: Before/After, Day in the life, Time-lapse construction, POV du client
Sons tendances: Sons ambiants de construction, musique motivationnelle, sons satisfaisants
Hashtags actifs: #renovation #maison #construction #quebec #reno #travaux #before #after`);

  // Later.com blog
  try {
    const later = UrlFetchApp.fetch('https://later.com/blog/tiktok-trending/', { muteHttpExceptions: true });
    if (later.getResponseCode() === 200) {
      const text = later.getContentText().replace(/<[^>]+>/g, ' ').substring(0, 2000);
      results.push('=== LATER.COM BLOG ===\n' + text);
    }
  } catch (_) {}

  return results.join('\n\n');
}

function sendTikTokSummaryEmail(analysed) {
  const email = GMAIL_SENDER;
  const subject = '🔥 Vos idées TikTok de la semaine — Heúrēka Marketing';

  const sounds = analysed.sounds.slice(0, 3).map(s => `• ${s.name}: ${s.useCase || s.desc}`).join('\n');
  const hashtags = analysed.rawHashtags.split('\n').slice(0, 10).join(', ');

  const body = `Bonjour,

Voici votre résumé TikTok de cette semaine pour Les Gestions Heúrēka :

🎵 SONS TENDANCES:
${sounds || 'Aucun son identifié cette semaine'}

📱 FORMATS QUI PERFORMENT:
${analysed.formats.slice(0, 2).map(f => `• ${f.format}: ${f.desc}`).join('\n')}

🏷️ HASHTAGS RECOMMANDÉS:
${hashtags}

🎬 3 scripts complets sont prêts dans l'application.

Bonne création!
— Heúrēka Marketing
  `;

  try {
    GmailApp.sendEmail(email, subject, body, { name: 'Heúrēka Marketing' });
  } catch (_) {}
}

// ============ TRIGGER: RAPPEL PUBLICATIONS SEMAINE ============
function sendWeeklyPublicationReminder() {
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);

  const calendar = getSheetData(SHEETS.CALENDRIER);
  const upcoming = calendar.filter(c => {
    if (c['Statut'] === 'Publié') return false;
    const d = new Date(c['DatePublication']);
    return d >= now && d <= weekEnd;
  });

  if (upcoming.length === 0) {
    sendNoPostWarningEmail();
    return;
  }

  const email = GMAIL_SENDER;
  const subject = '📅 Vos publications de la semaine — Heúrēka Marketing';
  const list = upcoming.map(c =>
    `• ${new Date(c['DatePublication']).toLocaleDateString('fr-CA')} — ${c['Plateforme']} : ${c['Titre']}`
  ).join('\n');

  const body = `Bonjour,

Voici les publications planifiées pour cette semaine :

${list}

Consultez l'application Heúrēka Marketing pour voir le contenu complet.

Bonne semaine!
— Heúrēka Marketing
  `;

  try {
    GmailApp.sendEmail(email, subject, body, { name: 'Heúrēka Marketing' });
  } catch (_) {}
}

function sendNoPostWarningEmail() {
  const email = GMAIL_SENDER;
  const subject = '⚠️ Aucune publication cette semaine — Heúrēka Marketing';
  const body = `Bonjour,

Aucune publication n'est planifiée pour cette semaine sur Facebook ou TikTok.

Pensez à :
• Générer du contenu pour vos projets terminés récents
• Planifier un post de conseil ou de tendance saisonnière
• Utiliser vos idées TikTok de la semaine

— Heúrēka Marketing
  `;
  try {
    GmailApp.sendEmail(email, subject, body, { name: 'Heúrēka Marketing' });
  } catch (_) {}
}

// ============ TRIGGER: RAPPORT MENSUEL AUTO ============
function generateMonthlyReportAuto() {
  const now = new Date();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = now.getMonth() === 0 ? 12 : now.getMonth();

  // Vérifier si le rapport existe déjà
  const existing = getSheetData(SHEETS.STATS).find(
    s => parseInt(s['Année']) === year && parseInt(s['Mois']) === month
  );
  if (existing && existing['Analyse']) return; // Déjà fait

  // Stats vides par défaut — l'utilisateur saisira les vrais chiffres
  Logger.log(`📊 Génération rapport mensuel ${month}/${year}`);
  sendMonthlyReportReminder(year, month);
}

function sendMonthlyReportReminder(year, month) {
  const MONTHS_FR = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const email = GMAIL_SENDER;
  const subject = `📊 Rapport mensuel ${MONTHS_FR[month]} ${year} — Saisie requise`;
  const body = `Bonjour,

C'est le début du mois! Il est temps de saisir vos statistiques ${MONTHS_FR[month]} ${year}.

Rendez-vous dans Heúrēka Marketing → Rapport mensuel pour :
• Saisir vos vues Facebook et TikTok
• Entrer vos nouveaux abonnés
• Noter vos nouveaux avis Google
• Laisser Claude IA générer votre analyse et plan du mois

— Heúrēka Marketing
  `;
  try {
    GmailApp.sendEmail(email, subject, body, { name: 'Heúrēka Marketing' });
  } catch (_) {}
}

// ============ TRIGGER: SYNC PIPELINE ============
function autoSyncPipeline() {
  try {
    const result = syncPipeline();
    if (result.newProjects > 0) {
      Logger.log(`✅ ${result.newProjects} nouveaux projets Pipeline synchronisés`);
    }
  } catch (err) {
    Logger.log('❌ Erreur sync Pipeline: ' + err.message);
  }
}

// ============ TRIGGER: SUGGESTIONS SAISONNIÈRES ============
function checkSeasonalSuggestions() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;

  // Envoyer suggestions au début de chaque saison
  const seasonStarts = [
    { month: 3, day: 1, season: 'Printemps' },
    { month: 6, day: 1, season: 'Été' },
    { month: 9, day: 1, season: 'Automne' },
    { month: 12, day: 1, season: 'Hiver' }
  ];

  const match = seasonStarts.find(s => s.month === month && s.day === day);
  if (!match) return;

  const email = GMAIL_SENDER;
  const subject = `🌿 Nouvelle saison — Idées de contenu ${match.season} prêtes`;
  const body = `Bonjour,

La saison ${match.season} commence aujourd'hui!

Heúrēka Marketing a des idées de contenu thématiques prêtes pour vous :
• Posts Facebook saisonniers
• Scripts TikTok adaptés
• Promotions saisonnières

Connectez-vous pour accéder au contenu saisonnier de l'${match.season}.

— Heúrēka Marketing
  `;
  try {
    GmailApp.sendEmail(email, subject, body, { name: 'Heúrēka Marketing' });
  } catch (_) {}
}

// ============ UPLOAD PHOTO ============
function uploadPhoto(payload) {
  const { fileName, mimeType, base64Data, projectId } = payload;
  const folder = getOrCreateDriveFolder('Heúrēka Marketing — Photos');
  const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const url = `https://drive.google.com/uc?id=${file.getId()}`;
  return { url, fileId: file.getId(), fileName };
}

function getOrCreateDriveFolder(name) {
  const folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}
