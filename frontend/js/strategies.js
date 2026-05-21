/* ============================================
   STRATEGIES.JS — Module Stratégie Marketing
   ============================================ */
const STRAT = (() => {
  const LS_KEY = 'mkt_strategies';
  let strategies = [];
  let currentId = null;
  let currentTab = 'infos';
  let filterStatut = 'all';

  // ── Storage ──────────────────────────────────────────────
  function load() {
    try { strategies = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch(e) { strategies = []; }
  }
  function save() { localStorage.setItem(LS_KEY, JSON.stringify(strategies)); }
  function getById(id) { return strategies.find(s => s.id === id); }
  function newId() { return 'str_' + Date.now() + '_' + Math.random().toString(36).slice(2,6); }

  // ── Sheet sync ───────────────────────────────────────────
  async function saveToSheet(strat) {
    const url = HEUREKA_CONFIG.APPS_SCRIPT_URL;
    if (!url) return;
    const row = {
      ID_Strategie: strat.id,
      Nom: strat.nom,
      Plateformes: (strat.plateformes || []).join(', '),
      Statut: strat.statut,
      Objectif: strat.objectif || '',
      Budget_Prevu: strat.budget_prevu || 0,
      Leads_Vises: strat.leads_vises || 0,
      Projets_Vises: strat.projets_vises || 0,
      Idees: JSON.stringify(strat.idees || []),
      Actions: JSON.stringify(strat.actions || []),
      Leads_Obtenus: strat.leads_obtenus || 0,
      Projets_Signes: strat.projets_signes || 0,
      Revenus_Reels: strat.revenus_reels || 0,
      Budget_Reel: strat.budget_reel || 0,
      Note_Bilan: strat.note_bilan || '',
      Bilan_Texte: strat.bilan_texte || '',
      Notes: strat.notes || '',
      Date_Debut: strat.date_debut || '',
      Date_Fin: strat.date_fin || '',
      Date_Cree: strat.date_cree || new Date().toISOString()
    };
    try {
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ action: 'updateRow', sheet: 'Strategies', key: 'ID_Strategie', data: row }),
        redirect: 'follow'
      });
    } catch(e) {}
  }

  async function syncFromSheet() {
    const url = HEUREKA_CONFIG.APPS_SCRIPT_URL;
    if (!url) return;
    try {
      const r = await fetch(url + '?action=getData&sheet=Strategies', { redirect: 'follow' });
      const data = await r.json();
      if (!Array.isArray(data) || !data.length) return;
      const sheetStrats = data.map(row => ({
        id: row.ID_Strategie,
        nom: row.Nom || '',
        plateformes: (row.Plateformes || '').split(',').map(p => p.trim()).filter(Boolean),
        statut: row.Statut || 'Idee',
        objectif: row.Objectif || '',
        budget_prevu: parseFloat(row.Budget_Prevu) || 0,
        leads_vises: parseInt(row.Leads_Vises) || 0,
        projets_vises: parseInt(row.Projets_Vises) || 0,
        idees: safeJSON(row.Idees, []),
        actions: safeJSON(row.Actions, []),
        leads_obtenus: parseFloat(row.Leads_Obtenus) || 0,
        projets_signes: parseInt(row.Projets_Signes) || 0,
        revenus_reels: parseFloat(row.Revenus_Reels) || 0,
        budget_reel: parseFloat(row.Budget_Reel) || 0,
        note_bilan: row.Note_Bilan || '',
        bilan_texte: row.Bilan_Texte || '',
        notes: row.Notes || '',
        date_debut: row.Date_Debut || '',
        date_fin: row.Date_Fin || '',
        date_cree: row.Date_Cree || new Date().toISOString()
      })).filter(s => s.id);
      const sheetIds = new Set(sheetStrats.map(s => s.id));
      const localOnly = strategies.filter(s => !sheetIds.has(s.id));
      strategies = [...sheetStrats, ...localOnly];
      save();
      if (!currentId) renderList();
    } catch(e) {}
  }

  function safeJSON(str, def) {
    try { return JSON.parse(str); } catch(e) { return def; }
  }

  // ── Donut helpers ────────────────────────────────────────
  function pctColor(pct) {
    if (pct >= 80) return 'var(--green)';
    if (pct >= 50) return 'var(--blue)';
    if (pct >= 25) return 'var(--orange)';
    return 'var(--red)';
  }

  function donutSVG(pct, color) {
    const p = Math.min(100, Math.max(0, pct));
    return `<svg width="44" height="44" viewBox="0 0 36 36" style="transform:rotate(-90deg)">
      <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--black-border)" stroke-width="3.8"/>
      <circle cx="18" cy="18" r="15.915" fill="none" stroke="${color}" stroke-width="3.8"
        stroke-dasharray="${p} ${100-p}" stroke-linecap="round"/>
    </svg>`;
  }

  function bigDonutHTML(pct, label, value) {
    const p = Math.min(100, Math.max(0, pct));
    const c = pctColor(p);
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px">
      <div style="position:relative;width:84px;height:84px">
        <svg width="84" height="84" viewBox="0 0 36 36" style="transform:rotate(-90deg)">
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--black-border)" stroke-width="3.8"/>
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="${c}" stroke-width="3.8"
            stroke-dasharray="${p} ${100-p}" stroke-linecap="round"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:${c}">${Math.round(p)}%</div>
      </div>
      <div style="font-size:11px;color:var(--text-secondary);text-align:center">${label}</div>
      <div style="font-size:12px;font-weight:600;color:var(--text-primary);text-align:center">${value}</div>
    </div>`;
  }

  // ── Metrics ──────────────────────────────────────────────
  function leadsP(s) { return s.leads_vises > 0 ? (s.leads_obtenus / s.leads_vises) * 100 : 0; }
  function budgetP(s) { return s.budget_prevu > 0 ? Math.min(100, (s.budget_reel / s.budget_prevu) * 100) : 0; }
  function actionsP(s) {
    const a = s.actions || [];
    return a.length > 0 ? (a.filter(x => x.fait).length / a.length) * 100 : 0;
  }
  function fmtDate(d) {
    if (!d) return '—';
    return new Date(d + 'T12:00:00').toLocaleDateString('fr-CA', { year:'numeric', month:'short', day:'numeric' });
  }
  function fmtMoney(n) { return n ? '$' + Number(n).toLocaleString('fr-CA') : '$0'; }

  // ── Card HTML ────────────────────────────────────────────
  function cardHTML(s) {
    const lp = leadsP(s), bp = budgetP(s), ap = actionsP(s);
    const statusCls = { 'Idée':'tag-blue','En cours':'tag-gold','Terminée':'tag-green','Abandonnée':'tag-gray' };
    const tagCls = statusCls[s.statut] || 'tag-gray';
    const platforms = (s.plateformes || []).map(p =>
      `<span class="tag tag-gray" style="font-size:10px;padding:2px 6px">${p}</span>`
    ).join('');
    return `<div class="strat-card" onclick="STRAT.openDetail('${s.id}')">
      <div class="strat-card-header">
        <div style="flex:1;min-width:0">
          <div class="strat-card-title">${escHtml(s.nom || 'Sans nom')}</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">${platforms}</div>
        </div>
        <span class="tag ${tagCls}" style="flex-shrink:0">${s.statut}</span>
      </div>
      <div class="strat-donuts">
        <div class="strat-donut-item">
          ${donutSVG(lp, pctColor(lp))}
          <span style="font-size:10px;color:var(--text-secondary)">Leads</span>
          <span style="font-size:11px;font-weight:700;color:${pctColor(lp)}">${Math.round(lp)}%</span>
        </div>
        <div class="strat-donut-item">
          ${donutSVG(bp, pctColor(bp))}
          <span style="font-size:10px;color:var(--text-secondary)">Budget</span>
          <span style="font-size:11px;font-weight:700;color:${pctColor(bp)}">${Math.round(bp)}%</span>
        </div>
        <div class="strat-donut-item">
          ${donutSVG(ap, pctColor(ap))}
          <span style="font-size:10px;color:var(--text-secondary)">Actions</span>
          <span style="font-size:11px;font-weight:700;color:${pctColor(ap)}">${Math.round(ap)}%</span>
        </div>
      </div>
      ${s.date_debut || s.date_fin
        ? `<div style="font-size:11px;color:var(--text-muted);margin-top:10px;border-top:1px solid var(--black-border);padding-top:10px">${fmtDate(s.date_debut)} → ${fmtDate(s.date_fin)}</div>`
        : ''}
    </div>`;
  }

  // ── Render list ──────────────────────────────────────────
  function renderList() {
    const el = document.getElementById('view-strategies');
    if (!el) return;
    const filtered = filterStatut === 'all' ? strategies : strategies.filter(s => s.statut === filterStatut);
    const filterBtns = ['all','Idée','En cours','Terminée','Abandonnée'].map(f =>
      `<button class="btn btn-sm ${filterStatut===f?'btn-primary':'btn-secondary'}" onclick="STRAT.setFilter('${f}')">${f==='all'?'Toutes':f}</button>`
    ).join('');
    const cards = filtered.length
      ? filtered.map(cardHTML).join('')
      : `<div class="empty-state" style="grid-column:1/-1">
          <i class="fa-solid fa-chess-king"></i>
          <h3>Aucune stratégie</h3>
          <p>Créez votre première stratégie marketing</p>
          <button class="btn btn-primary" onclick="STRAT.newStrategy()"><i class="fa-solid fa-plus"></i> Nouvelle stratégie</button>
        </div>`;
    el.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Stratégie Marketing</div>
          <div class="page-subtitle">${strategies.length} stratégie${strategies.length!==1?'s':''} — Suivi complet des campagnes</div>
        </div>
        <button class="btn btn-primary" onclick="STRAT.newStrategy()"><i class="fa-solid fa-plus"></i> Nouvelle stratégie</button>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap">${filterBtns}</div>
      <div class="strat-grid">${cards}</div>`;
  }

  // ── Create / Delete ──────────────────────────────────────
  function newStrategy() {
    const s = {
      id: newId(), nom: '', plateformes: [], statut: 'Idée', objectif: '',
      budget_prevu: 0, leads_vises: 0, projets_vises: 0,
      idees: [], actions: [],
      leads_obtenus: 0, projets_signes: 0, revenus_reels: 0, budget_reel: 0,
      note_bilan: '', bilan_texte: '', notes: '',
      date_debut: '', date_fin: '', date_cree: new Date().toISOString()
    };
    strategies.unshift(s);
    save();
    openDetail(s.id);
  }

  function deleteStrategy(id) {
    if (!confirm('Supprimer cette stratégie définitivement ?')) return;
    strategies = strategies.filter(s => s.id !== id);
    save();
    closeDetail();
    renderList();
    App.toast('Stratégie supprimée', 'info');
  }

  // ── Detail panel ─────────────────────────────────────────
  function openDetail(id) {
    currentId = id;
    currentTab = 'infos';
    renderPanel();
    document.getElementById('strat-panel').classList.add('open');
    document.getElementById('strat-overlay').classList.add('open');
  }

  function closeDetail() {
    document.getElementById('strat-panel').classList.remove('open');
    document.getElementById('strat-overlay').classList.remove('open');
    currentId = null;
    renderList();
  }

  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.strat-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    renderTabContent();
  }

  function renderPanel() {
    const s = getById(currentId);
    if (!s) return;
    const tabs = [
      ['infos','fa-circle-info','Infos'],
      ['objectifs','fa-bullseye','Objectifs'],
      ['idees','fa-lightbulb','Idées'],
      ['actions','fa-list-check','Actions'],
      ['resultats','fa-chart-pie','Résultats'],
      ['ia','fa-robot','IA Claude']
    ];
    document.getElementById('strat-panel').innerHTML = `
      <div class="strat-panel-header">
        <div style="flex:1;min-width:0">
          <input class="strat-name-input" id="strat-nom-input" value="${escHtml(s.nom)}"
            placeholder="Nom de la stratégie..." onchange="STRAT.updateField('nom',this.value)">
          <select class="form-control" style="width:auto;font-size:12px;padding:4px 8px;margin-top:6px"
            onchange="STRAT.updateField('statut',this.value)">
            ${['Idée','En cours','Terminée','Abandonnée'].map(st =>
              `<option ${s.statut===st?'selected':''}>${st}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;gap:8px;flex-shrink:0">
          <button class="btn btn-sm btn-primary" onclick="STRAT.saveFromPanel()">
            <i class="fa-solid fa-floppy-disk"></i> Sauvegarder
          </button>
          <button class="btn btn-sm btn-ghost" onclick="STRAT.deleteStrategy('${s.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button class="btn-icon" onclick="STRAT.closeDetail()" title="Fermer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div class="strat-tabs">
        ${tabs.map(([tab,icon,label]) =>
          `<button class="strat-tab ${currentTab===tab?'active':''}" data-tab="${tab}" onclick="STRAT.switchTab('${tab}')">
            <i class="fa-solid ${icon}"></i> ${label}
          </button>`).join('')}
      </div>
      <div class="strat-tab-content" id="strat-tab-content"></div>`;
    renderTabContent();
  }

  function renderTabContent() {
    const el = document.getElementById('strat-tab-content');
    if (!el) return;
    const s = getById(currentId);
    if (!s) return;
    const renderers = { infos: tabInfos, objectifs: tabObjectifs, idees: tabIdees, actions: tabActions, resultats: tabResultats, ia: tabIA };
    el.innerHTML = renderers[currentTab] ? renderers[currentTab](s) : '';
  }

  // ── Tab Infos ────────────────────────────────────────────
  function tabInfos(s) {
    const platOptions = ['Facebook','Instagram','TikTok','Google','Blogue','Email','Autre'];
    return `
      <div class="form-group">
        <label class="form-label">Plateformes</label>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${platOptions.map(p => {
            const active = (s.plateformes||[]).includes(p);
            return `<label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:6px 12px;
              background:${active?'rgba(212,175,55,.12)':'var(--black-hover)'};
              border:1px solid ${active?'rgba(212,175,55,.4)':'var(--black-border)'};
              border-radius:6px;font-size:12px;font-weight:500;transition:all .15s;user-select:none">
              <input type="checkbox" style="accent-color:var(--gold)" ${active?'checked':''}
                onchange="STRAT.togglePlatform('${p}',this.checked)"> ${p}
            </label>`;
          }).join('')}
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Date de début</label>
          <input type="date" class="form-control" value="${s.date_debut||''}"
            onchange="STRAT.updateField('date_debut',this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Date de fin</label>
          <input type="date" class="form-control" value="${s.date_fin||''}"
            onchange="STRAT.updateField('date_fin',this.value)">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Notes générales</label>
        <textarea class="form-control" rows="5" placeholder="Contexte, remarques, idées générales..."
          onchange="STRAT.updateField('notes',this.value)">${escHtml(s.notes||'')}</textarea>
      </div>`;
  }

  // ── Tab Objectifs ────────────────────────────────────────
  function tabObjectifs(s) {
    return `
      <div class="form-group">
        <label class="form-label">Description de l'objectif</label>
        <textarea class="form-control" rows="3" placeholder="Quel est l'objectif principal de cette stratégie ?"
          onchange="STRAT.updateField('objectif',this.value)">${escHtml(s.objectif||'')}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Budget prévu ($)</label>
          <input type="number" class="form-control" value="${s.budget_prevu||0}" min="0" step="50"
            onchange="STRAT.updateField('budget_prevu',parseFloat(this.value)||0)">
        </div>
        <div class="form-group">
          <label class="form-label">Leads visés</label>
          <input type="number" class="form-control" value="${s.leads_vises||0}" min="0"
            onchange="STRAT.updateField('leads_vises',parseInt(this.value)||0)">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Projets visés (nouveaux clients)</label>
        <input type="number" class="form-control" value="${s.projets_vises||0}" min="0"
          onchange="STRAT.updateField('projets_vises',parseInt(this.value)||0)">
      </div>`;
  }

  // ── Tab Idées ────────────────────────────────────────────
  function tabIdees(s) {
    const items = (s.idees||[]).map(idea => `
      <div class="strat-checklist-item">
        <input type="checkbox" style="accent-color:var(--gold);flex-shrink:0;width:15px;height:15px"
          ${idea.fait?'checked':''} onchange="STRAT.toggleIdee('${idea.id}',this.checked)">
        <span style="flex:1;${idea.fait?'text-decoration:line-through;color:var(--text-muted)':''}">${escHtml(idea.texte)}</span>
        <button class="btn-icon" style="width:26px;height:26px;font-size:11px;flex-shrink:0" onclick="STRAT.deleteIdee('${idea.id}')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>`).join('');
    return `
      <div style="margin-bottom:16px">
        ${items || `<div style="color:var(--text-muted);font-size:13px;padding:16px 0;text-align:center">Aucune idée — ajoutez-en une ci-dessous</div>`}
      </div>
      <div style="display:flex;gap:8px">
        <input class="form-control" id="new-idee-input" placeholder="Nouvelle idée..."
          onkeydown="if(event.key==='Enter')STRAT.addIdee()">
        <button class="btn btn-primary btn-sm" style="flex-shrink:0" onclick="STRAT.addIdee()">
          <i class="fa-solid fa-plus"></i> Ajouter
        </button>
      </div>`;
  }

  // ── Tab Actions ──────────────────────────────────────────
  function tabActions(s) {
    const items = (s.actions||[]).map(a => `
      <div class="strat-checklist-item" style="flex-wrap:wrap;row-gap:4px">
        <input type="checkbox" style="accent-color:var(--gold);flex-shrink:0;width:15px;height:15px"
          ${a.fait?'checked':''} onchange="STRAT.toggleAction('${a.id}',this.checked)">
        <span style="flex:1;min-width:120px;${a.fait?'text-decoration:line-through;color:var(--text-muted)':''}">${escHtml(a.texte)}</span>
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
          ${a.responsable?`<span class="tag tag-blue" style="font-size:10px">${escHtml(a.responsable)}</span>`:''}
          ${a.date_limite?`<span style="font-size:11px;color:var(--text-muted)">${fmtDate(a.date_limite)}</span>`:''}
        </div>
        <button class="btn-icon" style="width:26px;height:26px;font-size:11px;flex-shrink:0" onclick="STRAT.deleteAction('${a.id}')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>`).join('');
    return `
      <div style="margin-bottom:16px">
        ${items || `<div style="color:var(--text-muted);font-size:13px;padding:16px 0;text-align:center">Aucune action — ajoutez-en une ci-dessous</div>`}
      </div>
      <div style="background:var(--black-soft);border:1px solid var(--black-border);border-radius:var(--radius);padding:14px;display:flex;flex-direction:column;gap:10px">
        <input class="form-control" id="new-action-texte" placeholder="Description de l'action...">
        <div class="form-row">
          <select class="form-control" id="new-action-resp">
            <option value="">Responsable...</option>
            <option>Maxime</option>
            <option>Daphnée</option>
            <option>Anabelle</option>
            <option>Équipe chantier</option>
          </select>
          <input type="date" class="form-control" id="new-action-date" title="Date limite">
        </div>
        <button class="btn btn-primary btn-sm" onclick="STRAT.addAction()">
          <i class="fa-solid fa-plus"></i> Ajouter l'action
        </button>
      </div>`;
  }

  // ── Tab Résultats ────────────────────────────────────────
  function tabResultats(s) {
    const lp = leadsP(s), bp = budgetP(s);
    const pp = s.projets_vises > 0 ? Math.min(100, s.projets_signes / s.projets_vises * 100) : 0;
    const noteBgColors = {
      'Excellent':'rgba(34,197,94,.15)', 'Bien':'rgba(59,130,246,.15)',
      'Moyen':'rgba(249,115,22,.15)', 'À éviter':'rgba(239,68,68,.15)'
    };
    const noteColors = {
      'Excellent':'var(--green)', 'Bien':'var(--blue)',
      'Moyen':'var(--orange)', 'À éviter':'var(--red)'
    };
    return `
      <div style="display:flex;justify-content:space-around;padding:20px;background:var(--black-soft);border:1px solid var(--black-border);border-radius:var(--radius);margin-bottom:20px">
        ${bigDonutHTML(lp, 'Leads', `${s.leads_obtenus} / ${s.leads_vises}`)}
        ${bigDonutHTML(bp, 'Budget', `${fmtMoney(s.budget_reel)} / ${fmtMoney(s.budget_prevu)}`)}
        ${bigDonutHTML(pp, 'Projets', `${s.projets_signes} / ${s.projets_vises}`)}
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Leads obtenus</label>
          <input type="number" class="form-control" value="${s.leads_obtenus||0}" min="0"
            onchange="STRAT.updateField('leads_obtenus',parseInt(this.value)||0);STRAT.refreshResultats()">
        </div>
        <div class="form-group">
          <label class="form-label">Projets signés</label>
          <input type="number" class="form-control" value="${s.projets_signes||0}" min="0"
            onchange="STRAT.updateField('projets_signes',parseInt(this.value)||0);STRAT.refreshResultats()">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Revenus réels ($)</label>
          <input type="number" class="form-control" value="${s.revenus_reels||0}" min="0" step="100"
            onchange="STRAT.updateField('revenus_reels',parseFloat(this.value)||0)">
        </div>
        <div class="form-group">
          <label class="form-label">Budget réel dépensé ($)</label>
          <input type="number" class="form-control" value="${s.budget_reel||0}" min="0" step="50"
            onchange="STRAT.updateField('budget_reel',parseFloat(this.value)||0);STRAT.refreshResultats()">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Note bilan</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${['Excellent','Bien','Moyen','À éviter'].map(n => {
            const active = s.note_bilan === n;
            return `<button onclick="STRAT.updateField('note_bilan','${n}');STRAT.refreshResultats()"
              style="padding:7px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;
                border:1px solid ${active?noteColors[n]:'var(--black-border)'};
                background:${active?noteBgColors[n]:'var(--black-hover)'};
                color:${active?noteColors[n]:'var(--text-secondary)'};transition:all .15s">${n}</button>`;
          }).join('')}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Bilan texte</label>
        <textarea class="form-control" rows="4" placeholder="Synthèse et apprentissages de cette campagne..."
          onchange="STRAT.updateField('bilan_texte',this.value)">${escHtml(s.bilan_texte||'')}</textarea>
      </div>`;
  }

  // ── Tab IA Gemini ─────────────────────────────────────────
  function tabIA(s) {
    const hasKey = !!(HEUREKA_CONFIG.GEMINI_API_KEY && HEUREKA_CONFIG.GEMINI_API_KEY.trim());
    return `
      ${!hasKey ? `<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(249,115,22,.08);border:1px solid rgba(249,115,22,.25);border-radius:8px;margin-bottom:16px;font-size:13px;color:var(--orange)">
        <i class="fa-solid fa-triangle-exclamation"></i>
        Clé API manquante — ajoutez <code style="background:rgba(255,255,255,.05);padding:2px 6px;border-radius:4px">GEMINI_API_KEY</code> dans <code style="background:rgba(255,255,255,.05);padding:2px 6px;border-radius:4px">config.js</code>
      </div>` : ''}
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.65;margin-bottom:20px">
        Gemini va analyser les données de cette stratégie et fournir des recommandations personnalisées basées sur vos résultats.
      </div>
      <button class="btn btn-primary" onclick="STRAT.generateAnalysis()" ${!hasKey?'disabled':''}>
        <i class="fa-solid fa-robot"></i> Analyser avec Gemini IA
      </button>
      <div id="strat-ai-result" style="margin-top:20px"></div>`;
  }

  // ── CRUD helpers ─────────────────────────────────────────
  function updateField(field, value) {
    const s = getById(currentId);
    if (!s) return;
    s[field] = value;
    save();
  }

  function togglePlatform(p, checked) {
    const s = getById(currentId);
    if (!s) return;
    if (!s.plateformes) s.plateformes = [];
    if (checked) { if (!s.plateformes.includes(p)) s.plateformes.push(p); }
    else { s.plateformes = s.plateformes.filter(x => x !== p); }
    save();
  }

  function addIdee() {
    const inp = document.getElementById('new-idee-input');
    const texte = inp ? inp.value.trim() : '';
    if (!texte) return;
    const s = getById(currentId);
    if (!s) return;
    s.idees = s.idees || [];
    s.idees.push({ id: newId(), texte, fait: false });
    save();
    switchTab('idees');
  }

  function toggleIdee(ideaId, checked) {
    const s = getById(currentId);
    if (!s) return;
    const idea = (s.idees||[]).find(i => i.id === ideaId);
    if (idea) { idea.fait = checked; save(); }
  }

  function deleteIdee(ideaId) {
    const s = getById(currentId);
    if (!s) return;
    s.idees = (s.idees||[]).filter(i => i.id !== ideaId);
    save();
    switchTab('idees');
  }

  function addAction() {
    const texte = document.getElementById('new-action-texte')?.value.trim() || '';
    const resp  = document.getElementById('new-action-resp')?.value || '';
    const date  = document.getElementById('new-action-date')?.value || '';
    if (!texte) return;
    const s = getById(currentId);
    if (!s) return;
    s.actions = s.actions || [];
    s.actions.push({ id: newId(), texte, responsable: resp, date_limite: date, fait: false });
    save();
    switchTab('actions');
  }

  function toggleAction(actionId, checked) {
    const s = getById(currentId);
    if (!s) return;
    const a = (s.actions||[]).find(x => x.id === actionId);
    if (a) { a.fait = checked; save(); }
  }

  function deleteAction(actionId) {
    const s = getById(currentId);
    if (!s) return;
    s.actions = (s.actions||[]).filter(x => x.id !== actionId);
    save();
    switchTab('actions');
  }

  function refreshResultats() {
    if (currentTab === 'resultats') renderTabContent();
  }

  // ── Save ─────────────────────────────────────────────────
  async function saveFromPanel() {
    const s = getById(currentId);
    if (!s) return;
    const nomEl = document.getElementById('strat-nom-input');
    if (nomEl) s.nom = nomEl.value.trim();
    save();
    App.toast('Stratégie sauvegardée', 'success');
    await saveToSheet(s);
  }

  // ── AI analysis (Gemini) ─────────────────────────────────
  async function generateAnalysis() {
    const s = getById(currentId);
    if (!s) return;
    const key = (HEUREKA_CONFIG.GEMINI_API_KEY || '').trim();
    if (!key) { App.toast('Clé API Gemini manquante dans config.js', 'error'); return; }

    const resultEl = document.getElementById('strat-ai-result');
    if (resultEl) resultEl.innerHTML = `
      <div style="color:var(--text-muted);font-size:13px;padding:24px;text-align:center">
        <i class="fa-solid fa-spinner fa-spin" style="color:var(--gold);font-size:22px;margin-bottom:12px;display:block"></i>
        Analyse en cours avec Gemini...
      </div>`;

    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: buildPrompt(s) }] }] })
        }
      );
      if (!resp.ok) throw new Error('Erreur API ' + resp.status);
      const data = await resp.json();
      renderAnalysis(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
    } catch(e) {
      const el = document.getElementById('strat-ai-result');
      if (el) el.innerHTML = `<div style="color:var(--red);font-size:13px;padding:12px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:8px">
        <i class="fa-solid fa-circle-xmark"></i> ${escHtml(e.message)}
      </div>`;
    }
  }

  function buildPrompt(s) {
    const lp = s.leads_vises > 0 ? Math.round(s.leads_obtenus / s.leads_vises * 100) : 0;
    const bp = s.budget_prevu > 0 ? Math.round(s.budget_reel / s.budget_prevu * 100) : 0;
    const acts = s.actions || [];
    const ap = acts.length > 0 ? Math.round(acts.filter(a => a.fait).length / acts.length * 100) : 0;
    return `Tu es un expert en marketing pour une entreprise de rénovation résidentielle au Québec (Les Gestions Heúrēka, Saint-Jean-sur-Richelieu).

Analyse cette stratégie marketing et fournis des conseils pratiques et concrets.

STRATÉGIE: ${s.nom || 'Sans nom'}
Statut: ${s.statut}
Plateformes: ${(s.plateformes||[]).join(', ') || 'Non spécifié'}
Objectif: ${s.objectif || 'Non spécifié'}
Période: ${s.date_debut || '?'} → ${s.date_fin || '?'}

RÉSULTATS vs OBJECTIFS:
- Leads: ${s.leads_obtenus} obtenus / ${s.leads_vises} visés (${lp}%)
- Projets signés: ${s.projets_signes} / ${s.projets_vises} visés
- Budget utilisé: $${s.budget_reel} / $${s.budget_prevu} prévu (${bp}%)
- Revenus réels: $${s.revenus_reels}

ACTIONS: ${acts.length} total, ${acts.filter(a => a.fait).length} complétées (${ap}%)
IDÉES notées: ${(s.idees||[]).length}
Note bilan: ${s.note_bilan || 'Non évaluée'}
Bilan: ${s.bilan_texte || 'Non rédigé'}
Notes: ${s.notes || 'Aucune'}

Réponds UNIQUEMENT avec ce JSON valide (aucun markdown autour) :
{"bien_fonctionne":"Ce qui a bien fonctionné (2-3 points clés concrets)","ameliorations":"Pistes d'amélioration concrètes (2-3 points)","points_vigilance":"Points à surveiller pour la prochaine fois (2 points)","conseils":"Conseils stratégiques pour la prochaine campagne (2-3 conseils adaptés au secteur rénovation QC)"}`;
  }

  function renderAnalysis(text) {
    const el = document.getElementById('strat-ai-result');
    if (!el) return;
    let data;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      data = JSON.parse(match ? match[0] : text);
    } catch(e) {
      el.innerHTML = `<div class="content-block"><div class="content-block-body"><div class="content-text">${escHtml(text)}</div></div></div>`;
      return;
    }
    const sections = [
      { key:'bien_fonctionne', icon:'fa-circle-check', color:'var(--green)', title:'Ce qui a bien fonctionné' },
      { key:'ameliorations',   icon:'fa-arrow-trend-up', color:'var(--blue)', title:"Pistes d'amélioration" },
      { key:'points_vigilance',icon:'fa-triangle-exclamation', color:'var(--orange)', title:'Points à surveiller' },
      { key:'conseils',        icon:'fa-star', color:'var(--gold)', title:'Conseils stratégiques' }
    ];
    el.innerHTML = sections.map(sec => `
      <div class="content-block" style="margin-bottom:12px">
        <div class="content-block-header">
          <div class="content-block-title" style="color:${sec.color}">
            <i class="fa-solid ${sec.icon}"></i> ${sec.title}
          </div>
        </div>
        <div class="content-block-body">
          <div class="content-text">${escHtml(data[sec.key] || '—')}</div>
        </div>
      </div>`).join('');
  }

  // ── Utils ─────────────────────────────────────────────────
  function escHtml(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function setFilter(f) { filterStatut = f; renderList(); }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    load();
    renderList();
    setTimeout(syncFromSheet, 3000);
    setInterval(syncFromSheet, HEUREKA_CONFIG.SYNC_INTERVAL_MS);
  }

  return {
    init, renderList, newStrategy, deleteStrategy,
    openDetail, closeDetail, switchTab,
    updateField, togglePlatform,
    addIdee, toggleIdee, deleteIdee,
    addAction, toggleAction, deleteAction,
    saveFromPanel, generateAnalysis,
    setFilter, refreshResultats
  };
})();
