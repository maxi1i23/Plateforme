// src/layouts/LayoutManager.jsx
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { 
  Users, BookOpen, Presentation, CalendarDays, FileText, BarChart3, MessageCircle, LogOut 
} from "lucide-react"

export default function LayoutManager() {
  const { logout, user } = useContext(AuthContext)
  const location = useLocation()

  const menuItems = [
    { to: '/manager', label: 'Tableau de bord', icon: BarChart3 },
    { to: '/manager/conger', label: 'Demandes de congé', icon: CalendarDays },
    { to: '/manager/demandes', label: 'Autres demandes', icon: FileText },
    { to: '/manager/briefing', label: 'Créer / Modifier briefing', icon: Presentation },
    { to: '/manager/discussions', label: 'Discussion', icon: MessageCircle },
    { to: '/manager/activiter', label: 'Activité & Performance', icon: BarChart3 },
    { to: '/manager/formations', label: 'Formations publiées', icon: BookOpen },
    { to: '/manager/briefing-publie', label: 'Briefing publiés', icon: Presentation },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">SUCCESS MDG</h2>
          <p className="text-sm text-gray-400">Espace Manager</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition 
                  ${active ? 'bg-amber-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-red-600 text-white 
              hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Tableau de bord</h1>
          <div className="flex items-center gap-3">
            {/* Nom du manager avec statut en ligne */}
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-medium">{user?.nomutilisateur || "Manager"}</span>
            </span>
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
