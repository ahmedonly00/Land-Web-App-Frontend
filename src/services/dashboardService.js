import api from './api';

const handleResponse = (response) => {
  if (response.data && (Array.isArray(response.data) || typeof response.data === 'object')) {
    return response.data;
  }
  return response.data || [];
};

export const dashboardService = {
  // Dashboard stats
  getStats: () => api.get('/api/admin/dashboard/stats'),
  
  // Get inquiries with pagination, search, and filters
  getInquiries: async (params = {}) => {
    try {
      const response = await api.get('/api/admin/inquiries', { 
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status || '',
          search: params.search || '',
          sortBy: params.sortBy || 'createdAt',
          sortOrder: params.sortOrder || 'desc',
          ...params
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Error in dashboardService.getInquiries:', error);
      throw error;
    }
  },
  
  // Get single inquiry by ID
  getInquiryById: async (id) => {
    try {
      const response = await api.get(`/api/admin/inquiries/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in dashboardService.getInquiryById:', error);
      throw error;
    }
  },
  
  // Update inquiry status
  updateInquiryStatus: async (id, status) => {
    try {
      const response = await api.patch(
        `/api/admin/inquiries/${id}/status`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error in dashboardService.updateInquiryStatus:', error);
      throw error;
    }
  },
  
  // Delete an inquiry
  deleteInquiry: async (id) => {
    try {
      const response = await api.delete(`/api/admin/inquiries/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in dashboardService.deleteInquiry:', error);
      throw error;
    }
  },
  
  // Get inquiry statistics (counts by status)
  getInquiryStats: async () => {
    try {
      const response = await api.get('/api/admin/inquiries/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in dashboardService.getInquiryStats:', error);
      throw error;
    }
  },
  
  // Export inquiries to CSV
  exportInquiries: async (params = {}) => {
    try {
      const response = await api.get('/api/admin/inquiries/export', {
        params,
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'text/csv'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in dashboardService.exportInquiries:', error);
      throw error;
    }
  }
};
