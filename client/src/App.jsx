// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './App.css'

import Login from './pages/Login';
import LayoutAdmin from './layouts/LayoutAdmin';
import LayoutManager from './layouts/LayoutManager';
import LayoutAgent from './layouts/LayoutAgent';

import UserList from './pages/admin/UserList';
import FormationList from './pages/admin/FormationList';
import BriefingList from './pages/admin/BriefingList'
import CongerList from './pages/admin/CongerList';
import AutreDemande from './pages/admin/AutreDemande'
import ActiviterList from './pages/admin/ActiviterList'
import Dashboard from './pages/admin/Dashboard';

/*import DashboardAdmin from './pages/admin/DashboardAdmin';
import DashboardManager from './pages/manager/DashboardManager';
import DashboardAgent from './pages/agent/DashboardAgent';*/

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Admin */}
          <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<LayoutAdmin />}>
              <Route index element={<Dashboard/>} />
              <Route path="users" element={<UserList />} />
              <Route path="formation" element={<FormationList />} />
              <Route path="briefing" element={<BriefingList />} />
              <Route path="conger" element={<CongerList />}/>
              <Route path="autre" element={<AutreDemande/>}/>
              <Route path="activiter" element={<ActiviterList/>}/>
            </Route>
          </Route>

          {/* Manager */}
          <Route element={<PrivateRoute allowedRoles={['Manager']} />}>
            <Route path="/manager" element={<LayoutManager />}>
              <Route index element={<h1>Dashboard manager</h1>} />
            </Route>
          </Route>

          {/* Agent */}
          <Route element={<PrivateRoute allowedRoles={['Agent']} />}>
            <Route path="/agent" element={<LayoutAgent />}>
              <Route index element={<h1>Dashboard agent</h1>} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<div>403 - Accès refusé</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
