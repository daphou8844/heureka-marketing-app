// ============================================
// PIPELINE.GS — Intégration avec l'app Pipeline Heúrēka
// Méthode : lecture directe du Google Sheet Pipeline
// Sheet Pipeline ID : "Gestions Heuréka Base de données"
// ============================================

// Nom de l'onglet dans le Sheet Pipeline qui contient les projets terminés
const PIPELINE_SHEET_NAME = 'Chantiers';
const PIPELINE_STATUS_COLUMN = 'Statut';
const PIPELINE_COMPLETED_STATUSES = ['Gagné', 'Chantier terminé', 'Terminé'];

function syncPipeline() {
  const pipelineSheetId = PIPELINE_SHEET_ID ||
    PropertiesService.getScriptProperties().getProperty('PIPELINE_SHEET_ID');

  if (!pipelineSheetId) {
    return { newProjects: 0, message: 'PIPELINE_SHEET_ID non configuré' };
  }

  try {
    const pipelineSS = SpreadsheetApp.openById(pipelineSheetId);
    const sheet = pipelineSS.getSheetByName(PIPELINE_SHEET_NAME);
    if (!sheet) {
      // Essayer de trouver l'onglet avec les chantiers
      const sheets = pipelineSS.getSheets();
      const names = sheets.map(s => s.getName()).join(', ');
      return { newProjects: 0, message: `Onglet "${PIPELINE_SHEET_NAME}" introuvable. Onglets disponibles: ${names}` };
    }

    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return { newProjects: 0 };

    const headers = values[0];
    const rows = values.slice(1);

    // Récupérer les IDs déjà synchronisés
    const existing = getSheetData(SHEETS.PIPELINE).map(p => p['PipelineID']);

    let newCount = 0;
    const newProjects = [];

    rows.forEach(row => {
      const rowData = {};
      headers.forEach((h, i) => { rowData[String(h).trim()] = row[i]; });

      const statut = String(rowData[PIPELINE_STATUS_COLUMN] || rowData['statut'] || '').trim();
      const pipelineId = String(rowData['ID'] || rowData['id'] || rowData['No'] || '').trim();

      // Si projet terminé et pas encore synchronisé
      if (PIPELINE_COMPLETED_STATUSES.includes(statut) && pipelineId && !existing.includes(pipelineId)) {
        const syncId = generateId();
        const project = mapPipelineRow(rowData, pipelineId, syncId);

        appendRow(SHEETS.PIPELINE, project, HEADERS.PIPELINE);
        newProjects.push(project);
        newCount++;
      }
    });

    // Envoyer notification si nouveaux projets
    if (newCount > 0) {
      sendPipelineNotificationEmail(newProjects);
    }

    return { newProjects: newCount, projects: newProjects };
  } catch (err) {
    return { newProjects: 0, error: err.message };
  }
}

function mapPipelineRow(row, pipelineId, syncId) {
  return {
    ID: syncId,
    PipelineID: pipelineId,
    Nom: row['Client'] || row['Nom'] || row['Prénom'] || row['client'] || '',
    Type: row['Type'] || row['Service'] || row['type'] || '',
    Ville: row['Ville'] || row['ville'] || '',
    DateDebut: row['Date début'] || row['DateDebut'] || row['Début'] || '',
    DateFin: row['Date fin'] || row['DateFin'] || row['Fin'] || '',
    Valeur: row['Valeur'] || row['Montant'] || row['Contrat'] || '',
    StatutSync: 'En attente',
    DateReception: new Date().toISOString()
  };
}

function getPipelineProjects() {
  const data = getSheetData(SHEETS.PIPELINE);
  return {
    projects: data
      .filter(p => p['StatutSync'] === 'En attente')
      .map(p => ({
        id: p['ID'],
        pipelineId: p['PipelineID'],
        client: p['Nom'],
        type: p['Type'],
        ville: p['Ville'],
        dateFin: p['DateFin'],
        valeur: p['Valeur']
      }))
  };
}

function sendPipelineNotificationEmail(projects) {
  const email = GMAIL_SENDER;
  const subject = `🔔 ${projects.length} nouveau(x) projet(s) prêt(s) à marketer — Heúrēka Marketing`;
  const body = `
Bonjour,

${projects.length} nouveau(x) projet(s) vient d'être synchronisé depuis votre application Pipeline :

${projects.map(p => `• ${p.Type || 'Projet'} — ${p.Ville || ''} (${p.Nom || 'Client'})`).join('\n')}

Rendez-vous dans l'application Heúrēka Marketing pour générer votre contenu marketing.

— Heúrēka Marketing (automatique)
  `;

  try {
    GmailApp.sendEmail(email, subject, body, { name: 'Heúrēka Marketing' });
  } catch (_) {}
}

// Webhook entrant — pour d'autres systèmes qui voudraient envoyer des projets
function receiveWebhook(projectData) {
  const syncId = generateId();
  appendRow(SHEETS.PIPELINE, {
    ID: syncId,
    PipelineID: projectData.id || '',
    Nom: projectData.client || '',
    Type: projectData.type || '',
    Ville: projectData.ville || '',
    DateDebut: projectData.dateDebut || '',
    DateFin: projectData.dateFin || '',
    Valeur: projectData.valeur || '',
    StatutSync: 'En attente',
    DateReception: new Date().toISOString()
  }, HEADERS.PIPELINE);
  return { id: syncId, success: true };
}
