// ============================================
// MAKE.GS — Webhook Make.com (publication Facebook)
// URL du webhook → onglet Config → MAKE_WEBHOOK_URL
// ============================================

function sendToMakeWebhook(message, date, imageUrl) {
  const webhookUrl = getConfigValue('MAKE_WEBHOOK_URL');
  if (!webhookUrl) throw new Error('MAKE_WEBHOOK_URL absente de l\'onglet Config du Google Sheet');

  const payload = JSON.stringify({
    message:   message,
    date:      date,
    image_url: imageUrl || ''
  });

  const response = UrlFetchApp.fetch(webhookUrl, {
    method:      'post',
    contentType: 'application/json',
    payload:     payload,
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  if (code < 200 || code > 299) {
    throw new Error('Make webhook — erreur HTTP ' + code + ': ' + response.getContentText());
  }

  return { success: true };
}
