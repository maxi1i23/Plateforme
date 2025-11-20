import React from 'react'
import { Link } from 'react-router-dom'
import { X, LogOut } from 'lucide-react'

const SideBar = ({ sidebarOpen, setSidebarOpen, menuItems, location, logout, role }) => {
    return (
        <aside
            className={`fixed top-0 left-0 h-screen w-64 
            bg-white/90 dark:bg-gray-900/90 
            backdrop-blur-xl 
            border-r border-gray-200/50 dark:border-gray-700/50 
            text-gray-700 dark:text-gray-200 
            flex flex-col shadow-xl z-50 
            transform transition-transform duration-300 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0`}
        >
            {/* Header Logo */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/40 
                bg-gradient-to-r from-gray-50 to-white 
                dark:from-gray-800 dark:to-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 
                        dark:from-indigo-500 dark:to-purple-600 
                        rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">SUCCESS MDG</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Espace {role}</p>
                    </div>
                </div>
                {/* Close for mobile */}
                <button
                    className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
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
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl 
                                transition-all duration-300 group relative overflow-hidden
                                
                                ${active
                                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-indigo-500 dark:to-purple-700 text-white shadow-lg scale-105"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-100"}
                            `}
                        >
                            {/* Pulse background for active */}
                            {active && (
                                <div className="absolute inset-0 bg-white/10 dark:bg-black/20 animate-pulse"></div>
                            )}

                            {/* Icon */}
                            <Icon
                                size={20}
                                className={`relative z-10 
                                    ${active ? "text-white" : "text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"}
                                `}
                            />

                            {/* Label */}
                            <span className={`relative z-10 font-medium
                                ${active ? "text-white" : "text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"}
                            `}>
                                {label}
                            </span>

                            {/* Pulse dot indicator */}
                            {active && <div className="absolute right-2 w-2 h-2 bg-white dark:bg-gray-200 rounded-full animate-ping"></div>}
                        </Link>
                    )
                })}
            </nav>
            {/* Logout */}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/40 
                bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl 
                        bg-gradient-to-br from-blue-600 to-indigo-700
                        dark:from-red-500 dark:to-red-600
                        text-white 
                        hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                    <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </aside>
    )
}
export default SideBar
