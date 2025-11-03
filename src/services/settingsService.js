import api from './api';

export const settingsService = {
  getPublicSettings: () => api.get('/settings/public'),
  
  // Admin endpoints
  getAllSettings: () => api.get('/admin/settings'),
  updateSettings: (settings) => api.put('/admin/settings', settings),
};
