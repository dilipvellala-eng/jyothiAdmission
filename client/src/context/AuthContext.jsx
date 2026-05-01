import React, { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

function readSavedUser() {
  try {
    const raw = sessionStorage.getItem('admission_user') || localStorage.getItem('admission_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    const token = sessionStorage.getItem('admission_token') || localStorage.getItem('admission_token');
    if (token) {
      sessionStorage.setItem('admission_token', token);
      sessionStorage.setItem('admission_user', JSON.stringify(user));
    }
    localStorage.removeItem('admission_user');
    localStorage.removeItem('admission_token');
    return user;
  } catch {
    sessionStorage.removeItem('admission_user');
    sessionStorage.removeItem('admission_token');
    localStorage.removeItem('admission_user');
    localStorage.removeItem('admission_token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data);
    setUser(data.user);
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    saveSession(data);
    setUser(data.user);
  }

  function logout() {
    sessionStorage.removeItem('admission_token');
    sessionStorage.removeItem('admission_user');
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

function saveSession(data) {
  sessionStorage.setItem('admission_token', data.token);
  sessionStorage.setItem('admission_user', JSON.stringify(data.user));
  localStorage.removeItem('admission_token');
  localStorage.removeItem('admission_user');
}
