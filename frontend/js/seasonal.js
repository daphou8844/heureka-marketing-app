/* ============================================
   SEASONAL.JS — Contenu saisonnier
   ============================================ */

const Seasonal = (() => {
  const view = () => document.getElementById('view-seasonal');
  let currentContent = [];

  const SEASONS = {
    Printemps: {
      months: [3, 4, 5],
      icon: '🌱',
      color: '#22C55E',
      themes: ['Terrasses et balcons', 'Revêtement extérieur post-hiver', 'Fenêtres et portes', 'Nettoyage et réparations printanières'],
      services: ['Revêtement extérieur', 'Portes et fenêtres', 'Agrandissement']
    },
    Été: {
      months: [6, 7, 8],
      icon: '☀️',
      color: '#F59E0B',
      themes: ['Construction de garages', 'Agrandissements', 'Projets extérieurs', 'Avant la rentrée scolaire'],
      services: ['Agrandissement de maison', 'Construction de garage', 'Entrepreneur général']
    },
    Automne: {
      months: [9, 10, 11],
      icon: '🍂',
      color: '#F97316',
      themes: ['Isolation avant l\'hiver', 'Portes et fenêtres écoénergétiques', 'Revêtement extérieur', 'Avant les grands froids'],
      services: ['Portes et fenêtres', 'Revêtement extérieur', 'Agrandissement']
    },
    Hiver: {
      months: [12, 1, 2],
      icon: '❄️',
      color: '#60A5FA',
      themes: ['Projets intérieurs', 'Planification printemps', 'Promotions hiver', 'Rénovation sans interruption'],
      services: ['Entrepreneur général', 'Agrandissement']
    }
  };

  function getCurrentSeason() {
    const m = new Date().getMonth() + 1;
    return Object.entries(SEASONS).find(([, s]) => s.months.includes(m))?.[0] || 'Printemps';
  }

  function render(data = {}) {
    const currentSeason = getCurrentSeason();
    const season = SEASONS[currentSeason];
    currentContent = data.content || [];
    const content = currentContent;

    view().innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Contenu saisonnier</div>
          <div class="page-subtitle">Saison actuelle : ${season.icon} ${currentSeason}</div>
        </div>
        <button class="btn btn-primary" onclick="Seasonal.generateSeason('${currentSeason}')">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Générer pour ${currentSeason}
        </button>
      </div>

      <!-- Saisons selector -->
      <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap">
        ${Object.entries(SEASONS).map(([name, s]) => `
          <button class="btn ${name === currentSeason ? 'btn-primary' : 'btn-ghost'}"
            onclick="Seasonal.generateSeason('${name}')">
            ${s.icon} ${name}
          </button>
        `).join('')}
      </div>

      <!-- Saison actuelle -->
      <div class="card card-gold" style="margin-bottom:24px">
        <div class="card-header">
          <span class="card-title">${season.icon} ${currentSeason} — Thèmes recommandés</span>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px">
          ${season.themes.map(t => `
            <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;
              background:var(--black-soft);border:1px solid var(--black-border);border-radius:8px;
              font-size:13px;cursor:pointer" onclick="Seasonal.generateTheme('${t}')">
              <span style="color:${season.color}">→</span> ${t}
              <span class="tag tag-gold" style="margin-left:4px;font-size:10px">Générer</span>
            </div>
          `).join('')}
        </div>
        <div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">Services mis en avant :</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${season.services.map(s => `<span class="tag tag-gold">${s}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Suggestions mensuelles -->
      <div class="section-title">Idées de contenu — ce mois</div>
      <div class="grid-3" style="margin-bottom:24px">
        ${[
          { icon: '💡', title: 'Conseil pratique', desc: `Partagez un conseil ${currentSeason === 'Printemps' ? 'pour préparer votre maison au printemps' : currentSeason === 'Été' ? 'pour réussir vos projets d\'été' : currentSeason === 'Automne' ? 'pour préparer votre maison à l\'hiver' : 'pour planifier vos rénovations'}.` },
          { icon: '❓', title: 'Question aux abonnés', desc: 'Posez une question engageante pour stimuler les commentaires et la visibilité.' },
          { icon: '✅', title: 'Avant/Après', desc: 'Montrez une transformation récente avec une photo avant/après impactante.' },
          { icon: '🔥', title: 'Promotion saisonnière', desc: `Créez une offre spéciale ${currentSeason} pour stimuler les demandes.` },
          { icon: '📚', title: 'Fait intéressant', desc: 'Partagez une statistique ou un fait surprenant sur la rénovation au Québec.' },
          { icon: '🎬', title: 'Tournage TikTok', desc: 'Tournez un TikTok montrant votre équipe au travail — format "Day in the life".' }
        ].map(item => `
          <div class="card" style="cursor:pointer" onclick="Seasonal.generateIdea('${item.title}')">
            <div style="font-size:24px;margin-bottom:10px">${item.icon}</div>
            <div style="font-size:14px;font-weight:600;margin-bottom:6px">${item.title}</div>
            <div style="font-size:12.5px;color:var(--text-secondary)">${item.desc}</div>
            <div style="margin-top:12px">
              <span class="tag tag-gold">Cliquer pour générer</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Contenu saisonnier généré -->
      ${content.length > 0 ? `
        <div class="section-title">Contenu généré récemment</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${content.map(c => `
            <div class="content-block">
              <div class="content-block-header">
                <div class="content-block-title">${c.platform || 'Contenu'} — ${c.theme || ''}</div>
                <div style="display:flex;gap:8px">
                  <button class="btn btn-ghost btn-sm btn-copy"
                    onclick="App.copyToClipboard(\`${(c.content || '').replace(/`/g, '\\`')}\`, this)">
                    <i class="fa-solid fa-copy"></i> Copier
                  </button>
                  <button class="btn btn-icon btn-sm" style="color:var(--red)"
                    onclick="if(confirm('Supprimer ce contenu?')){Seasonal.deleteContent('${c.id}')}" title="Supprimer">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              <div class="content-block-body">
                <div class="content-text">${c.content || ''}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  }

  function deleteContent(id) {
    currentContent = currentContent.filter(c => c.id !== id);
    render({ content: currentContent });
    App.toast('Contenu supprimé avec succès', 'success');
  }

  async function generateSeason(season) {
    App.showLoading(`Génération du contenu ${season}...`);
    try {
      const result = await API.generateSeasonalContent(season);
      App.hideLoading();
      render({ content: result.content || [] });
      App.toast(`Contenu ${season} généré!`, 'success');
    } catch (err) {
      App.hideLoading();
      App.toast(`Erreur: ${err.message}`, 'error');
    }
  }

  async function generateTheme(theme) {
    App.showLoading(`Génération pour "${theme}"...`);
    try {
      const result = await API.generateSeasonalContent(null, theme);
      App.hideLoading();
      render({ content: result.content || [] });
      App.toast('Contenu généré!', 'success');
    } catch (err) {
      App.hideLoading();
      App.toast(`Erreur: ${err.message}`, 'error');
    }
  }

  async function generateIdea(idea) {
    App.showLoading(`Génération de "${idea}"...`);
    try {
      const result = await API.generateSeasonalContent(null, idea);
      App.hideLoading();
      render({ content: result.content || [] });
      App.toast('Idée générée!', 'success');
    } catch (err) {
      App.hideLoading();
      App.toast(`Erreur: ${err.message}`, 'error');
    }
  }

  async function init() {
    view().innerHTML = `<div class="empty-state"><div class="loading-spinner" style="width:40px;height:40px;border-top-color:var(--gold)"></div></div>`;
    try {
      const data = await API.getSeasonalContent();
      render(data);
    } catch (_) { render({}); }
  }

  return { init, generateSeason, generateTheme, generateIdea, deleteContent };
})();
