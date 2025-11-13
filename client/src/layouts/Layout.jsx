import React, { useContext, useEffect, useRef, useState } from 'react'
import SideBar from '../components/navigation/SideBar'
import NavBAr from '../components/navigation/NavBAr'
import { Outlet, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { BarChart3, BookOpen, CalendarDays, CalendarRange, FileText, LayoutDashboard, Presentation, Users } from 'lucide-react'
import api from '../services/api'
import Profile from '../components/Profile'

const Layout = () => {
  const { logout, user } = useContext(AuthContext)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { socket } = useSocket()
  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  {/** Mettre à jour le conteur de message */ }
  const updateMessageCount = async () => {
    try {
      await api.put(`/message/update`)
      setMessageCount(0)
    } catch (error) {
      console.log(error)
    }
  }

  {/** Pour avoir le titre de la page active */ }
  const getCurrentPageTitle = () => {
    const currentItem = menuItems?.find((item) => item.to === location.pathname)
    if (currentItem) {
      return currentItem.label
    } else if (location.pathname === "/plateforme/discussion") {
      return "Discussions"
    } else if (location.pathname === "/plateforme/notifications") {
      return "Notifications"
    }

    return "Tableau de bord";
  }

  {/** Pour stocker les path selon le role de l'utilisateur */ }
  const menuItems = [
    { to: "/plateforme", label: "Tableau de bord", icon: LayoutDashboard },
    user.role === 'Admin' && { to: "/plateforme/utilisateurs", label: "Utilisateurs", icon: Users },
    { to: "/plateforme/formations", label: "Formation", icon: BookOpen },
    { to: "/plateforme/briefings", label: "Briefing", icon: Presentation },
    { to: "/plateforme/congers", label: "Demandes de congé", icon: CalendarDays },
    { to: "/plateforme/autres", label: "Autres demandes", icon: CalendarRange },
    user.role != 'Manager' && { to: "/plateforme/activiter", label: "Activité & Performance", icon: BarChart3 }
  ].filter(Boolean)

  {/** A éxécuter aux rendu du composant */ }
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get('/message/unread/count');
        setMessageCount(res.data.count);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUnreadCount();
  }, []);

  {/** Ecoute des évènement via socket */ }
  useEffect(() => {
    if (!socket) return;

    const handleNouvelleDemande = (data) => {
      setNotificationCount(prev => prev + 1);
    };

    const handleNouvellePublication = (data) => {
      setNotificationCount(prev => prev + 1);
    };

    const handleMessage = (data) => {
      setMessageCount(prev => parseInt(prev) + 1);
    }

    socket.on("NouvelleDemande", handleNouvelleDemande);
    socket.on("NouvellePublication", handleNouvellePublication);
    socket.on("NouveauxMessage", handleMessage);

    return () => {
      socket.off("NouvelleDemande", handleNouvelleDemande);
      socket.off("NouvellePublication", handleNouvellePublication);
    };
  }, [socket]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (desktop + mobile) */}
      <SideBar
        location={location}
        logout={logout}
        menuItems={menuItems}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        role={user.role}
      />
      {/* Overlay sombre sur mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Contenu principal */}
      <div className="flex flex-col flex-1 lg:ml-64">
        {/* Navbar */}
        <NavBAr
          logout={logout} messageCount={messageCount}
          notificationCount={notificationCount} setNotificationCount={setNotificationCount}
          setShowProfile={setShowProfile} setShowUserMenu={setShowUserMenu}
          setSidebarOpen={setSidebarOpen} user={user} updateMessageCount={updateMessageCount}
          getCurrentPageTitle={getCurrentPageTitle} showProfile={showProfile} showUserMenu={showUserMenu}
        />
        {
          showProfile && (
            <Profile
              logout={logout}
              user={user}
              onClose={() => setShowProfile(false)}
            />
          )
        }
        {/* Contenu */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
