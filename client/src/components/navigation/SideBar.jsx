import React from 'react'
import { Link } from 'react-router-dom'
import { X, LogOut } from 'lucide-react'

const SideBar = ({sidebarOpen, setSidebarOpen, menuItems, location, logout, role}) => {
    return (
        <aside
            className={`fixed top-0 left-0 h-screen w-64 bg-white/90 backdrop-blur-md border-r border-gray-200/50 text-gray-700 flex flex-col shadow-xl z-50 
          transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}>{/** // 👈 visible par défaut sur desktop */}
            {/* Logo */}
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">SUCCESS MDG</h2>
                        <p className="text-sm text-gray-500">Espace {role}</p>
                    </div>
                </div>
                {/* Bouton X (mobile) */}
                <button
                    className="md:hidden text-gray-600 hover:text-gray-900"
                    onClick={() => setSidebarOpen(false)}>
                    <X size={22} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems?.map(({ to, label, icon: Icon }) => {
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
                                }`}>
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
    )
}

export default SideBar