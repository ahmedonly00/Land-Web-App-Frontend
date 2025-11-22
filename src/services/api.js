import axios from 'axios';

// Use environment variable with fallback for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Check if this is a public endpoint that doesn't need authentication
    const publicEndpoints = [
      '/settings/public',
      '/houses/getAllHouses',
      '/plots/getAllPlots',
      '/houses/getFeaturedHouses',
      '/plots/getFeaturedPlots',
      '/houses/getHouseById/',
      '/plots/getPlotById/',
      '/houses/',
      '/plots/'
    ];
    
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.includes(endpoint)
    );
    
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // Debug token presence
    console.log('🔑 Token check:', {
      hasToken: !!token,
      tokenLength: token?.length,
      url: config.url,
      method: config.method?.toUpperCase(),
      isPublicEndpoint
    });
    
    // Only add token for non-public endpoints
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request headers');
    } else if (isPublicEndpoint) {
      console.log('🔓 Public endpoint - skipping auth token');
    } else {
      console.warn('⚠️ No auth token found in localStorage');
    }
    
    // Log request details (only in development)
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
        hasAuthHeader: !!config.headers.Authorization
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log response details (only in development)
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data
      });
    }
    
    return response;
  },
  (error) => {
    // Log error details
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data,
      responseData: error.response?.data,
      headers: error.response?.headers
    });
    
    // Handle specific status codes
    if (error.response) {
      const { status } = error.response;
      
      // Unauthorized - clear auth and redirect to login
      if (status === 401) {
        console.warn('⚠️ Unauthorized - clearing auth data');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Forbidden
      if (status === 403) {
        console.warn('⚠️ Forbidden - insufficient permissions');
      }
      
      // Not Found
      if (status === 404) {
        console.warn('⚠️ Resource not found');
      }
      
      // Server Error
      if (status >= 500) {
        console.error('❌ Server error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ No response from server:', {
        request: error.request,
        message: 'The server did not respond. Please check your connection.'
      });
    } else {
      // Something else happened
      console.error('❌ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default api;

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await api.get('/health');
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      message: error.message
    };
  }
};

// Export the base URL for reference
export { API_BASE_URL };