// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);
  
  // Attendre que le chargement soit terminé avant de rediriger
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Chargement...
    </div>;
  }
  
  // Si pas d'utilisateur après le chargement, rediriger vers login
  if (!user || !user.token) return <Navigate to="/" replace />;
  
  return <Outlet />;
};

export default PrivateRoute;
