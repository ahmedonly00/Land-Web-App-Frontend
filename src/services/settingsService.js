import api from './api';

export const settingsService = {
  getPublicSettings: () => api.get('/settings/public'),
  
  // Admin endpoints
  getAllSettings: () => api.get('/admin/settings/getAllSettings'),
  updateSettings: (settings) => api.put('/admin/settings/updateSettings', settings),
};
