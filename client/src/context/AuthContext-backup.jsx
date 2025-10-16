// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (token && parsedUser) return { token, role, ...parsedUser };
    return null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      try {
        const decoded = jwtDecode(token);
        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};

        setUser({
          token,
          role: decoded.role || localStorage.getItem('role'),
          id: decoded.id,
          nomutilisateur: parsedUser.nomutilisateur || decoded.nomUtilisateur,
          email: parsedUser.emailutilisateur || decoded.email,
        });
      } catch (e) {
        console.warn('token invalide', e);
        logout();
      }
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { 
      emailUtilisateur: email, 
      motDePasseUtilisateur: password 
    });
  
    const { token, user: userFromServer } = res.data;
    const role = userFromServer?.roleutilisateur || (token ? jwtDecode(token).role : null);
  
    if (token) {
      localStorage.setItem('token', token);
      if (role) localStorage.setItem('role', role);
  
      if (userFromServer) {
        localStorage.setItem('user', JSON.stringify(userFromServer));
      }
  
      setUser({ token, role, ...userFromServer });
    }
  
    return res;
  };
  

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user'); //  important
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
