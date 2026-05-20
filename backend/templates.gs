// ============================================
// TEMPLATES.GS — Génération de contenu sans IA
// Les Gestions Heúrēka — Saint-Jean-sur-Richelieu
// ============================================

const COMPANY = {
  nom:       'Les Gestions Heúrēka',
  tel:       '450-346-1486',
  courriel:  'info@gestionsheureka.com',
  site:      'gestionsheureka.net',
  adresse:   '353A Bd du Séminaire N, Saint-Jean-sur-Richelieu, QC J3B 8C5',
  rbq:       '5818-7162-01',
  region:    'Saint-Jean-sur-Richelieu et environs'
};

// ---- GÉNÉRATEUR PRINCIPAL ----
function generateProjectContent(projectData) {
  const t = getTypeConfig(projectData.type);
  return {
    facebook: buildFacebookPost(projectData, t),
    tiktok:   buildTikTokScript(projectData, t),
    blog:     buildBlogArticle(projectData, t),
    gallery:  buildGalleryCard(projectData, t)
  };
}

// ---- CONFIG PAR TYPE DE TRAVAUX ----
function getTypeConfig(type) {
  const configs = {
    'Portes et fenêtres': {
      emoji:      '🪟',
      hashtags:   '#PoseDeFenetres #PortesEtFenetres #IsolationQuebec #EfficaciteEnergetique #Isothermic #TripleVitrage',
      avantage:   'économies d\'énergie et confort thermique en toute saison',
      verbe:      'avons remplacé',
      resultat:   'lumineux, bien isolé et économique en chauffage',
      conseil:    'Des fenêtres de qualité certifiées ENERGY STAR peuvent réduire votre facture de chauffage jusqu\'à 30 %. Un investissement qui se rentabilise rapidement au Québec.',
      seoService: 'pose de portes et fenêtres',
      accroches: [
        '🪟 On vient de transformer cette maison à {ville} — avant/après incroyable!',
        '🪟 Projet portes et fenêtres complété à {ville} — résultat impeccable!',
        '🪟 {ville} : des fenêtres neuves et une facture de chauffage qui va baisser cet hiver!',
        '🪟 Remplacement complet des fenêtres à {ville} — le client n\'en revient pas!'
      ],
      accrochesTikTok: [
        'On vient de poser {nb} fenêtres à {ville}. Regardez la différence. 🪟',
        'Cette maison à {ville} perdait 30% de sa chaleur par ses vieilles fenêtres. On a tout réglé.',
        'Le son d\'une fenêtre bien posée. Satisfaisant. 🪟',
        'Savez-vous combien coûtent de mauvaises fenêtres sur votre facture? On vous explique.'
      ],
      conseilTikTok: '💡 Conseil de pro : cherchez la certification ENERGY STAR et le label Isothermic pour vos fenêtres au Québec. Ce sont des garanties de qualité reconnues.',
      detail: 'Nos installateurs certifiés remplacent chaque fenêtre avec soin : retrait de l\'ancien cadre, inspection de l\'encadrement, installation avec mousse isolante haute densité et scellant hydrofuge. Chaque fenêtre est testée avant de quitter le chantier.'
    },
    'Revêtement extérieur': {
      emoji:      '🏠',
      hashtags:   '#RevetementExterieur #VinyleQuebec #RenoExterieure #ParementMaison #IsolationExterieure',
      avantage:   'protection durable 30-50 ans contre les intempéries québécoises et look impeccable',
      verbe:      'avons posé',
      resultat:   'protégé, moderne et sans entretien pour les prochaines décennies',
      conseil:    'Un revêtement extérieur de qualité protège votre maison contre l\'humidité, les variations de température extrêmes et réduit vos coûts d\'entretien pour 30 à 50 ans.',
      seoService: 'revêtement extérieur résidentiel',
      accroches: [
        '🏠 Transformation totale à {ville} — nouveau revêtement extérieur posé par notre équipe!',
        '🏠 Cette maison à {ville} a retrouvé sa jeunesse — revêtement extérieur complet terminé!',
        '🏠 Avant/après incroyable à {ville} — revêtement extérieur réalisé par Les Gestions Heúrēka!',
        '🏠 {ville} : une maison entièrement revêtue et prête pour les prochains 40 ans!'
      ],
      accrochesTikTok: [
        'Cette maison à {ville} avait l\'air abandonnée. Voilà ce qu\'on en a fait. 🏠',
        'Avant/après revêtement extérieur à {ville}. La différence est spectaculaire.',
        'Combien de temps ça prend pour revêtir une maison complète? On vous montre.',
        'Votre revêtement a des bulles ou des fissures? On vous explique pourquoi c\'est urgent.'
      ],
      conseilTikTok: '💡 Conseil de pro : avant de choisir votre revêtement, vérifiez l\'indice R de l\'isolation intégrée. Au Québec, on recommande un indice R minimal de 5 pour les parois extérieures.',
      detail: 'Notre équipe procède méthodiquement : retrait du vieux revêtement, inspection et traitement de l\'OSB, installation d\'un pare-air homologué, puis pose du revêtement en vinyle ou en fibrociment selon le choix du client. Chaque joint est vérifié pour l\'étanchéité.'
    },
    'Agrandissement de maison': {
      emoji:      '📐',
      hashtags:   '#Agrandissement #AjoutDEtage #ExtensionMaison #PlusDEspace #AgrandissementMaison #ConstructionQuebec',
      avantage:   'espace de vie augmenté sur mesure, sans les coûts et le stress d\'un déménagement',
      verbe:      'avons agrandi',
      resultat:   'spacieux, fonctionnel et parfaitement intégré à la structure existante',
      conseil:    'Agrandir sa maison coûte en moyenne 2 à 3 fois moins cher que déménager dans une propriété plus grande, tout en restant dans le quartier qu\'on aime.',
      seoService: 'agrandissement de maison résidentielle',
      accroches: [
        '📐 Agrandissement complété à {ville} — la famille a enfin l\'espace dont elle avait besoin!',
        '📐 Ajout de {duree} de travaux à {ville} — le résultat dépasse les attentes du client!',
        '📐 {ville} : on a agrandi cette maison et complètement transformé la vie de la famille!',
        '📐 Plus d\'espace sans déménager — agrandissement réussi à {ville}!'
      ],
      accrochesTikTok: [
        'Cette famille à {ville} avait besoin d\'espace. On a ajouté {surface} sans déménager.',
        'Agrandir ou déménager? On vous donne les vrais chiffres.',
        'De la fondation au toit — agrandissement complet à {ville} en {duree}.',
        'Voici comment on intègre un agrandissement à une maison existante sans que ça paraisse.'
      ],
      conseilTikTok: '💡 Conseil de pro : avant tout agrandissement, faites vérifier la capacité portante de votre fondation. C\'est une étape que beaucoup d\'entrepreneurs sautent — nous, jamais.',
      detail: 'Chaque agrandissement commence par une analyse structurale et un dessin de plans conformes au Code du bâtiment du Québec. Nos équipes gèrent les permis municipaux, la fondation, la charpente, l\'isolation, le parement extérieur et les finitions intérieures.'
    },
    'Construction de garage': {
      emoji:      '🏗️',
      hashtags:   '#ConstructionGarage #GarageDetache #GarageDouble #ConstructionQuebec #GarageResidentiel',
      avantage:   'protection de vos véhicules, espace de rangement et plus-value immobilière immédiate',
      verbe:      'avons construit',
      resultat:   'solide, bien isolé, fini et prêt à l\'usage',
      conseil:    'Un garage construit selon les normes du bâtiment augmente la valeur de revente de votre propriété de 10 à 15 %, tout en vous offrant un espace sécuritaire et fonctionnel.',
      seoService: 'construction de garage résidentiel',
      accroches: [
        '🏗️ Nouveau garage construit à {ville} — de la fondation à la porte, notre équipe a tout fait!',
        '🏗️ Construction de garage complétée à {ville} — le client a maintenant son espace de rêve!',
        '🏗️ {ville} : un garage double flambant neuf livré en {duree} par Les Gestions Heúrēka!',
        '🏗️ De la dalle de béton à la toiture — garage construit de A à Z à {ville}!'
      ],
      accrochesTikTok: [
        'On construit un garage à {ville}. Suivez l\'évolution en 60 secondes.',
        'De la coulée de béton à la porte de garage — {duree} de travaux résumés ici.',
        'Combien ça coûte vraiment de construire un garage au Québec? On répond.',
        'Ce garage à {ville} a pris {duree}. Voici toutes les étapes.'
      ],
      conseilTikTok: '💡 Conseil de pro : un garage doit avoir un plancher avec une légère pente vers la porte pour l\'évacuation de l\'eau. Un détail technique que vous devez exiger de votre entrepreneur.',
      detail: 'De la conception aux finitions : plans conformes, permis municipal, coulée de dalle de béton armé, charpente en bois traité ou en acier, isolation, parement extérieur assorti à la maison, installation de la porte sectionnelle et du système d\'éclairage.'
    },
    'Entrepreneur général': {
      emoji:      '🔨',
      hashtags:   '#EntrepreneurGeneral #RenovationComplete #ExpertRenovation #ClefEnMain #RenovationResidentielle',
      avantage:   'un seul entrepreneur pour coordonner tous les corps de métier — sans stress pour le client',
      verbe:      'avons réalisé',
      resultat:   'entièrement rénové, coordonné et livré clé en main',
      conseil:    'Travailler avec un entrepreneur général licencié RBQ simplifie tout : un seul interlocuteur, une seule garantie, une seule responsabilité. Vous protégez votre investissement.',
      seoService: 'entrepreneur général en rénovation résidentielle',
      accroches: [
        '🔨 Projet clé en main complété à {ville} — coordination complète par Les Gestions Heúrēka!',
        '🔨 Rénovation majeure à {ville} — de la conception à la remise des clés, on a tout géré!',
        '🔨 {ville} : un projet complexe livré dans les délais et dans le budget!',
        '🔨 Le client de {ville} n\'avait qu\'un seul numéro de téléphone à composer. Le nôtre.'
      ],
      accrochesTikTok: [
        'Rénovation complète à {ville}. Un entrepreneur, zéro stress pour le client.',
        'Ce que fait vraiment un entrepreneur général — et pourquoi c\'est différent d\'un sous-traitant.',
        'De la démolition à la peinture finale à {ville} — tout en {duree}.',
        'Voici pourquoi vous ne devriez pas gérer vous-même vos sous-traitants.'
      ],
      conseilTikTok: '💡 Conseil de pro : demandez toujours le numéro de licence RBQ de votre entrepreneur et vérifiez-le sur le site de la Régie du bâtiment du Québec. C\'est gratuit et ça vous protège.',
      detail: 'En tant qu\'entrepreneur général licencié, nous coordonnons tous les corps de métier : charpentiers, électriciens, plombiers, peintres et sous-traitants spécialisés. Un seul point de contact, une communication transparente et un résultat livré selon les plans et devis signés.'
    },
    'Autre': {
      emoji:      '🏡',
      hashtags:   '#Renovation #TravauxMaison #ExpertReno #QualiteQuebec #RenovationResidentielle',
      avantage:   'résultat professionnel et durable, réalisé par une équipe licenciée',
      verbe:      'avons réalisé',
      resultat:   'rénové avec soin selon les attentes du client',
      conseil:    'Toujours choisir un entrepreneur licencié RBQ pour vos travaux. Votre maison est votre investissement le plus important — protégez-le.',
      seoService: 'rénovation résidentielle',
      accroches: [
        '🏡 Beau projet complété à {ville} par notre équipe!',
        '🏡 Travaux terminés à {ville} — le client est pleinement satisfait!',
        '🏡 Encore un projet réussi à {ville} par Les Gestions Heúrēka!',
        '🏡 {ville} : notre équipe vient de compléter un autre beau projet!'
      ],
      accrochesTikTok: [
        'Projet terminé à {ville}. Voici le résultat.',
        'Nos équipes à l\'œuvre à {ville}. Regardez le travail.',
        'De l\'état initial au résultat final — {ville} en {duree}.',
        'Ce que ça prend pour livrer un projet propre et dans les délais.'
      ],
      conseilTikTok: '💡 Conseil de pro : avant de signer un contrat, assurez-vous que tout est par écrit — matériaux, délais, garanties et coûts. Un bon entrepreneur n\'hésitera jamais à tout mettre sur papier.',
      detail: 'Notre équipe aborde chaque projet avec le même sérieux : évaluation initiale, planification rigoureuse, exécution soignée et inspection finale avec le client avant la remise des clés.'
    }
  };
  return configs[type] || configs['Autre'];
}

// ---- POST FACEBOOK ----
function buildFacebookPost(d, t) {
  const ville   = d.ville || 'Saint-Jean-sur-Richelieu';
  const duree   = d.duree || '';
  const client  = d.client || '';
  const desc    = d.description || 'Un beau projet réalisé avec soin par notre équipe.';
  const extra   = d.extra || '';

  const accrocheTemplate = t.accroches[Math.floor(Math.random() * t.accroches.length)];
  const accroche = accrocheTemplate
    .replace('{ville}', ville)
    .replace('{duree}', duree || 'quelques semaines')
    .replace('{nb}', '');

  const clientMention = client ? `\nMerci à ${client} pour leur confiance! 🙏` : '';
  const dureeMention  = duree  ? `\n⏱️ Durée des travaux : ${duree}.` : '';
  const extraMention  = extra  ? `\n\n${extra}` : '';

  const villeHashtag = ville.replace(/[^a-zA-ZÀ-ÿ]/g, '');

  return `${accroche}

${desc}${dureeMention}${extraMention}

${t.detail}

La maison est maintenant ${t.resultat}.${clientMention}

💡 ${t.conseil}

Vous avez un projet en tête? Appelez-nous pour une soumission gratuite et sans obligation!

📞 ${COMPANY.tel}
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
📍 ${COMPANY.adresse}
🏆 Entrepreneur licencié RBQ ${COMPANY.rbq}

${t.hashtags} #GestionsHeureka #RenovationQuebec #${villeHashtag} #SaintJeanSurRichelieu #Renovation #AvantApres #Quebec #Monteregie #ExpertReno`;
}

// ---- SCRIPT TIKTOK ----
function buildTikTokScript(d, t) {
  const ville  = d.ville || 'Saint-Jean-sur-Richelieu';
  const duree  = d.duree || '';
  const desc   = d.description || 'Notre équipe vient de terminer un beau projet.';
  const extra  = d.extra || '';

  const accrocheTemplate = t.accrochesTikTok[Math.floor(Math.random() * t.accrochesTikTok.length)];
  const accroche = accrocheTemplate
    .replace('{ville}', ville)
    .replace('{duree}', duree || 'quelques semaines')
    .replace('{nb}', '')
    .replace('{surface}', '');

  const villeHashtag = ville.replace(/[^a-zA-ZÀ-ÿ]/g, '');
  const typeHashtag  = (d.type || 'Renovation').replace(/[^a-zA-ZÀ-ÿ]/g, '');

  return `[ACCROCHE — 3 PREMIÈRES SECONDES]
${accroche}

[NARRATION — voix off naturelle et québécoise]
${desc}${duree ? '\n\nDurée des travaux : ' + duree + '.' : ''}${extra ? '\n\n' + extra : ''}

La maison est maintenant ${t.resultat}.

${t.conseilTikTok}

Si vous avez un projet similaire, on peut vous aider. Soumission gratuite, sans pression.
Appelez-nous au ${COMPANY.tel} ou visitez ${COMPANY.site}.

[TEXTE À L'ÉCRAN]
📍 ${ville}
🔨 ${d.type || 'Rénovation'}${duree ? '\n⏱️ ' + duree : ''}
✅ Résultat : ${t.resultat}
📞 ${COMPANY.tel}
🌐 ${COMPANY.site}

[SON SUGGÉRÉ]
Before/after reveal — musique qui monte en intensité au moment du résultat.
Alternative : son ambiant de chantier authentique + musique motivationnelle en fond.

[HASHTAGS]
#${typeHashtag} #Renovation #RenoTikTok #Quebec #GestionsHeureka #AvantApres #${villeHashtag} #Maison #Construction #ExpertReno #RenovationQuebec #Monteregie #BeforeAfter #MaisonQuebec #Travaux`;
}

// ---- ARTICLE DE BLOGUE ----
function buildBlogArticle(d, t) {
  const ville  = d.ville || 'Saint-Jean-sur-Richelieu';
  const type   = d.type  || 'Rénovation';
  const duree  = d.duree || '';
  const desc   = d.description || 'Notre équipe a récemment complété un projet de ' + type.toLowerCase() + ' à ' + ville + '.';
  const extra  = d.extra || '';
  const client = d.client || '';

  const villes = 'Saint-Jean-sur-Richelieu, Iberville, Saint-Luc, Saint-Blaise, Lacolle, Napierville, Sainte-Martine et toute la région de la Montérégie';

  const typeSpec = {
    'Portes et fenêtres': 'Les fenêtres et portes extérieures représentent jusqu\'à 25 % des pertes de chaleur d\'une maison. Un remplacement par des produits certifiés ENERGY STAR améliore significativement le confort thermique et réduit les frais de chauffage dès le premier hiver. Nous installons des produits de marques reconnues au Québec, avec garantie fabricant incluse.',
    'Revêtement extérieur': 'Le revêtement extérieur est la première ligne de défense de votre maison contre les hivers québécois. Un parement en vinyle haute densité ou en fibrociment bien installé protège la structure pour 30 à 50 ans, sans peinture ni entretien annuel. Il améliore également l\'efficacité énergétique en réduisant les infiltrations d\'air.',
    'Agrandissement de maison': 'Agrandir sa maison représente un investissement judicieux dans le marché immobilier de la Montérégie. Contrairement au déménagement, vous conservez votre quartier, votre école de quartier et votre réseau social, tout en gagnant l\'espace dont votre famille a besoin. Chaque agrandissement est conçu pour s\'intégrer harmonieusement à l\'architecture existante.',
    'Construction de garage': 'Un garage bien construit augmente la valeur de revente de 10 à 15 % selon les données du marché immobilier de la Montérégie. Au-delà de la protection des véhicules, il offre un espace de rangement supplémentaire précieux et peut être conçu pour accueillir un atelier ou un espace de travail à domicile.',
    'Entrepreneur général': 'Faire appel à un entrepreneur général licencié simplifie considérablement la gestion d\'un projet de rénovation complexe. Un seul interlocuteur coordonne tous les corps de métier, assume la responsabilité de l\'ensemble des travaux et vous garantit une cohérence entre tous les éléments du projet.'
  };
  const sectionSpec = typeSpec[type] || 'Chaque projet de rénovation est unique. Notre équipe s\'adapte aux contraintes de chaque maison et aux besoins de chaque client pour livrer un résultat à la hauteur des attentes.';

  return `# ${type} à ${ville} — Les Gestions Heúrēka | Entrepreneur licencié RBQ

## Un projet réalisé avec expertise à ${ville}

${desc}${client ? ' Le client, ' + client + ', nous a fait confiance pour mener ce projet du début à la fin.' : ''}${duree ? ' Les travaux ont été complétés en ' + duree + ', dans le respect des délais convenus.' : ''}${extra ? '\n\n' + extra : ''}

## Les détails du projet

${t.detail}

La résidence est maintenant ${t.resultat} — exactement ce que le client souhaitait obtenir.

## Pourquoi ce type de travaux est un investissement rentable

${sectionSpec}

${t.conseil}

## Notre approche sur chaque chantier

Chez Les Gestions Heúrēka, nous n'acceptons aucun compromis sur la qualité. Voici comment nous travaillons :

- **Évaluation initiale** : visite à domicile gratuite, prise de mesures et recommandations honnêtes
- **Devis détaillé** : tous les matériaux, délais et coûts sont précisés par écrit avant le début des travaux
- **Exécution soignée** : nos équipes sont formées, assurées et respectueuses de votre propriété
- **Contrôle qualité** : inspection finale avec le client avant la remise des clés
- **Garantie** : garantie main-d\'œuvre incluse sur tous nos projets

## Pourquoi choisir Les Gestions Heúrēka

- ✅ Entrepreneur général licencié RBQ ${COMPANY.rbq}
- ✅ Équipe d\'expérience en ${t.seoService}
- ✅ Soumission gratuite et sans obligation
- ✅ Communication transparente tout au long du projet
- ✅ Garantie main-d\'œuvre incluse
- ✅ Plus de 80 avis 5 étoiles sur Google

## Prêt à démarrer votre projet à ${ville}?

Contactez Les Gestions Heúrēka pour une visite et une soumission gratuite à domicile. Nous desservons ${villes}.

📞 **${COMPANY.tel}**
📧 **${COMPANY.courriel}**
🌐 **${COMPANY.site}**
📍 ${COMPANY.adresse}

---
*${COMPANY.nom} — Entrepreneur général licencié RBQ ${COMPANY.rbq} — ${COMPANY.region}*

**Méta-description SEO :** ${type} professionnelle à ${ville} par ${COMPANY.nom}. Entrepreneur licencié RBQ ${COMPANY.rbq}. Soumission gratuite. Desservant ${ville}, Saint-Jean-sur-Richelieu et toute la Montérégie. Appelez le ${COMPANY.tel}.`;
}

// ---- FICHE GALERIE ----
function buildGalleryCard(d, t) {
  const ville  = d.ville || 'Saint-Jean-sur-Richelieu';
  const type   = d.type  || 'Rénovation';
  const desc   = d.description || '';
  const duree  = d.duree || '';

  return `TITRE (SEO) :
${type} — ${ville} | ${COMPANY.nom}

DESCRIPTION LONGUE :
Ce projet de ${type.toLowerCase()} réalisé à ${ville} illustre le savoir-faire de l\'équipe des Gestions Heúrēka. ${desc ? desc + ' ' : ''}${duree ? 'Durée des travaux : ' + duree + '. ' : ''}La résidence est maintenant ${t.resultat}. Chaque détail a été soigné pour assurer ${t.avantage}. ${t.detail} ${COMPANY.nom}, entrepreneur général licencié RBQ ${COMPANY.rbq}, réalise des projets de ${t.seoService} dans toute la région de ${COMPANY.region}.

TEXTE ALTERNATIF (alt text) :
Photo ${type.toLowerCase()} maison ${ville} Québec — ${COMPANY.nom} entrepreneur général licencié RBQ ${COMPANY.rbq}

MOTS-CLÉS SEO :
${type.toLowerCase()} ${ville}, ${t.seoService} Montérégie, rénovation résidentielle Saint-Jean-sur-Richelieu, entrepreneur général licencié Québec, ${COMPANY.nom}, RBQ ${COMPANY.rbq}, ${COMPANY.tel}`;
}

// ---- EMAIL DEMANDE D'AVIS ----
function generateReviewEmail(clientData) {
  const prenom  = (clientData.nom || 'cher client').split(' ')[0];
  const typeStr = clientData.type ? clientData.type.toLowerCase() : 'rénovation';
  const villeStr = clientData.ville || 'votre région';

  return `Bonjour ${prenom},

Nous espérons que vous êtes pleinement satisfait des travaux de ${typeStr} réalisés à ${villeStr}!

Ce fut un réel plaisir de travailler pour vous. Toute notre équipe est fière du résultat livré et nous espérons que vous profitez pleinement de votre nouvelle rénovation.

Si vous avez deux minutes, un avis Google nous aiderait énormément à faire connaître notre entreprise à d'autres familles de la région. Ça prend moins de 2 minutes et c'est très précieux pour une entreprise locale comme la nôtre.

${GOOGLE_BUSINESS_LINK || 'Cherchez "Les Gestions Heúrēka" sur Google Maps pour laisser votre avis.'}

Si vous avez des questions ou des commentaires sur les travaux réalisés, n'hésitez pas à nous contacter directement :

📞 ${COMPANY.tel}
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}

Merci sincèrement de votre confiance. C'est grâce à des clients comme vous que notre entreprise continue de grandir dans la région de Saint-Jean-sur-Richelieu!

Au plaisir de travailler de nouveau ensemble,

L'équipe des Gestions Heúrēka
${COMPANY.adresse}
RBQ ${COMPANY.rbq}`;
}

// ---- CONTENU SAISONNIER ----
function generateSeasonalContentClaude(season, theme) {
  const currentSeason = season || getCurrentSeasonName();
  const id1 = generateId();
  const id2 = generateId();
  const id3 = generateId();
  const id4 = generateId();

  const pieces = {
    Printemps: [
      {
        id: id1, platform: 'Facebook', theme: 'Inspection post-hiver',
        content: `🌱 Le printemps est arrivé — et votre maison a peut-être besoin d'attention après un hiver difficile!

Après plusieurs mois de grand froid, de neige et de gel-dégel, certaines parties de votre maison peuvent avoir subi des dommages invisibles :

🔍 Portes et fenêtres : condensation entre les vitres, joints décollés ou courant d'air?
🔍 Revêtement extérieur : fissures, bulles ou infiltrations d'eau?
🔍 Calfeutrage et solins : joints détériorés qui laissent entrer l'humidité?

Notre équipe offre une inspection visuelle gratuite. On vous dit honnêtement ce qui doit être réparé — et ce qui peut attendre.

Profitez du printemps pour régler ces problèmes avant les grosses pluies de mai!

📞 ${COMPANY.tel}
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
📍 ${COMPANY.adresse}
🏆 Entrepreneur licencié RBQ ${COMPANY.rbq}

#Printemps #InspectionMaison #Renovation #GestionsHeureka #SaintJeanSurRichelieu #Quebec #EntretienMaison #PostHiver #Monteregie`
      },
      {
        id: id2, platform: 'Facebook', theme: 'Revêtement extérieur printemps',
        content: `🏠 Le printemps est LA meilleure saison pour rénover votre revêtement extérieur au Québec!

Pourquoi maintenant?
✅ Températures idéales pour la pose et l'adhésion des matériaux
✅ Séchage parfait du calfeutrage et du scellant
✅ Votre maison est prête avant les chaleurs de l'été
✅ Plus de disponibilité dans notre calendrier qu'à l'automne

Chez Les Gestions Heúrēka, nous posons des revêtements en vinyle, en fibrociment et en bois composite — des matériaux testés pour résister aux hivers québécois.

Chaque projet inclut : retrait de l'ancien revêtement, inspection de la structure, pare-air, revêtement et calfeutrage complet.

Résultat garanti pour 30 à 50 ans. Sans entretien annuel.

📞 ${COMPANY.tel} — Soumission gratuite à domicile
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
🏆 RBQ ${COMPANY.rbq}

#Printemps #RevetementExterieur #VinyleQuebec #GestionsHeureka #SaintJean #RenovationPrintemps #ExpertReno #Monteregie`
      },
      {
        id: id3, platform: 'TikTok', theme: 'Inspection printemps 3 points',
        content: `[ACCROCHE — 3 PREMIÈRES SECONDES]
Vérifiez ces 3 choses sur votre maison CE printemps. 🌿

[NARRATION — voix naturelle et québécoise]
Après un hiver québécois, votre maison a besoin d'une vérification rapide.

Point numéro 1 : vos fenêtres. Cherchez de la condensation ENTRE les deux vitres. Si vous en voyez, le sceau est brisé — votre fenêtre ne vous isole plus.

Point numéro 2 : votre revêtement extérieur. Passez la main le long des joints. Si vous sentez un espace ou si le vinyle est bombé, il y a de l'humidité en dessous.

Point numéro 3 : le calfeutrage autour de vos portes et fenêtres. S'il est craquelé ou décollé, l'eau entre dans le mur — et les dommages sont silencieux mais coûteux.

💡 Conseil de pro : si vous trouvez un de ces problèmes, appelez-nous avant les pluies de mai. Un petit problème réglé maintenant évite une grosse facture à l'automne.

Soumission gratuite — ${COMPANY.tel} — ${COMPANY.site}

[TEXTE À L'ÉCRAN]
1️⃣ Condensation entre les vitres → fenêtre à remplacer
2️⃣ Revêtement bombé → humidité dans le mur
3️⃣ Calfeutrage craquelé → eau qui entre
📞 ${COMPANY.tel}

[SON SUGGÉRÉ]
Musique informative légère, ton pédagogique et rassurant.

[HASHTAGS]
#Printemps #ConseilsMaison #InspectionMaison #Renovation #Quebec #GestionsHeureka #EntretienMaison #MaisonQuebec #ExpertReno`
      },
      {
        id: id4, platform: 'TikTok', theme: 'Agrandissement planifier maintenant',
        content: `[ACCROCHE — 3 PREMIÈRES SECONDES]
Vous voulez agrandir votre maison cet été? Il faut commencer MAINTENANT. 📐

[NARRATION — voix naturelle et québécoise]
Un agrandissement de maison, ça se planifie des mois à l'avance. Voici pourquoi.

Étape 1 : les plans. Un technicien ou architecte doit dessiner les plans selon le Code du bâtiment. Ça prend 2 à 4 semaines.

Étape 2 : le permis municipal. Selon votre ville, ça peut prendre de 2 à 6 semaines d'approbation.

Étape 3 : la construction. Un agrandissement typique prend 6 à 12 semaines selon la complexité.

Si vous commencez à planifier en mai, vous pouvez être installés dans votre nouvel espace en septembre.

Si vous attendez en juillet? C'est pour l'an prochain.

💡 Conseil de pro : un agrandissement bien planifié coûte 2 à 3 fois moins cher que de déménager dans une maison plus grande.

Appelez-nous maintenant pour commencer la planification : ${COMPANY.tel}

[TEXTE À L'ÉCRAN]
📐 Plans : 2-4 semaines
🏛️ Permis : 2-6 semaines
🔨 Construction : 6-12 semaines
👉 Commencez MAINTENANT pour cet été
📞 ${COMPANY.tel}

[SON SUGGÉRÉ]
Musique motivationnelle, rythme progressif qui monte.

[HASHTAGS]
#Agrandissement #PlanifierMaintenant #Renovation #Quebec #GestionsHeureka #PlusDEspace #MaisonQuebec #Construction`
      }
    ],
    Été: [
      {
        id: id1, platform: 'Facebook', theme: 'Construction de garage été',
        content: `☀️ L'été, c'est LA saison pour construire votre garage à Saint-Jean-sur-Richelieu!

Les conditions sont parfaites : températures idéales pour le béton, séchage rapide, pas de contraintes météo. Nos équipes peuvent travailler efficacement et livrer plus vite.

Ce qu'on inclut dans chaque construction de garage :
✅ Plans conformes au Code du bâtiment du Québec
✅ Permis municipal géré par notre équipe
✅ Dalle de béton armé avec évacuation d'eau
✅ Charpente en bois traité de qualité
✅ Isolation, parement extérieur assorti à la maison
✅ Porte sectionnelle et système d'éclairage

Garage simple ou double, détaché ou attenant — on s'adapte à votre terrain et à votre budget.

Délai moyen : 4 à 6 semaines. Réservez votre place maintenant pour avoir votre garage avant l'hiver!

📞 ${COMPANY.tel} — Soumission gratuite à domicile
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
📍 Saint-Jean-sur-Richelieu et environs
🏆 RBQ ${COMPANY.rbq}

#Été #ConstructionGarage #GarageDouble #GestionsHeureka #SaintJean #Quebec #ConstructionQuebec #Monteregie`
      },
      {
        id: id2, platform: 'Facebook', theme: 'Revêtement extérieur avant automne',
        content: `🏠 Vous pensez à refaire votre revêtement extérieur? Agissez maintenant — avant l'automne!

L'été offre une fenêtre idéale pour les travaux de parement extérieur. Les températures permettent une pose parfaite et vous profitez du résultat AVANT les premiers froids.

Pourquoi ne pas attendre à l'automne?
❄️ Les températures fraîches compliquent l'adhésion des matériaux
🍂 Notre calendrier est complet en septembre-octobre
⏳ Un projet mal planifié peut vous laisser sans protection avant l'hiver

Chez Les Gestions Heúrēka, chaque projet de revêtement inclut :
• Inspection complète de la structure existante
• Retrait de l'ancien parement et traitement si nécessaire
• Installation d'un pare-air homologué
• Pose du revêtement choisi avec joints et calfeutrage
• Garantie main-d'œuvre sur tous les travaux

📞 ${COMPANY.tel}
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
🏆 Entrepreneur licencié RBQ ${COMPANY.rbq}

#Été #RevetementExterieur #RenoExterieure #GestionsHeureka #SaintJean #Renovation #Quebec #Monteregie`
      },
      {
        id: id3, platform: 'TikTok', theme: 'Construction garage étapes',
        content: `[ACCROCHE — 3 PREMIÈRES SECONDES]
On construit un garage de A à Z. Voici toutes les étapes. 🏗️

[NARRATION — voix naturelle et québécoise]
Jour 1 : marquage du terrain et préparation de la fondation.

Jour 3 : coulée de la dalle de béton armé. On intègre la pente vers la porte dès maintenant — un détail que beaucoup d'entrepreneurs oublient.

Semaine 2 : charpente en bois traité, solins et structure du toit.

Semaine 3 : revêtement extérieur assorti à la maison, installation de la porte sectionnelle.

Semaine 4 : électricité, éclairage, finitions et nettoyage du chantier.

Livraison : 4 à 6 semaines selon la complexité.

💡 Conseil de pro : exigez une dalle de béton d'au moins 4 pouces d'épaisseur avec treillis métallique pour votre garage. C'est ce qui garantit la longévité du plancher.

📞 ${COMPANY.tel} — Soumission gratuite
🌐 ${COMPANY.site}

[TEXTE À L'ÉCRAN]
📅 Sem. 1 : Fondation + béton
🔨 Sem. 2 : Charpente
🏗️ Sem. 3 : Revêtement + porte
⚡ Sem. 4 : Électricité + finitions
✅ Livraison : 4-6 semaines
📞 ${COMPANY.tel}

[SON SUGGÉRÉ]
Son authentique de chantier + musique progressive.

[HASHTAGS]
#Été #ConstructionGarage #GarageQuebec #Construction #GestionsHeureka #Quebec #Renovation #Monteregie`
      },
      {
        id: id4, platform: 'TikTok', theme: 'Agrandissement en cours',
        content: `[ACCROCHE — 3 PREMIÈRES SECONDES]
Cette famille à Saint-Jean voulait plus d'espace. On leur a ajouté sans déménager. 📐

[NARRATION — voix naturelle et québécoise]
Agrandir sa maison plutôt que déménager — c'est souvent la décision la plus sage financièrement.

On a calculé pour cette famille : déménager dans une maison plus grande dans leur quartier leur aurait coûté environ 80 000 $ de plus (frais de notaire, frais d'agence, différentiel de prix).

L'agrandissement qu'on leur a fait : 45 000 $.

Résultat : ils gardent leur quartier, leur voisinage, l'école de leurs enfants — et ils ont l'espace dont ils avaient besoin.

💡 Conseil de pro : avant de planifier un agrandissement, vérifiez les règlements de zonage de votre municipalité. Certaines villes ont des restrictions sur le pourcentage d'occupation du terrain. On s'occupe de tout ça pour vous.

📞 ${COMPANY.tel}
🌐 ${COMPANY.site}

[TEXTE À L'ÉCRAN]
🏠 Déménager : +80 000 $
📐 Agrandir : 45 000 $
📍 Même quartier ✅
🏫 Même école ✅
👨‍👩‍👧‍👦 Même voisinage ✅
📞 ${COMPANY.tel}

[SON SUGGÉRÉ]
Musique chaleureuse et positive, ton humain.

[HASHTAGS]
#Été #Agrandissement #PlusDEspace #Renovation #Quebec #GestionsHeureka #MaisonQuebec #Famille`
      }
    ],
    Automne: [
      {
        id: id1, platform: 'Facebook', theme: 'Remplacement fenêtres avant hiver',
        content: `🍂 DERNIÈRE CHANCE avant l'hiver — remplacez vos fenêtres maintenant!

On pose des fenêtres jusqu'en novembre. Après ça, les températures rendent les travaux extérieurs très difficiles et risquent d'affecter la qualité de l'installation.

Signes que vos fenêtres doivent être remplacées CETTE année :
❄️ Vous sentez un courant d'air froid près des cadres
💧 De la condensation apparaît entre les deux vitres
💸 Votre facture de chauffage augmente chaque année
🔊 Le bruit de l'extérieur s'entend trop facilement

Des fenêtres certifiées ENERGY STAR peuvent réduire votre consommation de chauffage jusqu'à 30 %. Investissez maintenant et économisez cet hiver!

Nous avons encore quelques créneaux disponibles pour septembre et octobre. Premier arrivé, premier servi.

📞 ${COMPANY.tel} — Appelez maintenant pour votre soumission gratuite
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
📍 Saint-Jean-sur-Richelieu et environs
🏆 Entrepreneur licencié RBQ ${COMPANY.rbq}

#Automne #PortesEtFenetres #IsolationHiver #GestionsHeureka #SaintJean #Quebec #EnergyStar #EfficaciteEnergetique #Monteregie`
      },
      {
        id: id2, platform: 'Facebook', theme: 'Isolation étanchéité urgence',
        content: `🍂 L'automne est là — et l'hiver s'en vient vite. Votre maison est-elle prête?

Avant les premières neiges, voici les points critiques à vérifier :

🏠 REVÊTEMENT EXTÉRIEUR
Des fissures ou des joints ouverts dans votre parement laissent entrer l'eau, qui gèle et fait des dégâts importants. On peut réparer ou remplacer avant l'hiver.

🪟 PORTES ET FENÊTRES
Un joint brisé ou un sceau défaillant, c'est de l'argent qui s'envole par le froid. L'automne est le dernier moment pour remplacer avant les grands froids.

🔧 CALFEUTRAGE
Le tour de vos portes, fenêtres et coins de maison doit être inspecté chaque automne. Un calfeutrage sec et craquelé ne protège plus rien.

Notre équipe peut faire une inspection complète et vous donner une soumission honnête sur ce qui doit être réglé MAINTENANT versus ce qui peut attendre.

📞 ${COMPANY.tel} — Inspection gratuite
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
🏆 RBQ ${COMPANY.rbq}

#Automne #IsolationMaison #PreparationHiver #GestionsHeureka #SaintJean #Quebec #EntretienMaison #Monteregie`
      },
      {
        id: id3, platform: 'TikTok', theme: 'Dernière chance fenêtres automne',
        content: `[ACCROCHE — 3 PREMIÈRES SECONDES]
Vous pensez encore à vos fenêtres? C'est maintenant ou jamais. 🍂

[NARRATION — voix naturelle et québécoise]
On reçoit beaucoup d'appels en novembre de gens qui veulent faire remplacer leurs fenêtres avant l'hiver.

Le problème : à -5°C, on ne peut plus garantir la qualité de l'installation. Le calfeutrage et le scellant ne sèchent pas correctement. Et si on coupe l'ouverture dans le mur par temps froid — votre maison est ouverte sur l'extérieur pendant l'installation.

On pose des fenêtres jusqu'à la mi-novembre, selon les conditions météo. Après ça, on vous met sur la liste pour le printemps.

Si vos fenêtres laissent entrer le froid ce soir, appelez-nous demain matin.

💡 Conseil de pro : une seule fenêtre mal isolée peut forcer votre fournaise à travailler 15 % plus fort tout l'hiver. Faites le calcul avec votre facture de gaz.

📞 ${COMPANY.tel}
🌐 ${COMPANY.site}

[TEXTE À L'ÉCRAN]
🍂 Maintenant : installation parfaite ✅
🌨️ Novembre : selon météo ⚠️
❄️ Décembre : liste printemps ❌
📞 Appelez : ${COMPANY.tel}

[SON SUGGÉRÉ]
Musique d'automne légèrement urgente, ton informatif mais sans panique.

[HASHTAGS]
#Automne #Fenêtres #IsolationHiver #DernièreChance #GestionsHeureka #Quebec #EfficaciteEnergetique #Renovation`
      },
      {
        id: id4, platform: 'TikTok', theme: 'Planifier projets intérieurs hiver',
        content: `[ACCROCHE — 3 PREMIÈRES SECONDES]
L'hiver approche. C'est le bon moment pour planifier vos projets intérieurs. 🔨

[NARRATION — voix naturelle et québécoise]
Beaucoup de gens ne savent pas que l'hiver, c'est une excellente saison pour certains travaux de rénovation.

Sous-sol : isolation, plancher chauffant, finitions — parfait en hiver.
Salle de bain : rénovation complète, céramique, plomberie — disponibilité maximale.
Cuisine : armoires, comptoirs, éclairage — on peut planifier et livrer rapidement.
Agrandissement intérieur : cloisonnement, ajout de chambre — 100 % faisable.

En hiver, les entrepreneurs sont plus disponibles, les délais de soumission sont plus courts et vous pouvez magasiner vos matériaux sans pression.

💡 Conseil de pro : réservez votre projet intérieur en décembre ou janvier. Vous obtiendrez une meilleure disponibilité et parfois de meilleures conditions. En mai, notre agenda est déjà plein.

📞 ${COMPANY.tel}
🌐 ${COMPANY.site}

[TEXTE À L'ÉCRAN]
❄️ Hiver = meilleure disponibilité
✅ Sous-sol, salle de bain, cuisine
✅ Agrandissement intérieur
✅ Délais plus courts
📞 ${COMPANY.tel}

[SON SUGGÉRÉ]
Musique chaleureuse intérieur, ton positif et motivant.

[HASHTAGS]
#Automne #ProjetsIntérieurs #Hiver #Renovation #Quebec #GestionsHeureka #PlanifierMaintenant #RenovationQuebec`
      }
    ],
    Hiver: [
      {
        id: id1, platform: 'Facebook', theme: 'Projets intérieurs hiver',
        content: `❄️ L'hiver, c'est la saison parfaite pour les projets de rénovation INTÉRIEURS!

Pendant que dehors c'est le grand froid, notre équipe travaille à transformer votre espace intérieur. Et en hiver, vous bénéficiez d'avantages importants :

⏰ DISPONIBILITÉ : notre calendrier est plus ouvert qu'au printemps ou à l'automne
💰 DÉLAIS : soumissions et démarrage plus rapides
🛠️ TRANQUILLITÉ : travaux moins perturbants (on n'a pas besoin d'ouvrir sur l'extérieur)

Projets parfaits pour l'hiver :
✅ Rénovation complète de sous-sol
✅ Salle de bain : céramique, plomberie, vanité
✅ Cuisine : armoires, comptoirs, éclairage
✅ Cloisonnement et ajout de chambres
✅ Isolation intérieure et plancher chauffant

Commencez votre hiver avec un projet et finissez-le au printemps — prêt pour accueillir famille et amis!

📞 ${COMPANY.tel}
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
📍 ${COMPANY.adresse}
🏆 Entrepreneur licencié RBQ ${COMPANY.rbq}

#Hiver #RenovationInterieure #SousSol #SalleDeBain #GestionsHeureka #SaintJean #Quebec #Renovation #Monteregie`
      },
      {
        id: id2, platform: 'Facebook', theme: 'Planification printemps hiver',
        content: `❄️ Le secret pour avoir le meilleur entrepreneur au printemps? Réserver en HIVER.

Chaque année, en mars et avril, on reçoit des dizaines d'appels de propriétaires qui veulent commencer leurs travaux immédiatement. Résultat : les délais s'allongent, les prix montent et les meilleurs créneaux sont pris.

Ceux qui appellent en janvier et février?
✅ Premiers dans le calendrier au printemps
✅ Soumissions sans délai
✅ Temps de planifier correctement le projet
✅ Permis municipaux demandés à temps

Que vous planifiez un agrandissement, un revêtement extérieur, de nouvelles fenêtres ou une construction de garage — c'est maintenant qu'il faut appeler.

La soumission est gratuite. La visite est sans obligation. Et vous partez l'hiver l'esprit tranquille.

📞 ${COMPANY.tel} — Appelez dès maintenant
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
📍 Saint-Jean-sur-Richelieu et environs
🏆 RBQ ${COMPANY.rbq}

#Hiver #PlanificationPrintemps #Renovation #GestionsHeureka #SaintJean #Quebec #AgendaPlein #Monteregie #PrenezVotrePlace`
      },
      {
        id: id3, platform: 'TikTok', theme: 'Secret entrepreneur printemps',
        content: `[ACCROCHE — 3 PREMIÈRES SECONDES]
Le secret pour avoir le meilleur entrepreneur au printemps. ❄️

[NARRATION — voix naturelle et québécoise]
Chaque printemps, la même chose se passe.

En mars, les téléphones sonnent sans arrêt. Tout le monde veut commencer ses travaux. Les délais pour une soumission passent de 1 semaine à 3-4 semaines. Et les créneaux pour commencer? Ils sont déjà pris jusqu'en juillet.

Ceux qui nous ont appelés en janvier et en février?

Ils sont dans notre calendrier en avril et mai. Première neige fondue, premier marteau.

💡 Conseil de pro : si vous avez un projet extérieur pour le printemps — agrandissement, revêtement, fenêtres, garage — appelez votre entrepreneur en décembre ou janvier. Vous obtiendrez une meilleure disponibilité, des délais plus courts et parfois de meilleures conditions.

La soumission est gratuite. Ça ne coûte rien de planifier.

📞 ${COMPANY.tel}
🌐 ${COMPANY.site}

[TEXTE À L'ÉCRAN]
❄️ Janvier : appel → soumission rapide ✅
🌱 Mars : appel → délai 4 semaines ⚠️
☀️ Juin : appel → liste d'attente ❌
📞 Appelez maintenant : ${COMPANY.tel}

[SON SUGGÉRÉ]
Musique hivernale légère, ton conseil d'ami.

[HASHTAGS]
#Hiver #ConseilRenovation #PlanificationPrintemps #GestionsHeureka #Quebec #Renovation #EntrepreneurGeneral`
      },
      {
        id: id4, platform: 'TikTok', theme: 'Protection maison froid',
        content: `[ACCROCHE — 3 PREMIÈRES SECONDES]
3 choses à faire sur votre maison avant le grand froid. ❄️

[NARRATION — voix naturelle et québécoise]
L'hiver québécois est brutal. Voici comment protéger votre maison.

Numéro 1 : vérifiez vos joints de portes et fenêtres. Passez une allumette allumée le long du cadre par grand vent. Si la flamme bouge, vous avez une fuite d'air — et de l'argent qui s'envole.

Numéro 2 : dégagez vos évacuations de ventilation et de chauffe-eau. En hiver, le givre peut les bloquer et causer des retours de gaz dangereux.

Numéro 3 : isolez vos tuyaux dans les espaces non chauffés. Sous-sol non isolé, garage attenant, cabanon — les tuyaux qui gèlent peuvent éclater et causer des dégâts majeurs.

Ces 3 vérifications prennent 30 minutes. Elles peuvent vous éviter des milliers de dollars en dommages.

💡 Conseil de pro : si vous avez des doutes sur l'état de votre isolation ou de vos fenêtres, appelez-nous pour une inspection. On vous dira honnêtement ce qui est urgent.

📞 ${COMPANY.tel}
🌐 ${COMPANY.site}

[TEXTE À L'ÉCRAN]
1️⃣ Joints portes/fenêtres : test allumette
2️⃣ Évacuations : dégagées du givre
3️⃣ Tuyaux : isolés dans espaces froids
📞 Questions? ${COMPANY.tel}

[SON SUGGÉRÉ]
Musique hivernale, ton informatif et utile.

[HASHTAGS]
#Hiver #ProtectionMaison #ConseilsMaison #GrandFroid #GestionsHeureka #Quebec #EntretienMaison #MaisonQuebec`
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

// ---- RAPPORT MENSUEL ----
function analyzeMonthlyStats(stats, publications) {
  const fbViews = stats.facebookViews || 0;
  const ttViews = stats.tiktokViews || 0;
  const reviews = stats.newReviews || 0;
  const posts   = stats.postsPublished || publications.length;
  const leads   = stats.leads || 0;

  const analysis = `Résumé du mois ${stats.month}/${stats.year} — Les Gestions Heúrēka

📊 Publications : ${posts} posts publiés ce mois.
📱 Facebook : ${fbViews.toLocaleString('fr-CA')} vues. ${fbViews > 500 ? 'Bonne performance — continuez à publier régulièrement avec des photos avant/après.' : 'Pour augmenter la portée, publiez au moins 2 fois par semaine avec des photos de vos projets terminés.'}
🎵 TikTok : ${ttViews.toLocaleString('fr-CA')} vues. ${ttViews > 1000 ? 'Excellent — le format vidéo fonctionne bien pour votre niche rénovation.' : 'Le before/after et le day-in-the-life sont les formats qui performent le mieux en rénovation au Québec.'}
⭐ Nouveaux avis Google : ${reviews}. ${reviews > 0 ? 'Bravo! Continuez d\'envoyer des demandes d\'avis après chaque projet terminé.' : 'Pensez à envoyer une demande d\'avis à chaque client satisfait — utilisez la fonction "Avis Google" de l\'application.'}
🏠 Leads reçus : ${leads}. ${leads > 0 ? 'Ces leads sont précieux — suivez-les dans les 24 heures pour maximiser votre taux de conversion.' : 'Augmentez votre visibilité avec plus de contenu montrant vos projets récents.'}

${posts < 4 ? '⚠️ Vous avez publié moins de 4 fois ce mois. La régularité est la clé de la croissance — visez minimum 2 publications par semaine sur Facebook.' : '✅ Bonne régularité de publication ce mois — continuez sur cette lancée!'}`;

  const nextMonth = `Plan suggéré pour le mois prochain — Les Gestions Heúrēka :

1. 📅 Publier minimum 2x/semaine sur Facebook (mardi et jeudi, entre 17h et 19h — heures de pointe pour votre audience)
2. 🎵 Créer 1 TikTok before/after par projet terminé — c'est le format qui génère le plus d'engagement en rénovation
3. ⭐ Envoyer une demande d'avis Google à chaque client dans les 48h suivant la fin des travaux
4. 📸 Systématiser la prise de photos sur chaque chantier : avant le début, pendant les travaux et après la livraison
5. 🌿 Utiliser le contenu saisonnier disponible dans l'application pour rester pertinent toute l'année
6. 📞 Inclure toujours vos coordonnées complètes : ${COMPANY.tel} et ${COMPANY.courriel}`;

  return { analysis, nextMonthPlan: nextMonth };
}

// ---- PROMOTION ----
function generatePromotionClaude(data) {
  const nom     = data.name    || 'Promotion spéciale';
  const service = data.service || 'tous nos services';
  const offre   = data.offer   || 'offre exclusive';
  const valeur  = data.value   ? ` (jusqu'à ${data.value})` : '';
  const periode = data.startDate && data.endDate
    ? `\n📅 Valable du ${data.startDate} au ${data.endDate}.`
    : '';
  const msg = data.message ? `\n\n${data.message}` : '';

  const facebook = `🎉 ${nom} — Les Gestions Heúrēka!

Pour tout projet de ${service} réservé pendant cette période, profitez de :
✅ ${offre}${valeur}${periode}${msg}

Places limitées — notre agenda se remplit rapidement. Appelez-nous dès maintenant pour sécuriser votre place!

📞 ${COMPANY.tel}
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
📍 ${COMPANY.adresse}
🏆 Entrepreneur licencié RBQ ${COMPANY.rbq}
📍 Saint-Jean-sur-Richelieu et toute la Montérégie

#Promotion #${nom.replace(/[^a-zA-ZÀ-ÿ]/g, '')} #GestionsHeureka #Renovation #Quebec #SaintJean #OffreSpeciale #Monteregie`;

  const tiktok = `[ACCROCHE] ${nom} chez Les Gestions Heúrēka — places limitées! 🎉

[NARRATION]
${offre}${valeur} pour tout projet de ${service}.${periode}

Soumission gratuite et sans obligation. Appelez-nous ou visitez notre site.

📞 ${COMPANY.tel}
🌐 ${COMPANY.site}

[HASHTAGS] #Promo #${nom.replace(/[^a-zA-ZÀ-ÿ]/g, '')} #GestionsHeureka #Renovation #Quebec #OffreSpeciale`;

  const email = `Bonjour,

En tant qu'ancien client des Gestions Heúrēka, nous souhaitons vous informer en avant-première de notre ${nom}.

${offre}${valeur}.${periode}${msg}

Que ce soit pour un projet que vous planifiez depuis un moment ou pour des travaux urgents, c'est le bon moment pour nous contacter.

📞 ${COMPANY.tel}
📧 ${COMPANY.courriel}
🌐 ${COMPANY.site}
📍 ${COMPANY.adresse}

Soumission gratuite et sans obligation.

Merci de votre fidélité!

L'équipe des Gestions Heúrēka
RBQ ${COMPANY.rbq}`;

  return { facebook, tiktok, email };
}
