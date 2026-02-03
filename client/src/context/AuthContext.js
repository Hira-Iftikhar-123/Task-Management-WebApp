import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const getStoredToken = () => {
  const t = localStorage.getItem('token');
  if (t) axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  return t;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(getStoredToken);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const apiBase =
      process.env.REACT_APP_API_URL ||
      (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api');
    axios
      .get(`${apiBase}/auth/me`)
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Register user
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api')}/auth/register`,
        { name, email, password }
      );
      const { token: newToken } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api')}/auth/login`,
        { email, password }
      );
      const { token: newToken } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};