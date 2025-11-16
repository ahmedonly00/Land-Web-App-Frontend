import api from './api';

const handleApiError = (error, context = '') => {
  console.error(`Error in plotService${context ? ` (${context})` : ''}:`, {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
    params: error.config?.params
  });

  let errorMessage = 'Failed to load plots. Please try again later.';
  
  if (error.response) {
    switch (error.response.status) {
      case 400:
        errorMessage = 'Invalid request parameters';
        break;
      case 401:
        errorMessage = 'Unauthorized. Please log in again.';
        break;
      case 403:
        errorMessage = 'You do not have permission to view this content';
        break;
      case 404:
        errorMessage = 'No plots found';
        break;
      case 500:
        errorMessage = 'Server error. Our team has been notified.';
        break;
      default:
        errorMessage = error.response.data?.message || errorMessage;
    }
  } else if (error.request) {
    errorMessage = 'No response from server. Please check your connection.';
  }

  const apiError = new Error(errorMessage);
  apiError.status = error.response?.status;
  apiError.isApiError = true;
  throw apiError;
};

export const plotService = {
  // Public endpoints
  getAllPlots: async (params = {}) => {
    try {
      console.log('Fetching plots with params:', params);
      const response = await api.get('/plots', { 
        params: {
          page: params.page || 0,
          size: params.size || 12,
          sortBy: params.sortBy || 'createdAt',
          sortDir: params.sortDir || 'desc',
          ...(params.type && { type: params.type }),
          ...(params.location && { location: params.location }),
          ...(params.minPrice && { minPrice: params.minPrice }),
          ...(params.maxPrice && { maxPrice: params.maxPrice }),
          ...(params.minSize && { minSize: params.minSize }),
          ...(params.maxSize && { maxSize: params.maxSize })
        } 
      });
      
      console.log('Plots API Response:', response.data);
      
      // Ensure we always return a consistent response structure
      if (response.data && response.data.content) {
        return response.data;
      } else if (Array.isArray(response.data)) {
        // If the response is an array, convert it to the expected format
        return {
          content: response.data,
          totalPages: 1,
          totalElements: response.data.length,
          size: response.data.length,
          number: 0
        };
      }
      
      // Return empty result if no valid data
      return { content: [], totalPages: 0, totalElements: 0 };
    } catch (error) {
      console.error('Error in getAllPlots:', error);
      return handleApiError(error, 'getAllPlots');
    }
  },
  
  getFeaturedPlots: async (limit = 6) => {
    try {
      const response = await api.get(`/plots/getFeaturedPlots?limit=${limit}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getFeaturedPlots');
    }
  },
  
  getPlotById: async (id) => {
    try {
      const response = await api.get(`/plots/getPlotById/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPlotById');
    }
  },
  
  // Admin endpoints
  adminGetAllPlots: async (params = {}) => {
    try {
      const response = await api.get('/admin/plots/getAllPlots', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'adminGetAllPlots');
    }
  },
  
  adminGetPlotById: async (id) => {
    try {
      const response = await api.get(`/admin/plots/getPlotById/${id}`);
      return response.data;
    } catch (error) {
      // If it's a 500 error with successful response data, return the data
      if (error.response?.status === 500 && error.response?.data?.success !== false && error.response?.data) {
        console.warn('Backend returned 500 but with data:', error.response.data);
        return error.response.data;
      }
      return handleApiError(error, 'adminGetPlotById');
    }
  },
  
  createPlot: async (plotData) => {
    try {
      const response = await api.post('/admin/plots/createPlot', plotData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'createPlot');
    }
  },
  
  updatePlot: async (id, plotData) => {
    try {
      const response = await api.put(`/admin/plots/updatePlot/${id}`, plotData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updatePlot');
    }
  },
  
  deletePlot: async (id) => {
    try {
      const response = await api.delete(`/admin/plots/deletePlot/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'deletePlot');
    }
  },
  
  updatePlotStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/plots/updatePlotStatus/${id}`, { status });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updatePlotStatus');
    }
  },
  
  // Image management
  uploadImage: async (plotId, formData) => {
    try {
      const response = await api.post(`/admin/plots/uploadImage/${plotId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'uploadImage');
    }
  },
  
  uploadVideo: async (plotId, formData) => {
    try {
      const response = await api.post(`/admin/plots/uploadVideo/${plotId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'uploadVideo');
    }
  },
  
  deleteImage: async (imageId) => {
    try {
      const response = await api.delete(`/admin/plots/deleteImage/${imageId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'deleteImage');
    }
  },
  
  reorderImages: async (plotId, imageIds) => {
    try {
      const response = await api.put(`/admin/plots/reorderImages/${plotId}`, imageIds);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'reorderImages');
    }
  },
};
