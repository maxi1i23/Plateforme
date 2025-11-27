import React, { useEffect, useRef } from 'react'
import { Bell, MessageCircle, Menu, LogOut, User, ChevronDown, ToggleLeft, ToggleRight, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const NavBAr = (
    {
        setSidebarOpen, setNotificationCount, notificationCount,
        updateMessageCount, messageCount, setShowUserMenu, setShowProfile, logout, user, getCurrentPageTitle,
        showUserMenu, showProfile
    }) => {
    const userRef = useRef(null)
    const { theme, toggleTheme } = useTheme();
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
        <header
            className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-gray-700/50 flex items-center justify-between px-6 sticky top-0 z-30 transition-all duration-300"
        >
            {/* Bouton hamburger (mobile) */}
            <button
                className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setSidebarOpen(true)}
            >
                <Menu size={24} />
            </button>
            {/* Titre + date */}
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-slate-800 dark:text-gray-100 transition-colors">
                    {getCurrentPageTitle()}
                </h1>

                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
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
            {/* Section droite */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative">
                    <Link
                        to="/plateforme/notifications"
                        aria-label="Notifications"
                        className="
                    inline-flex p-3 rounded-full
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    transition-all duration-200 shadow-sm
                "
                        onClick={setNotificationCount}
                    >
                        <Bell size={20} className="text-slate-600 dark:text-gray-300" />
                    </Link>
                    {
                        notificationCount > 0 && (
                            <span
                                className="pointer-events-none absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg min-w-[18px] h-[18px] flex items-center justify-center">
                                {notificationCount}
                            </span>
                        )
                    }
                </div>
                {/* Messages */}
                <div className="relative">
                    <Link
                        to="/plateforme/discussion"
                        aria-label="Discussions"
                        className="
                    inline-flex p-3 rounded-full
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    transition-all duration-200 shadow-sm
                "
                        onClick={updateMessageCount}
                    >
                        <MessageCircle size={20} className="text-slate-600 dark:text-gray-300" />
                    </Link>

                    {messageCount > 0 && (
                        <span
                            className="
                        pointer-events-none absolute -top-1 -right-1 
                        bg-gradient-to-r from-red-500 to-red-600 
                        text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg
                        min-w-[18px] h-[18px] flex items-center justify-center
                    "
                        >
                            {messageCount > 99 ? "99+" : messageCount}
                        </span>
                    )}
                </div>

                {/* USER */}
                <div className="relative flex items-center gap-3 cursor-pointer" ref={userRef}>
                    {/* Avatar */}
                    <div
                        className="
                    w-11 h-11 
                    bg-gradient-to-r from-blue-600 to-indigo-700 
                    dark:from-indigo-500 dark:to-purple-600
                    rounded-full flex items-center justify-center 
                    text-white text-sm font-bold shadow 
                    transition-all
                "
                        onClick={() => setShowUserMenu(prev => !prev)}
                    >
                        {user?.nomutilisateur?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    {/* Infos utilisateur */}
                    <div
                        className="hidden md:flex text-left items-center gap-2"
                        onClick={() => setShowUserMenu(prev => !prev)}
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-gray-100">{user?.nomutilisateur}</p>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-xs text-slate-500 dark:text-gray-400">En ligne</span>
                            </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    {/* Menu utilisateur */}
                    {showUserMenu && (
                        <div
                            className="
                        absolute right-0 top-full mt-2 w-50
                        bg-white/90 dark:bg-gray-900/90
                        backdrop-blur-xl 
                        rounded-xl shadow-xl 
                        border border-gray-200/50 dark:border-gray-700/50
                        py-2 z-50 overflow-hidden 
                        transition-all
                    "
                        >
                            {/* Header user */}
                            <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/40 
                        bg-gray-50 dark:bg-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="
                                w-10 h-10 rounded-full 
                                bg-gradient-to-br from-blue-600 to-indigo-700
                                dark:from-indigo-500 dark:to-purple-600
                                flex items-center justify-center text-white font-bold
                            ">
                                        {user?.nomutilisateur?.charAt(0)?.toUpperCase() || "U"}
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                            {user?.nomutilisateur}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            {user?.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Menu Items */}
                            <div className="py-1">
                                {/* Profil */}
                                <button
                                    className="
                                w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                text-gray-700 dark:text-gray-300
                                hover:bg-gray-100 dark:hover:bg-gray-800
                                transition-all duration-300
                            "
                                    onClick={() => {
                                        setShowProfile(!showProfile)
                                        setShowUserMenu(false)
                                    }}
                                >
                                    <User size={18} />
                                    <span>Profil</span>
                                </button>

                                {/* Dark mode switch */}
                                <button
                                    onClick={toggleTheme}
                                    className="
                                w-full flex items-center justify-between px-4 py-2.5 text-sm 
                                text-gray-700 dark:text-gray-300
                                hover:bg-gray-100 dark:hover:bg-gray-800
                                transition-all duration-300
                            "
                                >
                                    <div className="flex items-center gap-3">
                                        {theme === "dark" ? (
                                            <Moon size={18} className="text-gray-300" />
                                        ) : (
                                            <Sun size={18} className="text-yellow-500" />
                                        )}
                                    </div>

                                    {/* Switch animé */}
                                    <div
                                        className={`relative w-10 h-5 rounded-full transition-all duration-300 
                                ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
                                    >
                                        <div
                                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 
                                    ${theme === "dark" ? "translate-x-5" : "translate-x-1"}`}
                                        ></div>
                                    </div>
                                </button>
                                {/* Divider */}
                                <div className="my-1 mx-2 border-t border-gray-200/50 dark:border-gray-700/30"></div>
                                {/* Logout */}
                                <button
                                    onClick={logout}
                                    className="
                                w-full px-4 py-2.5 text-sm text-red-600 
                                hover:bg-red-50 dark:hover:bg-red-900/30 
                                transition-all duration-300 flex items-center gap-3"
                                >
                                    <LogOut size={18} className="text-red-500" />
                                    <span>Déconnexion</span>
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