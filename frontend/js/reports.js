/* ============================================
   REPORTS.JS — Rapport mensuel
   ============================================ */

const Reports = (() => {
  const view = () => document.getElementById('view-reports');
  const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth() + 1;
  let reportData = null;

  function render(data = {}) {
    reportData = data;
    const analysis = data.analysis || '';
    const plan = data.nextMonthPlan || '';
    const stats = data.stats || {};

    view().innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Rapport mensuel</div>
          <div class="page-subtitle">Généré automatiquement le 1er de chaque mois</div>
        </div>
        <div style="display:flex;gap:10px">
          <select class="form-control" style="width:auto" onchange="Reports.changeMonth(this.value)">
            ${MONTHS_FR.map((m, i) => `
              <option value="${i + 1}" ${i + 1 === currentMonth ? 'selected' : ''}>${m} ${currentYear}</option>
            `).join('')}
          </select>
          <button class="btn btn-ghost" onclick="Reports.changeYear(-1)">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button class="btn btn-ghost" onclick="Reports.changeYear(1)">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
          <button class="btn btn-primary" onclick="Reports.openStatsEntry()">
            <i class="fa-solid fa-keyboard"></i> Saisir statistiques
          </button>
        </div>
      </div>

      <!-- Saisie stats mensuelle -->
      <div class="card card-gold" style="margin-bottom:24px">
        <div class="card-header">
          <span class="card-title">📊 Statistiques — ${MONTHS_FR[currentMonth - 1]} ${currentYear}</span>
          <button class="btn btn-ghost btn-sm" onclick="Reports.openStatsEntry()">
            <i class="fa-solid fa-pen"></i> Modifier
          </button>
        </div>
        <div class="grid-4">
          ${[
            { label: 'Vues Facebook', val: stats.facebookViews || '—', icon: 'fa-brands fa-facebook', color: '#60A5FA' },
            { label: 'Vues TikTok', val: stats.tiktokViews || '—', icon: 'fa-brands fa-tiktok', color: 'var(--gold)' },
            { label: 'Nouveaux avis', val: stats.newReviews || '—', icon: 'fa-solid fa-star', color: '#FCD34D' },
            { label: 'Posts publiés', val: stats.postsPublished || '—', icon: 'fa-solid fa-share-nodes', color: 'var(--green)' }
          ].map(s => `
            <div style="text-align:center;padding:12px">
              <i class="${s.icon}" style="font-size:22px;color:${s.color};margin-bottom:8px;display:block"></i>
              <div style="font-size:24px;font-weight:800;color:var(--text-primary)">${s.val}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Analyse Claude -->
      ${analysis ? `
        <div class="section-title">🤖 Analyse Claude IA</div>
        <div class="content-block" style="margin-bottom:24px">
          <div class="content-block-body">
            <div class="content-text" style="line-height:1.8">${analysis}</div>
          </div>
        </div>
      ` : `
        <div class="card" style="margin-bottom:24px;text-align:center;padding:32px">
          <div style="font-size:24px;margin-bottom:12px">🤖</div>
          <div style="font-size:14px;font-weight:600;color:var(--text-secondary)">Aucune analyse pour ce mois</div>
          <div style="font-size:12px;color:var(--text-muted);margin:8px 0 16px">
            Saisissez vos statistiques pour que Claude génère l'analyse
          </div>
          <button class="btn btn-primary" onclick="Reports.openStatsEntry()">
            <i class="fa-solid fa-keyboard"></i> Saisir mes statistiques
          </button>
        </div>
      `}

      <!-- Plan mois prochain -->
      ${plan ? `
        <div class="section-title">📅 Plan de contenu suggéré — ${MONTHS_FR[currentMonth % 12]} ${currentMonth === 12 ? currentYear + 1 : currentYear}</div>
        <div class="content-block" style="margin-bottom:24px">
          <div class="content-block-body">
            <div class="content-text" style="line-height:1.8">${plan}</div>
          </div>
        </div>
      ` : ''}

      <!-- Résumé publications -->
      <div class="section-title">Publications du mois</div>
      <div class="card">
        ${data.publications && data.publications.length > 0 ? `
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>Date</th><th>Plateforme</th><th>Type</th><th>Statut</th><th></th></tr>
              </thead>
              <tbody>
                ${data.publications.map(p => `
                  <tr>
                    <td>${App.formatDate(p.date)}</td>
                    <td><span class="tag ${p.platform === 'Facebook' ? 'tag-blue' : 'tag-gold'}">${p.platform}</span></td>
                    <td>${p.type || '—'}</td>
                    <td><span class="tag tag-green">${p.status || 'Publié'}</span></td>
                    <td>
                      ${p.id ? `<button class="btn btn-icon" title="Supprimer" style="color:var(--red)"
                        onclick="if(confirm('Supprimer cette publication définitivement?')){Reports.deletePublication('${p.id}')}">
                        <i class="fa-solid fa-trash"></i>
                      </button>` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="empty-state" style="padding:32px">
            <i class="fa-solid fa-chart-line"></i>
            <p>Aucune publication pour ce mois</p>
          </div>
        `}
      </div>

      <!-- Export PDF -->
      <div style="margin-top:24px;text-align:center">
        <button class="btn btn-ghost" onclick="Reports.exportPDF()">
          <i class="fa-solid fa-file-pdf"></i> Exporter en PDF
        </button>
      </div>
    `;
  }

  function openStatsEntry() {
    const s = reportData?.stats || {};
    App.showModal({
      title: `Statistiques — ${MONTHS_FR[currentMonth - 1]} ${currentYear}`,
      subtitle: 'Saisissez vos statistiques du mois (1x par mois)',
      body: `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label"><i class="fa-brands fa-facebook" style="color:#60A5FA"></i> Vues Facebook</label>
            <input type="number" class="form-control" id="stat-fb" placeholder="0" value="${s.facebookViews || ''}">
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fa-brands fa-tiktok" style="color:var(--gold)"></i> Vues TikTok</label>
            <input type="number" class="form-control" id="stat-tt" placeholder="0" value="${s.tiktokViews || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nouveaux abonnés Facebook</label>
            <input type="number" class="form-control" id="stat-fb-subs" placeholder="0" value="${s.facebookFollowers || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Nouveaux abonnés TikTok</label>
            <input type="number" class="form-control" id="stat-tt-subs" placeholder="0" value="${s.tiktokFollowers || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nouveaux avis Google</label>
            <input type="number" class="form-control" id="stat-reviews" placeholder="0" value="${s.newReviews || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Leads reçus ce mois</label>
            <input type="number" class="form-control" id="stat-leads" placeholder="0" value="${s.leads || ''}">
          </div>
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="App.closeModal()">Annuler</button>
        <button class="btn btn-primary" onclick="Reports.saveStats()">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Sauvegarder et analyser avec Claude
        </button>
      `
    });
  }

  async function saveStats() {
    App.showLoading('Claude analyse vos statistiques du mois...');
    App.closeModal();
    try {
      const stats = {
        year: currentYear, month: currentMonth,
        facebookViews: parseInt(document.getElementById('stat-fb')?.value) || 0,
        tiktokViews: parseInt(document.getElementById('stat-tt')?.value) || 0,
        facebookFollowers: parseInt(document.getElementById('stat-fb-subs')?.value) || 0,
        tiktokFollowers: parseInt(document.getElementById('stat-tt-subs')?.value) || 0,
        newReviews: parseInt(document.getElementById('stat-reviews')?.value) || 0,
        leads: parseInt(document.getElementById('stat-leads')?.value) || 0
      };
      const result = await API.saveStats(stats);
      App.hideLoading();
      render(result.report || { stats });
      App.toast('Statistiques sauvegardées et rapport généré!', 'success');
    } catch (err) {
      App.hideLoading();
      App.toast(err.message, 'error');
    }
  }

  async function deletePublication(id) {
    try {
      await API.deleteContent(id);
      App.toast('Contenu supprimé avec succès', 'success');
      await loadAndRender();
    } catch (err) { App.toast(err.message, 'error'); }
  }

  function exportPDF() {
    App.toast('Ouverture de la fenêtre d\'impression...', 'info');
    window.print();
  }

  async function changeMonth(month) {
    currentMonth = parseInt(month);
    await loadAndRender();
  }

  async function changeYear(delta) {
    currentYear += delta;
    await loadAndRender();
  }

  async function loadAndRender() {
    try {
      const data = await API.getMonthlyReport(currentYear, currentMonth);
      render(data);
    } catch (_) { render({}); }
  }

  async function init() {
    view().innerHTML = `<div class="empty-state"><div class="loading-spinner" style="width:40px;height:40px;border-top-color:var(--gold)"></div></div>`;
    await loadAndRender();
  }

  return { init, openStatsEntry, saveStats, exportPDF, changeMonth, changeYear, deletePublication };
})();
