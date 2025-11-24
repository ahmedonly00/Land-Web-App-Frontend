import api from './api';

export const settingsService = {
  getPublicSettings: () => api.get('/api/settings/public'),
  
  // Admin endpoints
  getAllSettings: () => api.get('/api/settings/getAllSettings'),
  updateSettings: (settings) => api.put('/api/settings/updateSettings', settings),
};
