/* ============================================
   DASHBOARD.JS — Tableau de bord principal
   ============================================ */

const Dashboard = (() => {
  const view = () => document.getElementById('view-dashboard');

  function render(data = {}) {
    const nextPost = data.nextPost || null;
    const daysNext = nextPost ? App.daysUntil(nextPost.date) : null;
    const pipelineNotifs = data.pipelineProjects || [];
    const alerts = data.alerts || [];

    App.showAlerts(alerts);

    view().innerHTML = `
      <!-- Notifications Pipeline -->
      ${pipelineNotifs.map(p => `
        <div class="notification-pill" onclick="App.navigate('generator')">
          <div class="notification-pill-icon">
            <i class="fa-solid fa-bell"></i>
          </div>
          <div class="notification-pill-text">
            <div class="notification-pill-title">Nouveau projet terminé — Générez votre contenu</div>
            <div class="notification-pill-sub">${p.type} · ${p.ville} · ${p.client || 'Client anonyme'}</div>
          </div>
          <i class="fa-solid fa-arrow-right" style="color:var(--gold)"></i>
        </div>
      `).join('')}

      <!-- KPI stats -->
      <div class="grid-4" style="margin-bottom:24px">
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-calendar-check"></i></div>
          <div class="stat-label">Prochain post</div>
          <div class="stat-value" style="font-size:22px">
            ${daysNext !== null ? (daysNext === 0 ? "Aujourd'hui" : daysNext === 1 ? 'Demain' : `${daysNext}j`) : '—'}
          </div>
          <div class="stat-sub">${nextPost ? `${nextPost.platform} · ${App.formatDate(nextPost.date)}` : 'Aucun post planifié'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-layer-group"></i></div>
          <div class="stat-label">Banque de contenu</div>
          <div class="stat-value">${data.contentCount || 0}</div>
          <div class="stat-sub">projets avec contenu généré</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-star"></i></div>
          <div class="stat-label">Avis Google</div>
          <div class="stat-value">${data.reviewCount || 82}</div>
          <div class="stat-sub">⭐ ${data.reviewRating || 4.8} · objectif: 150</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-hammer"></i></div>
          <div class="stat-label">Projets ce mois</div>
          <div class="stat-value">${data.projectsThisMonth || 0}</div>
          <div class="stat-sub">en attente: ${data.pendingContent || 0}</div>
        </div>
      </div>

      <!-- Dernière pub + tendances -->
      <div class="grid-2" style="margin-bottom:24px">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Dernière publication</span>
            <button class="btn btn-ghost btn-sm" onclick="App.navigate('content-bank')">
              Voir tout
            </button>
          </div>
          ${data.lastPost ? `
            <div style="display:flex;gap:10px;align-items:flex-start">
              <span class="tag ${data.lastPost.platform === 'Facebook' ? 'tag-blue' : 'tag-gold'}">
                ${data.lastPost.platform}
              </span>
              <div>
                <div style="font-size:13.5px;line-height:1.5;margin-bottom:6px">
                  ${data.lastPost.preview || 'Aucun contenu'}
                </div>
                <div style="font-size:11px;color:var(--text-muted)">
                  ${App.formatDate(data.lastPost.date)}
                </div>
              </div>
            </div>
          ` : `
            <div class="empty-state" style="padding:24px">
              <i class="fa-solid fa-photo-film" style="font-size:24px"></i>
              <p>Aucune publication encore</p>
            </div>
          `}
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">🔥 TikTok — Résumé tendances</span>
            <button class="btn btn-ghost btn-sm" onclick="App.navigate('trending')">
              Voir plus
            </button>
          </div>
          ${data.tiktokSummary ? `
            <div style="display:flex;flex-direction:column;gap:8px">
              ${data.tiktokSummary.slice(0, 3).map((t, i) => `
                <div style="display:flex;gap:10px;align-items:center;padding:8px;background:var(--black-soft);border-radius:6px">
                  <span style="font-size:18px;font-weight:900;color:rgba(212,175,55,0.3)">${i + 1}</span>
                  <div>
                    <div style="font-size:13px;font-weight:600">${t.title}</div>
                    <div style="font-size:11px;color:var(--text-muted)">${t.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="empty-state" style="padding:24px">
              <i class="fa-brands fa-tiktok" style="font-size:24px"></i>
              <p>Tendances mises à jour chaque lundi</p>
              <button class="btn btn-ghost btn-sm" onclick="App.navigate('trending')">
                Voir les tendances
              </button>
            </div>
          `}
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Actions rapides</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px">
          <button class="btn btn-primary" onclick="App.navigate('generator')">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            Générer du contenu
          </button>
          <button class="btn btn-secondary" onclick="App.navigate('calendar')">
            <i class="fa-solid fa-calendar-plus"></i>
            Planifier un post
          </button>
          <button class="btn btn-secondary" onclick="App.navigate('trending')">
            <i class="fa-brands fa-tiktok"></i>
            Idées TikTok
          </button>
          <button class="btn btn-secondary" onclick="App.syncPipeline()">
            <i class="fa-solid fa-rotate"></i>
            Sync Pipeline
          </button>
          <button class="btn btn-secondary" onclick="App.navigate('reviews')">
            <i class="fa-solid fa-star"></i>
            Demander un avis
          </button>
        </div>
      </div>

      <!-- Mini calendrier prochains posts -->
      <div class="section-title" style="margin-top:24px">Cette semaine</div>
      <div class="card">
        ${data.thisWeek && data.thisWeek.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px">
            ${data.thisWeek.map(item => `
              <div style="display:flex;align-items:center;gap:14px;padding:10px;background:var(--black-soft);border-radius:8px">
                <div style="text-align:center;min-width:40px">
                  <div style="font-size:20px;font-weight:800;color:var(--gold)">${new Date(item.date).getDate()}</div>
                  <div style="font-size:10px;color:var(--text-muted)">${new Date(item.date).toLocaleDateString('fr-CA',{weekday:'short'})}</div>
                </div>
                <span class="tag ${item.platform === 'Facebook' ? 'tag-blue' : item.platform === 'TikTok' ? 'tag-gold' : 'tag-green'}">
                  ${item.platform}
                </span>
                <div style="flex:1;font-size:13px">${item.title || 'Post sans titre'}</div>
                <button class="btn btn-ghost btn-sm" onclick="App.navigate('content-bank')">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state" style="padding:32px">
            <i class="fa-solid fa-calendar-xmark"></i>
            <h3>Aucun post cette semaine</h3>
            <p>Planifiez du contenu pour rester actif sur les réseaux</p>
            <button class="btn btn-primary" onclick="App.navigate('generator')">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Générer du contenu
            </button>
          </div>
        `}
      </div>
    `;
  }

  async function init() {
    view().innerHTML = `
      <div style="display:flex;flex-direction:column;gap:16px">
        ${[...Array(3)].map(() => `
          <div class="card" style="height:120px;background:linear-gradient(90deg,var(--black-card) 25%,var(--black-hover) 50%,var(--black-card) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite">
          </div>
        `).join('')}
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = '@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}';
    document.head.appendChild(style);

    try {
      const data = await API.getDashboardData();
      render(data);
    } catch (err) {
      render({}); // Render empty state on error
      if (err.message.includes('non configurée')) {
        App.promptApiSetup();
      }
    }
  }

  async function refresh() {
    try {
      const data = await API.getDashboardData();
      render(data);
    } catch (_) {}
  }

  return { init, refresh };
})();
