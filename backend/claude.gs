// ============================================
// CLAUDE.GS — Intégration Claude API
// Modèle : claude-sonnet-4-20250514
// ============================================

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const COMPANY_CONTEXT = `Tu travailles pour Les Gestions Heúrēka, une entreprise de rénovation résidentielle
basée à Saint-Jean-sur-Richelieu, Québec.

Services offerts : portes et fenêtres, revêtement extérieur, agrandissement de maison,
construction de garage, entrepreneur général.

Ton de communication : professionnel, humain, chaleureux, authentiquement québécois.
Langue : français québécois naturel (pas trop de sacres, mais l'accent y est).
Réseaux : Facebook (1354 abonnés), TikTok, site web gestionsheureka.net
Google Business : 82 avis, 4.8 étoiles
RBQ : 5818-7162-01`;

function callClaude(systemPrompt, userMessage, maxTokens = 2048) {
  const key = CLAUDE_API_KEY || PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  if (!key) throw new Error('Clé API Claude non configurée');

  const payload = {
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }]
  };

  const options = {
    method: 'post',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(CLAUDE_API_URL, options);
  const json = JSON.parse(response.getContentText());

  if (json.error) throw new Error(json.error.message);
  return json.content[0].text;
}

// ---- GÉNÉRER CONTENU PROJET ----
function generateProjectContent(projectData) {
  const { type, ville, duree, client, description, extra, genFacebook, genTiktok, genBlog, genGallery } = projectData;

  const system = `${COMPANY_CONTEXT}

Tu es un expert en marketing numérique pour les PME en rénovation résidentielle.
Tu génères du contenu authentique, engageant et optimisé pour les réseaux sociaux québécois.`;

  const user = `Génère du contenu marketing pour ce projet terminé :

TYPE DE TRAVAUX : ${type}
VILLE : ${ville}
DURÉE : ${duree || 'non précisée'}
CLIENT : ${client || 'Anonyme'}
DESCRIPTION : ${description}
INFOS SUPPLÉMENTAIRES : ${extra || 'aucune'}

Génère uniquement ce qui est demandé ci-dessous, séparé par des délimiteurs exacts :

${genFacebook ? `
===FACEBOOK===
Post Facebook complet avec :
- Accroche percutante (première ligne avant "Voir plus")
- Corps du texte engageant (200-350 mots)
- Appel à l'action clair
- 8-12 hashtags québécois pertinents
- Emoji moderément utilisés
===FIN_FACEBOOK===
` : ''}

${genTiktok ? `
===TIKTOK===
Script TikTok complet avec :
- [ACCROCHE 3 SEC] : phrase d'accroche orale percutante
- [NARRATION] : texte à dire en voix off (30-60 sec)
- [TEXTE À L'ÉCRAN] : 5-8 textes courts à afficher
- [SON SUGGÉRÉ] : type de musique ou son ambiant
- [HASHTAGS] : 10-15 hashtags optimisés
===FIN_TIKTOK===
` : ''}

${genBlog ? `
===BLOG===
Article de blogue complet (600-900 mots) avec :
- Titre SEO optimisé
- Introduction engageante
- Corps structuré avec sous-titres
- Mention des services de l'entreprise
- Call to action en fin d'article
- Méta-description (150-160 caractères)
===FIN_BLOG===
` : ''}

${genGallery ? `
===GALERIE===
Fiche galerie SEO avec :
- Titre de la photo (optimisé SEO)
- Description longue (150-200 mots)
- Texte alternatif (alt text) pour les images
- Mots-clés ciblés
===FIN_GALERIE===
` : ''}`;

  const raw = callClaude(system, user, 4096);

  const result = {};
  if (genFacebook) result.facebook = extractSection(raw, 'FACEBOOK', 'FIN_FACEBOOK');
  if (genTiktok) result.tiktok = extractSection(raw, 'TIKTOK', 'FIN_TIKTOK');
  if (genBlog) result.blog = extractSection(raw, 'BLOG', 'FIN_BLOG');
  if (genGallery) result.gallery = extractSection(raw, 'GALERIE', 'FIN_GALERIE');

  return result;
}

// ---- GÉNÉRER EMAIL DEMANDE D'AVIS ----
function generateReviewEmail(clientData) {
  const system = `${COMPANY_CONTEXT}
Tu génères des emails personnalisés de demande d'avis Google, chaleureux et authentiques.`;

  const user = `Génère un email de demande d'avis Google pour ce client :
NOM : ${clientData.nom}
PROJET : ${clientData.type || 'rénovation'}
VILLE : ${clientData.ville || 'Saint-Jean-sur-Richelieu'}
LIEN GOOGLE : ${GOOGLE_BUSINESS_LINK}

L'email doit être :
- Personnel et chaleureux (utilise le prénom)
- Court (150-200 mots max)
- Inclure le lien Google directement
- Terminer par une signature des Gestions Heúrēka
- En français québécois naturel`;

  return callClaude(system, user, 512);
}

// ---- GÉNÉRER TENDANCES TIKTOK ----
function generateTikTokTrendsContent(rawTrends) {
  const system = `${COMPANY_CONTEXT}
Tu es un expert en contenu TikTok pour la rénovation résidentielle au Québec.
Tu analyses les tendances TikTok et les adaptes à notre niche.`;

  const user = `Voici les tendances TikTok actuelles :
${rawTrends}

Génère du contenu adapté à Les Gestions Heúrēka :

===SONS===
Top 5 sons viraux avec leur utilisation pour la rénovation (format JSON):
[{"name": "Nom du son", "desc": "Pourquoi c'est viral", "useCase": "Comment l'utiliser en rénovation"}, ...]
===FIN_SONS===

===FORMATS===
Top 3 formats vidéo avec détails (format JSON):
[{"format": "Nom du format", "desc": "Description", "duration": "Durée idéale", "engagement": "Taux engag."}, ...]
===FIN_FORMATS===

===SCRIPTS===
3 scripts TikTok prêts à tourner pour la rénovation québécoise.
Chaque script doit inclure [TITRE], [SCRIPT], [SON SUGGÉRÉ], [HASHTAGS]
===FIN_SCRIPTS===

===HASHTAGS===
Top 20 hashtags optimisés pour la rénovation au Québec (un par ligne avec #)
===FIN_HASHTAGS===`;

  const raw = callClaude(system, user, 3000);

  return {
    sounds: parseJson(extractSection(raw, 'SONS', 'FIN_SONS')) || [],
    formats: parseJson(extractSection(raw, 'FORMATS', 'FIN_FORMATS')) || [],
    rawScripts: extractSection(raw, 'SCRIPTS', 'FIN_SCRIPTS') || '',
    rawHashtags: extractSection(raw, 'HASHTAGS', 'FIN_HASHTAGS') || ''
  };
}

// ---- GÉNÉRER CONTENU SAISONNIER ----
function generateSeasonalContentClaude(season, theme) {
  const system = `${COMPANY_CONTEXT}
Tu génères du contenu saisonnier pour les réseaux sociaux, varié et engageant.`;

  const user = `Génère du contenu saisonnier pour ${season || 'la saison actuelle'} :
${theme ? `THÈME SPÉCIFIQUE : ${theme}` : ''}

Génère 2-3 pièces de contenu variées :
- Un post Facebook engageant
- Un conseil ou fait intéressant
- Une idée de TikTok rapide

Format: Sépare chaque pièce avec ===PIECE_X=== et ===FIN_PIECE_X===
Indique la plateforme et le thème pour chaque pièce.`;

  const raw = callClaude(system, user, 2000);

  // Parse pieces
  const pieces = [];
  for (let i = 1; i <= 5; i++) {
    const piece = extractSection(raw, `PIECE_${i}`, `FIN_PIECE_${i}`);
    if (piece) pieces.push({ id: generateId(), content: piece, theme: theme || season });
  }
  if (pieces.length === 0) {
    pieces.push({ id: generateId(), content: raw, theme: theme || season });
  }
  return pieces;
}

// ---- ANALYSER STATISTIQUES MENSUEL ----
function analyzeMonthlyStats(stats, publications) {
  const system = `${COMPANY_CONTEXT}
Tu es un analyste marketing spécialisé dans le contenu numérique pour PME.
Tu fournis des analyses claires et des recommandations actionnables.`;

  const user = `Analyse les statistiques marketing du mois ${stats.month}/${stats.year} pour Les Gestions Heúrēka :

STATISTIQUES :
- Vues Facebook : ${stats.facebookViews || 0}
- Nouveaux abonnés Facebook : ${stats.facebookFollowers || 0}
- Vues TikTok : ${stats.tiktokViews || 0}
- Nouveaux abonnés TikTok : ${stats.tiktokFollowers || 0}
- Nouveaux avis Google : ${stats.newReviews || 0}
- Posts publiés : ${stats.postsPublished || publications.length}
- Leads reçus : ${stats.leads || 0}

PUBLICATIONS DU MOIS :
${publications.map(p => `- ${p.platform} : ${p.type || ''}`).join('\n')}

Génère :
===ANALYSE===
Analyse de 250-350 mots : ce qui a bien performé, ce qui peut être amélioré, tendances observées.
===FIN_ANALYSE===

===PLAN_MOIS_PROCHAIN===
Plan de contenu suggéré pour le mois prochain : 5-7 idées concrètes et actionnables.
===FIN_PLAN_MOIS_PROCHAIN===`;

  const raw = callClaude(system, user, 1500);

  return {
    analysis: extractSection(raw, 'ANALYSE', 'FIN_ANALYSE') || raw,
    nextMonthPlan: extractSection(raw, 'PLAN_MOIS_PROCHAIN', 'FIN_PLAN_MOIS_PROCHAIN') || ''
  };
}

// ---- GÉNÉRER CAMPAGNE PROMO ----
function generatePromotionClaude(data) {
  const system = `${COMPANY_CONTEXT}
Tu génères des campagnes promotionnelles complètes et percutantes.`;

  const user = `Génère une campagne promotionnelle complète :
NOM : ${data.name}
SERVICE : ${data.service || 'tous les services'}
OFFRE : ${data.offer}
VALEUR MAX : ${data.value || 'non spécifiée'}
PÉRIODE : ${data.startDate || 'à venir'} au ${data.endDate || ''}
MESSAGE CLÉ : ${data.message || ''}

===FACEBOOK===
Post Facebook promotionnel complet (250-400 mots) avec accroche urgente, détails de l'offre,
conditions, appel à l'action fort et hashtags.
===FIN_FACEBOOK===

===TIKTOK===
Script TikTok promotionnel (format court, 30-45 sec) avec accroche, offre, urgence et CTA.
===FIN_TIKTOK===

===EMAIL===
Email promotionnel pour envoyer aux anciens clients (200-300 mots), personnel, avec l'offre
exclusive et un lien vers le site.
===FIN_EMAIL===`;

  const raw = callClaude(system, user, 3000);
  return {
    facebook: extractSection(raw, 'FACEBOOK', 'FIN_FACEBOOK') || '',
    tiktok: extractSection(raw, 'TIKTOK', 'FIN_TIKTOK') || '',
    email: extractSection(raw, 'EMAIL', 'FIN_EMAIL') || ''
  };
}

// ---- UTILITAIRES ----
function extractSection(text, start, end) {
  const regex = new RegExp(`===\\s*${start}\\s*===[\\s\\S]*?(?:===\\s*${end}\\s*===|$)`, 'i');
  const match = text.match(regex);
  if (!match) return null;
  return match[0]
    .replace(new RegExp(`^===\\s*${start}\\s*===\\s*`, 'i'), '')
    .replace(new RegExp(`===\\s*${end}\\s*===\\s*$`, 'i'), '')
    .trim();
}

function parseJson(str) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch (_) {
    return null;
  }
}
