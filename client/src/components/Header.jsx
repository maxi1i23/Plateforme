import React from 'react'
import { Search, PlusCircle } from 'lucide-react'

const Header = ({ 
    title, 
    description, 
    searchTerm, 
    setSearchTerm, 
    openAddModal, 
    buttonText, 
    allowedRoles, 
    userRole, 
    search = true 
}) => {

    const isAllowed = !allowedRoles || allowedRoles.includes(userRole)
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 dark:bg-white/5">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 dark:border-white/10 dark:shadow-2xl ">
                <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 dark:from-blue-400 dark:to-purple-400">
                        {title || "Gestion des Utilisateurs"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">{description || "Gérez les comptes utilisateurs et leurs permissions"}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {
                        search && (
                            <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Faites votre recherche"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-80 dark:bg-white/5 dark:border-gray-600 dark:text-gray-100"
                        />
                    </div>
                        )
                    }
                    {
                        isAllowed && (
                            <button
                                onClick={openAddModal}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
                                <PlusCircle size={20} /> {buttonText || "Ajouter un utilisateur"}
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Header
