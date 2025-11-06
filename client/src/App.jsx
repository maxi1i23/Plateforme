// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from "./context/SocketContext";
import PrivateRoute from './components/PrivateRoute';
import './App.css'
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Utilisateur from './pages/Utilisateur';
import Formation from './pages/Formation';
import Briefing from './pages/Briefing';
import Conger from './pages/Conger';
import Autre from './pages/Autre';
import Activiter from './pages/Activiter';
import Discussion from './pages/Discussion';
import Notification from './components/Notification'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
