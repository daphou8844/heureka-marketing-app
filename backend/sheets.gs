// ============================================
// SHEETS.GS — Opérations CRUD sur Google Sheets
// ============================================

// En-têtes de chaque onglet
const HEADERS = {
  PROJETS: ['ID', 'Date', 'Type', 'Ville', 'Durée', 'Description', 'Client', 'Email', 'Tel', 'Photos', 'Statut', 'Source', 'PipelineID'],
  CONTENU: ['ID', 'ProjetID', 'Date', 'Type', 'Ville', 'Plateforme', 'Aperçu', 'ContenuComplet', 'Statut', 'DatePublication'],
  CALENDRIER: ['ID', 'ContenuID', 'Plateforme', 'Titre', 'DatePublication', 'Heure', 'Statut'],
  CLIENTS: ['ID', 'ProjetID', 'Nom', 'Email', 'Tel', 'Type', 'Ville', 'DateContact', 'DemandeStatut', 'AvisRecu', 'DateAvis'],
  TENDANCES: ['ID', 'DateMiseAJour', 'Sons', 'Formats', 'Scripts', 'Hashtags'],
  STATS: ['ID', 'Année', 'Mois', 'VuesFacebook', 'VuesTikTok', 'AbonnésFB', 'AbonnésTT', 'NouveauxAvis', 'PostsPubliés', 'Leads', 'Analyse', 'PlanMoisSuivant'],
  PIPELINE: ['ID', 'PipelineID', 'Nom', 'Type', 'Ville', 'DateDebut', 'DateFin', 'Valeur', 'StatutSync', 'DateReception']
};

// ---- TABLEAU DE BORD ----
function getDashboardData() {
  const now = new Date();
  const content = getSheetData(SHEETS.CONTENU);
  const calendar = getSheetData(SHEETS.CALENDRIER);
  const pipeline = getSheetData(SHEETS.PIPELINE);
  const clients = getSheetData(SHEETS.CLIENTS);

  // Prochain post planifié
  const upcoming = calendar
    .filter(c => c['Statut'] !== 'Publié' && c['DatePublication'])
    .sort((a, b) => new Date(a['DatePublication']) - new Date(b['DatePublication']));
  const nextPost = upcoming[0] ? {
    date: upcoming[0]['DatePublication'],
    platform: upcoming[0]['Plateforme'],
    title: upcoming[0]['Titre']
  } : null;

  // Dernière publication
  const published = content
    .filter(c => c['Statut'] === 'Publié')
    .sort((a, b) => new Date(b['Date']) - new Date(a['Date']));
  const lastPost = published[0] ? {
    platform: published[0]['Plateforme'],
    date: published[0]['Date'],
    preview: (published[0]['Aperçu'] || '').substring(0, 120)
  } : null;

  // Projets ce mois
  const projects = getSheetData(SHEETS.PROJETS);
  const thisMonth = projects.filter(p => {
    const d = new Date(p['Date']);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Projets Pipeline en attente
  const pipelineProjects = pipeline
    .filter(p => p['StatutSync'] === 'En attente')
    .map(p => ({
      id: p['ID'],
      type: p['Type'],
      ville: p['Ville'],
      client: p['Nom'],
      dateFin: p['DateFin']
    }));

  // Tendances TikTok résumé
  const trends = getSheetData(SHEETS.TENDANCES);
  const latestTrend = trends.sort((a, b) => new Date(b['DateMiseAJour']) - new Date(a['DateMiseAJour']))[0];
  let tiktokSummary = [];
  if (latestTrend && latestTrend['Sons']) {
    try {
      const sons = JSON.parse(latestTrend['Sons']);
      tiktokSummary = sons.slice(0, 3).map(s => ({ title: s.name, desc: s.useCase || s.desc }));
    } catch (_) {}
  }

  // Alertes
  const alerts = [];
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekEnd.getDate() + 7);

  const postsThisWeek = calendar.filter(c => {
    const d = new Date(c['DatePublication']);
    return d >= thisWeekStart && d <= thisWeekEnd;
  });
  if (postsThisWeek.length === 0) {
    alerts.push('Aucune publication planifiée cette semaine — pensez à planifier du contenu');
  }
  if (pipelineProjects.length > 0) {
    alerts.push(`${pipelineProjects.length} projet(s) de Pipeline en attente de contenu`);
  }

  // Posts cette semaine
  const thisWeek = calendar
    .filter(c => {
      const d = new Date(c['DatePublication']);
      return d >= now && d <= thisWeekEnd;
    })
    .map(c => ({ date: c['DatePublication'], platform: c['Plateforme'], title: c['Titre'] }));

  return {
    nextPost,
    lastPost,
    contentCount: content.length,
    reviewCount: 82 + clients.filter(c => c['AvisRecu'] === true || c['AvisRecu'] === 'TRUE').length,
    reviewRating: 4.8,
    projectsThisMonth: thisMonth,
    pendingContent: pipeline.filter(p => p['StatutSync'] === 'En attente').length,
    pipelineProjects,
    tiktokSummary,
    alerts,
    thisWeek
  };
}

// ---- PROJETS ----
function getProjects(params = {}) {
  let data = getSheetData(SHEETS.PROJETS);
  if (params.type) data = data.filter(p => p['Type'] === params.type);
  if (params.ville) data = data.filter(p => p['Ville'] === params.ville);
  return {
    projects: data.map(p => ({
      id: p['ID'], date: p['Date'], type: p['Type'], ville: p['Ville'],
      description: p['Description'], client: p['Client'], statut: p['Statut'], source: p['Source']
    }))
  };
}

function addProject(project) {
  const id = generateId();
  appendRow(SHEETS.PROJETS, {
    ID: id,
    Date: new Date().toISOString(),
    Type: project.type,
    Ville: project.ville,
    Durée: project.duree,
    Description: project.description,
    Client: project.client,
    Email: project.email,
    Tel: project.tel,
    Photos: (project.photoUrls || []).join(', '),
    Statut: 'Terminé',
    Source: 'Manuel',
    PipelineID: ''
  }, HEADERS.PROJETS);
  return { id, success: true };
}

function updateProject(id, data) {
  const updates = {};
  if (data.statut) updates['Statut'] = data.statut;
  if (data.photos) updates['Photos'] = data.photos;
  updateRowById(SHEETS.PROJETS, id, updates);
  return { success: true };
}

// ---- GÉNÉRATION DE CONTENU ----
function generateContent(projectId, projectData) {
  // Sauvegarder le projet si nouveau
  let finalProjectId = projectId;
  if (!projectId) {
    const proj = addProject(projectData);
    finalProjectId = proj.id;
  }

  // Générer avec Claude
  const generated = generateProjectContent(projectData);

  const contentId = generateId();
  const now = new Date().toISOString();
  const preview = (generated.facebook || generated.tiktok || '').substring(0, 200);

  // Sauvegarder tout le contenu généré
  const platforms = [];
  if (generated.facebook) platforms.push({ platform: 'Facebook', content: generated.facebook });
  if (generated.tiktok) platforms.push({ platform: 'TikTok', content: generated.tiktok });
  if (generated.blog) platforms.push({ platform: 'Blogue', content: generated.blog });
  if (generated.gallery) platforms.push({ platform: 'Galerie', content: generated.gallery });

  platforms.forEach(p => {
    appendRow(SHEETS.CONTENU, {
      ID: generateId(),
      ProjetID: finalProjectId,
      Date: now,
      Type: projectData.type,
      Ville: projectData.ville,
      Plateforme: p.platform,
      'Aperçu': p.content.substring(0, 200),
      ContenuComplet: p.content,
      Statut: 'Brouillon',
      DatePublication: ''
    }, HEADERS.CONTENU);
  });

  // Mettre à jour statut Pipeline si applicable
  if (projectData.pipelineId) {
    updateRowById(SHEETS.PIPELINE, projectData.pipelineId, { StatutSync: 'Contenu généré' });
  }

  // Email demande d'avis
  let reviewEmail = null;
  if (projectData.sendReviewEmail && projectData.client && projectData.email) {
    const clientId = addClientForReview(finalProjectId, projectData);
    const emailText = generateReviewEmail({
      nom: projectData.client,
      type: projectData.type,
      ville: projectData.ville
    });
    sendReviewEmailGmail(projectData.email, projectData.client, emailText);
    reviewEmail = emailText;
    updateRowById(SHEETS.CLIENTS, clientId, { DemandeStatut: 'Envoyée' });
  }

  return {
    contentId,
    projectId: finalProjectId,
    facebook: generated.facebook || null,
    tiktok: generated.tiktok || null,
    blog: generated.blog || null,
    gallery: generated.gallery || null,
    reviewEmail
  };
}

// ---- CALENDRIER ----
function getCalendar(year, month) {
  const data = getSheetData(SHEETS.CALENDRIER);
  const events = {};

  data.forEach(row => {
    if (!row['DatePublication']) return;
    const d = new Date(row['DatePublication']);
    if (d.getFullYear() !== year || d.getMonth() + 1 !== month) return;
    const key = d.toISOString().split('T')[0];
    if (!events[key]) events[key] = [];
    events[key].push({
      id: row['ID'],
      platform: row['Plateforme'],
      title: row['Titre'],
      status: row['Statut'],
      preview: ''
    });
  });

  return { events, year, month };
}

function scheduleContent(contentId, date, platform) {
  const id = generateId();
  appendRow(SHEETS.CALENDRIER, {
    ID: id,
    ContenuID: contentId || '',
    Plateforme: platform,
    Titre: platform + ' — ' + new Date(date).toLocaleDateString('fr-CA'),
    DatePublication: date,
    Heure: '',
    Statut: 'Planifié'
  }, HEADERS.CALENDRIER);

  if (contentId) {
    updateRowById(SHEETS.CONTENU, contentId, { Statut: 'Planifié', DatePublication: date });
  }
  return { id, success: true };
}

function updateSchedule(id, date) {
  updateRowById(SHEETS.CALENDRIER, id, { DatePublication: date });
  return { success: true };
}

// ---- CONTENU ----
function getContent(params = {}) {
  let data = getSheetData(SHEETS.CONTENU);
  if (params.platform) data = data.filter(c => c['Plateforme'] === params.platform);
  if (params.status) data = data.filter(c => c['Statut'] === params.status);
  return {
    content: data.sort((a, b) => new Date(b['Date']) - new Date(a['Date'])).map(c => ({
      id: c['ID'],
      date: c['Date'],
      type: c['Type'],
      ville: c['Ville'],
      platform: c['Plateforme'],
      preview: c['Aperçu'],
      fullContent: c['ContenuComplet'],
      status: c['Statut'],
      publishDate: c['DatePublication']
    }))
  };
}

function updateContentStatus(id, status) {
  updateRowById(SHEETS.CONTENU, id, { Statut: status });
  return { success: true };
}

function deleteContent(id) {
  deleteRowById(SHEETS.CONTENU, id);
  deleteRowById(SHEETS.CALENDRIER, id);
  return { success: true };
}

// ---- AVIS ----
function getReviews() {
  const data = getSheetData(SHEETS.CLIENTS);
  return {
    clients: data.map(c => ({
      id: c['ID'],
      projetId: c['ProjetID'],
      nom: c['Nom'],
      email: c['Email'],
      tel: c['Tel'],
      type: c['Type'],
      ville: c['Ville'],
      dateContact: c['DateContact'],
      demandeStat: c['DemandeStatut'],
      avisReçu: c['AvisRecu'] === 'TRUE' || c['AvisRecu'] === true,
      dateAvis: c['DateAvis']
    }))
  };
}

function addClientForReview(projetId, data) {
  const id = generateId();
  appendRow(SHEETS.CLIENTS, {
    ID: id,
    ProjetID: projetId,
    Nom: data.client,
    Email: data.email || '',
    Tel: data.tel || '',
    Type: data.type,
    Ville: data.ville,
    DateContact: new Date().toISOString(),
    DemandeStatut: 'En attente',
    AvisRecu: false,
    DateAvis: ''
  }, HEADERS.CLIENTS);
  return id;
}

function sendReviewRequest(clientIdOrData) {
  // Accept both a client ID (string) and a raw data object
  let clientData, clientId;
  if (typeof clientIdOrData === 'string') {
    const clients = getSheetData(SHEETS.CLIENTS);
    const client = clients.find(c => c['ID'] === clientIdOrData);
    if (!client) throw new Error('Client introuvable');
    clientData = { nom: client['Nom'], email: client['Email'], type: client['Type'], ville: client['Ville'] };
    clientId = clientIdOrData;
  } else {
    clientId = addClientForReview('manual', clientIdOrData);
    clientData = clientIdOrData;
  }

  const emailText = generateReviewEmail(clientData);
  sendReviewEmailGmail(clientData.email, clientData.nom, emailText);
  updateRowById(SHEETS.CLIENTS, clientId, { DemandeStatut: 'Envoyée', DateContact: new Date().toISOString() });
  return { success: true };
}

function markReviewReceived(clientId) {
  updateRowById(SHEETS.CLIENTS, clientId, { AvisRecu: 'TRUE', DateAvis: new Date().toISOString() });
  return { success: true };
}

function sendReviewEmailGmail(to, nom, emailText) {
  if (!to || !to.includes('@')) return;
  const subject = `Merci pour votre confiance — Les Gestions Heúrēka`;
  GmailApp.sendEmail(to, subject, emailText, {
    from: GMAIL_SENDER,
    name: 'Les Gestions Heúrēka'
  });
}

// ---- TENDANCES TIKTOK ----
function getTikTokTrends() {
  const data = getSheetData(SHEETS.TENDANCES);
  if (!data.length) return { sounds: [], formats: [], scripts: [], hashtags: [], lastUpdate: null };

  const latest = data.sort((a, b) => new Date(b['DateMiseAJour']) - new Date(a['DateMiseAJour']))[0];
  const scripts = [];
  if (latest['Scripts']) {
    const parts = latest['Scripts'].split('\n\n---\n\n');
    parts.forEach((s, i) => {
      const titleMatch = s.match(/\[TITRE\]\s*([^\n]+)/);
      scripts.push({
        id: generateId(),
        title: titleMatch ? titleMatch[1].trim() : `Script ${i + 1}`,
        script: s,
        sound: '',
        hashtags: latest['Hashtags'] ? latest['Hashtags'].split('\n').slice(0, 10).join(' ') : ''
      });
    });
  }

  return {
    sounds: parseJson(latest['Sons']) || [],
    formats: parseJson(latest['Formats']) || [],
    scripts,
    hashtags: (latest['Hashtags'] || '').split('\n').filter(Boolean),
    lastUpdate: latest['DateMiseAJour']
  };
}

// ---- CONTENU SAISONNIER ----
function getSeasonalContent() {
  return { content: [] };
}

function generateSeasonalContent(season, theme) {
  const pieces = generateSeasonalContentClaude(season, theme);
  return { content: pieces };
}

// ---- STATISTIQUES & RAPPORT ----
function getMonthlyReport(year, month) {
  const stats = getSheetData(SHEETS.STATS);
  const row = stats.find(s => parseInt(s['Année']) === year && parseInt(s['Mois']) === month);

  const content = getSheetData(SHEETS.CONTENU);
  const publications = content.filter(c => {
    if (!c['DatePublication']) return false;
    const d = new Date(c['DatePublication']);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  }).map(c => ({ id: c['ID'], platform: c['Plateforme'], type: c['Type'], date: c['DatePublication'], status: c['Statut'] }));

  return {
    stats: row ? {
      facebookViews: row['VuesFacebook'],
      tiktokViews: row['VuesTikTok'],
      facebookFollowers: row['AbonnésFB'],
      tiktokFollowers: row['AbonnésTT'],
      newReviews: row['NouveauxAvis'],
      postsPublished: row['PostsPubliés'],
      leads: row['Leads']
    } : {},
    analysis: row ? row['Analyse'] : '',
    nextMonthPlan: row ? row['PlanMoisSuivant'] : '',
    publications
  };
}

function saveAndAnalyzeStats(stats) {
  const content = getSheetData(SHEETS.CONTENU);
  const publications = content.filter(c => {
    const d = new Date(c['DatePublication']);
    return d.getFullYear() === stats.year && d.getMonth() + 1 === stats.month;
  }).map(c => ({ platform: c['Plateforme'], type: c['Type'] }));

  const { analysis, nextMonthPlan } = analyzeMonthlyStats(stats, publications);

  // Chercher si la ligne existe déjà
  const existing = getSheetData(SHEETS.STATS).find(
    s => parseInt(s['Année']) === stats.year && parseInt(s['Mois']) === stats.month
  );

  if (existing) {
    updateRowById(SHEETS.STATS, existing['ID'], {
      VuesFacebook: stats.facebookViews,
      VuesTikTok: stats.tiktokViews,
      AbonnésFB: stats.facebookFollowers,
      AbonnésTT: stats.tiktokFollowers,
      NouveauxAvis: stats.newReviews,
      PostsPubliés: stats.postsPublished || publications.length,
      Leads: stats.leads,
      Analyse: analysis,
      PlanMoisSuivant: nextMonthPlan
    });
  } else {
    appendRow(SHEETS.STATS, {
      ID: generateId(),
      Année: stats.year,
      Mois: stats.month,
      VuesFacebook: stats.facebookViews,
      VuesTikTok: stats.tiktokViews,
      AbonnésFB: stats.facebookFollowers,
      AbonnésTT: stats.tiktokFollowers,
      NouveauxAvis: stats.newReviews,
      PostsPubliés: stats.postsPublished || publications.length,
      Leads: stats.leads,
      Analyse: analysis,
      PlanMoisSuivant: nextMonthPlan
    }, HEADERS.STATS);
  }

  return { report: { stats, analysis, nextMonthPlan, publications } };
}

// ---- PROMOTIONS ----
function getPromotions() {
  // Promotions stockées dans l'onglet Contenu avec type Promotion
  const data = getSheetData(SHEETS.CONTENU).filter(c => c['Type'] === 'Promotion');
  return { promotions: data };
}

function generatePromotion(data) {
  const generated = generatePromotionClaude(data);
  const id = generateId();
  const now = new Date().toISOString();

  appendRow(SHEETS.CONTENU, {
    ID: id,
    ProjetID: '',
    Date: now,
    Type: 'Promotion',
    Ville: '',
    Plateforme: 'Campagne',
    'Aperçu': data.name,
    ContenuComplet: JSON.stringify({ facebook: generated.facebook, tiktok: generated.tiktok, email: generated.email }),
    Statut: 'Brouillon',
    DatePublication: data.startDate || ''
  }, HEADERS.CONTENU);

  return {
    promotion: {
      id, name: data.name, status: 'Brouillon',
      startDate: data.startDate, endDate: data.endDate,
      facebook: generated.facebook,
      tiktok: generated.tiktok,
      email: generated.email
    }
  };
}
