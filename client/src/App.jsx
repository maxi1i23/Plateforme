// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from "./context/SocketContext";
import PrivateRoute from './components/PrivateRoute';
import './App.css'

// Lazy load components for better performance
const Login = React.lazy(() => import('./pages/Login'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Layout = React.lazy(() => import('./layouts/Layout'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Utilisateur = React.lazy(() => import('./pages/Utilisateur'));
const Formation = React.lazy(() => import('./pages/Formation'));
const Briefing = React.lazy(() => import('./pages/Briefing'));
const Conger = React.lazy(() => import('./pages/Conger'));
const Autre = React.lazy(() => import('./pages/Autre'));
const Activiter = React.lazy(() => import('./pages/Activiter'));
const Discussion = React.lazy(() => import('./pages/Discussion'));
const Notification = React.lazy(() => import('./components/Notification'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route path='/plateforme' element={<Layout/>}>
                <Route index element={<Dashboard/>}/>
                <Route path='utilisateurs' element={<Utilisateur/>} />
                <Route path='formations' element={<Formation/>} />
                <Route path='briefings' element={<Briefing/>} />
                <Route path='congers' element={<Conger/>} />
                <Route path='autres' element={<Autre/>} />
                <Route path='activiter' element={<Activiter/>} />
                <Route path='discussion' element={<Discussion/>} />
                <Route path='notifications' element={<Notification/>} />
              </Route>
              </Route>
              {/* Route 404 - à placer en dernier */}
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
