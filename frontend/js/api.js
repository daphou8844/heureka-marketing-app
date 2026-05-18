/* ============================================
   API.JS — Couche de communication avec Apps Script
   ============================================ */

const API = (() => {
  // URL du Web App Apps Script — à configurer après déploiement
  const BASE_URL = localStorage.getItem('heureka_api_url') || '';

  async function request(action, data = {}) {
    if (!BASE_URL) {
      throw new Error('URL Apps Script non configurée. Allez dans Paramètres.');
    }
    const params = new URLSearchParams({ action, ...data });
    const res = await fetch(`${BASE_URL}?${params}`);
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json;
  }

  async function post(action, payload = {}) {
    if (!BASE_URL) {
      throw new Error('URL Apps Script non configurée. Allez dans Paramètres.');
    }
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload })
    });
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json;
  }

  return {
    setUrl(url) {
      localStorage.setItem('heureka_api_url', url);
      location.reload();
    },

    getUrl() { return BASE_URL; },

    // ---- DASHBOARD ----
    getDashboardData: () => request('getDashboardData'),

    // ---- PROJETS ----
    getProjects: (filters = {}) => request('getProjects', filters),
    addProject: (project) => post('addProject', { project }),
    updateProject: (id, data) => post('updateProject', { id, data }),

    // ---- GÉNÉRATION DE CONTENU ----
    generateContent: (projectId, projectData) =>
      post('generateContent', { projectId, projectData }),

    // ---- CALENDRIER ----
    getCalendar: (year, month) => request('getCalendar', { year, month }),
    scheduleContent: (contentId, date, platform) =>
      post('scheduleContent', { contentId, date, platform }),
    updateSchedule: (id, date) => post('updateSchedule', { id, date }),

    // ---- TENDANCES TIKTOK ----
    getTikTokTrends: () => request('getTikTokTrends'),
    triggerTrendsScrape: () => post('triggerTrendsScrape'),

    // ---- BANQUE DE CONTENU ----
    getContent: (filters = {}) => request('getContent', filters),
    updateContentStatus: (id, status) => post('updateContentStatus', { id, status }),
    deleteContent: (id) => post('deleteContent', { id }),

    // ---- AVIS ----
    getReviews: () => request('getReviews'),
    sendReviewRequest: (clientId) => post('sendReviewRequest', { clientId }),
    markReviewReceived: (clientId) => post('markReviewReceived', { clientId }),

    // ---- SAISONNIER ----
    getSeasonalContent: () => request('getSeasonalContent'),
    generateSeasonalContent: (season) => post('generateSeasonalContent', { season }),

    // ---- RAPPORT ----
    getMonthlyReport: (year, month) => request('getMonthlyReport', { year, month }),
    saveStats: (stats) => post('saveStats', { stats }),

    // ---- PROMOTIONS ----
    getPromotions: () => request('getPromotions'),
    generatePromotion: (data) => post('generatePromotion', { data }),

    // ---- PIPELINE SYNC ----
    syncPipeline: () => post('syncPipeline'),
    getPipelineProjects: () => request('getPipelineProjects'),

    // ---- UPLOAD PHOTO ----
    uploadPhoto: async (file, projectId) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const base64 = e.target.result.split(',')[1];
            const result = await post('uploadPhoto', {
              fileName: file.name,
              mimeType: file.type,
              base64Data: base64,
              projectId
            });
            resolve(result);
          } catch (err) { reject(err); }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };
})();
