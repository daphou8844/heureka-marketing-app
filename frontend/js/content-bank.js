/* ============================================
   CONTENT-BANK.JS — Banque de contenu
   ============================================ */

const ContentBank = (() => {
  const view = () => document.getElementById('view-content-bank');
  let allContent = [];
  let filtered = [];
  let filterType = 'all';
  let filterPlatform = 'all';
  let filterStatus = 'all';
  let searchQuery = '';

  const PLATFORMS = ['all', 'Facebook', 'TikTok', 'Blogue', 'Galerie'];
  const STATUSES = ['all', 'Brouillon', 'Planifié', 'Publié'];
  const TYPES = ['all', 'Portes et fenêtres', 'Revêtement extérieur', 'Agrandissement', 'Garage', 'Entrepreneur général'];

  function applyFilters() {
    filtered = allContent.filter(c => {
      if (filterPlatform !== 'all' && c.platform !== filterPlatform) return false;
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      if (filterType !== 'all' && c.type !== filterType) return false;
      if (searchQuery && !c.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.preview?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    renderTable();
  }

  function renderTable() {
    const tableDiv = document.getElementById('content-table');
    if (!tableDiv) return;

    if (filtered.length === 0) {
      tableDiv.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-layer-group"></i>
          <h3>Aucun contenu trouvé</h3>
          <p>Générez du contenu depuis l'onglet "Générateur"</p>
          <button class="btn btn-primary" onclick="App.navigate('generator')">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Générer du contenu
          </button>
        </div>
      `;
      return;
    }

    tableDiv.innerHTML = `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type de projet</th>
              <th>Ville</th>
              <th>Plateforme</th>
              <th>Aperçu</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(c => `
              <tr>
                <td style="white-space:nowrap">${App.formatDate(c.date)}</td>
                <td>${c.type || '—'}</td>
                <td>${c.ville || '—'}</td>
                <td>
                  <span class="tag ${c.platform === 'Facebook' ? 'tag-blue' : c.platform === 'TikTok' ? 'tag-gold' : c.platform === 'Blogue' ? 'tag-green' : 'tag-gray'}">
                    ${c.platform || '—'}
                  </span>
                </td>
                <td style="max-width:280px">
                  <div style="font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-secondary)">
                    ${(c.preview || '').substring(0, 80)}${(c.preview || '').length > 80 ? '…' : ''}
                  </div>
                </td>
                <td>
                  <select class="form-control" style="padding:4px 8px;width:auto"
                    onchange="ContentBank.updateStatus('${c.id}', this.value)">
                    ${STATUSES.slice(1).map(s => `<option value="${s}" ${c.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                  </select>
                </td>
                <td>
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    <button class="btn btn-icon" title="Voir" onclick="ContentBank.viewContent('${c.id}')">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn btn-icon btn-copy" title="Copier" onclick="ContentBank.copyContent('${c.id}', this)">
                      <i class="fa-solid fa-copy"></i>
                    </button>
                    <button class="btn btn-icon" title="Planifier calendrier" onclick="Calendar.openScheduler()">
                      <i class="fa-solid fa-calendar-plus"></i>
                    </button>
                    ${c.platform === 'Facebook' && c.status !== 'Planifié dans Metricool' ? `
                      <button class="btn btn-icon" title="Planifier dans Metricool"
                        onclick="ContentBank.openMetricoolScheduler('${c.id}')"
                        style="color:#4267B2;border-color:rgba(66,103,178,0.4)"
                        title="Envoyer à Metricool → Facebook">
                        <i class="fa-brands fa-facebook"></i>
                      </button>
                    ` : ''}
                    <button class="btn btn-icon" title="Supprimer" onclick="ContentBank.deleteContent('${c.id}')">
                      <i class="fa-solid fa-trash" style="color:var(--red)"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function viewContent(id) {
    const c = allContent.find(x => x.id === id);
    if (!c) return;
    App.showModal({
      title: `${c.platform} — ${c.type || 'Contenu'}`,
      subtitle: `${c.ville || ''} · ${App.formatDate(c.date)}`,
      size: 'lg',
      body: `
        <div class="content-text" style="white-space:pre-wrap;line-height:1.7">${c.fullContent || c.preview || 'Aucun contenu'}</div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="App.closeModal()">Fermer</button>
        <button class="btn btn-primary btn-copy" onclick="App.copyToClipboard(\`${(c.fullContent || '').replace(/`/g, '\\`')}\`, this)">
          <i class="fa-solid fa-copy"></i> Copier
        </button>
      `
    });
  }

  function copyContent(id, btn) {
    const c = allContent.find(x => x.id === id);
    if (!c) return;
    App.copyToClipboard(c.fullContent || c.preview || '', btn);
  }

  function openMetricoolScheduler(id) {
    const c = allContent.find(x => x.id === id);
    if (!c) return;
    const text = c.fullContent || c.preview || '';
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const dateMin = new Date().toISOString().split('T')[0];
    const dateDefault = tomorrow.toISOString().split('T')[0];

    App.showModal({
      title: 'Planifier dans Metricool',
      subtitle: 'Le post sera envoyé à Metricool → publié automatiquement sur Facebook',
      body: `
        <div style="padding:10px 14px;background:rgba(66,103,178,0.08);border:1px solid rgba(66,103,178,0.25);
          border-radius:8px;margin-bottom:16px;font-size:13px">
          <i class="fa-brands fa-facebook" style="color:#4267B2"></i>
          <strong style="color:#4267B2"> Facebook — Les Gestions Heúrēka</strong>
        </div>
        <div class="form-group">
          <label class="form-label">Aperçu du contenu</label>
          <div style="background:var(--black-soft);border:1px solid var(--black-border);border-radius:8px;
            padding:12px;font-size:13px;line-height:1.6;max-height:150px;overflow-y:auto;color:var(--text-secondary)">
            ${text.substring(0, 300)}${text.length > 300 ? '…' : ''}
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date de publication</label>
            <input type="date" class="form-control" id="mc-date" min="${dateMin}" value="${dateDefault}">
          </div>
          <div class="form-group">
            <label class="form-label">Heure</label>
            <select class="form-control" id="mc-time">
              <option value="08:00">08h00</option>
              <option value="09:00">09h00</option>
              <option value="12:00">12h00</option>
              <option value="17:00" selected>17h00</option>
              <option value="18:00">18h00</option>
              <option value="19:00">19h00</option>
              <option value="20:00">20h00</option>
            </select>
          </div>
        </div>
        ${c.photoUrl || c.imageUrl ? `
          <div class="form-group">
            <label class="form-label">Image jointe</label>
            <img src="${c.photoUrl || c.imageUrl}" style="width:100%;max-height:140px;object-fit:cover;border-radius:8px">
          </div>
        ` : ''}
        <div style="font-size:12px;color:var(--text-muted)">
          <i class="fa-solid fa-envelope"></i> Un email de confirmation vous sera envoyé après la planification.
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="App.closeModal()">Annuler</button>
        <button class="btn btn-primary" onclick="ContentBank.confirmMetricool('${id}')">
          <i class="fa-brands fa-facebook"></i> Envoyer à Metricool
        </button>
      `
    });
  }

  async function confirmMetricool(id) {
    const c = allContent.find(x => x.id === id);
    if (!c) return;
    const date = document.getElementById('mc-date').value;
    const time = document.getElementById('mc-time').value;
    if (!date) { App.toast('Choisissez une date', 'error'); return; }

    const scheduledDate = `${date}T${time}:00`;
    const text = c.fullContent || c.preview || '';
    const imageUrl = c.photoUrl || c.imageUrl || null;

    App.closeModal();
    App.showLoading('Envoi à Metricool...');
    try {
      await API.scheduleMetricool(c.id, text, scheduledDate, imageUrl);
      App.hideLoading();
      c.status = 'Planifié dans Metricool';
      applyFilters();
      App.toast('✅ Post envoyé à Metricool! Email de confirmation envoyé.', 'success');
    } catch (err) {
      App.hideLoading();
      App.toast(`Erreur Metricool: ${err.message}`, 'error');
    }
  }

  async function updateStatus(id, status) {
    try {
      await API.updateContentStatus(id, status);
      const c = allContent.find(x => x.id === id);
      if (c) c.status = status;
      App.toast(`Statut mis à jour: ${status}`, 'success');
    } catch (err) { App.toast(err.message, 'error'); }
  }

  async function deleteContent(id) {
    if (!confirm('Supprimer ce contenu définitivement?')) return;
    try {
      await API.deleteContent(id);
      allContent = allContent.filter(c => c.id !== id);
      applyFilters();
      App.toast('Contenu supprimé', 'success');
    } catch (err) { App.toast(err.message, 'error'); }
  }

  function renderLayout() {
    view().innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Banque de contenu</div>
          <div class="page-subtitle">${allContent.length} éléments au total</div>
        </div>
        <button class="btn btn-primary" onclick="App.navigate('generator')">
          <i class="fa-solid fa-plus"></i> Nouveau contenu
        </button>
      </div>

      <!-- Stats rapides -->
      <div class="grid-4" style="margin-bottom:20px">
        ${[
          { label: 'Brouillons', val: allContent.filter(c => c.status === 'Brouillon').length, tag: 'tag-gray' },
          { label: 'Planifiés', val: allContent.filter(c => c.status === 'Planifié').length, tag: 'tag-blue' },
          { label: 'Publiés', val: allContent.filter(c => c.status === 'Publié').length, tag: 'tag-green' },
          { label: 'Ce mois', val: allContent.filter(c => {
            const d = new Date(c.date);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length, tag: 'tag-gold' }
        ].map(s => `
          <div class="stat-card">
            <div class="stat-label">${s.label}</div>
            <div class="stat-value">${s.val}</div>
          </div>
        `).join('')}
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-input" style="min-width:220px">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" class="form-control" placeholder="Rechercher..."
            oninput="ContentBank.search(this.value)">
        </div>
        <select class="form-control" style="width:auto" onchange="ContentBank.filterBy('platform', this.value)">
          ${PLATFORMS.map(p => `<option value="${p}">${p === 'all' ? 'Toutes plateformes' : p}</option>`).join('')}
        </select>
        <select class="form-control" style="width:auto" onchange="ContentBank.filterBy('status', this.value)">
          ${STATUSES.map(s => `<option value="${s}">${s === 'all' ? 'Tous statuts' : s}</option>`).join('')}
        </select>
        <select class="form-control" style="width:auto" onchange="ContentBank.filterBy('type', this.value)">
          ${TYPES.map(t => `<option value="${t}">${t === 'all' ? 'Tous les types' : t}</option>`).join('')}
        </select>
      </div>

      <div id="content-table"></div>
    `;
    applyFilters();
  }

  function search(q) { searchQuery = q; applyFilters(); }
  function filterBy(key, val) {
    if (key === 'platform') filterPlatform = val;
    if (key === 'status') filterStatus = val;
    if (key === 'type') filterType = val;
    applyFilters();
  }

  async function init() {
    view().innerHTML = `<div class="empty-state"><div class="loading-spinner" style="width:40px;height:40px;border-top-color:var(--gold)"></div><p>Chargement...</p></div>`;
    try {
      const result = await API.getContent();
      allContent = result.content || [];
      filtered = [...allContent];
      renderLayout();
    } catch (_) {
      allContent = [];
      filtered = [];
      renderLayout();
    }
  }

  return { init, search, filterBy, viewContent, copyContent, updateStatus, deleteContent, openMetricoolScheduler, confirmMetricool };
})();
