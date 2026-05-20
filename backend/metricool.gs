// ============================================
// METRICOOL.GS — Planification via Metricool API
// Clé API → onglet Config → METRICOOL_API_KEY
// Brand ID → onglet Config → METRICOOL_BRAND_ID
// ============================================

const METRICOOL_API_BASE = 'https://app.metricool.com/api/v2';

// Lire une valeur dans l'onglet Config (colonnes: Clé | Valeur)
function getConfigValue(key) {
  const rows = getSheetData(SHEETS.CONFIG);
  const row = rows.find(r => r['Clé'] === key);
  return row ? String(row['Valeur']).trim() : null;
}

// ============ ACTION PRINCIPALE ============
function scheduleMetricoolPost(contentId, text, scheduledDate, imageUrl) {
  const apiKey = getConfigValue('METRICOOL_API_KEY');
  if (!apiKey) throw new Error('METRICOOL_API_KEY absente de l\'onglet Config');

  const brandId = getConfigValue('METRICOOL_BRAND_ID');

  // Construire le payload Metricool
  const payload = {
    text: text,
    date: new Date(scheduledDate).toISOString(),
    networks: { facebook: true }
  };
  if (brandId) payload.blogId = parseInt(brandId);
  if (imageUrl) payload.mediaUrls = [imageUrl];

  // Appel API Metricool
  const response = UrlFetchApp.fetch(METRICOOL_API_BASE + '/scheduledPost', {
    method: 'POST',
    headers: {
      'X-Mc-Auth': apiKey,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  const body = response.getContentText();

  if (code !== 200 && code !== 201) {
    throw new Error('Metricool erreur ' + code + ': ' + body);
  }

  // Mettre à jour le statut dans le Sheet
  if (contentId) {
    updateRowById(SHEETS.CONTENU, contentId, {
      'Statut': 'Planifié dans Metricool',
      'DatePublication': scheduledDate
    });
  }

  // Email de confirmation
  _sendMetricoolConfirmEmail(text, scheduledDate, imageUrl);

  return { success: true };
}

// ============ EMAIL DE CONFIRMATION ============
function _sendMetricoolConfirmEmail(text, scheduledDate, imageUrl) {
  try {
    const dateStr = new Date(scheduledDate).toLocaleDateString('fr-CA', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const subject = '✅ Post Facebook planifié dans Metricool — ' + dateStr;
    const body = [
      'Bonjour,',
      '',
      'Votre post Facebook a été transmis à Metricool avec succès.',
      '',
      '📅 Publication prévue : ' + dateStr,
      imageUrl ? ('🖼 Image : ' + imageUrl) : '',
      '',
      '📝 Contenu :',
      text,
      '',
      'Metricool publiera automatiquement sur votre page Facebook "Les Gestions Heúrēka".',
      '',
      '— Heúrēka Marketing'
    ].filter(l => l !== undefined).join('\n');

    GmailApp.sendEmail(GMAIL_SENDER, subject, body, { name: 'Heúrēka Marketing' });
  } catch (_) {}
}
