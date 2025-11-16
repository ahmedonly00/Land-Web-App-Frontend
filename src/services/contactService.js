import api from './api';

export const contactService = {
  submitInquiry: (inquiryData) => api.post('/contacts/submit', inquiryData),
  
  // Admin endpoints
  getInquiries: (params) => api.get('/admin/dashboard/inquiries', { params }),
};
