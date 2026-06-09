import React, { createContext, useState, useContext } from 'react';
import authService from '../services/authService';

// Create authentication context
const AuthContext = createContext(null);

/**
 * Safely removes only the authentication keys from local storage
 */
const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Safely checks local storage and parses session details
 * Returns valid credentials or nulls (and clears corrupted states)
 */
const getValidInitialAuth = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token || !storedUser) {
    // If one is present but the other is missing, clean the state
    if (token || storedUser) {
      clearAuthStorage();
    }
    return { token: null, user: null };
  }

  try {
    const parsedUser = JSON.parse(storedUser);
    
    // Validate that user is a valid object containing required properties
    if (!parsedUser || typeof parsedUser !== 'object' || !parsedUser.id || !parsedUser.role) {
      clearAuthStorage();
      return { token: null, user: null };
    }
    
    return { token, user: parsedUser };
  } catch (error) {
    // If JSON parsing fails (e.g. malformed data), clear session keys
    clearAuthStorage();
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  // Safe validation check on start to prevent crashes
  const initialAuth = getValidInitialAuth();
  const [token, setToken] = useState(initialAuth.token);
  const [user, setUser] = useState(initialAuth.user);
  const [loading, setLoading] = useState(false);

  // Authenticate user with email and password
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoading(false);
        return { success: true };
      } else {
        throw new Error(data.message || 'Login failed.');
      }
    } catch (error) {
      setLoading(false);
      // Clean up local storage in case of response code 401 or corrupted states
      if (error.response && error.response.status === 401) {
        clearAuthStorage();
        setToken(null);
        setUser(null);
      }
      const errMsg = error.response?.data?.message || error.message || 'Authentication error occurred.';
      return { success: false, error: errMsg };
    }
  };

  // Register user and trigger auto-login
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);

      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoading(false);
        return { success: true };
      } else {
        throw new Error(data.message || 'Registration failed.');
      }
    } catch (error) {
      setLoading(false);
      const errMsg = error.response?.data?.message || error.message || 'Registration error occurred.';
      return { success: false, error: errMsg };
    }
  };

  // Clear authentication state and local storage keys
  const logout = () => {
    setToken(null);
    setUser(null);
    clearAuthStorage();
  };

  const value = {
    currentUser: user,
    user, // Expose user for compatibility across all components
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
