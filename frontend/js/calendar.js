/* ============================================
   CALENDAR.JS — Calendrier de publication
   ============================================ */

const Calendar = (() => {
  const view = () => document.getElementById('view-calendar');
  let currentDate = new Date();
  let calendarData = {};

  const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  function renderCalendar(year, month, events) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let html = `
      <!-- Navigation -->
      <div class="page-header">
        <div>
          <div class="page-title">Calendrier de publication</div>
          <div class="page-subtitle">${MONTHS_FR[month]} ${year}</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost" onclick="Calendar.prevMonth()">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button class="btn btn-ghost" onclick="Calendar.goToday()">Aujourd'hui</button>
          <button class="btn btn-ghost" onclick="Calendar.nextMonth()">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
          <button class="btn btn-primary" onclick="Calendar.openScheduler()">
            <i class="fa-solid fa-plus"></i> Planifier
          </button>
        </div>
      </div>

      <!-- Legend -->
      <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px;font-size:12px">
          <div style="width:10px;height:10px;border-radius:2px;background:rgba(59,130,246,0.5)"></div>
          Facebook
        </div>
        <div style="display:flex;align-items:center;gap:6px;font-size:12px">
          <div style="width:10px;height:10px;border-radius:2px;background:rgba(212,175,55,0.5)"></div>
          TikTok
        </div>
        <div style="display:flex;align-items:center;gap:6px;font-size:12px">
          <div style="width:10px;height:10px;border-radius:2px;background:rgba(34,197,94,0.5)"></div>
          Blogue
        </div>
      </div>

      <!-- Calendar grid -->
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
              ondrop="Calendar.handleDrop(event, '${dateKey}')">
              <div class="cal-day-num">${day}</div>
              ${dayEvents.map(ev => `
                <div class="cal-event cal-event-${ev.platform.toLowerCase()}"
                  draggable="true"
                  ondragstart="Calendar.handleDragStart(event, '${ev.id}')"
                  onclick="Calendar.showEventDetail('${ev.id}')"
                  title="${ev.title}">
                  ${ev.title}
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
      </div>

      <!-- Upcoming list -->
      <div class="section-title" style="margin-top:24px">Prochaines publications</div>
      <div class="card">
        ${Object.entries(events).filter(([d]) => d >= new Date().toISOString().split('T')[0])
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(0, 8)
          .flatMap(([date, evs]) => evs.map(ev => ({ date, ...ev })))
          .map(item => `
            <div style="display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid var(--black-border)">
              <div style="min-width:40px;text-align:center">
                <div style="font-size:18px;font-weight:800;color:var(--gold)">${parseInt(item.date.split('-')[2])}</div>
                <div style="font-size:10px;color:var(--text-muted)">${MONTHS_FR[parseInt(item.date.split('-')[1])-1].slice(0,4)}</div>
              </div>
              <span class="tag ${item.platform === 'Facebook' ? 'tag-blue' : item.platform === 'TikTok' ? 'tag-gold' : 'tag-green'}">
                ${item.platform}
              </span>
              <div style="flex:1;font-size:13.5px">${item.title}</div>
              <span class="tag ${item.status === 'Publié' ? 'tag-green' : item.status === 'Planifié' ? 'tag-blue' : 'tag-gray'}">
                ${item.status}
              </span>
              <button class="btn btn-icon" onclick="Calendar.deleteEvent('${item.id}')" title="Supprimer">
                <i class="fa-solid fa-trash" style="color:var(--red)"></i>
              </button>
            </div>
          `).join('') || '<div class="empty-state" style="padding:32px"><p>Aucune publication à venir</p></div>'}
      </div>
    `;
    view().innerHTML = html;
  }

  function openScheduler() {
    App.showModal({
      title: 'Planifier une publication',
      body: `
        <div class="form-group">
          <label class="form-label">Plateforme</label>
          <select class="form-control" id="sch-platform">
            <option value="Facebook">Facebook</option>
            <option value="TikTok">TikTok</option>
            <option value="Blogue">Article de blogue</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Titre / Description courte</label>
          <input type="text" class="form-control" id="sch-title"
            placeholder="Ex: Pose de fenêtres à Saint-Jean">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-control" id="sch-date"
              min="${new Date().toISOString().split('T')[0]}">
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
      `,
      footer: `
        <button class="btn btn-ghost" onclick="App.closeModal()">Annuler</button>
        <button class="btn btn-primary" onclick="Calendar.saveSchedule()">
          <i class="fa-solid fa-calendar-check"></i> Planifier
        </button>
      `
    });
  }

  async function saveSchedule() {
    const platform = document.getElementById('sch-platform').value;
    const title = document.getElementById('sch-title').value;
    const date = document.getElementById('sch-date').value;
    const time = document.getElementById('sch-time').value;
    if (!date || !title) { App.toast('Remplissez tous les champs', 'error'); return; }
    try {
      await API.scheduleContent(null, `${date}T${time}`, platform);
      App.closeModal();
      App.toast(`Publication planifiée!`, 'success');
      await loadAndRender();
    } catch (err) { App.toast(err.message, 'error'); }
  }

  let draggedId = null;

  function handleDragStart(e, id) {
    draggedId = id;
  }

  async function handleDrop(e, dateKey) {
    if (!draggedId) return;
    try {
      await API.updateSchedule(draggedId, dateKey);
      App.toast('Publication déplacée!', 'success');
      await loadAndRender();
    } catch (err) { App.toast(err.message, 'error'); }
    draggedId = null;
  }

  function showEventDetail(id) {
    // Find event in calendarData
    for (const evs of Object.values(calendarData)) {
      const ev = evs.find(e => e.id === id);
      if (ev) {
        App.showModal({
          title: ev.title,
          body: `
            <div style="display:flex;flex-direction:column;gap:12px">
              <div><span class="tag ${ev.platform === 'Facebook' ? 'tag-blue' : ev.platform === 'TikTok' ? 'tag-gold' : 'tag-green'}">${ev.platform}</span></div>
              <div style="font-size:13px;color:var(--text-secondary)">
                <i class="fa-solid fa-calendar"></i> ${App.formatDate(ev.date)}
              </div>
              <div style="font-size:13.5px;line-height:1.6;white-space:pre-wrap">${ev.preview || 'Aucun aperçu'}</div>
            </div>
          `,
          footer: `
            <button class="btn btn-ghost" onclick="App.closeModal()">Fermer</button>
            <button class="btn btn-primary" onclick="App.copyToClipboard(\`${(ev.preview || '').replace(/`/g, '\\`')}\`)">
              <i class="fa-solid fa-copy"></i> Copier
            </button>
          `
        });
        return;
      }
    }
  }

  async function deleteEvent(id) {
    if (!confirm('Supprimer cette publication planifiée?')) return;
    try {
      await API.deleteContent(id);
      App.toast('Publication supprimée', 'success');
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

  function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadAndRender();
  }

  function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadAndRender();
  }

  function goToday() {
    currentDate = new Date();
    loadAndRender();
  }

  async function init() {
    view().innerHTML = `<div class="empty-state"><div class="loading-spinner" style="width:40px;height:40px;border-top-color:var(--gold)"></div><p>Chargement...</p></div>`;
    await loadAndRender();
  }

  return { init, prevMonth, nextMonth, goToday, openScheduler, saveSchedule, handleDragStart, handleDrop, showEventDetail, deleteEvent };
})();
