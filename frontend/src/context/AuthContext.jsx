'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('krishi_admin_token');
    const savedAdmin = localStorage.getItem('krishi_admin_profile');
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (e) {
        localStorage.removeItem('krishi_admin_profile');
      }
    }
    setLoading(false);
  }, []);

  const login = (tokenValue, adminProfile) => {
    setToken(tokenValue);
    setAdmin(adminProfile);
    localStorage.setItem('krishi_admin_token', tokenValue);
    localStorage.setItem('krishi_admin_profile', JSON.stringify(adminProfile));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('krishi_admin_token');
    localStorage.removeItem('krishi_admin_profile');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
