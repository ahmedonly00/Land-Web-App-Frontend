import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();
        
        if (currentUser && isAuth) {
          setUser(currentUser);
          console.log('✅ User authenticated on mount:', currentUser);
        } else {
          console.log('ℹ️ No authenticated user found');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  
  const login = async (credentials) => {
    try {
      console.log('🔐 AuthContext: Login called with:', { 
        username: credentials.username,
        hasPassword: !!credentials.password 
      });

      // Call authService with the credentials object
      const response = await authService.login(credentials);
      
      console.log('✅ AuthContext: Login successful:', response);

      // Update user state
      if (response.user) {
        setUser(response.user);
      } else {
        // Fallback if user is not in response.user
        const { accessToken, tokenType, ...userData } = response;
        setUser(userData);
      }

      return response;
    } catch (error) {
      console.error('❌ AuthContext: Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('👋 AuthContext: Logout called');
      await authService.logout();
      setUser(null);
      console.log('✅ AuthContext: Logout successful');
    } catch (error) {
      console.error('❌ AuthContext: Logout error:', error);
      // Still clear user state even if logout API fails
      setUser(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.name === roleName || role.name === `ROLE_${roleName}`);
  };

  const isAdmin = () => {
    return hasRole('ADMIN') || hasRole('ROLE_ADMIN');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    hasRole,
    isAdmin,
    isAuthenticated: authService.isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
