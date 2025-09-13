'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Changed from default import to named import

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Set auth header for axios
      if (parsedUser.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      }
    }
    setIsInitialLoading(false);
  }, []);

  // Check token expiry periodically
  useEffect(() => {
    if (!user?.token) return;
    
    const checkTokenExpiry = () => {
      try {
        const decoded = jwtDecode(user.token); // Changed from jwt_decode to jwtDecode
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
          token: data.token 
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
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
          token: data.token 
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
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