import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isLoaded, setIsLoaded] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) {
        setIsLoaded(true);
        return;
      }
      try {
        const data = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (data.success) {
          setUser(data.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setToken(null);
        }
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setToken(null);
      } finally {
        setIsLoaded(true);
      }
    };
    verifyToken();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await api.post('/auth/register', { name, email, password });
    if (data.success) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      }
    } catch { /* ignore */ } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoaded,
      isLoggedIn: !!user,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
