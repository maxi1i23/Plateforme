// src/services/api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
const api = axios.create({
  baseURL: baseURL, // adapte si besoin
  withCredentials: true, // si backend utilise cookie httpOnly
  headers: { 'Content-Type': 'application/json' },
});

// Ajouter automatiquement Authorization header si token dans localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
