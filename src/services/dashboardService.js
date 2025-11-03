import api from './api';

export const dashboardService = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getInquiries: (params) => api.get('/admin/dashboard/inquiries', { params }),
};
