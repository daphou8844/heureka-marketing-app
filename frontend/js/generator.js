/* ============================================
   GENERATOR.JS — Générateur de projet terminé
   ============================================ */

const Generator = (() => {
  const view = () => document.getElementById('view-generator');
  let pendingProjects = [];
  let uploadedFiles = [];
  let generatedContent = null;
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
        <!-- Projets en attente de Pipeline -->
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
            <label class="form-label">Type de travaux *</label>
            <select class="form-control" id="g-type" required>
              <option value="">Sélectionner...</option>
              ${TYPES.map(t => `<option value="${t}" ${project.type === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Ville du projet *</label>
            <input type="text" class="form-control" id="g-ville"
              placeholder="ex: Saint-Jean-sur-Richelieu"
              value="${project.ville || ''}" required>
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
          <label class="form-label">Description courte du projet *</label>
          <textarea class="form-control" id="g-desc" rows="3"
            placeholder="Décrivez le projet : matériaux utilisés, défi particulier, résultat final..."
            required>${project.description || ''}</textarea>
        </div>

        <!-- Upload photos -->
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

        <!-- Photos depuis Drive (auto-chargées si chantier lié) -->
        ${drivePhotos.length > 0 ? `
        <div class="form-group">
          <label class="form-label" style="display:flex;align-items:center;gap:8px">
            <i class="fa-solid fa-folder-open" style="color:var(--gold)"></i>
            Photos du chantier Drive (${drivePhotos.length} photo${drivePhotos.length > 1 ? 's' : ''})
          </label>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
            ${drivePhotos.map(p => `
              <a href="${p.viewUrl}" target="_blank" title="${p.fileName}"
                style="display:block;border-radius:6px;overflow:hidden;
                       border:1px solid var(--black-border);flex-shrink:0">
                <img src="${p.thumbnailUrl}" alt="${p.fileName}"
                  style="width:80px;height:80px;object-fit:cover;display:block"
                  onerror="this.parentElement.style.display='none'" loading="lazy">
              </a>
            `).join('')}
          </div>
          <div style="margin-top:6px;font-size:11px;color:var(--text-muted)">
            Cliquer pour ouvrir dans Drive · Les miniatures s'affichent si vous êtes connecté à Google
          </div>
        </div>
        ` : ''}

        <!-- Options de génération -->
        <div class="section-title">Contenu à générer</div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px">
          ${[
            { id: 'gen-fb', label: 'Post Facebook', icon: 'fa-brands fa-facebook', checked: true },
            { id: 'gen-tiktok', label: 'Script TikTok', icon: 'fa-brands fa-tiktok', checked: true },
            { id: 'gen-blog', label: 'Article blogue', icon: 'fa-solid fa-newspaper', checked: true },
            { id: 'gen-gallery', label: 'Fiche galerie SEO', icon: 'fa-solid fa-image', checked: true }
          ].map(opt => `
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;
              padding:8px 14px;background:var(--black-soft);border:1px solid var(--black-border);
              border-radius:6px;font-size:13px;color:var(--text-secondary);transition:all 0.15s"
              id="label-${opt.id}">
              <input type="checkbox" id="${opt.id}" ${opt.checked ? 'checked' : ''}
                style="accent-color:var(--gold)" onchange="Generator.toggleLabel('${opt.id}')">
              <i class="${opt.icon}"></i> ${opt.label}
            </label>
          `).join('')}
        </div>

        <div class="form-group">
          <label class="form-label">Infos supplémentaires pour l'IA (optionnel)</label>
          <textarea class="form-control" id="g-extra" rows="2"
            placeholder="Ex: projet primé, client très satisfait, technique innovante..."></textarea>
        </div>

        <!-- Email demande d'avis -->
        <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;
          background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.2);border-radius:8px;margin-top:8px">
          <input type="checkbox" id="g-avis" checked style="accent-color:var(--green)">
          <label for="g-avis" style="font-size:13px;cursor:pointer">
            <strong style="color:var(--green)">Envoyer automatiquement une demande d'avis Google au client</strong>
            <br><span style="color:var(--text-muted);font-size:11px">Un email personnalisé sera généré et envoyé via Gmail</span>
          </label>
        </div>
      </form>
    `;
  }

  function renderResult(content) {
    generatedContent = content;
    return `
      <div style="margin-bottom:16px;display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--green)">
            <i class="fa-solid fa-circle-check"></i> Contenu généré avec succès!
          </div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">
            ${App.formatDate(new Date().toISOString())}
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="Generator.resetForm()">
          <i class="fa-solid fa-plus"></i> Nouveau projet
        </button>
      </div>

      ${content.facebook ? `
        <div class="content-block">
          <div class="content-block-header">
            <div class="content-block-title">
              <i class="fa-brands fa-facebook" style="color:#60A5FA"></i> Post Facebook
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-ghost btn-sm btn-copy" onclick="App.copyToClipboard(document.getElementById('fb-text').textContent, this)">
                <i class="fa-solid fa-copy"></i> Copier
              </button>
              <button class="btn btn-secondary btn-sm" onclick="Generator.scheduleContent('facebook', '${content.contentId}')">
                <i class="fa-solid fa-calendar-plus"></i> Planifier
              </button>
            </div>
          </div>
          <div class="content-block-body">
            <div class="content-text" id="fb-text">${escapeHtml(content.facebook)}</div>
          </div>
        </div>
      ` : ''}

      ${content.tiktok ? `
        <div class="content-block">
          <div class="content-block-header">
            <div class="content-block-title">
              <i class="fa-brands fa-tiktok" style="color:var(--gold)"></i> Script TikTok
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-ghost btn-sm btn-copy" onclick="App.copyToClipboard(document.getElementById('tiktok-text').textContent, this)">
                <i class="fa-solid fa-copy"></i> Copier
              </button>
              <button class="btn btn-secondary btn-sm" onclick="Generator.scheduleContent('tiktok', '${content.contentId}')">
                <i class="fa-solid fa-calendar-plus"></i> Planifier
              </button>
            </div>
          </div>
          <div class="content-block-body">
            <div class="content-text" id="tiktok-text">${escapeHtml(content.tiktok)}</div>
          </div>
        </div>
      ` : ''}

      ${content.blog ? `
        <div class="content-block">
          <div class="content-block-header">
            <div class="content-block-title">
              <i class="fa-solid fa-newspaper" style="color:var(--green)"></i> Article de blogue
            </div>
            <button class="btn btn-ghost btn-sm btn-copy" onclick="App.copyToClipboard(document.getElementById('blog-text').textContent, this)">
              <i class="fa-solid fa-copy"></i> Copier
            </button>
          </div>
          <div class="content-block-body">
            <div class="content-text" id="blog-text">${escapeHtml(content.blog)}</div>
          </div>
        </div>
      ` : ''}

      ${content.gallery ? `
        <div class="content-block">
          <div class="content-block-header">
            <div class="content-block-title">
              <i class="fa-solid fa-image" style="color:var(--blue)"></i> Fiche galerie SEO
            </div>
            <button class="btn btn-ghost btn-sm btn-copy" onclick="App.copyToClipboard(document.getElementById('gallery-text').textContent, this)">
              <i class="fa-solid fa-copy"></i> Copier
            </button>
          </div>
          <div class="content-block-body">
            <div class="content-text" id="gallery-text">${escapeHtml(content.gallery)}</div>
          </div>
        </div>
      ` : ''}

      ${content.reviewEmail ? `
        <div class="content-block" style="border-color:rgba(34,197,94,0.3)">
          <div class="content-block-header">
            <div class="content-block-title">
              <i class="fa-solid fa-envelope" style="color:var(--green)"></i> Email demande d'avis Google
              <span class="tag tag-green" style="margin-left:8px">Envoyé</span>
            </div>
          </div>
          <div class="content-block-body">
            <div class="content-text">${escapeHtml(content.reviewEmail)}</div>
          </div>
        </div>
      ` : ''}
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function toggleLabel(id) {
    const cb = document.getElementById(id);
    const label = document.getElementById(`label-${id}`);
    label.style.color = cb.checked ? 'var(--text-primary)' : 'var(--text-muted)';
    label.style.borderColor = cb.checked ? 'rgba(212,175,55,0.4)' : 'var(--black-border)';
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

  async function submitForm() {
    const type = document.getElementById('g-type').value;
    const ville = document.getElementById('g-ville').value;
    const desc = document.getElementById('g-desc').value;

    if (!type || !ville || !desc) {
      App.toast('Veuillez remplir les champs obligatoires (*)', 'error');
      return;
    }

    const projectData = {
      type,
      ville,
      duree: document.getElementById('g-duree').value,
      client: document.getElementById('g-client').value,
      description: desc,
      extra: document.getElementById('g-extra').value,
      genFacebook: document.getElementById('gen-fb').checked,
      genTiktok: document.getElementById('gen-tiktok').checked,
      genBlog: document.getElementById('gen-blog').checked,
      genGallery: document.getElementById('gen-gallery').checked,
      sendReviewEmail: document.getElementById('g-avis').checked
    };

    App.showLoading('Gemini génère votre contenu marketing...');

    try {
      // Upload photos first
      const photoUrls = [];
      for (let i = 0; i < uploadedFiles.length; i++) {
        const photoType = i === uploadedFiles.length - 1 ? 'apres' : 'avant';
        const result = await API.uploadPhoto(uploadedFiles[i], 'new', photoType, type, ville);
        photoUrls.push(result.url);
      }
      projectData.photoUrls = photoUrls;

      const result = await API.generateContent(null, projectData);

      App.hideLoading();
      uploadedFiles = [];

      const contentSection = document.getElementById('content-section');
      contentSection.innerHTML = renderResult(result);
      contentSection.scrollIntoView({ behavior: 'smooth' });

      // Clear badge
      document.getElementById('badge-generator').style.display = 'none';

      App.toast('Contenu généré avec succès!', 'success');
    } catch (err) {
      App.hideLoading();
      App.toast(`Erreur: ${err.message}`, 'error');
      const cs = document.getElementById('content-section');
      if (cs) cs.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-triangle-exclamation" style="color:var(--red);font-size:32px"></i>
          <h3 style="color:var(--red);margin-top:12px">Erreur de génération</h3>
          <p style="max-width:320px;text-align:center;color:var(--text-secondary)">${err.message}</p>
          <button class="btn btn-primary" style="margin-top:16px" onclick="Generator.submitForm()">
            <i class="fa-solid fa-rotate-right"></i> Réessayer
          </button>
        </div>`;
    }
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
          <label class="form-label">Heure (optionnel)</label>
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

  function resetForm() {
    uploadedFiles = [];
    generatedContent = null;
    drivePhotos = [];
    init();
  }

  async function init() {
    view().innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Générateur de projet terminé</div>
          <div class="page-subtitle">Créez tout votre contenu marketing en un clic grâce à Claude IA</div>
        </div>
      </div>

      <div class="grid-2" style="align-items:start">
        <div class="card" style="position:sticky;top:0">
          <div class="card-header">
            <span class="card-title">Informations du projet</span>
          </div>
          <div id="form-section"></div>
          <div style="display:flex;gap:10px;margin-top:20px">
            <button class="btn btn-primary" style="flex:1" onclick="Generator.submitForm()">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              Générer avec Claude IA
            </button>
          </div>
        </div>

        <div id="content-section">
          <div class="empty-state">
            <i class="fa-solid fa-wand-magic-sparkles" style="color:rgba(212,175,55,0.3)"></i>
            <h3>Votre contenu apparaîtra ici</h3>
            <p>Remplissez le formulaire et cliquez sur "Générer"</p>
          </div>
        </div>
      </div>
    `;

    // Load pending Pipeline projects
    try {
      const result = await API.getPipelineProjects();
      pendingProjects = result.projects || [];
    } catch (_) {
      pendingProjects = [];
    }

    document.getElementById('form-section').innerHTML = renderForm();
  }

  return {
    init, submitForm, prefill, resetForm, scheduleContent, confirmSchedule,
    toggleLabel, handleDragOver, handleDrop, handleFileSelect, removeFile,
    getDrivePhotos: (driveId) => API.getChantierPhotos(driveId)
  };
})();
