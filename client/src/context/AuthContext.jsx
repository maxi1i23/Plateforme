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

  const [loading, setLoading] = useState(true); // État de chargement

  useEffect(() => {
    const loadUser = async () => {
      // Charger depuis localStorage
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      // Si on a déjà un token valide dans localStorage, on l'utilise
      if (token && parsedUser) {
        try {
          const decoded = jwtDecode(token);

          // Vérifier si le token n'est pas expiré
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            console.warn('Token expiré');
            logout();
            return;
          }

          // Charger l'utilisateur depuis localStorage
          setUser({
            token,
            role: decoded.role || localStorage.getItem('role'),
            id: decoded.id,
            idutilisateur: decoded.id,
            nomutilisateur: parsedUser.nomutilisateur || decoded.nomUtilisateur,
            email: parsedUser.emailutilisateur || decoded.email,
            emailutilisateur: parsedUser.emailutilisateur || decoded.email,
            dateinscription: parsedUser.dateinscription || null
          });
        } catch (err) {
          console.warn('Token invalide localStorage:', err);
          logout();
        }
      } else {
        // Pas de token dans localStorage, on est déconnecté
        setUser(null);
      }
    };

    loadUser().finally(() => setLoading(false)); // Marquer comme chargé après l'init

    // 🔄 Synchroniser entre les onglets : écouter les changements de localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        loadUser(); // Recharger l'utilisateur quand le localStorage change
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
    try { await api.post('/auth/logout'); } catch (e) { }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user'); //  important
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
