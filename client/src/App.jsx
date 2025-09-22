// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './App.css'

import Login from './pages/Login';
import LayoutAdmin from './layouts/LayoutAdmin';
import LayoutManager from './layouts/LayoutManager';
import LayoutAgent from './layouts/LayoutAgent';

// Pour la section Admin
import UserList from './pages/admin/UserList';
import FormationList from './pages/admin/FormationList';
import BriefingList from './pages/admin/BriefingList'
import CongerList from './pages/admin/CongerList';
import AutreDemande from './pages/admin/AutreDemande'
import ActiviterList from './pages/admin/ActiviterList'
import Dashboard from './pages/admin/Dashboard';

// Pour la section Manager
import DashboardManager from './pages/manager/DashboardManager';
import CongerListManager from './pages/manager/CongerListManager';
import AutreDemandeListManager from './pages/manager/AutreDemandeListManager';
import BriefingListManager from './pages/manager/BriefingListManager';
import DiscussionsManager from './pages/manager/DiscussionsManager';
import ActiviterListManager from './pages/manager/ActiviterListManager';
import FormationListManager from './pages/manager/FormationListManager';

// Pour la section Agent
import BriefingListAgent from './pages/agent/BriefingListAgent';
import FormationListAgent from './pages/agent/FormationListAgent';
import CongerListAgent from './pages/agent/CongerListAgent';
import AutreDemandeAgent from './pages/agent/AutreDemandeAgent';
import ActiviterListAgent from './pages/agent/ActiviterListAgent';
import DashboardAgent from './pages/agent/DashboardAgent';



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
              <Route index element={<DashboardManager/>} />
              <Route path="conger" element={<CongerListManager />}/>
              <Route path="demandes" element={<AutreDemandeListManager />}/>
              <Route path="briefing" element={<BriefingListManager />}/>
              <Route path="discussions" element={<DiscussionsManager/>}/>
              <Route path="activiter" element={<ActiviterListManager/>}/>
              <Route path="formations" element={<FormationListManager/>}/>
            </Route>
          </Route>

          {/* Agent */}
          <Route element={<PrivateRoute allowedRoles={['Agent']} />}>
            <Route path="/agent" element={<LayoutAgent />}>
              <Route index element={<DashboardAgent/>} />
              <Route path="conger" element={<CongerListAgent />}/>
              <Route path="demandes" element={<AutreDemandeAgent />}/>
              <Route path="briefing" element={<BriefingListAgent />}/>
              <Route path="discussions" element={<DiscussionsManager/>}/>
              <Route path="activiter" element={<ActiviterListAgent/>}/>
              <Route path="formations" element={<FormationListAgent/>}/>
            </Route>
          </Route>

          <Route path="/unauthorized" element={<div>403 - Accès refusé</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
