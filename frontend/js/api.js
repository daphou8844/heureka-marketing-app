/* ============================================
   API.JS — Couche de communication avec Apps Script
   Mode DÉMO si pas d'URL configurée
   ============================================ */

// ===== DONNÉES DE DÉMO =====
const DEMO_DATA = {
  dashboard: {
    nextPost: { date: new Date(Date.now() + 2*86400000).toISOString(), platform: 'Facebook', title: 'Revêtement extérieur — Saint-Jean' },
    lastPost: { platform: 'TikTok', date: new Date(Date.now() - 3*86400000).toISOString(), preview: '🔨 Transformation incroyable à Iberville! Revêtement extérieur complet en 5 jours...' },
    contentCount: 14,
    reviewCount: 82,
    reviewRating: 4.8,
    projectsThisMonth: 3,
    pendingContent: 1,
    pipelineProjects: [{ id: 'DEMO1', type: 'Construction de garage', ville: 'Saint-Jean-sur-Richelieu', client: 'Famille Tremblay', dateFin: new Date().toISOString() }],
    tiktokSummary: [
      { title: 'Before/After Reveal', desc: 'Transformer en 30 sec avec son dramatique' },
      { title: 'Day in the life', desc: 'Suivre l\'équipe sur le chantier' },
      { title: 'Time-lapse construction', desc: 'Accéléré d\'un projet complet' }
    ],
    alerts: ['1 projet terminé dans Pipeline en attente de contenu marketing'],
    thisWeek: [
      { date: new Date(Date.now() + 1*86400000).toISOString(), platform: 'Facebook', title: 'Pose de fenêtres — Iberville' },
      { date: new Date(Date.now() + 3*86400000).toISOString(), platform: 'TikTok', title: 'Before/After revêtement extérieur' },
      { date: new Date(Date.now() + 5*86400000).toISOString(), platform: 'Blogue', title: 'Guide: Choisir son revêtement extérieur au Québec' }
    ]
  },
  content: {
    content: [
      { id: 'C001', date: new Date(Date.now()-1*86400000).toISOString(), type: 'Revêtement extérieur', ville: 'Saint-Jean', platform: 'Facebook', preview: '🏠 Transformation totale à Saint-Jean-sur-Richelieu! Notre équipe vient de terminer un revêtement extérieur complet...', fullContent: '🏠 Transformation totale à Saint-Jean-sur-Richelieu!\n\nNotre équipe vient de terminer un revêtement extérieur complet qui a complètement changé le look de cette belle maison. Le propriétaire cherchait quelque chose de durable, low-maintenance et qui résiste aux hivers québécois.\n\nOn a choisi un revêtement en vinyle haut de gamme, pose sur 3 semaines, résultat garanti 25 ans. La différence est spectaculaire!\n\n📞 Obtenez votre soumission gratuite : gestionsheureka.net\n\n#GestionsHeureka #RenovationQuebec #RevetementExterieur #SaintJeanSurRichelieu #Maison', status: 'Planifié', publishDate: new Date(Date.now()+1*86400000).toISOString() },
      { id: 'C002', date: new Date(Date.now()-2*86400000).toISOString(), type: 'Portes et fenêtres', ville: 'Iberville', platform: 'TikTok', preview: '[ACCROCHE] On vient de poser 12 fenêtres en une journée. Regardez ça. [NARRATION] Ça fait 5 ans que cette famille attend...', fullContent: '[ACCROCHE 3 SEC]\nOn vient de poser 12 fenêtres en une journée. Regardez ça.\n\n[NARRATION]\nÇa fait 5 ans que cette famille à Iberville planifiait ce projet. Des fenêtres qui laissaient entrer le froid chaque hiver, des factures de chauffage qui explosaient...\n\nNotre équipe a tout changé en 8 heures. 12 fenêtres triple vitrage, cadres en fibre de verre, coupe-froid parfait.\n\n[TEXTE À L\'ÉCRAN]\n- Avant: fenêtres d\'origine 1985\n- 8h de travail\n- 12 nouvelles fenêtres\n- Économies: 35% sur le chauffage\n- 100% satisfait ✅\n\n[SON] Musique motivationnelle + son satisfaisant de la pose\n\n[HASHTAGS]\n#Renovation #Fenetres #Quebec #GestionsHeureka #AvantApres', status: 'Publié', publishDate: new Date(Date.now()-1*86400000).toISOString() },
      { id: 'C003', date: new Date(Date.now()-5*86400000).toISOString(), type: 'Construction de garage', ville: 'Saint-Luc', platform: 'Blogue', preview: 'Construction d\'un garage double à Saint-Luc — Guide complet | Les Gestions Heúrēka', fullContent: '# Construction d\'un garage double à Saint-Luc\n\nVotre famille a besoin d\'espace? Découvrez comment Les Gestions Heúrēka a construit un garage double moderne en 4 semaines à Saint-Luc...', status: 'Brouillon' },
      { id: 'C004', date: new Date(Date.now()-7*86400000).toISOString(), type: 'Agrandissement de maison', ville: 'Lacolle', platform: 'Facebook', preview: '📐 Agrandissement réussi à Lacolle! On a ajouté 400 pieds carrés à cette belle maison de plain-pied...', fullContent: '📐 Agrandissement réussi à Lacolle!\n\nCette famille de Lacolle avait besoin d\'espace pour accueillir leurs enfants et petits-enfants. On a ajouté 400 pieds carrés...', status: 'Publié', publishDate: new Date(Date.now()-6*86400000).toISOString() }
    ]
  },
  calendar: {
    events: (() => {
      const ev = {};
      const now = new Date();
      const addEv = (dayOffset, platform, title, status) => {
        const d = new Date(now);
        d.setDate(d.getDate() + dayOffset);
        const key = d.toISOString().split('T')[0];
        if (!ev[key]) ev[key] = [];
        ev[key].push({ id: 'EV'+dayOffset, platform, title, status });
      };
      addEv(1, 'Facebook', 'Revêtement — Saint-Jean', 'Planifié');
      addEv(3, 'TikTok', 'Before/After Fenêtres Iberville', 'Planifié');
      addEv(5, 'Blogue', 'Guide revêtement extérieur', 'Planifié');
      addEv(7, 'Facebook', 'Promotion Printemps 2025', 'Brouillon');
      addEv(10, 'TikTok', 'Day in the life — équipe chantier', 'Brouillon');
      addEv(-2, 'TikTok', 'Fenêtres Iberville — 12 en 1 jour', 'Publié');
      addEv(-6, 'Facebook', 'Agrandissement Lacolle — résultat', 'Publié');
      return ev;
    })()
  },
  trends: {
    lastUpdate: new Date(Date.now()-2*86400000).toISOString(),
    sounds: [
      { name: 'Son de construction satisfaisant', desc: 'Ambiance chantier rythmique', useCase: 'Parfait pour time-lapse de rénovation' },
      { name: 'Musique trap légère instrumentale', desc: 'Tendance sur les projets DIY', useCase: 'Background pour before/after reveal' },
      { name: 'Original Sound — transformation', desc: 'Son viral réno/déco', useCase: 'Before/after avec effet wow' },
      { name: 'Motivational beat', desc: 'Énergie et dynamisme', useCase: 'Présentation de l\'équipe au travail' },
      { name: 'Ambient construction', desc: 'Son réel de chantier', useCase: 'Day in the life authentique' }
    ],
    formats: [
      { format: 'Before/After Reveal', desc: 'Transformation visible en 15-30 sec avec musique dramatique. Très haut engagement.', duration: '15-30 sec', engagement: '+45% vues' },
      { format: 'Day in the life équipe', desc: 'Suivre l\'équipe sur le chantier. Humanise l\'entreprise et construit la confiance.', duration: '45-60 sec', engagement: '+32% abonnés' },
      { format: 'Tips rapides x3', desc: '3 conseils en 30 secondes. Très partageable et sauvegardable.', duration: '25-35 sec', engagement: '+28% sauvegardes' }
    ],
    scripts: [
      { id: 'S001', title: 'Before/After Revêtement', script: '[ACCROCHE 3 SEC]\nCette maison avait l\'air abandonnée. Maintenant regardez.\n\n[NARRATION]\nLes propriétaires avaient honte de leur maison depuis 10 ans. Revêtement d\'origine des années 80, peinture écaillée, isolant compromis.\n\nNotre équipe a tout changé en 2 semaines. Nouveau revêtement vinyle haut de gamme, nouvelles frisettes, fenêtres refaites.\n\nLe voisinage était bouche bée.\n\n[TEXTE À L\'ÉCRAN]\n- Avant : Maison 1982 non rénovée\n- 2 semaines de travail\n- Équipe de 4 personnes\n- Garantie 25 ans\n- Résultat : WOW ✨\n\n[SON SUGGÉRÉ] Musique dramatique + cut silence au reveal\n[HASHTAGS] #Renovation #RevetementExterieur #Quebec #AvantApres #GestionsHeureka', sound: 'Musique dramatique', hashtags: '#Renovation #RevetementExterieur #Quebec #AvantApres #GestionsHeureka' },
      { id: 'S002', title: 'Day in the life — pose de fenêtres', script: '[ACCROCHE 3 SEC]\nVous savez combien de fenêtres on peut poser en une journée?\n\n[NARRATION]\nAujourd\'hui, notre équipe pose 8 fenêtres dans une maison à Saint-Jean-sur-Richelieu.\n\n7h00 — On arrive, café en main, équipe au complet.\n8h00 — Première fenêtre retirée. Inspection de l\'encadrement.\n10h00 — 3 fenêtres posées. On est dans le rythme.\n12h00 — Lunch mérité. 5 fenêtres complétées.\n15h30 — TOUTES les fenêtres sont posées.\n\nLe client voulait pas y croire.\n\n[TEXTE À L\'ÉCRAN]\n- 7:00 ☕ Go!\n- 10:00 - 3/8 fenêtres\n- 12:00 - Lunch!\n- 15:30 ✅ Mission accomplie\n\n[SON SUGGÉRÉ] Rythme up-tempo, son du travail\n[HASHTAGS] #Fenêtres #DayInTheLife #Construction #Quebec #GestionsHeureka', sound: 'Rythme up-tempo', hashtags: '#Fenêtres #DayInTheLife #Construction #Quebec #GestionsHeureka' },
      { id: 'S003', title: '3 conseils avant de rénover', script: '[ACCROCHE 3 SEC]\n3 choses à savoir AVANT de faire rénover votre maison au Québec.\n\n[NARRATION]\nConseil 1 : Vérifiez le numéro RBQ de votre entrepreneur. C\'est gratuit sur le site de la Régie du Bâtiment. Ça vous protège.\n\nConseil 2 : Demandez toujours 3 soumissions. Pas pour prendre le moins cher — pour comprendre les différences.\n\nConseil 3 : Signez un contrat détaillé. Matériaux, délais, garanties. Tout doit être écrit.\n\nLes Gestions Heúrēka — RBQ 5818-7162-01 — On est là pour vous.\n\n[TEXTE À L\'ÉCRAN]\n- ✅ #1 Vérifiez le RBQ\n- ✅ #2 3 soumissions\n- ✅ #3 Contrat signé\n- 🏠 Les Gestions Heúrēka\n\n[SON SUGGÉRÉ] Musique informative, ton confiant\n[HASHTAGS] #Conseils #Renovation #Quebec #Entrepreneur #GestionsHeureka', sound: 'Musique informative', hashtags: '#Conseils #Renovation #Quebec #Entrepreneur #GestionsHeureka' }
    ],
    hashtags: ['#GestionsHeureka', '#RenovationQuebec', '#SaintJeanSurRichelieu', '#RevetementExterieur', '#PortesEtFenêtres', '#Agrandissement', '#ConstructionGarage', '#EntrepreneurGeneral', '#Maison', '#Renovation', '#Quebec', '#Monteregie', '#AvantApres', '#BeforeAfter', '#Reno', '#Construction', '#RBQ', '#MaisonQuebec', '#RenoTikTok', '#Travaux']
  },
  reviews: {
    clients: [
      { id: 'CL001', nom: 'Michel Tremblay', email: 'michel@exemple.com', type: 'Revêtement extérieur', ville: 'Saint-Jean-sur-Richelieu', dateContact: new Date(Date.now()-5*86400000).toISOString(), demandeStat: 'Envoyée', avisReçu: false },
      { id: 'CL002', nom: 'Famille Gagnon', email: 'gagnon@exemple.com', type: 'Portes et fenêtres', ville: 'Iberville', dateContact: new Date(Date.now()-12*86400000).toISOString(), demandeStat: 'Envoyée', avisReçu: true },
      { id: 'CL003', nom: 'Patrick Boisvert', email: '', type: 'Construction de garage', ville: 'Saint-Luc', dateContact: new Date(Date.now()-2*86400000).toISOString(), demandeStat: 'En attente', avisReçu: false }
    ]
  },
  seasonal: { content: [] },
  report: { stats: {}, analysis: '', nextMonthPlan: '', publications: [] },
  promotions: {
    promotions: [
      { id: 'P001', name: 'Spécial Printemps 2025', status: 'Active', startDate: '2025-03-01', endDate: '2025-05-31',
        facebook: '🌱 SPÉCIAL PRINTEMPS chez Les Gestions Heúrēka!\n\nC\'est le temps de donner un coup de jeune à votre maison avant l\'été!\n\nPour tout projet de revêtement extérieur ou remplacement de portes et fenêtres réservé avant le 31 mai, profitez de :\n✅ Soumission gratuite à domicile\n✅ 5% de rabais sur votre projet\n✅ Garantie main-d\'œuvre 5 ans\n\nPlaces limitées — notre agenda se remplit vite au printemps!\n\n📞 Appelez-nous ou visitez gestionsheureka.net\n\n#Printemps #Renovation #GestionsHeureka #SaintJean #Maison',
        tiktok: '[ACCROCHE] Le printemps arrive — et notre agenda aussi!\n\n5% de rabais sur tous les projets réservés en mai. Places limitées. Appelez maintenant.\n\n#Promo #Printemps #GestionsHeureka',
        email: 'Bonjour,\n\nNous espérons que vous êtes satisfait des travaux réalisés chez vous!\n\nNous souhaitons vous informer de notre promotion printemps exclusive pour nos anciens clients : 5% de rabais sur votre prochain projet.\n\nVisitez gestionsheureka.net pour en savoir plus.\n\nL\'équipe Heúrēka' }
    ]
  },
  pipeline: { projects: [{ id: 'DEMO1', type: 'Construction de garage', ville: 'Saint-Jean-sur-Richelieu', client: 'Famille Tremblay', dateFin: new Date().toISOString(), valeur: '28,500$' }] }
};

// URL Apps Script — depuis config.js (HEUREKA_CONFIG)
const APPS_SCRIPT_URL = HEUREKA_CONFIG.APPS_SCRIPT_URL;

const DEMO_MODE = false;

// Simuler un délai réseau en mode démo
const demoDelay = (data) => new Promise(resolve => setTimeout(() => resolve(data), 400));

const API = (() => {
  const BASE_URL = APPS_SCRIPT_URL;

  async function request(action, data = {}) {
    if (!BASE_URL) throw new Error('DEMO');
    const params = new URLSearchParams({ action, ...data });
    const res = await fetch(`${BASE_URL}?${params}`, { redirect: 'follow' });
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json;
  }

  async function post(action, payload = {}) {
    if (!BASE_URL) throw new Error('DEMO');
    // Apps Script: POST en text/plain pour éviter les problèmes CORS preflight
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action, ...payload }),
      redirect: 'follow'
    });
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json;
  }

  // Wrapper — toujours fallback sur les données démo si erreur
  async function safe(action, realFn, demoData) {
    try { return await realFn(); }
    catch (err) {
      console.warn('[API] Fallback démo pour', action, '—', err.message);
      return demoDelay(demoData);
    }
  }

  return {
    setUrl(url) { localStorage.setItem('heureka_api_url', url); location.reload(); },
    getUrl() { return BASE_URL; },
    isDemoMode() { return !BASE_URL; },

    getDashboardData: () => safe('getDashboardData', () => request('getDashboardData'), DEMO_DATA.dashboard),
    getProjects: (f={}) => safe('getProjects', () => request('getProjects', f), { projects: [] }),
    addProject: (p) => safe('addProject', () => post('addProject', {project:p}), { id: 'DEMO'+Date.now(), success: true }),
    updateProject: (id, d) => safe('updateProject', () => post('updateProject', {id, data:d}), { success: true }),

    // ── Génération IA — appel Gemini direct depuis le navigateur ──
    generateContent: async (projectId, projectData) => {
      const key = (HEUREKA_CONFIG.GEMINI_API_KEY || '').trim();
      if (!key) {
        console.warn('[API] GEMINI_API_KEY manquante — données démo');
        return demoDelay({
          contentId: 'DEMO' + Date.now(),
          facebook: `🏠 Projet ${projectData.type || 'rénovation'} terminé à ${projectData.ville || 'Saint-Jean'}!\n\n${projectData.description || ''}\n\nUn projet réalisé avec passion par notre équipe des Gestions Heúrēka.\n\n📞 Soumission gratuite : gestionsheureka.net\n\n#GestionsHeureka #RenovationQuebec #SaintJeanSurRichelieu #Maison`,
          tiktok: `[ACCROCHE 3 SEC]\nTransformation à ${projectData.ville || 'Saint-Jean'}!\n\n[NARRATION]\n${projectData.description || ''}\n\n[HASHTAGS] #Renovation #Quebec #GestionsHeureka`,
          blog: `# ${projectData.type || 'Rénovation'} à ${projectData.ville || 'Saint-Jean-sur-Richelieu'} | Les Gestions Heúrēka\n\n${projectData.description || ''}\n\n*Les Gestions Heúrēka — RBQ 5818-7162-01 — gestionsheureka.net*`,
          gallery: `**TITRE:** ${projectData.type || 'Rénovation'} — ${projectData.ville || 'Saint-Jean-sur-Richelieu'}\n\n**ALT TEXT:** Photo rénovation maison ${projectData.ville || ''} Québec — Les Gestions Heúrēka`
        });
      }
      const emailField = projectData.sendReviewEmail
        ? `,\n  "reviewEmail": "Email poli en français demandant un avis Google (3-4 phrases, mentionner le type de travaux et remercier le client)"` : '';
      const prompt = `Tu es un expert en marketing de contenu pour Les Gestions Heúrēka, entrepreneur général en rénovation résidentielle au Québec (Saint-Jean-sur-Richelieu, Montérégie). RBQ 5818-7162-01.

Un projet vient d'être terminé. Génère du contenu marketing professionnel et engageant en français québécois.

PROJET :
- Type de travaux : ${projectData.type}
- Ville : ${projectData.ville}
- Durée des travaux : ${projectData.duree || 'non précisée'}
- Nom du client : ${projectData.client || 'client anonyme'}
- Description : ${projectData.description}
- Infos supplémentaires : ${projectData.extra || 'aucune'}

Réponds UNIQUEMENT avec ce JSON valide (sans balises markdown ni backticks autour du JSON) :
{
  "facebook": "Post Facebook complet avec emojis, hashtags québécois pertinents, appel à l'action vers gestionsheureka.net. 200-280 mots.",
  "tiktok": "Script TikTok structuré avec [ACCROCHE 3 SEC], [NARRATION], [TEXTE À L'ÉCRAN], [SON SUGGÉRÉ], [HASHTAGS]. Contenu pour 30-60 secondes.",
  "blog": "Article de blogue SEO complet : titre # H1, introduction, 3 sections ## H2, conclusion + CTA, méta-description. 450-600 mots.",
  "gallery": "Fiche galerie : TITRE:, DESCRIPTION SEO: (150-200 mots), ALT TEXT:, MOTS-CLÉS: (8-10 mots-clés locaux)"${emailField}
}`;
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        { method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      if (!resp.ok) throw new Error('Erreur API Gemini ' + resp.status);
      const geminiData = await resp.json();
      const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      let content = {};
      try {
        const match = rawText.match(/\{[\s\S]*\}/);
        content = JSON.parse(match ? match[0] : rawText);
      } catch(e) { throw new Error('Réponse Gemini invalide — veuillez réessayer'); }
      const contentId = 'MCT-' + Date.now();
      if (BASE_URL) {
        fetch(BASE_URL, {
          method: 'POST', headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'addRow', sheet: 'Marketing_Contenu', data: {
            ID_Contenu: contentId, Projet_ID: projectId || '', Client: projectData.client || '',
            Type_Travaux: projectData.type, Ville: projectData.ville,
            Date_Fin_Chantier: new Date().toISOString().split('T')[0],
            Statut_Contenu: 'Généré',
            Plateforme: [projectData.genFacebook && 'Facebook', projectData.genTiktok && 'TikTok'].filter(Boolean).join(', '),
            Texte_Contenu: content.facebook || '', Date_Publication: ''
          }}), redirect: 'follow'
        }).catch(() => {});
      }
      return { contentId, ...content };
    },

    getCalendar: (y, m) => safe('getCalendar', () => request('getCalendar', {year:y, month:m}), DEMO_DATA.calendar),
    scheduleContent: (cid, date, platform) => safe('scheduleContent',
      () => post('scheduleContent', {contentId:cid, date, platform}),
      { id: 'EV'+Date.now(), success: true }
    ),
    updateSchedule: (id, date) => safe('updateSchedule', () => post('updateSchedule', {id, date}), { success: true }),

    getTikTokTrends: () => safe('getTikTokTrends', () => request('getTikTokTrends'), DEMO_DATA.trends),
    triggerTrendsScrape: () => safe('triggerTrendsScrape', () => post('triggerTrendsScrape'), { success: true, data: DEMO_DATA.trends }),

    getContent: (f={}) => safe('getContent', () => request('getContent', f), DEMO_DATA.content),
    updateContentStatus: (id, status) => safe('updateContentStatus', () => post('updateContentStatus', {id, status}), { success: true }),
    deleteContent: (id) => safe('deleteContent', () => post('deleteContent', {id}), { success: true }),

    getReviews: () => safe('getReviews', () => request('getReviews'), DEMO_DATA.reviews),
    sendReviewRequest: (d) => safe('sendReviewRequest', () => post('sendReviewRequest', typeof d==='string'?{clientId:d}:d),
      demoDelay({ success: true })
    ),
    markReviewReceived: (id) => safe('markReviewReceived', () => post('markReviewReceived', {clientId:id}), { success: true }),

    getSeasonalContent: () => safe('getSeasonalContent', () => request('getSeasonalContent'), DEMO_DATA.seasonal),
    generateSeasonalContent: (season, theme) => safe('generateSeasonalContent',
      () => post('generateSeasonalContent', {season, theme}),
      demoDelay({ content: [
        { id: 'SC'+Date.now(), platform: 'Facebook', theme: theme||season,
          content: `🌿 Contenu ${season||theme} généré!\n\nLes Gestions Heúrēka vous accompagnent dans tous vos projets de rénovation ${season === 'Printemps' ? 'printaniers' : season === 'Été' ? "d'été" : season === 'Automne' ? "d'automne" : "d'hiver"}.\n\nContactez-nous pour une soumission gratuite.\n\n#GestionsHeureka #${season||'Renovation'} #Quebec` },
        { id: 'SC2'+Date.now(), platform: 'TikTok', theme: theme||season,
          content: `[ACCROCHE] La saison parfaite pour rénover!\n\n[NARRATION] C'est la saison idéale pour votre projet de rénovation. Notre équipe est disponible.\n\n[HASHTAGS] #Renovation #${season||'Reno'} #Quebec #GestionsHeureka` }
      ]})
    ),

    getMonthlyReport: (y, m) => safe('getMonthlyReport', () => request('getMonthlyReport', {year:y, month:m}), DEMO_DATA.report),
    saveStats: (stats) => safe('saveStats',
      () => post('saveStats', {stats}),
      demoDelay({ report: { stats, analysis: `Analyse démo: En mode démonstration, votre rapport sera généré par Gemini IA une fois le backend configuré. Vos statistiques de ${stats.facebookViews||0} vues Facebook et ${stats.tiktokViews||0} vues TikTok montrent une bonne activité pour une PME en rénovation.`, nextMonthPlan: 'Plan du mois prochain: 1) Poster 2x/semaine sur Facebook, 2) Créer 1 TikTok before/after par semaine, 3) Relancer les clients récents pour des avis Google.', publications: [] }})
    ),

    getPromotions: () => safe('getPromotions', () => request('getPromotions'), DEMO_DATA.promotions),
    generatePromotion: (data) => safe('generatePromotion',
      () => post('generatePromotion', {data}),
      demoDelay({ promotion: { id: 'P'+Date.now(), name: data.name, status: 'Brouillon', startDate: data.startDate, endDate: data.endDate,
        facebook: `🎉 ${data.name} chez Les Gestions Heúrēka!\n\n${data.offer}${data.value ? ' (jusqu\'à '+data.value+')' : ''}\n\nValable ${data.startDate ? 'du '+data.startDate : ''} ${data.endDate ? 'au '+data.endDate : ''}.\n\n${data.message || ''}\n\n📞 Soumission gratuite : gestionsheureka.net\n\n#Promo #GestionsHeureka #Renovation #Quebec`,
        tiktok: `[ACCROCHE] ${data.name} — places limitées!\n\n${data.offer}. Appelez maintenant ou visitez gestionsheureka.net\n\n#Promo #GestionsHeureka #Quebec`,
        email: `Bonjour,\n\nNous avons une offre exclusive pour vous : ${data.name}.\n\n${data.offer}${data.value ? ' — jusqu\'à '+data.value : ''}.\n\n${data.message || ''}\n\nContactez-nous : gestionsheureka.net\n\nL'équipe Heúrēka` }})
    ),

    scheduleMetricool: (contentId, text, scheduledDate, imageUrl) => safe('scheduleMetricool',
      () => post('scheduleMetricool', { contentId, text, scheduledDate, imageUrl }),
      demoDelay({ success: true })
    ),

    sendToMake: (contentId, date) => safe('sendToMake',
      () => post('sendToMake', { contentId, date }),
      demoDelay({ success: true })
    ),

    // ── Pipeline sync — corrigé: parser res.data (réponse = {status:'ok', data:[...]}) ──
    syncPipeline: () => safe('syncPipeline',
      async () => {
        const res = await fetch(HEUREKA_CONFIG.APPS_SCRIPT_URL+'?action=getData&sheet=Marketing_Contenu', {redirect:'follow'});
        const json = await res.json();
        const pending = (json.data || []).filter(r=>r.Statut_Contenu==='En attente de contenu');
        return {
          newProjects: pending.length,
          projects: pending.map(r=>({id:r.ID_Contenu, type:r.Type_Travaux, ville:r.Ville, client:r.Client, dateFin:r.Date_Fin_Chantier, projetId:r.Projet_ID}))
        };
      },
      demoDelay({ newProjects: 1, projects: DEMO_DATA.pipeline.projects })
    ),
    getPipelineProjects: () => safe('getPipelineProjects',
      async () => {
        const res = await fetch(HEUREKA_CONFIG.APPS_SCRIPT_URL+'?action=getData&sheet=Marketing_Contenu', {redirect:'follow'});
        const json = await res.json();
        const pending = (json.data || []).filter(r=>r.Statut_Contenu==='En attente de contenu');
        return { projects: pending.map(r=>({id:r.ID_Contenu, type:r.Type_Travaux, ville:r.Ville, client:r.Client, dateFin:r.Date_Fin_Chantier, projetId:r.Projet_ID})) };
      },
      DEMO_DATA.pipeline
    ),

    uploadPhoto: async (file, projectId, photoType, type, ville) => {
      if (!BASE_URL) {
        await new Promise(r => setTimeout(r, 800));
        return { url: URL.createObjectURL(file), fileId: 'DEMO', fileName: file.name };
      }
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const base64 = e.target.result.split(',')[1];
            const result = await post('uploadPhoto', {
              fileName: file.name, mimeType: file.type, base64Data: base64,
              projectId, photoType: photoType || 'apres', type, ville
            });
            resolve(result);
          } catch (err) { reject(err); }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };
})();
