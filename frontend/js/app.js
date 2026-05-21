/* ============================================
   APP.JS — Gestionnaire principal de l'application
   ============================================ */

const App = (() => {
  const modules = {
    dashboard: { title: 'Tableau de bord', init: () => Dashboard.init() },
    generator: { title: 'Générateur de projet terminé', init: () => Generator.init() },
    calendar: { title: 'Calendrier de publication', init: () => Calendar.init() },
    trending: { title: 'TikTok Tendances 🔥', init: () => Trending.init() },
    'content-bank': { title: 'Banque de contenu', init: () => ContentBank.init() },
    reviews: { title: 'Avis Google', init: () => Reviews.init() },
    seasonal: { title: 'Contenu saisonnier', init: () => Seasonal.init() },
    reports: { title: 'Rapport mensuel', init: () => Reports.init() },
    promotions: { title: 'Promotions saisonnières', init: () => Promotions.init() },
    strategies: { title: 'Stratégie Marketing', init: () => STRAT.init() }
  };

  let currentModule = 'dashboard';
  const initialized = new Set();

  function navigate(module) {
    if (!modules[module]) return;

    // Cacher toutes les vues
    document.querySelectorAll('.module-view').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Afficher la vue cible
    const view = document.getElementById(`view-${module}`);
    const navItem = document.querySelector(`[data-module="${module}"]`);
    if (view) view.classList.remove('hidden');
    if (navItem) navItem.classList.add('active');

    const titleEl = document.getElementById('topbar-title');
    if (titleEl) titleEl.textContent = modules[module].title;

    currentModule = module;

    // Init une seule fois — avec protection contre les erreurs
    if (!initialized.has(module)) {
      initialized.add(module);
      try {
        modules[module].init();
      } catch (err) {
        console.error('[Nav] Erreur init module', module, err);
        if (view) view.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-triangle-exclamation" style="color:var(--red)"></i>
            <h3>Erreur de chargement</h3>
            <p>${err.message}</p>
            <button class="btn btn-secondary" onclick="App.retryModule('${module}')">Réessayer</button>
          </div>`;
      }
    }

    // Fermer sidebar sur mobile
    if (window.innerWidth <= 900) {
      document.getElementById('sidebar').classList.remove('open');
    }
  }

  function retryModule(module) {
    initialized.delete(module);
    navigate(module);
  }

  function showModal({ title, subtitle = '', body, footer = '', size = 'md' }) {
    document.getElementById('modal-header').innerHTML =
      `<h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}`;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('modal-footer').innerHTML = footer;
    const modal = document.getElementById('modal');
    modal.style.maxWidth = size === 'lg' ? '880px' : size === 'sm' ? '420px' : '680px';
    document.getElementById('modal-overlay').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
  }

  function showLoading(text = 'Génération en cours avec Claude IA...') {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-overlay').style.display = 'flex';
  }

  function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
  }

  function toast(message, type = 'info', duration = 4000) {
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    const colors = { success: '#22C55E', error: '#EF4444', info: '#D4AF37' };
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<i class="fa-solid ${icons[type]}" style="color:${colors[type]}"></i>${message}`;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = '0.3s'; setTimeout(() => el.remove(), 300); }, duration);
  }

  function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copié!';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
      }
      toast('Contenu copié dans le presse-papiers', 'success');
    });
  }

  function showAlerts(alerts) {
    const bar = document.getElementById('alert-bar');
    const container = document.getElementById('alerts-container');
    if (!alerts || alerts.length === 0) { bar.style.display = 'none'; return; }
    bar.style.display = 'block';
    container.innerHTML = alerts.map(a =>
      `<div class="alert-item"><i class="fa-solid fa-triangle-exclamation"></i>${a}</div>`
    ).join('');
  }

  async function syncPipeline() {
    const btn = document.getElementById('btn-sync');
    if (!btn) return;
    btn.querySelector('i').classList.add('fa-spin');
    try {
      const result = await API.syncPipeline();
      if (result.newProjects > 0) {
        toast(`${result.newProjects} nouveau(x) projet(s) synchronisé(s) depuis Pipeline!`, 'success');
        document.getElementById('badge-generator').style.display = 'inline-flex';
        document.getElementById('badge-generator').textContent = result.newProjects;
      } else {
        toast('Aucun nouveau projet — Pipeline à jour', 'info');
      }
      // Refresh dashboard if active
      if (currentModule === 'dashboard') Dashboard.refresh();
    } catch (err) {
      if (!API.isDemoMode()) toast(`Erreur sync Pipeline: ${err.message}`, 'error');
    } finally {
      btn.querySelector('i').classList.remove('fa-spin');
    }
  }

  function promptApiSetup() {
    showModal({
      title: 'Configuration requise',
      subtitle: 'Entrez l\'URL de votre Web App Apps Script',
      body: `
        <div class="form-group">
          <label class="form-label">URL Apps Script Web App</label>
          <input type="url" class="form-control" id="api-url-input"
            placeholder="https://script.google.com/macros/s/..."
            value="${API.getUrl()}">
          <small style="color:var(--text-muted);margin-top:6px;display:block">
            Obtenez cette URL en déployant votre Apps Script comme "Application Web"
          </small>
        </div>
      `,
      footer: `<button class="btn btn-primary" onclick="App.saveApiUrl()">
        <i class="fa-solid fa-save"></i> Sauvegarder
      </button>`
    });
  }

  function saveApiUrl() {
    const url = document.getElementById('api-url-input').value.trim();
    if (!url.startsWith('https://script.google.com')) {
      toast('URL invalide — doit commencer par https://script.google.com', 'error');
      return;
    }
    API.setUrl(url);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(dateStr);
    target.setHours(0,0,0,0);
    return Math.round((target - today) / 86400000);
  }

  function getCurrentSeason() {
    const m = new Date().getMonth() + 1;
    if (m >= 3 && m <= 5) return 'Printemps';
    if (m >= 6 && m <= 8) return 'Été';
    if (m >= 9 && m <= 11) return 'Automne';
    return 'Hiver';
  }

  function showDemoBanner() {
    // Bannière démo en haut de l'écran
    const banner = document.createElement('div');
    banner.id = 'demo-banner';
    banner.innerHTML = `
      <div style="background:linear-gradient(90deg,rgba(212,175,55,0.15),rgba(212,175,55,0.08));
        border-bottom:1px solid rgba(212,175,55,0.3);padding:8px 24px;
        display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0">
        <div style="display:flex;align-items:center;gap:10px;font-size:12.5px">
          <span style="background:var(--gold);color:var(--black);padding:2px 8px;border-radius:4px;font-weight:800;font-size:11px">DÉMO</span>
          <span style="color:var(--text-secondary)">Mode démonstration — données fictives affichées. Pour connecter votre vrai backend :</span>
          <button onclick="App.promptApiSetup()" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:12.5px;font-weight:600;padding:0">
            Configurer le backend Apps Script →
          </button>
        </div>
        <button onclick="document.getElementById('demo-banner').remove()"
          style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:14px">✕</button>
      </div>
    `;
    document.querySelector('.main-content').insertBefore(banner, document.querySelector('.topbar'));
  }

  function init() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        navigate(item.dataset.module);
      });
    });

    // Modal close
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', e => {
      if (e.target === document.getElementById('modal-overlay')) closeModal();
    });

    // Sidebar toggle — rétractable/extensible avec persistance
    const _sbEl = document.getElementById('sidebar');
    const _mcEl = document.getElementById('main-content');
    function _applySbState(collapsed){
      if(collapsed){ _sbEl.classList.add('collapsed'); _mcEl.style.marginLeft='0'; }
      else { _sbEl.classList.remove('collapsed'); _mcEl.style.marginLeft='var(--sidebar-width)'; }
    }
    _applySbState(!!localStorage.getItem('mkt_sb_col'));
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      const col = _sbEl.classList.toggle('collapsed');
      _mcEl.style.marginLeft = col ? '0' : 'var(--sidebar-width)';
      localStorage.setItem('mkt_sb_col', col ? '1' : '');
    });

    // Init dashboard
    navigate('dashboard');

    // Auto-sync Pipeline on load
    setTimeout(syncPipeline, 2000);
  }

  // Public API
  return {
    init, navigate, retryModule,
    showModal, closeModal, showLoading, hideLoading,
    toast, copyToClipboard, showAlerts, syncPipeline,
    promptApiSetup, saveApiUrl, formatDate, daysUntil, getCurrentSeason
  };
})();

// Expose globally for inline onclick handlers
window.App = App;

// Les scripts sont en bas du <body> — DOM déjà prêt, on appelle init directement
App.init();
