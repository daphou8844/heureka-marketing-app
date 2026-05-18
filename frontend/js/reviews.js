/* ============================================
   REVIEWS.JS — Gestion des avis Google
   ============================================ */

const Reviews = (() => {
  const view = () => document.getElementById('view-reviews');
  const CURRENT_REVIEWS = 82;
  const TARGET_REVIEWS = 150;
  const RATING = 4.8;
  const GOOGLE_BUSINESS_LINK = 'https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review';

  let clients = [];

  function renderReviews(data) {
    clients = data.clients || [];
    const sent = clients.filter(c => c.demandeStat === 'Envoyée').length;
    const received = clients.filter(c => c.avisReçu).length;

    view().innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Avis Google</div>
          <div class="page-subtitle">Gestion des demandes d'avis et suivi</div>
        </div>
        <button class="btn btn-primary" onclick="Reviews.openManualRequest()">
          <i class="fa-solid fa-envelope"></i> Demander un avis
        </button>
      </div>

      <!-- Progression -->
      <div class="card card-gold" style="margin-bottom:24px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <div>
            <div style="font-size:14px;font-weight:600;color:var(--gold)">Progression vers l'objectif</div>
            <div style="font-size:12px;color:var(--text-secondary)">
              ⭐ ${RATING} · ${CURRENT_REVIEWS + received} avis sur Google Maps
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:32px;font-weight:900;color:var(--gold)">${CURRENT_REVIEWS + received}</div>
            <div style="font-size:12px;color:var(--text-muted)">objectif : ${TARGET_REVIEWS}</div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.min(100, ((CURRENT_REVIEWS + received) / TARGET_REVIEWS) * 100)}%"></div>
        </div>
        <div class="progress-labels">
          <span>${CURRENT_REVIEWS + received} avis</span>
          <span>${TARGET_REVIEWS - CURRENT_REVIEWS - received} restants</span>
          <span>${TARGET_REVIEWS}</span>
        </div>
      </div>

      <!-- Stats rapides -->
      <div class="grid-3" style="margin-bottom:24px">
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-paper-plane"></i></div>
          <div class="stat-label">Demandes envoyées</div>
          <div class="stat-value">${sent}</div>
          <div class="stat-sub">ce mois</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-star"></i></div>
          <div class="stat-label">Avis reçus</div>
          <div class="stat-value">${received}</div>
          <div class="stat-sub">grâce aux relances</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-chart-line"></i></div>
          <div class="stat-label">Taux de conversion</div>
          <div class="stat-value">${sent > 0 ? Math.round((received / sent) * 100) : 0}%</div>
          <div class="stat-sub">demandes → avis</div>
        </div>
      </div>

      <!-- Liste des clients -->
      <div class="section-title">Clients contactés</div>
      <div class="card">
        ${clients.length > 0 ? `
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Projet</th>
                  <th>Ville</th>
                  <th>Date contact</th>
                  <th>Statut demande</th>
                  <th>Avis reçu</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${clients.map(c => `
                  <tr>
                    <td><strong>${c.nom || 'Anonyme'}</strong><br>
                      <span style="font-size:11px;color:var(--text-muted)">${c.email || c.tel || ''}</span>
                    </td>
                    <td>${c.type || '—'}</td>
                    <td>${c.ville || '—'}</td>
                    <td style="font-size:12px">${App.formatDate(c.dateContact)}</td>
                    <td>
                      <span class="tag ${c.demandeStat === 'Envoyée' ? 'tag-green' : c.demandeStat === 'En attente' ? 'tag-orange' : 'tag-gray'}">
                        ${c.demandeStat || 'En attente'}
                      </span>
                    </td>
                    <td>
                      ${c.avisReçu
                        ? '<span class="tag tag-green"><i class="fa-solid fa-check"></i> Oui</span>'
                        : '<span class="tag tag-gray">Non</span>'}
                    </td>
                    <td>
                      <div style="display:flex;gap:6px">
                        ${!c.demandeStat || c.demandeStat === 'En attente' ? `
                          <button class="btn btn-secondary btn-sm"
                            onclick="Reviews.sendRequest('${c.id}')">
                            <i class="fa-solid fa-paper-plane"></i> Envoyer
                          </button>
                        ` : ''}
                        ${c.demandeStat === 'Envoyée' && !c.avisReçu ? `
                          <button class="btn btn-ghost btn-sm"
                            onclick="Reviews.markReceived('${c.id}')">
                            <i class="fa-solid fa-star"></i> Marquer reçu
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="empty-state" style="padding:40px">
            <i class="fa-solid fa-star"></i>
            <h3>Aucun client enregistré</h3>
            <p>Les clients apparaissent ici quand vous marquez un projet comme "Terminé"</p>
          </div>
        `}
      </div>
    `;
  }

  function openManualRequest() {
    App.showModal({
      title: 'Demander un avis Google',
      subtitle: 'Envoyer un email personnalisé au client',
      body: `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nom du client *</label>
            <input type="text" class="form-control" id="rev-nom" placeholder="ex: Jean Tremblay">
          </div>
          <div class="form-group">
            <label class="form-label">Email *</label>
            <input type="email" class="form-control" id="rev-email" placeholder="client@email.com">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Type de projet</label>
            <input type="text" class="form-control" id="rev-type" placeholder="ex: Revêtement extérieur">
          </div>
          <div class="form-group">
            <label class="form-label">Ville</label>
            <input type="text" class="form-control" id="rev-ville" placeholder="ex: Saint-Jean">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Message personnalisé (optionnel)</label>
          <textarea class="form-control" id="rev-msg" rows="3"
            placeholder="Ajoutez un contexte... (laissez vide pour le message automatique)"></textarea>
        </div>
        <div style="padding:12px;background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.2);border-radius:8px;font-size:12.5px;color:var(--text-secondary)">
          <strong style="color:var(--gold)">Aperçu du lien envoyé:</strong><br>
          ${GOOGLE_BUSINESS_LINK}
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="App.closeModal()">Annuler</button>
        <button class="btn btn-primary" onclick="Reviews.submitManualRequest()">
          <i class="fa-solid fa-paper-plane"></i> Générer et envoyer
        </button>
      `
    });
  }

  async function submitManualRequest() {
    const nom = document.getElementById('rev-nom').value;
    const email = document.getElementById('rev-email').value;
    if (!nom || !email) { App.toast('Nom et email requis', 'error'); return; }

    App.showLoading('Génération de l\'email personnalisé...');
    try {
      await API.sendReviewRequest({
        nom,
        email,
        type: document.getElementById('rev-type').value,
        ville: document.getElementById('rev-ville').value,
        message: document.getElementById('rev-msg').value
      });
      App.hideLoading();
      App.closeModal();
      App.toast(`Email envoyé à ${nom}!`, 'success');
      await init();
    } catch (err) {
      App.hideLoading();
      App.toast(`Erreur: ${err.message}`, 'error');
    }
  }

  async function sendRequest(clientId) {
    App.showLoading('Envoi de la demande d\'avis...');
    try {
      await API.sendReviewRequest(clientId);
      App.hideLoading();
      App.toast('Demande d\'avis envoyée!', 'success');
      await init();
    } catch (err) {
      App.hideLoading();
      App.toast(err.message, 'error');
    }
  }

  async function markReceived(clientId) {
    try {
      await API.markReviewReceived(clientId);
      App.toast('Avis marqué comme reçu! Merci!', 'success');
      await init();
    } catch (err) { App.toast(err.message, 'error'); }
  }

  async function init() {
    view().innerHTML = `<div class="empty-state"><div class="loading-spinner" style="width:40px;height:40px;border-top-color:var(--gold)"></div></div>`;
    try {
      const data = await API.getReviews();
      renderReviews(data);
    } catch (_) { renderReviews({}); }
  }

  return { init, openManualRequest, submitManualRequest, sendRequest, markReceived };
})();
