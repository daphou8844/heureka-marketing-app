/* ============================================
   GENERATOR.JS — Créateur de contenu
   ============================================ */

const Generator = (() => {
  const view = () => document.getElementById('view-generator');
  let pendingProjects = [];
  let uploadedFiles = [];
  let drivePhotos = [];

  const TYPES = [
    'Portes et fenêtres',
    'Revêtement extérieur',
    'Agrandissement de maison',
    'Construction de garage',
    'Entrepreneur général',
    'Autre'
  ];

  function renderForm(project = {}) {
    return `
      <form id="generator-form">
        ${pendingProjects.length > 0 ? `
          <div style="margin-bottom:20px">
            <div class="section-title">Projets reçus de Pipeline</div>
            ${pendingProjects.map(p => `
              <div class="notification-pill" style="margin-bottom:8px" onclick="Generator.prefill('${p.id}')">
                <div class="notification-pill-icon">
                  <i class="fa-solid fa-hard-hat"></i>
                </div>
                <div class="notification-pill-text">
                  <div class="notification-pill-title">${p.type} — ${p.ville}</div>
                  <div class="notification-pill-sub">${p.client || 'Client anonyme'} · Terminé le ${App.formatDate(p.dateFin)}</div>
                </div>
                <span class="tag tag-gold">Préremplir</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Type de travaux</label>
            <select class="form-control" id="g-type">
              <option value="">Sélectionner...</option>
              ${TYPES.map(t => `<option value="${t}" ${project.type === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Ville du projet</label>
            <input type="text" class="form-control" id="g-ville"
              placeholder="ex: Saint-Jean-sur-Richelieu"
              value="${project.ville || ''}">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Durée des travaux</label>
            <input type="text" class="form-control" id="g-duree"
              placeholder="ex: 3 semaines" value="${project.duree || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Nom du client (optionnel)</label>
            <input type="text" class="form-control" id="g-client"
              placeholder="ex: Famille Tremblay" value="${project.client || ''}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description du projet</label>
          <textarea class="form-control" id="g-desc" rows="3"
            placeholder="Matériaux utilisés, défi particulier, résultat final...">${project.description || ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Photos avant/après</label>
          <div class="upload-zone" id="upload-zone"
            onclick="document.getElementById('photo-input').click()"
            ondragover="Generator.handleDragOver(event)"
            ondrop="Generator.handleDrop(event)">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <p>Glisser-déposer ou cliquer pour ajouter des photos</p>
            <small>JPG, PNG, WEBP — max 10 Mo chacune</small>
          </div>
          <input type="file" id="photo-input" multiple accept="image/*" style="display:none"
            onchange="Generator.handleFileSelect(event)">
          <div class="file-preview" id="file-preview"></div>
        </div>

        ${drivePhotos.length > 0 ? `
        <div class="form-group">
          <label class="form-label" style="display:flex;align-items:center;gap:8px">
            <i class="fa-solid fa-folder-open" style="color:var(--gold)"></i>
            Photos du chantier Drive (${drivePhotos.length} photo${drivePhotos.length > 1 ? 's' : ''})
          </label>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
            ${drivePhotos.map(p => `
              <a href="${p.viewUrl}" target="_blank" title="${p.fileName}"
                style="display:block;border-radius:6px;overflow:hidden;border:1px solid var(--black-border);flex-shrink:0">
                <img src="${p.thumbnailUrl}" alt="${p.fileName}"
                  style="width:80px;height:80px;object-fit:cover;display:block"
                  onerror="this.parentElement.style.display='none'" loading="lazy">
              </a>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </form>
    `;
  }

  function renderContentAreas() {
    return `
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="content-block">
          <div class="content-block-header">
            <div class="content-block-title">
              <i class="fa-brands fa-facebook" style="color:#60A5FA"></i> Post Facebook
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-ghost btn-sm" onclick="App.copyToClipboard(document.getElementById('manual-fb').value)">
                <i class="fa-solid fa-copy"></i> Copier
              </button>
              <button class="btn btn-secondary btn-sm" onclick="Generator.scheduleManual('facebook')">
                <i class="fa-solid fa-calendar-plus"></i> Planifier
              </button>
            </div>
          </div>
          <div class="content-block-body">
            <textarea id="manual-fb" class="form-control" rows="8"
              placeholder="Rédigez votre post Facebook ici..."></textarea>
          </div>
        </div>

        <div class="content-block">
          <div class="content-block-header">
            <div class="content-block-title">
              <i class="fa-brands fa-tiktok" style="color:var(--gold)"></i> Script TikTok
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-ghost btn-sm" onclick="App.copyToClipboard(document.getElementById('manual-tiktok').value)">
                <i class="fa-solid fa-copy"></i> Copier
              </button>
              <button class="btn btn-secondary btn-sm" onclick="Generator.scheduleManual('tiktok')">
                <i class="fa-solid fa-calendar-plus"></i> Planifier
              </button>
            </div>
          </div>
          <div class="content-block-body">
            <textarea id="manual-tiktok" class="form-control" rows="8"
              placeholder="Rédigez votre script TikTok ici..."></textarea>
          </div>
        </div>
      </div>
    `;
  }

  function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.add('dragover');
  }

  function handleDrop(e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addFiles(files);
  }

  function handleFileSelect(e) {
    addFiles(Array.from(e.target.files));
  }

  function addFiles(files) {
    uploadedFiles.push(...files);
    updateFilePreview();
  }

  function removeFile(index) {
    uploadedFiles.splice(index, 1);
    updateFilePreview();
  }

  function updateFilePreview() {
    const preview = document.getElementById('file-preview');
    if (!preview) return;
    preview.innerHTML = uploadedFiles.map((f, i) => `
      <div class="file-chip">
        <i class="fa-solid fa-image"></i>
        ${f.name.length > 20 ? f.name.substring(0, 20) + '…' : f.name}
        <button onclick="Generator.removeFile(${i})" title="Retirer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `).join('');
  }

  async function prefill(pipelineId) {
    const p = pendingProjects.find(x => x.id === pipelineId);
    if (!p) return;
    document.getElementById('g-type').value = p.type || '';
    document.getElementById('g-ville').value = p.ville || '';
    document.getElementById('g-client').value = p.client || '';
    document.getElementById('g-duree').value = p.duree || '';
    document.getElementById('g-desc').value = p.description || '';
    App.toast('Formulaire prérempli avec les données Pipeline!', 'success');

    if (p.driveId) {
      try {
        App.toast('Chargement des photos Drive...', 'info');
        const result = await API.getChantierPhotos(p.driveId);
        if (result.status === 'ok' && result.photos && result.photos.length > 0) {
          drivePhotos = result.photos;
          document.getElementById('form-section').innerHTML = renderForm(p);
          App.toast(`${result.photos.length} photo(s) trouvée(s) dans Drive!`, 'success');
        } else {
          drivePhotos = [];
        }
      } catch(_) {
        drivePhotos = [];
      }
    } else {
      drivePhotos = [];
    }
  }

  function scheduleManual(platform) {
    const text = document.getElementById(`manual-${platform}`)?.value?.trim();
    if (!text) { App.toast('Rédigez d\'abord votre contenu', 'error'); return; }
    scheduleContent(platform, 'manual_' + Date.now());
  }

  async function scheduleContent(platform, contentId) {
    App.showModal({
      title: 'Planifier la publication',
      subtitle: `Choisissez une date pour ${platform === 'facebook' ? 'Facebook' : 'TikTok'}`,
      body: `
        <div class="form-group">
          <label class="form-label">Date de publication</label>
          <input type="date" class="form-control" id="schedule-date"
            min="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label class="form-label">Heure</label>
          <select class="form-control" id="schedule-time">
            <option value="08:00">08:00</option>
            <option value="12:00">12:00</option>
            <option value="17:00" selected>17:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
          </select>
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="App.closeModal()">Annuler</button>
        <button class="btn btn-primary" onclick="Generator.confirmSchedule('${platform}', '${contentId}')">
          <i class="fa-solid fa-calendar-check"></i> Planifier
        </button>
      `
    });
  }

  async function confirmSchedule(platform, contentId) {
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;
    if (!date) { App.toast('Choisissez une date', 'error'); return; }
    try {
      await API.scheduleContent(contentId, `${date}T${time}`, platform);
      App.closeModal();
      App.toast(`Post planifié pour le ${App.formatDate(date)}!`, 'success');
    } catch (err) {
      App.toast(`Erreur: ${err.message}`, 'error');
    }
  }

  async function init() {
    view().innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Créateur de contenu</div>
          <div class="page-subtitle">Rédigez et planifiez vos publications Facebook et TikTok</div>
        </div>
      </div>

      <div class="grid-2" style="align-items:start">
        <div class="card" style="position:sticky;top:0">
          <div class="card-header">
            <span class="card-title">Informations du projet</span>
          </div>
          <div id="form-section"></div>
        </div>

        <div id="content-section">
          ${renderContentAreas()}
        </div>
      </div>
    `;

    try {
      const result = await API.getPipelineProjects();
      pendingProjects = result.projects || [];
    } catch (_) {
      pendingProjects = [];
    }

    document.getElementById('form-section').innerHTML = renderForm();
    document.getElementById('badge-generator').style.display = 'none';
  }

  return {
    init, prefill, scheduleManual, scheduleContent, confirmSchedule,
    handleDragOver, handleDrop, handleFileSelect, removeFile
  };
})();
