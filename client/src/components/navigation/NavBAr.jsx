import React, { useEffect, useRef } from 'react'
import { Bell, MessageCircle, Menu, LogOut, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const NavBAr = (
    {
        setSidebarOpen, setNotificationCount, notificationCount,
        updateMessageCount, messageCount, setShowUserMenu, setShowProfile, logout, user, getCurrentPageTitle,
        showUserMenu, showProfile
    }) => {
    const userRef = useRef(null)

    {/** Pour fermer le menu profile en cas de clic à l'éxétieur */ }
    useEffect(() => {
        const handleClickOutside = event => {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setShowUserMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (

        <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Bouton hamburger (mobile) */}
            <button
                className="md:hidden text-gray-600 hover:text-gray-900"
                onClick={() => setSidebarOpen(true)}>
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
                        to="/plateforme/notifications"
                        aria-label="Notifications"
                        className="inline-flex p-3 rounded-full hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 transition-all duration-200 shadow-sm"
                        onClick={() => setNotificationCount(0)}>
                        <Bell size={20} className="text-slate-600" />
                    </Link>

                    {notificationCount > 0 ?
                        <span
                            className="pointer-events-none absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg min-w-[18px] h-[18px] flex items-center justify-center"
                            aria-hidden="true">
                            {notificationCount > 99 ? "99+" : notificationCount}
                        </span>
                        :
                        <span
                            className="pointer-events-none absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg min-w-[15px] h-[15px] flex items-center justify-center"
                            aria-hidden="true">
                            {""}
                        </span>
                    }
                </div>
                {/* Messages */}
                <div className="relative">
                    <Link
                        to="/plateforme/discussion"
                        aria-label="Discussions"
                        className="inline-flex  p-3 rounded-full hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 transition-all duration-200 shadow-sm  "
                        onClick={updateMessageCount}>
                        <MessageCircle size={20} className="text-slate-600" />
                    </Link>
                    {messageCount > 0 && (
                        <span
                            className="pointer-events-none absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg min-w-[18px] h-[18px] flex items-center justify-center"
                            aria-hidden="true">
                            {messageCount > 99 ? "99+" : messageCount}
                        </span>
                    )}
                </div>
                <div className="relative flex items-center gap-3 cursor-pointer" ref={userRef}>
                    <div className="w-11 h-11 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        onClick={() => setShowUserMenu(prev => !prev)}>
                        {user?.nomutilisateur?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="hidden md:block text-left" onClick={() => setShowUserMenu(prev => !prev)}>
                        <p className="text-sm font-medium text-slate-700">{user?.nomutilisateur || "Utilisateur"}</p>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-xs text-slate-500">En ligne</span>
                        </div>
                    </div>
                    {/* Menu utilisateur */}
                    {showUserMenu && (
                        <div className="absolute right-0 top-full mt-2 w-auto bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 py-2 z-50 overflow-hidden">
                            {/* User Info Header */}
                            <div className="px-4 py-3 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                                        {user?.nomutilisateur?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{user?.nomutilisateur}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            {user?.role || "Manager"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Menu Items */}
                            <div className="py-1">
                                {/* Profile Button */}
                                <button
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 transition-all duration-300 flex items-center gap-3 group"
                                    onClick={() => {
                                        setShowProfile(!showProfile)
                                        setShowUserMenu(!showUserMenu)
                                    }}>
                                    <User size={18} className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
                                    <span className="font-medium group-hover:text-gray-900">Profil</span>
                                </button>
                                {/* Divider */}
                                <div className="my-1 mx-2 border-t border-gray-200/50"></div>
                                {/* Logout Button */}
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 flex items-center gap-3 group rounded-lg mx-2">
                                    <LogOut
                                        size={18}
                                        className="text-red-500 group-hover:text-red-700 group-hover:rotate-12 transition-all duration-300"
                                    />
                                    <span className="font-medium group-hover:text-red-700">Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
export default NavBAr