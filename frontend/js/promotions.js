/* ============================================
   PROMOTIONS.JS — Promotions saisonnières
   ============================================ */

const Promotions = (() => {
  const view = () => document.getElementById('view-promotions');
  let promotions = [];

  const PROMO_TEMPLATES = [
    { name: 'Spécial Printemps', season: 'Printemps', icon: '🌱', services: ['Revêtement extérieur', 'Portes et fenêtres'] },
    { name: 'Été Construction', season: 'Été', icon: '☀️', services: ['Construction de garage', 'Agrandissement'] },
    { name: 'Avant l\'Hiver', season: 'Automne', icon: '🍂', services: ['Portes et fenêtres', 'Isolation'] },
    { name: 'Planification Hiver', season: 'Hiver', icon: '❄️', services: ['Entrepreneur général'] }
  ];

  function render(data) {
    promotions = data.promotions || [];

    view().innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Promotions saisonnières</div>
          <div class="page-subtitle">Générateur de campagnes complètes</div>
        </div>
        <button class="btn btn-primary" onclick="Promotions.openCreator()">
          <i class="fa-solid fa-plus"></i> Nouvelle promotion
        </button>
      </div>

      <!-- Templates rapides -->
      <div class="section-title">Modèles de promotions</div>
      <div class="grid-4" style="margin-bottom:24px">
        ${PROMO_TEMPLATES.map(t => `
          <div class="card" style="cursor:pointer;text-align:center;padding:24px"
            onclick="Promotions.generateFromTemplate('${t.name}')">
            <div style="font-size:32px;margin-bottom:10px">${t.icon}</div>
            <div style="font-size:14px;font-weight:700;margin-bottom:6px">${t.name}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px">
              ${t.services.join(', ')}
            </div>
            <span class="tag tag-gold">Générer</span>
          </div>
        `).join('')}
      </div>

      <!-- Promotions créées -->
      <div class="section-title">Promotions créées</div>
      ${promotions.length > 0 ? `
        <div style="display:flex;flex-direction:column;gap:16px">
          ${promotions.map(p => `
            <div class="card">
              <div class="card-header">
                <div>
                  <div style="font-size:15px;font-weight:700">${p.name}</div>
                  <div style="font-size:12px;color:var(--text-muted);margin-top:2px">
                    ${App.formatDate(p.startDate)} → ${App.formatDate(p.endDate)}
                  </div>
                </div>
                <div style="display:flex;gap:8px;align-items:center">
                  <span class="tag ${p.status === 'Active' ? 'tag-green' : p.status === 'Planifiée' ? 'tag-blue' : 'tag-gray'}">
                    ${p.status || 'Brouillon'}
                  </span>
                </div>
              </div>

              <div class="grid-3" style="margin-top:8px">
                ${p.facebook ? `
                  <div style="padding:12px;background:var(--black-soft);border-radius:6px">
                    <div style="font-size:11px;font-weight:600;color:#60A5FA;margin-bottom:6px">
                      <i class="fa-brands fa-facebook"></i> Facebook
                    </div>
                    <div style="font-size:12px;color:var(--text-secondary);line-height:1.5">
                      ${(p.facebook || '').substring(0, 100)}…
                    </div>
                  </div>
                ` : '<div></div>'}

                ${p.tiktok ? `
                  <div style="padding:12px;background:var(--black-soft);border-radius:6px">
                    <div style="font-size:11px;font-weight:600;color:var(--gold);margin-bottom:6px">
                      <i class="fa-brands fa-tiktok"></i> TikTok
                    </div>
                    <div style="font-size:12px;color:var(--text-secondary);line-height:1.5">
                      ${(p.tiktok || '').substring(0, 100)}…
                    </div>
                  </div>
                ` : '<div></div>'}

                ${p.email ? `
                  <div style="padding:12px;background:var(--black-soft);border-radius:6px">
                    <div style="font-size:11px;font-weight:600;color:var(--green);margin-bottom:6px">
                      <i class="fa-solid fa-envelope"></i> Email client
                    </div>
                    <div style="font-size:12px;color:var(--text-secondary);line-height:1.5">
                      ${(p.email || '').substring(0, 100)}…
                    </div>
                  </div>
                ` : '<div></div>'}
              </div>

              <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn btn-ghost btn-sm" onclick="Promotions.viewPromo('${p.id}')">
                  <i class="fa-solid fa-eye"></i> Voir tout
                </button>
                <button class="btn btn-ghost btn-sm" onclick="App.copyToClipboard('${(p.facebook || '').replace(/'/g, "\\'")}')">
                  <i class="fa-solid fa-copy"></i> Copier Facebook
                </button>
                <button class="btn btn-ghost btn-sm" onclick="App.copyToClipboard('${(p.tiktok || '').replace(/'/g, "\\'")}')">
                  <i class="fa-brands fa-tiktok"></i> Copier TikTok
                </button>
                <button class="btn btn-icon btn-sm" style="color:var(--red);margin-left:auto"
                  onclick="if(confirm('Supprimer cette promotion définitivement?')){Promotions.deletePromo('${p.id}')}" title="Supprimer">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <i class="fa-solid fa-tags"></i>
          <h3>Aucune promotion créée</h3>
          <p>Générez une campagne complète en quelques secondes</p>
        </div>
      `}
    `;
  }

  function openCreator(template = null) {
    App.showModal({
      title: 'Créer une promotion',
      subtitle: 'Gemini génère le post Facebook, le script TikTok et l\'email client',
      body: `
        <div class="form-group">
          <label class="form-label">Nom de la promotion</label>
          <input type="text" class="form-control" id="promo-name"
            value="${template || ''}" placeholder="Ex: Spécial Printemps 2025">
        </div>
        <div class="form-group">
          <label class="form-label">Service mis en avant</label>
          <select class="form-control" id="promo-service">
            <option value="">Tous les services</option>
            <option>Portes et fenêtres</option>
            <option>Revêtement extérieur</option>
            <option>Agrandissement de maison</option>
            <option>Construction de garage</option>
            <option>Entrepreneur général</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Offre / Remise</label>
            <input type="text" class="form-control" id="promo-offer"
              placeholder="Ex: 10% de rabais, soumission gratuite...">
          </div>
          <div class="form-group">
            <label class="form-label">Valeur max (optionnel)</label>
            <input type="text" class="form-control" id="promo-value"
              placeholder="Ex: jusqu'à 500$">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date de début</label>
            <input type="date" class="form-control" id="promo-start">
          </div>
          <div class="form-group">
            <label class="form-label">Date de fin</label>
            <input type="date" class="form-control" id="promo-end">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Message clé (optionnel)</label>
          <textarea class="form-control" id="promo-msg" rows="2"
            placeholder="Ex: Idéal avant l'hiver, places limitées..."></textarea>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${['Post Facebook', 'Script TikTok', 'Email client'].map(opt => `
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;
              padding:6px 12px;background:var(--black-soft);border:1px solid var(--black-border);
              border-radius:6px;font-size:12.5px;color:var(--text-secondary)">
              <input type="checkbox" checked style="accent-color:var(--gold)"> ${opt}
            </label>
          `).join('')}
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="App.closeModal()">Annuler</button>
        <button class="btn btn-primary" onclick="Promotions.generate()">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Générer la campagne
        </button>
      `
    });
  }

  async function generate() {
    const data = {
      name: document.getElementById('promo-name').value,
      service: document.getElementById('promo-service').value,
      offer: document.getElementById('promo-offer').value,
      value: document.getElementById('promo-value').value,
      startDate: document.getElementById('promo-start').value,
      endDate: document.getElementById('promo-end').value,
      message: document.getElementById('promo-msg').value
    };
    if (!data.name || !data.offer) { App.toast('Nom et offre requis', 'error'); return; }
    App.showLoading('Génération de la campagne promotionnelle...');
    App.closeModal();
    try {
      const result = await API.generatePromotion(data);
      App.hideLoading();
      promotions.unshift(result.promotion);
      render({ promotions });
      App.toast('Campagne générée!', 'success');
    } catch (err) {
      App.hideLoading();
      App.toast(err.message, 'error');
    }
  }

  async function deletePromo(id) {
    try {
      await API.deleteContent(id);
      promotions = promotions.filter(p => p.id !== id);
      render({ promotions });
      App.toast('Promotion supprimée avec succès', 'success');
    } catch (err) { App.toast(err.message, 'error'); }
  }

  async function generateFromTemplate(templateName) {
    openCreator(templateName);
  }

  function viewPromo(id) {
    const p = promotions.find(x => x.id === id);
    if (!p) return;
    App.showModal({
      title: p.name,
      size: 'lg',
      body: `
        <div style="display:flex;flex-direction:column;gap:16px">
          ${p.facebook ? `
            <div class="content-block">
              <div class="content-block-header">
                <div class="content-block-title"><i class="fa-brands fa-facebook" style="color:#60A5FA"></i> Facebook</div>
                <button class="btn btn-ghost btn-sm btn-copy" onclick="App.copyToClipboard(this.closest('.content-block').querySelector('.content-text').textContent, this)">
                  <i class="fa-solid fa-copy"></i> Copier
                </button>
              </div>
              <div class="content-block-body"><div class="content-text">${p.facebook}</div></div>
            </div>
          ` : ''}
          ${p.tiktok ? `
            <div class="content-block">
              <div class="content-block-header">
                <div class="content-block-title"><i class="fa-brands fa-tiktok" style="color:var(--gold)"></i> TikTok</div>
                <button class="btn btn-ghost btn-sm btn-copy" onclick="App.copyToClipboard(this.closest('.content-block').querySelector('.content-text').textContent, this)">
                  <i class="fa-solid fa-copy"></i> Copier
                </button>
              </div>
              <div class="content-block-body"><div class="content-text">${p.tiktok}</div></div>
            </div>
          ` : ''}
          ${p.email ? `
            <div class="content-block">
              <div class="content-block-header">
                <div class="content-block-title"><i class="fa-solid fa-envelope" style="color:var(--green)"></i> Email client</div>
                <button class="btn btn-ghost btn-sm btn-copy" onclick="App.copyToClipboard(this.closest('.content-block').querySelector('.content-text').textContent, this)">
                  <i class="fa-solid fa-copy"></i> Copier
                </button>
              </div>
              <div class="content-block-body"><div class="content-text">${p.email}</div></div>
            </div>
          ` : ''}
        </div>
      `,
      footer: `<button class="btn btn-ghost" onclick="App.closeModal()">Fermer</button>`
    });
  }

  async function init() {
    view().innerHTML = `<div class="empty-state"><div class="loading-spinner" style="width:40px;height:40px;border-top-color:var(--gold)"></div></div>`;
    try {
      const data = await API.getPromotions();
      render(data);
    } catch (_) { render({}); }
  }

  return { init, openCreator, generate, generateFromTemplate, viewPromo, deletePromo };
})();
