import api from './api';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const authService = {

  login: async (credentials, passwordParam) => {
    try {
      // Handle both calling styles:
      // authService.login({ username, password }) OR
      // authService.login(username, password)
      let username, password;
      
      if (typeof credentials === 'object' && credentials !== null) {
        // Called with object: login({ username, password })
        username = credentials.username;
        password = credentials.password;
      } else if (typeof credentials === 'string' && passwordParam) {
        // Called with separate params: login(username, password)
        username = credentials;
        password = passwordParam;
      } else {
        throw new Error('Invalid credentials format');
      }

      // Validate inputs
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      console.log('🔐 Attempting login:', { 
        username, 
        passwordLength: password.length 
      });

      // Make API call with proper format
      const response = await api.post('/auth/login', { 
        username: username.trim(), 
        password: password 
      });
      
      console.log('✅ Login API response:', {
        status: response.status,
        hasAccessToken: !!response.data?.accessToken,
        data: response.data
      });

      // Check if response has the expected structure
      if (!response.data || !response.data.accessToken) {
        console.error('❌ Invalid response structure:', response.data);
        throw new Error('Invalid server response. Please try again.');
      }
      
      const { accessToken: token, ...userData } = response.data;
      
      // Store authentication data
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      
      console.log('✅ Login successful, data stored');
      
      // Return the complete user data
      return { ...response.data, user: userData };
      
    } catch (error) {
      console.error('❌ Login error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data
      });

      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        // Handle different status codes
        if (status === 403) {
          errorMessage = data?.message || 'Access denied. Please check your credentials or contact support.';
        } else if (status === 401) {
          errorMessage = data?.message || 'Invalid username or password. Please try again.';
        } else if (status === 400) {
          errorMessage = data?.message || 'Invalid request. Please check your input.';
        } else if (status === 500) {
          errorMessage = data?.message || 'Server error. Please try again later.';
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }

      const authError = new Error(errorMessage);
      authError.status = error.response?.status;
      authError.isAuthError = true;
      throw authError;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   */
  register: async (userData) => {
    try {
      console.log('📝 Attempting registration');
      const response = await api.post('/auth/register', userData);
      console.log('✅ Registration successful');
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      const errorMessage = error.response?.data?.message 
        || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Logout current user
   */
  logout: async () => {
    try {
      console.log('👋 Logging out');
      
      // Try to call the backend logout endpoint
      try {
        await api.post('/auth/logout');
        console.log('✅ Backend logout successful');
      } catch (apiError) {
        console.warn('⚠️ Backend logout failed, proceeding with client-side cleanup', apiError);
        // Continue with client-side cleanup even if backend logout fails
      }
      
      // Clear local storage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      
      console.log('✅ Logout complete');
      
      return { 
        success: true, 
        message: 'Logged out successfully' 
      };
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Ensure we always clear local storage on logout attempt
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      
      return { 
        success: false, 
        message: 'An error occurred during logout',
        error: error.message 
      };
    }
  },
  
  /**
   * Get current user data from localStorage
   * @returns {Object|null} User data or null
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem(USER_DATA_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has a valid token
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
  },
  
  /**
   * Get authentication token
   * @returns {string|null} Auth token or null
   */
  getAuthToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      console.log('✅ Auth token stored');
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      console.log('🗑️ Auth token removed');
    }
  },

  /**
   * Clear all authentication data
   */
  clearAuth: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    console.log('🗑️ All auth data cleared');
  }
};

export default authService;