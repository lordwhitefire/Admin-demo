// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('eliphany-admin');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('eliphany-admin');
      }
    }
    setLoading(false);
  }, []);

  // Login using .env credentials
  const login = async (email, password) => {
    setLoading(true);
    try {
      const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        throw new Error('Admin credentials not configured');
      }

      if (email === adminEmail && password === adminPassword) {
        const user = {
          email,
          name: 'Store Owner',
          role: 'admin'
        };
        localStorage.setItem('eliphany-admin', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('eliphany-admin');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};