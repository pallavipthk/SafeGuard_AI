import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const auth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),

  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

const chat = {
  sendMessage: (message) => api.post('/chat/send', { message }),
  getHistory: () => api.get('/chat/history'),
  deleteMessage: (id) => api.delete(`/chat/history/${id}`),
  getSuggestions: (context) => api.post('/chat/suggest', { context }),
};

const vision = {
  analyzeImage: (formData) => api.post('/vision/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

const hazards = {
  getReports: (params) => api.get('/hazards', { params }),
  createReport: (data) => api.post('/hazards/report', data),
  updateReport: (id, data) => api.put(`/hazards/${id}`, data),
  deleteReport: (id) => api.delete(`/hazards/${id}`),
  getNearbyReports: (lat, lng, radius) => api.get('/hazards/nearby', { params: { lat, lng, radius } }),
};

const risk = {
  predictRisk: (data) => api.post('/risk/predict', data),
  getRiskHistory: () => api.get('/risk/history'),
};

const dashboard = {
  getStats: () => api.get('/dashboard/stats'),
  getTrends: () => api.get('/dashboard/reports-trend'),
  getHazardDensity: () => api.get('/dashboard/hazard-density'),
  getRiskCategories: () => api.get('/dashboard/risk-categories'),
  getSafetyScore: () => api.get('/dashboard/safety-score'),
  getLeaderboard: () => api.get('/dashboard/leaderboard'),
};

const sos = {
  triggerSOS: (data) => api.post('/sos/trigger', data),
  getNearbyHospitals: (lat, lng) => api.get('/sos/nearby-hospitals', { params: { lat, lng } }),
  getEmergencyContacts: () => api.get('/sos/emergency-contacts'),
  addEmergencyContact: (data) => api.post('/sos/emergency-contacts', data),
  getFirstAid: () => api.get('/sos/first-aid'),
};

const learning = {
  getArticles: (params) => api.get('/learning/articles', { params }),
  getArticleDetail: (id) => api.get(`/learning/articles/${id}`),
  getFlashcards: (params) => api.get('/learning/flashcards', { params }),
  getQuizQuestions: (params) => {
    if (typeof params === 'string') {
      return api.get('/learning/quiz/questions', { params: { category: params } });
    }
    return api.get('/learning/quiz/questions', { params });
  },
  submitQuiz: (data) => api.post('/learning/quiz/submit', data),
  getQuizResults: () => api.get('/learning/quiz/results'),
  getBadges: () => api.get('/learning/badges'),
  getLeaderboard: () => api.get('/learning/leaderboard'),
  getStats: () => api.get('/learning/stats'),
  askTutor: (question) => api.post('/learning/ask-tutor', { question }),
};

const admin = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAdminReports: (params) => api.get('/admin/reports', { params }),
  verifyReport: (id, action) => api.put(`/admin/reports/${id}/verify`, { action }),
  deleteAdminReport: (id) => api.delete(`/admin/reports/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  exportCSV: (type) => api.get('/admin/export/csv', { params: { type }, responseType: 'blob' }),
  exportPDF: (type) => api.get('/admin/export/pdf', { params: { type }, responseType: 'blob' }),
};

const notifications = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export {
  api,
  auth,
  chat,
  vision,
  hazards,
  risk,
  dashboard,
  sos,
  learning,
  admin,
  notifications,
};

export default api;
