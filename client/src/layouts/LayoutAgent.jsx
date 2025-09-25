import { Outlet, Link, useLocation } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import {
  BookOpen,
  Presentation,
  CalendarDays,
  FileText,
  BarChart3,
  MessageCircle,
  LogOut,
  Menu,
  X, Bell
} from "lucide-react"
import { useSocket } from "../context/SocketContext"

export default function LayoutAgent() {
  const { logout, user } = useContext(AuthContext)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false) // 👈 état sidebar mobile
  const { socket } = useSocket();
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  const menuItems = [
    { to: "/agent", label: "Tableau de bord", icon: BarChart3 },
    { to: "/agent/conger", label: "Demandes de congé", icon: CalendarDays },
    { to: "/agent/demandes", label: "Autres demandes", icon: FileText },
    { to: "/agent/briefing", label: "Briefings", icon: Presentation },
    { to: "/agent/formations", label: "Formations", icon: BookOpen },
    { to: "/agent/discussions", label: "Discussion", icon: MessageCircle },
    { to: "/agent/activiter", label: "Activité & Performance", icon: BarChart3 }
  ]

  useEffect(() => {
    if (!socket) return;

    console.log(" Socket connecté, on écoute NouvellePublication");

    const handleNouvellePublication = (data) => {
      console.log(" Nouvelle publication reçue:", data);
      setNotificationCount(prev => prev + 1);
    };

    const handleMessage = (data) => {
      console.log("💌 Nouveau message reçu:", data);
      setMessageCount(prev => prev + 1);
    }

    socket.on("NouvellePublication", handleNouvellePublication);
    socket.on("NouveauxMessage", handleMessage);

    return () => {
      socket.off("NouvellePublication", handler); // cleanup
    };
  }, [socket]);


  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find((item) => item.to === location.pathname)
    return currentItem ? currentItem.label : "Tableau de bord"
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (desktop + mobile) */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white/90 backdrop-blur-md border-r border-gray-200/50 text-gray-700 flex flex-col shadow-xl z-50 
          transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`} // 👈 visible par défaut sur desktop
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">SUCCESS MDG</h2>
              <p className="text-sm text-gray-500">Espace Agent</p>
            </div>
          </div>
          {/* Bouton X (mobile) */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)} // 👈 ferme menu après clic
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                  ${active
                    ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg transform scale-105"
                    : "hover:bg-gray-100 hover:text-gray-800 hover:shadow-md hover:transform hover:scale-102"
                  }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-700/20 animate-pulse"></div>
                )}
                <Icon
                  size={20}
                  className={`relative z-10 ${active ? "text-white" : "text-gray-600 group-hover:text-gray-800"}`}
                />
                <span
                  className={`relative z-10 font-medium ${active ? "text-white" : "text-gray-700 group-hover:text-gray-800"}`}
                >
                  {label}
                </span>
                {active && <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white 
              hover:from-gray-500 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group cursor-pointer"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Overlay sombre sur mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Navbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 flex items-center justify-between px-6 sticky top-0 z-30">
          {/* Bouton hamburger (mobile) */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Titre */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800">{getCurrentPageTitle()}</h1>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <span>•</span>
              <span>
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Profil */}
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <div className="relative">
              <Link
                to="/agent/notifications"
                aria-label="Notifications"
                className="inline-flex p-3 rounded-full hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 transition-all duration-200 shadow-sm"
                onClick={()=>setNotificationCount(0)}
              >
                <Bell size={20} className="text-slate-600" />
              </Link>

              {notificationCount > 0 && (
                <span
                  className="pointer-events-none absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg min-w-[18px] h-[18px] flex items-center justify-center"
                  aria-hidden="true"
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </div>
            {/* Messages */}
            <div className="relative">
              <Link
                to="/agent/discussions"
                aria-label="Discussions"
                className="inline-flex p-3 rounded-full hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 transition-all duration-200 shadow-sm"
                onClick={()=>setMessageCount(0)}
              >
                <MessageCircle size={20} className="text-slate-600" />
              </Link>

              {messageCount > 0 && (
                <span
                  className="pointer-events-none absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg min-w-[18px] h-[18px] flex items-center justify-center"
                  aria-hidden="true"
                >
                  {messageCount > 99 ? "99+" : messageCount}
                </span>
              )}
            </div>

            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.nomutilisateur?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-700">{user?.nomutilisateur || "Utilisateur"}</p>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-slate-500">En ligne</span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
