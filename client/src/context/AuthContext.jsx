// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) return { token, role };
    return null;
  });

  useEffect(() => {
    // Si token existant, essayer décoder
    const token = localStorage.getItem('token');
    if (token && !user) {
      try {
        const decoded = jwtDecode(token);
        setUser({ token, role: decoded.role || localStorage.getItem('role'), id: decoded.id });
      } catch (e) {
        console.warn('token invalide', e);
        logout();
      }
    }
  }, []);

  const login = async (email, password) => {
    // attend que backend renvoie { token, user } ou au moins token + role
    const res = await api.post('/auth/login', { emailUtilisateur: email, motDePasseUtilisateur: password });
    const { token, user: userFromServer } = res.data; // adapte au format que renvoie ton backend
    const role = userFromServer?.roleUtilisateur || (token ? jwtDecode(token).role : null);

    if (token) {
      localStorage.setItem('token', token);
      if (role) localStorage.setItem('role', role);
      setUser({ token, role });
    }
    return res;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
