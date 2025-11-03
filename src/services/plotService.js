import api from './api';

export const plotService = {
  // Public endpoints
  getAllPlots: (params) => api.get('/plots', { params }),
  getFeaturedPlots: (limit = 6) => api.get(`/plots/featured?limit=${limit}`),
  getPlotById: (id) => api.get(`/plots/${id}`),
  
  // Admin endpoints
  adminGetAllPlots: (params) => api.get('/admin/plots', { params }),
  createPlot: (plotData) => api.post('/admin/plots', plotData),
  updatePlot: (id, plotData) => api.put(`/admin/plots/${id}`, plotData),
  deletePlot: (id) => api.delete(`/admin/plots/${id}`),
  updatePlotStatus: (id, status) => api.patch(`/admin/plots/${id}/status`, { status }),
  
  // Image management
  uploadImage: (plotId, formData) => {
    return api.post(`/admin/plots/${plotId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (imageId) => api.delete(`/admin/images/${imageId}`),
  reorderImages: (plotId, imageIds) => api.put(`/admin/plots/${plotId}/images/reorder`, imageIds),
};
