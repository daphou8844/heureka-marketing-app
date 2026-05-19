/* ============================================
   CALENDAR.JS — Calendrier de publication
   ============================================ */

const Calendar = (() => {
  const view = () => document.getElementById('view-calendar');
  let currentDate = new Date();
  let calendarData = {};
  let scheduledImageUrl = '';

  const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  function platformClass(platform) {
    const map = { Facebook: 'facebook', TikTok: 'tiktok', Blogue: 'blogue', Blog: 'blogue' };
    return map[platform] || platform.toLowerCase();
  }

  function renderCalendar(year, month, events) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    view().innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Calendrier de publication</div>
          <div class="page-subtitle">${MONTHS_FR[month]} ${year}</div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-ghost" onclick="Calendar.prevMonth()"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="btn btn-ghost" onclick="Calendar.goToday()">Aujourd'hui</button>
          <button class="btn btn-ghost" onclick="Calendar.nextMonth()"><i class="fa-solid fa-chevron-right"></i></button>
          <button class="btn btn-primary" onclick="Calendar.openScheduler()">
            <i class="fa-solid fa-plus"></i> Planifier
          </button>
        </div>
      </div>

      <!-- Légende -->
      <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:center">
        <div style="display:flex;align-items:center;gap:6px;font-size:12px">
          <div style="width:10px;height:10px;border-radius:2px;background:rgba(59,130,246,0.5)"></div> Facebook
        </div>
        <div style="display:flex;align-items:center;gap:6px;font-size:12px">
          <div style="width:10px;height:10px;border-radius:2px;background:rgba(212,175,55,0.5)"></div> TikTok
        </div>
        <div style="display:flex;align-items:center;gap:6px;font-size:12px">
          <div style="width:10px;height:10px;border-radius:2px;background:rgba(34,197,94,0.5)"></div> Blogue
        </div>
        ${typeof Facebook !== 'undefined' && Facebook.isConnected()
          ? '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--green)"><i class="fa-brands fa-facebook"></i> Facebook connecté — publication directe activée</div>'
          : '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)"><i class="fa-brands fa-facebook"></i> <span style="cursor:pointer;text-decoration:underline" onclick="Facebook.connect()">Connecter Facebook pour publier directement</span></div>'
        }
      </div>

      <!-- Grille calendrier -->
      <div class="calendar-grid">
        ${DAYS_FR.map(d => `<div class="cal-header">${d}</div>`).join('')}
        ${[...Array(firstDay)].map(() => `<div class="cal-day other-month"></div>`).join('')}
        ${[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const dayEvents = events[dateKey] || [];
          return `
            <div class="cal-day ${isToday ? 'today' : ''}"
              ondragover="event.preventDefault()"
              ondrop="Calendar.handleDrop(event,'${dateKey}')">
              <div class="cal-day-num">${day}</div>
              ${dayEvents.map(ev => `
                <div class="cal-event cal-event-${platformClass(ev.platform)}"
                  draggable="true"
                  ondragstart="Calendar.handleDragStart(event,'${ev.id}')"
                  onclick="Calendar.showEventDetail('${ev.id}','${dateKey}')"
                  title="${ev.title}">
                  ${ev.imageUrl ? '🖼 ' : ''}${ev.title}
                </div>
              `).join('')}
            </div>`;
        }).join('')}
      </div>

      <!-- Prochaines publications -->
      <div class="section-title" style="margin-top:24px">Prochaines publications</div>
      <div class="card">
        ${Object.entries(events)
          .filter(([d]) => d >= new Date().toISOString().split('T')[0])
          .sort(([a],[b]) => a.localeCompare(b))
          .slice(0, 10)
          .flatMap(([date, evs]) => evs.map(ev => ({ date, ...ev })))
          .map(item => `
            <div style="display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid var(--black-border)">
              ${item.imageUrl
                ? `<img src="${item.imageUrl}" style="width:44px;height:44px;object-fit:cover;border-radius:6px;flex-shrink:0" onerror="this.style.display='none'">`
                : `<div style="min-width:40px;text-align:center">
                    <div style="font-size:18px;font-weight:800;color:var(--gold)">${parseInt(item.date.split('-')[2])}</div>
                    <div style="font-size:10px;color:var(--text-muted)">${MONTHS_FR[parseInt(item.date.split('-')[1])-1].slice(0,4)}</div>
                   </div>`}
              <span class="tag ${item.platform==='Facebook'?'tag-blue':item.platform==='TikTok'?'tag-gold':'tag-green'}">${item.platform}</span>
              <div style="flex:1;font-size:13.5px">${item.title}</div>
              <span class="tag ${item.status==='Publié'?'tag-green':item.status==='Planifié'?'tag-blue':'tag-gray'}">${item.status}</span>
              ${item.platform === 'Facebook' && typeof Facebook !== 'undefined' && Facebook.isConnected() ? `
                <button class="btn btn-secondary btn-sm" onclick="Calendar.publishToFacebook('${item.id}','${item.date}')">
                  <i class="fa-brands fa-facebook"></i> Publier
                </button>
              ` : ''}
              <button class="btn btn-icon" onclick="Calendar.deleteEvent('${item.id}')" title="Supprimer">
                <i class="fa-solid fa-trash" style="color:var(--red)"></i>
              </button>
            </div>
          `).join('') || '<div class="empty-state" style="padding:32px"><p>Aucune publication à venir</p></div>'}
      </div>
    `;
  }

  function openScheduler(prefill = {}) {
    scheduledImageUrl = '';
    App.showModal({
      title: 'Planifier une publication',
      size: 'md',
      body: `
        <div class="form-group">
          <label class="form-label">Plateforme</label>
          <select class="form-control" id="sch-platform">
            <option value="Facebook" ${prefill.platform==='Facebook'?'selected':''}>Facebook</option>
            <option value="TikTok" ${prefill.platform==='TikTok'?'selected':''}>TikTok</option>
            <option value="Blogue">Article de blogue</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Titre / Contenu</label>
          <textarea class="form-control" id="sch-title" rows="4"
            placeholder="Collez ici votre texte de publication (Facebook, TikTok...)...">${prefill.text || ''}</textarea>
        </div>

        <!-- Visuel Canva / Image -->
        <div class="form-group">
          <label class="form-label">Visuel (Canva exporté ou URL d'image)</label>
          <div style="display:flex;gap:8px">
            <input type="url" class="form-control" id="sch-image-url"
              placeholder="Coller un lien d'image (ex: lien Canva exporté)..."
              oninput="Calendar.previewImage(this.value)">
            <button type="button" class="btn btn-ghost btn-sm" style="flex-shrink:0"
              onclick="document.getElementById('sch-image-file').click()">
              <i class="fa-solid fa-upload"></i> Fichier
            </button>
          </div>
          <input type="file" id="sch-image-file" accept="image/*" style="display:none"
            onchange="Calendar.handleImageFile(event)">
          <div id="sch-image-preview" style="margin-top:10px"></div>
          <small style="color:var(--text-muted);display:block;margin-top:6px">
            💡 Dans Canva : Partager → Télécharger (PNG/JPG) → puis glissez ici, ou Partager → Lien public → coller l'URL
          </small>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-control" id="sch-date"
              min="${new Date().toISOString().split('T')[0]}" value="${prefill.date || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Heure</label>
            <select class="form-control" id="sch-time">
              <option value="08:00">08h00</option>
              <option value="12:00">12h00</option>
              <option value="17:00" selected>17h00</option>
              <option value="19:00">19h00</option>
              <option value="20:00">20h00</option>
            </select>
          </div>
        </div>

        ${typeof Facebook !== 'undefined' && Facebook.isConnected() ? `
          <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;
            background:rgba(24,119,242,0.08);border:1px solid rgba(24,119,242,0.25);border-radius:8px">
            <input type="checkbox" id="sch-post-now" style="accent-color:#1877F2">
            <label for="sch-post-now" style="font-size:13px;cursor:pointer">
              <i class="fa-brands fa-facebook" style="color:#1877F2"></i>
              <strong>Publier maintenant sur Facebook</strong> (en plus de planifier)
            </label>
          </div>
        ` : ''}
      `,
      footer: `
        <button class="btn btn-ghost" onclick="App.closeModal()">Annuler</button>
        <button class="btn btn-primary" onclick="Calendar.saveSchedule()">
          <i class="fa-solid fa-calendar-check"></i> Planifier
        </button>
      `
    });
  }

  function previewImage(url) {
    scheduledImageUrl = url;
    const prev = document.getElementById('sch-image-preview');
    if (!prev) return;
    if (!url) { prev.innerHTML = ''; return; }
    prev.innerHTML = `
      <img src="${url}" style="max-width:100%;max-height:180px;border-radius:8px;border:1px solid var(--black-border);object-fit:contain"
        onerror="document.getElementById('sch-image-preview').innerHTML='<span style=color:var(--red);font-size:12px>Image non accessible — téléchargez le fichier à la place</span>'">`;
  }

  function handleImageFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    scheduledImageUrl = url;
    const prev = document.getElementById('sch-image-preview');
    if (prev) prev.innerHTML = `
      <div style="position:relative;display:inline-block">
        <img src="${url}" style="max-width:100%;max-height:180px;border-radius:8px;border:1px solid var(--black-border);object-fit:contain">
        <div style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.7);border-radius:4px;padding:2px 6px;font-size:11px;color:#fff">
          ${file.name}
        </div>
      </div>`;
    const urlInput = document.getElementById('sch-image-url');
    if (urlInput) urlInput.value = '';
  }

  async function saveSchedule() {
    const platform = document.getElementById('sch-platform').value;
    const title = document.getElementById('sch-title').value.trim();
    const date = document.getElementById('sch-date').value;
    const time = document.getElementById('sch-time').value;
    const postNow = document.getElementById('sch-post-now')?.checked;

    if (!date || !title) { App.toast('Date et contenu requis', 'error'); return; }

    try {
      await API.scheduleContent(null, `${date}T${time}`, platform, title, scheduledImageUrl);
      App.closeModal();
      App.toast('Publication planifiée!', 'success');

      if (postNow && typeof Facebook !== 'undefined' && Facebook.isConnected()) {
        await Facebook.postToPage(title, scheduledImageUrl || null);
      }

      await loadAndRender();
    } catch (err) { App.toast(err.message, 'error'); }
  }

  async function publishToFacebook(eventId, dateKey) {
    const evs = calendarData[dateKey] || [];
    const ev = evs.find(e => e.id === eventId);
    const text = ev?.title || ev?.preview || '';
    const imageUrl = ev?.imageUrl || null;

    App.showModal({
      title: 'Publier sur Facebook',
      body: `
        <div style="margin-bottom:12px">
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">Texte qui sera publié :</div>
          <div class="content-text" style="background:var(--black-soft);padding:12px;border-radius:8px;max-height:200px;overflow-y:auto">${text}</div>
        </div>
        ${imageUrl ? `<img src="${imageUrl}" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-bottom:12px">` : ''}
        <div style="padding:10px 12px;background:rgba(24,119,242,0.08);border:1px solid rgba(24,119,242,0.25);border-radius:8px;font-size:12.5px;color:var(--text-secondary)">
          <i class="fa-brands fa-facebook" style="color:#1877F2"></i>
          Publication directe sur votre page Facebook Business
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="App.closeModal()">Annuler</button>
        <button class="btn btn-primary" onclick="App.closeModal();Facebook.postToPage(\`${text.replace(/`/g,'\\`')}\`, ${imageUrl ? `'${imageUrl}'` : 'null'})">
          <i class="fa-brands fa-facebook"></i> Publier maintenant
        </button>
      `
    });
  }

  let draggedId = null;

  function handleDragStart(e, id) { draggedId = id; }

  async function handleDrop(e, dateKey) {
    if (!draggedId) return;
    try {
      await API.updateSchedule(draggedId, dateKey);
      App.toast('Publication déplacée!', 'success');
      await loadAndRender();
    } catch (err) { App.toast(err.message, 'error'); }
    draggedId = null;
  }

  function showEventDetail(id, dateKey) {
    const source = dateKey ? (calendarData[dateKey] || []) : Object.values(calendarData).flat();
    const ev = source.find(e => e.id === id) || Object.values(calendarData).flat().find(e => e.id === id);
    if (!ev) return;

    App.showModal({
      title: ev.title || 'Publication',
      size: 'md',
      body: `
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;gap:8px;align-items:center">
            <span class="tag ${ev.platform==='Facebook'?'tag-blue':ev.platform==='TikTok'?'tag-gold':'tag-green'}">${ev.platform}</span>
            <span class="tag tag-gray">${ev.status || 'Planifié'}</span>
            <span style="font-size:12px;color:var(--text-muted)"><i class="fa-solid fa-calendar"></i> ${dateKey || ''}</span>
          </div>
          ${ev.imageUrl ? `<img src="${ev.imageUrl}" style="width:100%;max-height:260px;object-fit:cover;border-radius:8px">` : ''}
          ${ev.title || ev.preview ? `<div class="content-text" style="background:var(--black-soft);padding:12px;border-radius:8px;max-height:200px;overflow-y:auto">${ev.title || ev.preview}</div>` : ''}
        </div>
      `,
      footer: `
        <button class="btn btn-ghost" onclick="App.closeModal()">Fermer</button>
        ${ev.title ? `<button class="btn btn-secondary btn-copy" onclick="App.copyToClipboard(\`${(ev.title||'').replace(/`/g,'\\`')}\`,this)"><i class="fa-solid fa-copy"></i> Copier</button>` : ''}
        ${ev.platform === 'Facebook' && typeof Facebook !== 'undefined' && Facebook.isConnected() ? `
          <button class="btn btn-primary" onclick="App.closeModal();Facebook.postToPage(\`${(ev.title||'').replace(/`/g,'\\`')}\`,${ev.imageUrl?`'${ev.imageUrl}'`:'null'})">
            <i class="fa-brands fa-facebook"></i> Publier sur Facebook
          </button>
        ` : ''}
      `
    });
  }

  async function deleteEvent(id) {
    if (!confirm('Supprimer cette publication planifiée?')) return;
    try {
      await API.deleteContent(id);
      App.toast('Supprimé', 'success');
      await loadAndRender();
    } catch (err) { App.toast(err.message, 'error'); }
  }

  async function loadAndRender() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    try {
      const result = await API.getCalendar(year, month + 1);
      calendarData = result.events || {};
    } catch (_) { calendarData = {}; }
    renderCalendar(year, month, calendarData);
  }

  function prevMonth() { currentDate.setMonth(currentDate.getMonth() - 1); loadAndRender(); }
  function nextMonth() { currentDate.setMonth(currentDate.getMonth() + 1); loadAndRender(); }
  function goToday() { currentDate = new Date(); loadAndRender(); }

  async function init() {
    view().innerHTML = `<div class="empty-state"><div class="loading-spinner" style="width:40px;height:40px;border-top-color:var(--gold)"></div><p>Chargement...</p></div>`;
    await loadAndRender();
  }

  return { init, prevMonth, nextMonth, goToday, openScheduler, saveSchedule, previewImage, handleImageFile, handleDragStart, handleDrop, showEventDetail, deleteEvent, publishToFacebook };
})();
