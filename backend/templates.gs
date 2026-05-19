// ============================================
// TEMPLATES.GS — Génération de contenu sans IA
// Templates intelligents en français québécois
// ============================================

// ---- GÉNÉRATEUR PRINCIPAL ----
function generateProjectContent(projectData) {
  const { type, ville, duree, client, description, extra } = projectData;
  const t = getTypeConfig(type);

  return {
    facebook: buildFacebookPost(projectData, t),
    tiktok: buildTikTokScript(projectData, t),
    blog: buildBlogArticle(projectData, t),
    gallery: buildGalleryCard(projectData, t)
  };
}

// ---- CONFIG PAR TYPE DE TRAVAUX ----
function getTypeConfig(type) {
  const configs = {
    'Portes et fenêtres': {
      emoji: '🪟',
      hashtags: '#PoseDeFenetres #PortesEtFenetres #IsolationQuebec #EfficaciteEnergetique',
      avantage: 'économies d\'énergie et confort thermique',
      verbe: 'avons remplacé',
      resultat: 'lumineux, bien isolé et économique en chauffage',
      conseil: 'Des fenêtres de qualité peuvent réduire votre facture de chauffage jusqu\'à 30%.',
      seoService: 'pose de portes et fenêtres'
    },
    'Revêtement extérieur': {
      emoji: '🏠',
      hashtags: '#RevetementExterieur #PareChocs #VinyleQuebec #RenoExterieure',
      avantage: 'protection durable contre les intempéries et look impeccable',
      verbe: 'avons posé',
      resultat: 'protégé, moderne et sans entretien',
      conseil: 'Un bon revêtement extérieur protège votre maison pour 30 à 50 ans.',
      seoService: 'revêtement extérieur'
    },
    'Agrandissement de maison': {
      emoji: '📐',
      hashtags: '#Agrandissement #AjoutDEtage #ExtensionMaison #PlusDEspace',
      avantage: 'espace de vie augmenté sans déménager',
      verbe: 'avons agrandi',
      resultat: 'spacieux, fonctionnel et parfaitement intégré',
      conseil: 'Agrandir coûte souvent 2 à 3 fois moins cher que déménager.',
      seoService: 'agrandissement de maison'
    },
    'Construction de garage': {
      emoji: '🏗️',
      hashtags: '#ConstructionGarage #GarageDetache #GarageDouble #ConstructionQuebec',
      avantage: 'protection de vos véhicules et espace de rangement supplémentaire',
      verbe: 'avons construit',
      resultat: 'solide, isolé et parfaitement fini',
      conseil: 'Un garage augmente la valeur de revente de votre propriété de 10 à 15%.',
      seoService: 'construction de garage'
    },
    'Entrepreneur général': {
      emoji: '🔨',
      hashtags: '#EntrepreneurGeneral #RenovationComplete #ExpertRenovation #ClefEnMain',
      avantage: 'un seul entrepreneur pour tout gérer, sans stress',
      verbe: 'avons réalisé',
      resultat: 'entièrement rénové et livré clé en main',
      conseil: 'Travailler avec un entrepreneur général licencié protège votre investissement.',
      seoService: 'entrepreneur général en rénovation'
    },
    'Autre': {
      emoji: '🏡',
      hashtags: '#Renovation #TravauxMaison #ExpertReno #QualiteQuebec',
      avantage: 'résultat professionnel et durable',
      verbe: 'avons réalisé',
      resultat: 'rénové selon vos attentes',
      conseil: 'Toujours choisir un entrepreneur licencié RBQ pour vos travaux.',
      seoService: 'rénovation résidentielle'
    }
  };
  return configs[type] || configs['Autre'];
}

// ---- POST FACEBOOK ----
function buildFacebookPost(d, t) {
  const accroches = [
    `${t.emoji} Un autre projet ${d.type ? d.type.toLowerCase() : 'de rénovation'} complété à ${d.ville}!`,
    `${t.emoji} Transformation réussie à ${d.ville}! Notre équipe est fière du résultat.`,
    `${t.emoji} Projet terminé à ${d.ville} — et le client est aux anges!`,
    `${t.emoji} Beau projet complété à ${d.ville} cette semaine!`
  ];
  const accroche = accroches[Math.floor(Math.random() * accroches.length)];

  const clientMention = d.client ? `\n\nMerci à ${d.client} pour leur confiance!` : '';
  const dureeMention = d.duree ? `\n\n⏱️ Durée des travaux : ${d.duree}.` : '';

  return `${accroche}

${d.description || 'Un beau projet réalisé avec soin par notre équipe.'}
${dureeMention}
La maison est maintenant ${t.resultat}.${clientMention}

${t.conseil}

Vous avez un projet en tête? Contactez-nous pour une soumission gratuite — sans obligation!

📞 Appelez-nous ou visitez gestionsheureka.net
📍 Saint-Jean-sur-Richelieu et environs
🏆 RBQ 5818-7162-01

${t.hashtags} #GestionsHeureka #RenovationQuebec #${d.ville ? d.ville.replace(/[^a-zA-ZÀ-ÿ]/g, '') : 'SaintJean'} #SaintJeanSurRichelieu #Maison #Renovation #AvantApres #Quebec #Monteregie`;
}

// ---- SCRIPT TIKTOK ----
function buildTikTokScript(d, t) {
  return `[ACCROCHE 3 SEC]
Vous allez pas croire le résultat à ${d.ville}. Regardez ça. ${t.emoji}

[NARRATION — à dire en voix off]
${d.description || 'Notre équipe vient de terminer un beau projet de ' + (d.type || 'rénovation') + '.'}

${d.duree ? `Durée totale des travaux : ${d.duree}. ` : ''}La maison est maintenant ${t.resultat}.

${t.conseil}

Si vous avez un projet similaire, appelez-nous. On vous donne une soumission gratuite.

[TEXTE À L'ÉCRAN — à afficher]
📍 ${d.ville || 'Saint-Jean-sur-Richelieu'}
🔨 ${d.type || 'Rénovation complète'}
${d.duree ? `⏱️ ${d.duree}` : ''}
✅ Résultat : ${t.resultat}
📞 gestionsheureka.net

[SON SUGGÉRÉ]
Musique motivationnelle légère — type before/after reveal.
Ou : son ambiant de construction + musique de fond douce.

[HASHTAGS]
#${(d.type || 'Renovation').replace(/[^a-zA-ZÀ-ÿ]/g, '')} #Renovation #RenoTikTok #Quebec #GestionsHeureka #AvantApres #${d.ville ? d.ville.replace(/[^a-zA-ZÀ-ÿ]/g, '') : 'SaintJean'} #Maison #Construction #Travaux #Monteregie #RenovationQuebec #ExpertReno #BeforeAfter #MaisonQuebec`;
}

// ---- ARTICLE DE BLOGUE ----
function buildBlogArticle(d, t) {
  const villeStr = d.ville || 'Saint-Jean-sur-Richelieu';
  const typeStr = d.type || 'rénovation';

  return `# ${typeStr} professionnelle à ${villeStr} — Les Gestions Heúrēka

## Introduction

Vous cherchez un expert en ${t.seoService} dans la région de ${villeStr}? Les Gestions Heúrēka vient de terminer un nouveau projet qui illustre parfaitement notre savoir-faire.

## Le projet

${d.description || 'Notre équipe a récemment complété un projet de ' + typeStr.toLowerCase() + ' à ' + villeStr + '.'}

${d.duree ? `Les travaux ont duré ${d.duree}, dans le respect des délais convenus avec le client.` : ''}

## Notre approche

Chez Les Gestions Heúrēka, chaque projet est réalisé avec les mêmes standards : matériaux de qualité, équipe professionnelle et communication transparente avec le client.

La maison est maintenant ${t.resultat} — exactement comme le client le souhaitait.

## Pourquoi choisir Les Gestions Heúrēka?

- ✅ Entrepreneur licencié RBQ 5818-7162-01
- ✅ ${t.avantage}
- ✅ Soumission gratuite et sans obligation
- ✅ Garantie main-d'œuvre incluse
- ✅ Plus de 80 avis 5 étoiles sur Google

## ${t.conseil}

${typeStr === 'Portes et fenêtres' ? 'Des fenêtres mal isolées peuvent représenter jusqu\'à 25% de vos pertes de chaleur en hiver. Un investissement dans des fenêtres de qualité se rentabilise rapidement.' : typeStr === 'Revêtement extérieur' ? 'Le revêtement extérieur protège votre maison contre l\'humidité, les intempéries et améliore son efficacité énergétique. Un choix judicieux pour votre maison au Québec.' : 'Faites confiance à des professionnels licenciés pour vos projets de rénovation. Votre maison est votre investissement le plus important.'}

## Prêt à démarrer votre projet?

Contactez Les Gestions Heúrēka pour une soumission gratuite à domicile. Nous desservons Saint-Jean-sur-Richelieu, Iberville, Saint-Luc, Saint-Blaise, Lacolle et toute la région de la Montérégie.

📞 Visitez **gestionsheureka.net** ou appelez-nous directement.

---
*Les Gestions Heúrēka — Entrepreneur général licencié RBQ 5818-7162-01 — Saint-Jean-sur-Richelieu, Québec*

**Méta-description:** ${typeStr} professionnelle à ${villeStr} par Les Gestions Heúrēka. Entrepreneur licencié RBQ, soumission gratuite. Desservant la Montérégie. ${villeStr}, Québec.`;
}

// ---- FICHE GALERIE ----
function buildGalleryCard(d, t) {
  const villeStr = d.ville || 'Saint-Jean-sur-Richelieu';
  const typeStr = d.type || 'Rénovation';

  return `TITRE (SEO):
${typeStr} — ${villeStr} | Les Gestions Heúrēka

DESCRIPTION LONGUE:
Ce projet de ${typeStr.toLowerCase()} réalisé à ${villeStr} illustre le savoir-faire de l'équipe des Gestions Heúrēka. ${d.description || ''} La maison est maintenant ${t.resultat}. Chaque détail a été soigné pour assurer ${t.avantage}. Les Gestions Heúrēka, entrepreneur général licencié RBQ 5818-7162-01, réalise des projets de rénovation résidentielle dans toute la région de Saint-Jean-sur-Richelieu et la Montérégie.

TEXTE ALTERNATIF (alt text):
Photo ${typeStr.toLowerCase()} maison ${villeStr} Québec — Les Gestions Heúrēka entrepreneur général licencié RBQ

MOTS-CLÉS:
${typeStr.toLowerCase()} ${villeStr}, ${t.seoService} Montérégie, rénovation résidentielle Saint-Jean-sur-Richelieu, entrepreneur général licencié Québec, Les Gestions Heúrēka, RBQ 5818-7162-01`;
}

// ---- EMAIL DEMANDE D'AVIS ----
function generateReviewEmail(clientData) {
  const prenom = (clientData.nom || 'cher client').split(' ')[0];
  const typeStr = clientData.type ? clientData.type.toLowerCase() : 'rénovation';
  const villeStr = clientData.ville || 'votre région';

  return `Bonjour ${prenom},

Nous espérons que vous êtes pleinement satisfait des travaux de ${typeStr} réalisés à ${villeStr}.

Ce fut un plaisir de travailler pour vous, et nous sommes fiers du résultat livré!

Si vous avez quelques minutes, un avis Google nous aiderait énormément à faire connaître notre entreprise à d'autres familles de la région. Ça prend moins de 2 minutes et ça fait vraiment une différence pour une petite entreprise comme la nôtre.

${GOOGLE_BUSINESS_LINK || 'Cherchez "Les Gestions Heúrēka" sur Google Maps pour laisser votre avis.'}

Merci sincèrement de votre confiance. C'est grâce à des clients comme vous qu'on continue à grandir!

Au plaisir de travailler de nouveau ensemble,

L'équipe des Gestions Heúrēka
📞 gestionsheureka.net
RBQ 5818-7162-01`;
}

// ---- CONTENU SAISONNIER ----
function generateSeasonalContentClaude(season, theme) {
  const currentSeason = season || getCurrentSeasonName();
  const id1 = generateId();
  const id2 = generateId();

  const pieces = {
    Printemps: [
      {
        id: id1, platform: 'Facebook', theme: theme || 'Printemps',
        content: `🌱 C'est le printemps — le meilleur moment pour donner un coup de jeune à votre maison!

Après un hiver québécois difficile, votre revêtement extérieur, vos fenêtres et vos portes méritent peut-être une attention particulière.

Notre équipe est disponible pour une inspection gratuite et une soumission sans obligation.

📍 Saint-Jean-sur-Richelieu et environs
📞 gestionsheureka.net

#Printemps #Renovation #GestionsHeureka #SaintJean #Maison #RenoExterieure #Quebec`
      },
      {
        id: id2, platform: 'TikTok', theme: theme || 'Printemps',
        content: `[ACCROCHE] Vérifiez ces 3 choses sur votre maison ce printemps. 🌿

[NARRATION]
1️⃣ Votre revêtement extérieur — fissures, bulles ou décollement?
2️⃣ Vos fenêtres — condensation entre les vitres ou courant d'air?
3️⃣ Votre toiture — bardeaux manquants ou relevés?

Si vous voyez un de ces signes, appelez-nous avant que ça empire.

Soumission gratuite — gestionsheureka.net

[HASHTAGS] #Printemps #ConseilsMaison #Renovation #Quebec #GestionsHeureka #Inspection`
      }
    ],
    Été: [
      {
        id: id1, platform: 'Facebook', theme: theme || 'Été',
        content: `☀️ L'été, c'est la saison idéale pour construire votre garage ou agrandir votre maison!

Les conditions météo sont parfaites, notre équipe est disponible et les délais de livraison sont optimaux.

Réservez votre projet dès maintenant pour profiter de votre espace dès cet automne!

📞 Soumission gratuite : gestionsheureka.net
#Été #ConstructionGarage #Agrandissement #GestionsHeureka #SaintJean #Quebec`
      },
      {
        id: id2, platform: 'TikTok', theme: theme || 'Été',
        content: `[ACCROCHE] Vous rêvez d'un garage ou d'un agrandissement? L'été c'est maintenant. ☀️

[NARRATION]
On construit des garages simples et doubles toute la belle saison.
Délai moyen : 4 à 6 semaines.
Fini avant l'hiver? Absolument.

Appelez-nous — soumission gratuite.

[HASHTAGS] #Été #Garage #Agrandissement #Construction #GestionsHeureka #Quebec`
      }
    ],
    Automne: [
      {
        id: id1, platform: 'Facebook', theme: theme || 'Automne',
        content: `🍂 L'hiver s'en vient — est-ce que vos portes et fenêtres sont prêtes?

Des fenêtres mal isolées peuvent vous coûter des centaines de dollars en chauffage cet hiver.

C'est le dernier sprint avant les grands froids. Notre équipe a encore quelques créneaux disponibles.

📞 Soumission gratuite maintenant : gestionsheureka.net
#Automne #PortesEtFenetres #IsolationHiver #GestionsHeureka #SaintJean #Quebec`
      },
      {
        id: id2, platform: 'TikTok', theme: theme || 'Automne',
        content: `[ACCROCHE] Dernière chance avant l'hiver pour vos fenêtres. 🍂

[NARRATION]
On pose des fenêtres jusqu'en novembre.
Après ça, les températures compliquent les travaux extérieurs.

Si vos fenêtres laissent entrer le froid, appelez-nous maintenant.

[HASHTAGS] #Automne #Fenêtres #IsolationHiver #GestionsHeureka #Quebec #UrgenceReno`
      }
    ],
    Hiver: [
      {
        id: id1, platform: 'Facebook', theme: theme || 'Hiver',
        content: `❄️ L'hiver, c'est le bon moment pour planifier vos projets de printemps!

Les entrepreneurs sont plus disponibles, les délais de soumission sont plus courts et vous pouvez réserver votre place dans le calendrier avant que la saison s'emballe.

Planifiez maintenant, profitez au printemps!

📞 gestionsheureka.net — Soumission gratuite
#Hiver #PlanificationPrintemps #Renovation #GestionsHeureka #SaintJean #Quebec`
      },
      {
        id: id2, platform: 'TikTok', theme: theme || 'Hiver',
        content: `[ACCROCHE] Le secret pour avoir le meilleur entrepreneur au printemps? ❄️

[NARRATION]
Réserver en hiver.

Sérieusement — en mars, les entrepreneurs sont déjà bookés pour l'été.
En janvier-février, vous avez le choix et les meilleurs prix.

Appelez-nous cet hiver pour votre projet de printemps.

[HASHTAGS] #Hiver #ConseilRenovation #PlanificationPrintemps #GestionsHeureka #Quebec`
      }
    ]
  };

  return pieces[currentSeason] || pieces['Printemps'];
}

function getCurrentSeasonName() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'Printemps';
  if (m >= 6 && m <= 8) return 'Été';
  if (m >= 9 && m <= 11) return 'Automne';
  return 'Hiver';
}

// ---- RAPPORT MENSUEL (sans IA) ----
function analyzeMonthlyStats(stats, publications) {
  const fbViews = stats.facebookViews || 0;
  const ttViews = stats.tiktokViews || 0;
  const reviews = stats.newReviews || 0;
  const posts = stats.postsPublished || publications.length;
  const leads = stats.leads || 0;

  const analysis = `Résumé du mois ${stats.month}/${stats.year} :

📊 Publications : ${posts} posts publiés ce mois.
📱 Facebook : ${fbViews.toLocaleString('fr-CA')} vues. ${fbViews > 500 ? 'Bonne performance — continuez à publier régulièrement.' : 'Pour augmenter la portée, publiez au moins 2 fois par semaine.'}
🎵 TikTok : ${ttViews.toLocaleString('fr-CA')} vues. ${ttViews > 1000 ? 'Excellent — le format vidéo fonctionne bien pour votre niche.' : 'Le before/after et le day-in-the-life sont les formats qui performent le mieux en rénovation.'}
⭐ Nouveaux avis Google : ${reviews}. ${reviews > 0 ? 'Bravo! Continuez d\'envoyer des demandes après chaque projet terminé.' : 'Pensez à envoyer une demande d\'avis à chaque client satisfait.'}
🏠 Leads reçus : ${leads}. ${leads > 0 ? 'Ces leads sont précieux — suivez-les rapidement.' : ''}

${posts < 4 ? '⚠️ Vous avez publié moins de 4 fois ce mois. La régularité est la clé de la croissance sur les réseaux sociaux.' : '✅ Bonne régularité de publication ce mois.'}`;

  const nextMonth = `Plan suggéré pour le mois prochain :

1. 📅 Publier minimum 2x/semaine sur Facebook (mardi et jeudi, entre 17h-19h)
2. 🎵 Créer 1 TikTok before/after par projet terminé
3. ⭐ Envoyer une demande d'avis à tous les clients des 30 derniers jours
4. 📸 Prendre des photos systématiquement sur chaque chantier (avant + pendant + après)
5. 🌿 Utiliser les idées de contenu saisonnier disponibles dans l'application`;

  return { analysis, nextMonthPlan: nextMonth };
}

// ---- PROMOTION (sans IA) ----
function generatePromotionClaude(data) {
  const nom = data.name || 'Promotion spéciale';
  const service = data.service || 'tous nos services';
  const offre = data.offer || 'offre exclusive';
  const valeur = data.value ? ` (jusqu'à ${data.value})` : '';
  const periode = data.startDate && data.endDate ? `\n📅 Valable du ${data.startDate} au ${data.endDate}.` : '';
  const msg = data.message ? `\n\n${data.message}` : '';

  const facebook = `🎉 ${nom} chez Les Gestions Heúrēka!

Pour tout projet de ${service} réservé pendant cette période, profitez de :
✅ ${offre}${valeur}${periode}${msg}

Places limitées — notre agenda se remplit rapidement!

📞 Soumission gratuite et sans obligation : gestionsheureka.net
📍 Saint-Jean-sur-Richelieu et toute la Montérégie
🏆 Entrepreneur licencié RBQ 5818-7162-01

#Promotion #${nom.replace(/[^a-zA-ZÀ-ÿ]/g, '')} #GestionsHeureka #Renovation #Quebec #SaintJean #OffreSpeciale`;

  const tiktok = `[ACCROCHE] ${nom} — places limitées! 🎉

[NARRATION]
${offre}${valeur} chez Les Gestions Heúrēka.${periode}

Pour tous les projets de ${service}.

Appelez-nous ou visitez gestionsheureka.net — soumission gratuite.

[HASHTAGS] #Promo #${nom.replace(/[^a-zA-ZÀ-ÿ]/g, '')} #GestionsHeureka #Renovation #Quebec`;

  const email = `Bonjour,

En tant qu'ancien client des Gestions Heúrēka, nous souhaitons vous informer en avant-première de notre ${nom}.

${offre}${valeur}.${periode}${msg}

Que ce soit pour un projet que vous planifiez depuis un moment ou pour des travaux urgents, c'est le bon moment pour nous contacter.

📞 Soumission gratuite : gestionsheureka.net

Merci de votre fidélité!

L'équipe des Gestions Heúrēka
RBQ 5818-7162-01`;

  return { facebook, tiktok, email };
}
