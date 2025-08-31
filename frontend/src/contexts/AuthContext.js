import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  // Clear user data and token
  const clearAuthData = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  // Fetch user data
  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH.USER}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      // Clear auth data on error
      clearAuthData();
    } finally {
      setLoading(false);
    }
  }, [clearAuthData]);

  // Set up axios defaults and fetch user
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH.LOGIN}`, {
        email,
        password
      });
      
      const { user: userData, token: authToken } = response.data;
      
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('auth_token', authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH.REGISTER}`, {
        name,
        email,
        password,
        password_confirmation
      });
      
      const { user: userData, token: authToken } = response.data;
      
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('auth_token', authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = useCallback(async () => {
    try {
      if (token) {
        await axios.post(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH.LOGOUT}`);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      clearAuthData();
    }
  }, [token, clearAuthData]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
