import api from './api';

export const contactService = {
  submitInquiry: (inquiryData) => api.post('/contact/submitInquiry', inquiryData),
  
  // Admin endpoints
  getInquiries: async (params = {}) => {
    try {
      const response = await api.get('/admin/dashboard/inquiries', { params });
      console.log('getInquiries response:', response);
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        return { data: response.data };
      } else if (response.data && response.data.inquiries) {
        return { data: response.data.inquiries };
      } else if (response.data && response.data.data) {
        return { data: response.data.data };
      }
      
      // If we get here, the response format is unexpected
      console.warn('Unexpected response format:', response);
      return { data: [] };
    } catch (error) {
      console.error('Error in getInquiries:', error);
      throw error;
    }
  },
};
