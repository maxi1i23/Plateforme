"use client"

// src/layouts/LayoutAdmin.jsx
import { Outlet, Link, useLocation } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Presentation,
  CalendarDays,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  ChevronDown,
} from "lucide-react"

export default function LayoutAdmin() {
  const { logout, user } = useContext(AuthContext)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const menuItems = [
    { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
    { to: "/admin/users", label: "Utilisateurs", icon: Users },
    { to: "/admin/formation", label: "Formation", icon: BookOpen },
    { to: "/admin/briefing", label: "Briefing", icon: Presentation },
    { to: "/admin/conger", label: "Demande de congé", icon: CalendarDays },
    { to: "/admin/autre", label: "Autres demandes", icon: FileText },
    { to: "/admin/activiter", label: "Activité & Performance", icon: BarChart3 },
  ]

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find((item) => item.to === location.pathname)
    return currentItem ? currentItem.label : "Tableau de bord"
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-72" : "w-20"} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-2xl border-r border-slate-700/50`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  SUCCESS MDG
                </h2>
                <p className="text-sm text-slate-400 mt-1">Gestion de la plateforme</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors duration-200"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden
                  ${
                    active
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                      : "hover:bg-slate-700/50 hover:text-white hover:shadow-md"
                  }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 animate-pulse" />
                )}
                <Icon
                  size={20}
                  className={`${active ? "text-white" : "text-slate-400 group-hover:text-white"} transition-colors duration-200 relative z-10`}
                />
                {sidebarOpen && (
                  <span className={`font-medium relative z-10 ${active ? "text-white" : "text-slate-300"}`}>
                    {label}
                  </span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
          {sidebarOpen && (
            <div className="mb-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.nomutilisateur?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.nomutilisateur || "Utilisateur"}</p>
                  <p className="text-xs text-slate-400">Administrateur</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/25 ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 flex items-center justify-between px-6 sticky top-0 z-40">
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

          <div className="flex items-center gap-4">
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.nomutilisateur?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-700">{user?.nomutilisateur || "Utilisateur"}</p>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-slate-500">En ligne</span>
                  </div>
                </div>
                
              </button>

              {/* User Dropdown */}
              
            </div>
          </div>
        </header>

        {/* Contenu des pages */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
