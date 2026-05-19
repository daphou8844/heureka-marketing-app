/* ============================================
   FACEBOOK.JS — Connexion Facebook Business
   ============================================ */

const Facebook = (() => {
  let fbAppId = localStorage.getItem('heureka_fb_app_id') || '';
  let pageToken = localStorage.getItem('heureka_fb_page_token') || '';
  let pageId = localStorage.getItem('heureka_fb_page_id') || '';
  let pageName = localStorage.getItem('heureka_fb_page_name') || '';

  function isConnected() { return !!(pageToken && pageId); }

  function loadSDK() {
    return new Promise(resolve => {
      if (window.FB) { FB.init({ appId: fbAppId, cookie: true, xfbml: false, version: 'v19.0' }); resolve(); return; }
      window.fbAsyncInit = function() {
        FB.init({ appId: fbAppId, cookie: true, xfbml: false, version: 'v19.0' });
        resolve();
      };
      const s = document.createElement('script');
      s.src = 'https://connect.facebook.net/fr_CA/sdk.js';
      s.async = true;
      document.head.appendChild(s);
    });
  }

  function connect() {
    if (!fbAppId) {
      App.showModal({
        title: 'Connecter Facebook Business',
        subtitle: 'Étape 1 sur 2 — App ID Facebook',
        body: `
          <div style="padding:16px;background:rgba(59,130,246,0.05);border:1px solid rgba(59,130,246,0.2);border-radius:8px;margin-bottom:16px;font-size:13px;line-height:1.7">
            <strong style="color:#60A5FA">Comment obtenir votre App ID :</strong><br>
            1. Allez sur <a href="https://developers.facebook.com/apps" target="_blank" style="color:var(--gold)">developers.facebook.com/apps</a><br>
            2. Cliquez <strong>Créer une app</strong> → Type : <strong>Business</strong><br>
            3. Ajoutez le produit <strong>Facebook Login</strong><br>
            4. Dans Paramètres → Général, copiez l'<strong>Identifiant de l'app</strong><br>
            5. Dans Facebook Login → Paramètres, ajoutez <code style="background:var(--black-soft);padding:1px 6px;border-radius:3px">daphou8844.github.io</code> aux domaines OAuth valides
          </div>
          <div class="form-group">
            <label class="form-label">App ID Facebook</label>
            <input type="text" class="form-control" id="fb-app-id-input" placeholder="123456789012345">
          </div>
        `,
        footer: `
          <button class="btn btn-ghost" onclick="App.closeModal()">Annuler</button>
          <button class="btn btn-primary" onclick="Facebook.saveAppId()">
            <i class="fa-brands fa-facebook"></i> Continuer
          </button>
        `
      });
      return;
    }
    startLogin();
  }

  function saveAppId() {
    const id = (document.getElementById('fb-app-id-input').value || '').trim();
    if (!id) { App.toast('App ID requis', 'error'); return; }
    fbAppId = id;
    localStorage.setItem('heureka_fb_app_id', id);
    App.closeModal();
    startLogin();
  }

  async function startLogin() {
    App.showLoading('Connexion à Facebook...');
    await loadSDK();
    App.hideLoading();

    FB.login(response => {
      if (!response.authResponse) {
        App.toast('Connexion Facebook annulée', 'info');
        return;
      }
      FB.api('/me/accounts', { access_token: response.authResponse.accessToken }, pagesResp => {
        if (!pagesResp.data || pagesResp.data.length === 0) {
          App.toast('Aucune page Facebook Business trouvée sur ce compte', 'error');
          return;
        }
        showPageSelector(pagesResp.data);
      });
    }, { scope: 'pages_manage_posts,pages_read_engagement' });
  }

  function showPageSelector(pages) {
    App.showModal({
      title: 'Sélectionner votre page',
      subtitle: 'Quelle page Facebook voulez-vous connecter?',
      body: pages.map(p => `
        <div onclick="Facebook.selectPage('${p.id}','${encodeURIComponent(p.access_token)}','${p.name.replace(/'/g,"&apos;")}')"
          style="display:flex;align-items:center;gap:14px;padding:14px;cursor:pointer;
          border:1px solid var(--black-border);border-radius:8px;margin-bottom:8px;transition:all .15s"
          onmouseover="this.style.borderColor='rgba(212,175,55,0.5)'" onmouseout="this.style.borderColor='var(--black-border)'">
          <div style="width:36px;height:36px;background:#1877F2;border-radius:8px;display:flex;align-items:center;justify-content:center">
            <i class="fa-brands fa-facebook" style="color:#fff;font-size:18px"></i>
          </div>
          <div>
            <div style="font-weight:600">${p.name}</div>
            <div style="font-size:12px;color:var(--text-muted)">ID: ${p.id}</div>
          </div>
          <i class="fa-solid fa-arrow-right" style="color:var(--gold);margin-left:auto"></i>
        </div>
      `).join(''),
      footer: '<button class="btn btn-ghost" onclick="App.closeModal()">Annuler</button>'
    });
  }

  function selectPage(id, tokenEncoded, name) {
    const token = decodeURIComponent(tokenEncoded);
    pageId = id; pageToken = token; pageName = decodeURIComponent(name).replace(/&apos;/g, "'");
    localStorage.setItem('heureka_fb_page_id', id);
    localStorage.setItem('heureka_fb_page_token', token);
    localStorage.setItem('heureka_fb_page_name', pageName);
    App.closeModal();
    App.toast(`✅ Page "${pageName}" connectée à Facebook!`, 'success');
    updateBadge();
  }

  function disconnect() {
    pageToken = ''; pageId = ''; pageName = '';
    localStorage.removeItem('heureka_fb_page_token');
    localStorage.removeItem('heureka_fb_page_id');
    localStorage.removeItem('heureka_fb_page_name');
    App.toast('Facebook déconnecté', 'info');
    updateBadge();
  }

  function updateBadge() {
    const el = document.getElementById('fb-connect-area');
    if (!el) return;
    if (isConnected()) {
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;
          background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:6px">
          <i class="fa-brands fa-facebook" style="color:#1877F2;font-size:16px"></i>
          <div style="flex:1;min-width:0">
            <div style="font-size:11px;font-weight:600;color:var(--green)">Connecté</div>
            <div style="font-size:10px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${pageName}</div>
          </div>
          <button onclick="Facebook.disconnect()" title="Déconnecter"
            style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:11px">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>`;
    } else {
      el.innerHTML = `
        <button onclick="Facebook.connect()"
          style="width:100%;display:flex;align-items:center;gap:8px;padding:8px 12px;
          background:rgba(24,119,242,0.1);border:1px solid rgba(24,119,242,0.3);border-radius:6px;
          cursor:pointer;color:var(--text-secondary);font-size:12px;font-weight:600;transition:all .15s"
          onmouseover="this.style.borderColor='rgba(24,119,242,0.6)'" onmouseout="this.style.borderColor='rgba(24,119,242,0.3)'">
          <i class="fa-brands fa-facebook" style="color:#1877F2;font-size:16px"></i>
          Connecter Facebook Business
        </button>`;
    }
  }

  async function postToPage(message, imageUrl) {
    if (!isConnected()) { App.toast('Connectez votre page Facebook d\'abord', 'error'); return false; }
    await loadSDK();
    App.showLoading('Publication sur Facebook...');
    return new Promise(resolve => {
      const endpoint = imageUrl ? `/${pageId}/photos` : `/${pageId}/feed`;
      const params = imageUrl
        ? { caption: message, url: imageUrl, access_token: pageToken }
        : { message, access_token: pageToken };
      FB.api(endpoint, 'POST', params, response => {
        App.hideLoading();
        if (response && !response.error) {
          App.toast('✅ Publié sur Facebook avec succès!', 'success');
          resolve(true);
        } else {
          const msg = response?.error?.message || 'Erreur inconnue';
          App.toast(`Erreur Facebook: ${msg}`, 'error');
          resolve(false);
        }
      });
    });
  }

  function init() { updateBadge(); }

  return { init, connect, disconnect, saveAppId, selectPage, isConnected, postToPage, updateBadge };
})();
