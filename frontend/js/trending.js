/* ============================================
   TRENDING.JS — TikTok Tendances 🔥
   ============================================ */

const Trending = (() => {
  const view = () => document.getElementById('view-trending');

  function renderTrends(data) {
    const lastUpdate = data.lastUpdate || null;
    const sounds = data.sounds || [];
    const formats = data.formats || [];
    const scripts = data.scripts || [];
    const hashtags = data.hashtags || [];

    view().innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🔥 TikTok Tendances</div>
          <div class="page-subtitle">
            Mis à jour ${lastUpdate ? App.formatDate(lastUpdate) : 'chaque lundi à 7h00'}
          </div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost" onclick="Trending.triggerManualUpdate()">
            <i class="fa-solid fa-rotate"></i> Actualiser maintenant
          </button>
        </div>
      </div>

      <!-- Prochaine mise à jour -->
      <div class="card card-gold" style="margin-bottom:24px;display:flex;align-items:center;gap:16px">
        <div style="font-size:32px">🤖</div>
        <div>
          <div style="font-size:14px;font-weight:600;color:var(--gold)">Analyse IA automatique</div>
          <div style="font-size:12.5px;color:var(--text-secondary);margin-top:2px">
            Chaque lundi à 7h00, Claude analyse les sources TikTok et génère des idées adaptées à la rénovation québécoise.
            La prochaine mise à jour se fait automatiquement.
          </div>
        </div>
      </div>

      <!-- Top sons -->
      <div class="section-title">🎵 Top 5 Sons viraux adaptables à la rénovation</div>
      <div class="grid-3" style="margin-bottom:24px">
        ${sounds.length > 0 ? sounds.slice(0, 5).map((s, i) => `
          <div class="trend-card">
            <div class="trend-number">${String(i + 1).padStart(2, '0')}</div>
            <div class="trend-title">${s.name || 'Son tendance'}</div>
            <div class="trend-desc">${s.desc || ''}</div>
            ${s.useCase ? `<div style="margin-top:10px;font-size:11px;color:var(--gold)">💡 ${s.useCase}</div>` : ''}
          </div>
        `).join('') : `
          <div class="card" style="grid-column:1/-1">
            <div class="empty-state" style="padding:32px">
              <i class="fa-solid fa-music"></i>
              <p>Aucune donnée — actualisation prévue lundi prochain</p>
            </div>
          </div>
        `}
      </div>

      <!-- Top formats -->
      <div class="section-title">📱 Top 3 Formats vidéo qui explosent cette semaine</div>
      <div class="grid-3" style="margin-bottom:24px">
        ${formats.slice(0, 3).map((f, i) => `
          <div class="trend-card" style="border-color:rgba(212,175,55,0.2)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
              <div class="trend-number">${String(i + 1).padStart(2, '0')}</div>
              ${f.engagement ? `<span class="tag tag-green">${f.engagement}</span>` : ''}
            </div>
            <div class="trend-title">${f.format || 'Format tendance'}</div>
            <div class="trend-desc">${f.desc || ''}</div>
            ${f.duration ? `<div style="margin-top:10px;font-size:11px;color:var(--text-muted)">Durée idéale: ${f.duration}</div>` : ''}
          </div>
        `).join('') || '<div class="card" style="grid-column:1/-1"><div class="empty-state" style="padding:32px"><p>Données à venir</p></div></div>'}
      </div>

      <!-- Scripts prêts à tourner -->
      <div class="section-title">🎬 3 Scripts prêts à tourner</div>
      <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:24px">
        ${scripts.slice(0, 3).map((s, i) => `
          <div class="content-block">
            <div class="content-block-header">
              <div class="content-block-title">
                <span style="background:var(--gold);color:var(--black);width:22px;height:22px;border-radius:50%;
                  display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:800">
                  ${i + 1}
                </span>
                ${s.title || `Script #${i + 1}`}
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn btn-ghost btn-sm btn-copy"
                  onclick="App.copyToClipboard(this.closest('.content-block').querySelector('.content-text').textContent, this)">
                  <i class="fa-solid fa-copy"></i> Copier
                </button>
                <button class="btn btn-secondary btn-sm"
                  onclick="Generator.scheduleContent('tiktok', '${s.id || ''}')">
                  <i class="fa-solid fa-calendar-plus"></i> Planifier
                </button>
              </div>
            </div>
            <div class="content-block-body">
              ${s.sound ? `<div style="font-size:11px;color:var(--gold);margin-bottom:8px">🎵 Son suggéré: ${s.sound}</div>` : ''}
              <div class="content-text">${s.script || 'Script à venir...'}</div>
              ${s.hashtags ? `
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px">
                  ${s.hashtags.split(' ').map(h => `<span class="tag tag-gold">${h}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('') || '<div class="empty-state"><p>Scripts générés chaque lundi</p></div>'}
      </div>

      <!-- Hashtags -->
      <div class="section-title">🏷️ Hashtags optimisés — Rénovation Québec</div>
      <div class="card">
        ${hashtags.length > 0 ? `
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">
            ${hashtags.map(h => `
              <span class="tag tag-gold" style="cursor:pointer;font-size:12px" onclick="App.copyToClipboard('${h}')">
                ${h}
              </span>
            `).join('')}
          </div>
          <button class="btn btn-ghost btn-sm"
            onclick="App.copyToClipboard('${hashtags.join(' ')}')">
            <i class="fa-solid fa-copy"></i> Copier tous les hashtags
          </button>
        ` : `
          <div class="empty-state" style="padding:24px">
            <p>Hashtags générés chaque lundi</p>
          </div>
        `}
      </div>
    `;
  }

  async function triggerManualUpdate() {
    App.showLoading('Analyse des tendances TikTok en cours...');
    try {
      const result = await API.triggerTrendsScrape();
      App.hideLoading();
      renderTrends(result.data || {});
      App.toast('Tendances mises à jour!', 'success');
    } catch (err) {
      App.hideLoading();
      App.toast(`Erreur: ${err.message}`, 'error');
    }
  }

  async function init() {
    view().innerHTML = `<div class="empty-state"><div class="loading-spinner" style="width:40px;height:40px;border-top-color:var(--gold)"></div><p>Chargement des tendances...</p></div>`;
    try {
      const data = await API.getTikTokTrends();
      renderTrends(data);
    } catch (_) {
      renderTrends({});
    }
  }

  return { init, triggerManualUpdate };
})();
