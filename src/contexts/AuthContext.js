// src/contexts/AuthContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Set auth header for axios
        if (parsedUser.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsInitialLoading(false);
  }, []);
  
  // Check token expiry periodically
  useEffect(() => {
    if (!user?.token) return;
    
    const checkTokenExpiry = () => {
      try {
        const decoded = jwtDecode(user.token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (err) {
        console.error('Token validation error:', err);
      }
    };
    
    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [user]);
  
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const data = res.data;
      
      if (data.success) {
        const userData = { 
          name: data.user.name, 
          id: data.user.id,
          email: data.user.email,
          token: data.user.token 
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status code
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 400) {
          return { success: false, error: data.message || 'Invalid input data' };
        } else if (status === 401) {
          return { success: false, error: data.message || 'Invalid email or password' };
        } else if (status === 404) {
          return { success: false, error: 'Login service not available' };
        } else if (status === 500) {
          return { success: false, error: 'Server error. Please try again later' };
        } else {
          return { success: false, error: data.message || 'Login failed' };
        }
      } else if (err.request) {
        // Request was made but no response received
        return { success: false, error: 'Network error. Please check your connection' };
      } else {
        // Something happened in setting up the request
        return { success: false, error: 'An unexpected error occurred' };
      }
    } finally {
      setAuthLoading(false);
    }
  };
  
  const register = async (name, email, password) => {
    setAuthLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      const data = res.data;
      
      if (data.success) {
        const userData = { 
          name: data.user.name, 
          id: data.user.id,
          email: data.user.email,
          token: data.user.token 
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status code
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 400) {
          return { success: false, error: data.message || 'Invalid input data' };
        } else if (status === 409) {
          return { success: false, error: data.message || 'A user with this email already exists' };
        } else if (status === 500) {
          return { success: false, error: 'Server error. Please try again later' };
        } else {
          return { success: false, error: data.message || 'Registration failed' };
        }
      } else if (err.request) {
        // Request was made but no response received
        return { success: false, error: 'Network error. Please check your connection' };
      } else {
        // Something happened in setting up the request
        return { success: false, error: 'An unexpected error occurred' };
      }
    } finally {
      setAuthLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      if (user?.token) {
        await axios.post('/api/auth/logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      isInitialLoading,
      authLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);