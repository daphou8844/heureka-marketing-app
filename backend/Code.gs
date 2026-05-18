// ============================================
// CODE.GS — Point d'entrée Apps Script Web App
// Heúrēka Marketing — Les Gestions Heúrēka
// ============================================

const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const CLAUDE_API_KEY = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
const GMAIL_SENDER = 'daphou8844@gmail.com';
const GOOGLE_BUSINESS_LINK = PropertiesService.getScriptProperties().getProperty('GOOGLE_BUSINESS_LINK') || '';
const PIPELINE_SHEET_ID = PropertiesService.getScriptProperties().getProperty('PIPELINE_SHEET_ID');

// Onglets du Sheet
const SHEETS = {
  PROJETS: 'Projets',
  CONTENU: 'Contenu généré',
  CALENDRIER: 'Calendrier',
  CLIENTS: 'Clients',
  TENDANCES: 'Tendances TikTok',
  STATS: 'Statistiques',
  PIPELINE: 'Pipeline Sync',
  CONFIG: 'Config'
};

function doGet(e) {
  const action = e.parameter.action;
  const params = e.parameter;

  try {
    let result;
    switch (action) {
      case 'getDashboardData': result = getDashboardData(); break;
      case 'getProjects': result = getProjects(params); break;
      case 'getCalendar': result = getCalendar(parseInt(params.year), parseInt(params.month)); break;
      case 'getTikTokTrends': result = getTikTokTrends(); break;
      case 'getContent': result = getContent(params); break;
      case 'getReviews': result = getReviews(); break;
      case 'getSeasonalContent': result = getSeasonalContent(); break;
      case 'getMonthlyReport': result = getMonthlyReport(parseInt(params.year), parseInt(params.month)); break;
      case 'getPromotions': result = getPromotions(); break;
      case 'getPipelineProjects': result = getPipelineProjects(); break;
      default: result = { error: 'Action inconnue: ' + action };
    }
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const action = payload.action;

  try {
    let result;
    switch (action) {
      case 'addProject': result = addProject(payload.project); break;
      case 'updateProject': result = updateProject(payload.id, payload.data); break;
      case 'generateContent': result = generateContent(payload.projectId, payload.projectData); break;
      case 'scheduleContent': result = scheduleContent(payload.contentId, payload.date, payload.platform); break;
      case 'updateSchedule': result = updateSchedule(payload.id, payload.date); break;
      case 'updateContentStatus': result = updateContentStatus(payload.id, payload.status); break;
      case 'deleteContent': result = deleteContent(payload.id); break;
      case 'sendReviewRequest': result = sendReviewRequest(payload.clientId || payload); break;
      case 'markReviewReceived': result = markReviewReceived(payload.clientId); break;
      case 'generateSeasonalContent': result = generateSeasonalContent(payload.season, payload.theme); break;
      case 'saveStats': result = saveAndAnalyzeStats(payload.stats); break;
      case 'generatePromotion': result = generatePromotion(payload.data); break;
      case 'syncPipeline': result = syncPipeline(); break;
      case 'triggerTrendsScrape': result = triggerTrendsScrape(); break;
      case 'uploadPhoto': result = uploadPhoto(payload); break;
      default: result = { error: 'Action inconnue: ' + action };
    }
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Utilitaire ID unique
function generateId() {
  return Utilities.getUuid().split('-')[0].toUpperCase();
}

// Accès au spreadsheet
function getSheet(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(name);
}

// Lire toutes les données d'un onglet (en-têtes = première ligne)
function getSheetData(sheetName) {
  const sheet = getSheet(sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

// Ajouter une ligne
function appendRow(sheetName, data, headers) {
  const sheet = getSheet(sheetName);
  const row = headers.map(h => data[h] || '');
  sheet.appendRow(row);
}

// Mettre à jour une ligne par ID
function updateRowById(sheetName, id, updates) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIdx = headers.indexOf('ID');
  if (idIdx === -1) return;
  for (let i = 1; i < values.length; i++) {
    if (values[i][idIdx] === id) {
      Object.entries(updates).forEach(([key, val]) => {
        const colIdx = headers.indexOf(key);
        if (colIdx !== -1) sheet.getRange(i + 1, colIdx + 1).setValue(val);
      });
      return;
    }
  }
}

// Supprimer une ligne par ID
function deleteRowById(sheetName, id) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIdx = headers.indexOf('ID');
  if (idIdx === -1) return;
  for (let i = values.length - 1; i >= 1; i--) {
    if (values[i][idIdx] === id) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}
