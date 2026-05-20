// ============================================
// MAKE.GS — Webhook Make.com (publication Facebook)
// Config : MAKE_WEBHOOK_URL dans onglet Config
// ============================================

// Point d'entrée appelé par Code.gs (doPost)
// Reçoit contentId + date, cherche le texte et la photo
function sendContentToMake(contentId, scheduledDate) {
  // Récupérer le contenu
  const contents = getSheetData(SHEETS.CONTENU);
  const content = contents.find(function(c) { return c['ID'] === contentId; });
  if (!content) throw new Error('Contenu introuvable: ' + contentId);

  const message = content['ContenuComplet'] || content['Aperçu'] || '';

  // Chercher le Drive ID de la photo "après" du projet lié
  var imageId = '';
  var projetId = content['ProjetID'];
  if (projetId) {
    const projects = getSheetData(SHEETS.PROJETS);
    const project = projects.find(function(p) { return p['ID'] === projetId; });
    if (project && project['Photos']) {
      try {
        var photos = JSON.parse(project['Photos']);
        imageId = photos.apres_id || photos.avant_id || '';
      } catch (_) {}
    }
  }

  // Appel webhook Make
  _callMakeWebhook(message, scheduledDate, imageId);

  // Mettre à jour le statut dans le Sheet
  updateRowById(SHEETS.CONTENU, contentId, {
    Statut: 'Planifié sur Facebook',
    DatePublication: scheduledDate
  });

  // Email de confirmation
  _sendMakeConfirmEmail(message, scheduledDate, imageId);

  return { success: true };
}

function _callMakeWebhook(message, date, imageId) {
  const webhookUrl = getConfigValue('MAKE_WEBHOOK_URL');
  if (!webhookUrl) throw new Error('MAKE_WEBHOOK_URL absente de l\'onglet Config du Google Sheet');

  const payload = JSON.stringify({
    message:  message,
    date:     date,
    image_id: imageId || ''   // Google Drive File ID — vide si aucune photo
  });

  const response = UrlFetchApp.fetch(webhookUrl, {
    method:      'post',
    contentType: 'application/json',
    payload:     payload,
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  if (code < 200 || code > 299) {
    throw new Error('Make webhook erreur HTTP ' + code + ': ' + response.getContentText());
  }
}

function _sendMakeConfirmEmail(message, scheduledDate, imageId) {
  try {
    var dateStr = new Date(scheduledDate).toLocaleDateString('fr-CA', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    var subject = '✅ Post Facebook planifié sur Make — ' + dateStr;
    var lines = [
      'Bonjour,',
      '',
      'Votre post Facebook a été envoyé à Make.com avec succès.',
      '',
      '📅 Publication prévue : ' + dateStr,
      imageId
        ? '📷 Photo Google Drive ID : ' + imageId + '\n   Lien : https://drive.google.com/uc?id=' + imageId
        : '(Aucune photo — post texte seulement)',
      '',
      '📝 Contenu :',
      message.substring(0, 600) + (message.length > 600 ? '…' : ''),
      '',
      'Make.com va publier automatiquement sur votre page Facebook "Les Gestions Heúrēka".',
      '',
      '— Heúrēka Marketing'
    ];
    GmailApp.sendEmail(GMAIL_SENDER, subject, lines.join('\n'), { name: 'Heúrēka Marketing' });
  } catch (_) {}
}
