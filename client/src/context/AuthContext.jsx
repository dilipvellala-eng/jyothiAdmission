import React, { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('admission_user') || 'null');
  } catch {
    localStorage.removeItem('admission_user');
    localStorage.removeItem('admission_token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('admission_token', data.token);
    localStorage.setItem('admission_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('admission_token', data.token);
    localStorage.setItem('admission_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('admission_token');
    localStorage.removeItem('admission_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, register, logout, isAdmin: user?.role === 'admin', isStaff: user?.role === 'staff' }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
