import api from './api';

export const dashboardService = {
  getStats: () => api.get('/admin/dashboard/stats'),
  
  getInquiries: async (params = {}) => {
    try {
      const response = await api.get('/admin/dashboard/inquiries', { params });
      console.log('Dashboard service - raw response:', response);
      
      // Return the data in a consistent format
      return {
        data: response?.data || {},
        status: response?.status || 200,
        statusText: response?.statusText || 'OK'
      };
    } catch (error) {
      console.error('Error in dashboardService.getInquiries:', error);
      // Return a consistent error format
      return {
        data: [],
        status: error.response?.status || 500,
        statusText: error.response?.statusText || 'Internal Server Error',
        error: error.message
      };
    }
  },
};
