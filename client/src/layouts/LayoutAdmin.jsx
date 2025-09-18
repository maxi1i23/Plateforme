// src/layouts/LayoutAdmin.jsx
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { LayoutDashboard, Users, BookOpen, Presentation, CalendarDays, FileText, BarChart3, LogOut } from "lucide-react"

export default function LayoutAdmin() {
  const { logout } = useContext(AuthContext)
  const location = useLocation()

  const menuItems = [
    { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Utilisateurs', icon: Users },
    { to: '/admin/formation', label: 'Formation', icon: BookOpen },
    { to: '/admin/briefing', label: 'Briefing', icon: Presentation },
    { to: '/admin/conger', label: 'Demande de congé', icon: CalendarDays },
    { to: '/admin/autre', label: 'Autres demandes', icon: FileText },
    { to: '/admin/activiter', label: 'Activité & Performance', icon: BarChart3 },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">SUCCESS MDG</h2>
          <p className="text-sm text-gray-400">Gestion de la plateforme</p>
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
                  ${
                    active
                      ? 'bg-amber-600 text-white'
                      : 'hover:bg-gray-800 hover:text-white'
                  }`}
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

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
