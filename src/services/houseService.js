import api from './api';

const handleApiError = (error, context = '') => {
  console.error(`Error in houseService${context ? ` (${context})` : ''}:`, {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
    params: error.config?.params
  });

  let errorMessage = 'Failed to load houses. Please try again later.';
  
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
        errorMessage = 'No houses found';
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

const houseService = {
  // Public endpoints
  getAllHouses: async (params = {}) => {
    try {
      console.log('Fetching houses with params:', params);
      const response = await api.get('/houses/getAllHouses', { 
        params: {
          page: params.page || 0,
          size: params.size || 12,
          sortBy: params.sortBy || 'createdAt',
          sortDir: params.sortDir || 'desc',
          ...(params.type && { type: params.type }),
          ...(params.location && { location: params.location }),
          ...(params.minPrice && { minPrice: params.minPrice }),
          ...(params.maxPrice && { maxPrice: params.maxPrice }),
          ...(params.bedrooms && { bedrooms: params.bedrooms }),
          ...(params.bathrooms && { bathrooms: params.bathrooms })
        } 
      });
      
      console.log('Raw API response:', response);
      const data = response.data;
      console.log('Response data:', data);
      
      // Handle different response structures
      if (data.content) {
        // Spring Data Page response
        return {
          content: data.content,
          totalPages: data.totalPages || 1,
          totalElements: data.totalElements || data.content.length
        };
      } else if (Array.isArray(data)) {
        // Direct array response
        return {
          content: data,
          totalPages: 1,
          totalElements: data.length
        };
      } else if (data.data && Array.isArray(data.data)) {
        // Nested data array response
        return {
          content: data.data,
          totalPages: data.totalPages || 1,
          totalElements: data.totalElements || data.data.length
        };
      } else {
        console.error('Unexpected response format:', data);
        return { content: [], totalPages: 0, totalElements: 0 };
      }
    } catch (error) {
      console.error('Error in getAllHouses:', error);
      return handleApiError(error, 'getAllHouses');
    }
  },
  
  getFeaturedHouses: async (limit = 6) => {
    try {
      const response = await api.get(`/houses/getFeaturedHouses?limit=${limit}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getFeaturedHouses');
    }
  },
  
  getHouseById: async (id) => {
    try {
      const response = await api.get(`/houses/getHouseById/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getHouseById');
    }
  },
  
  // Admin endpoints
  adminGetAllHouses: async (params = {}) => {
    try {
      const response = await api.get('/admin/houses/getAllHouses', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'adminGetAllHouses');
    }
  },
  
  adminGetHouseById: async (id) => {
    try {
      const response = await api.get(`/admin/houses/getHouseById/${id}`);
      return response.data;
    } catch (error) {
      // If it's a 500 error with successful response data, return the data
      if (error.response?.status === 500 && error.response?.data?.success !== false && error.response?.data) {
        console.warn('Backend returned 500 but with data:', error.response.data);
        return error.response.data;
      }
      return handleApiError(error, 'adminGetHouseById');
    }
  },
  
  createHouse: async (houseData) => {
    try {
      const response = await api.post('/admin/houses/createHouse', houseData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'createHouse');
    }
  },
  
  updateHouse: async (id, houseData) => {
    try {
      const response = await api.put(`/admin/houses/updateHouse/${id}`, houseData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        console.error('400 Bad Request Details:', error.response.data);
        if (error.response.data?.validationErrors) {
          console.error('Validation Errors:', error.response.data.validationErrors);
        }
      }
      return handleApiError(error, 'updateHouse');
    }
  },
  
  deleteHouse: async (id) => {
    try {
      const response = await api.delete(`/admin/houses/deleteHouse/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'deleteHouse');
    }
  },
  
  updateHouseStatus: async (id, status) => {
    try {
      const response = await api.put(`/admin/houses/updateHouseStatus/${id}`, { status });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updateHouseStatus');
    }
  },
  
  // Search houses with filters
  searchHouses: async (filters = {}) => {
    try {
      const response = await api.get('/admin/houses/searchHouses', { params: filters });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'searchHouses');
    }
  },
  
  // Image management
  uploadImage: async (houseId, formData) => {
    try {
      const response = await api.post(`/admin/houses/uploadImage/${houseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'uploadImage');
    }
  },
  
  uploadVideo: async (houseId, formData) => {
    try {
      const response = await api.post(`/admin/houses/uploadVideo/${houseId}`, formData, {
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
      const response = await api.delete(`/admin/houses/deleteImage/${imageId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'deleteImage');
    }
  },
  
  reorderImages: async (houseId, imageIds) => {
    try {
      const response = await api.put(`/houses/reorderImages/${houseId}`, imageIds);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'reorderImages');
    }
  },
  
  
  getSimilarHouses: async (houseId) => {
    try {
      const response = await api.get(`/houses/getSimilarHouses/${houseId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getSimilarHouses');
    }
  },
  
  getHouseFeatures: async () => {
    try {
      const response = await api.get('/houses/getHouseFeatures');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getHouseFeatures');
    }
  },
};

export default houseService;
