import api from './api';

export const settingsService = {
  getPublicSettings: () => api.get('/settings/public'),
  
  // Admin endpoints
  getAllSettings: () => api.get('/settings/getAllSettings'),
  updateSettings: (settings) => api.put('/settings/updateSettings', settings),
};
