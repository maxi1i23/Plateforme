import { BarChart3, Clock, Coffee, Edit, Phone, Trash2, User } from 'lucide-react'
import React from 'react'

const ActiviterTable = ({ filteredActivites, onEdit, handleDelete, isAdmin = false }) => {

    return (
        <div className="
            bg-white/70 dark:bg-white/5 
            backdrop-blur-lg 
            rounded-2xl 
            border border-white/20 dark:border-white/10 
            shadow-xl 
            hover:shadow-2xl 
            transition-all 
            duration-300 
            overflow-hidden 
            mb-8
        ">
            <div className="overflow-x-auto">
                <table className="min-w-[800px] w-full">
                    
                    {/* HEADER */}
                    <thead className="
                        bg-gradient-to-r 
                        from-indigo-500/10 
                        to-purple-500/10 
                        dark:from-indigo-500/20 
                        dark:to-purple-500/20
                    ">
                        <tr className="text-gray-700 dark:text-gray-300">
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold">Date</th>
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold">Appels</th>
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold">Pauses</th>
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold">Durée appels</th>
                            {isAdmin && (
                                <th className="px-4 py-3 text-left text-xs uppercase font-semibold">Agent</th>
                            )}
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredActivites.length > 0 ? (
                            filteredActivites.map((a) => (
                                <tr
                                    key={a.idactiviter}
                                    className="
                                        hover:bg-indigo-50/50 
                                        dark:hover:bg-indigo-900/20 
                                        transition-colors 
                                        duration-300
                                    "
                                >
                                    {/* DATE */}
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                        {new Date(a.dateactiviter).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>

                                    {/* APPELS */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <Phone className="w-4 h-4 text-green-500 mr-2" />
                                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                                {a.nbappelle}
                                            </span>
                                        </div>
                                    </td>

                                    {/* PAUSES */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <Coffee className="w-4 h-4 text-orange-500 mr-2" />
                                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                                {a.pauses}
                                            </span>
                                        </div>
                                    </td>

                                    {/* DURÉE */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 text-purple-500 mr-2" />
                                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                                {a.dureeappelle.toFixed(2)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* AGENT (Admin Only) */}
                                    {isAdmin && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 text-blue-500 mr-2" />
                                                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                                    {a.nomutilisateur}
                                                </span>
                                            </div>
                                        </td>
                                    )}

                                    {/* ACTIONS */}
                                    <td className="px-4 py-3">
                                        <div className="flex space-x-2">

                                            {!isAdmin && (
                                                <button
                                                    onClick={() => onEdit(a)}
                                                    className="
                                                        inline-flex items-center px-3 py-1.5 
                                                        bg-blue-100 text-blue-700 
                                                        dark:bg-blue-900/30 dark:text-blue-300
                                                        rounded-xl 
                                                        hover:bg-blue-200 dark:hover:bg-blue-900/50
                                                        shadow-sm 
                                                        transition duration-200
                                                    "
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(a.idactiviter)}
                                                className="
                                                    inline-flex items-center px-3 py-1.5 
                                                    bg-red-100 text-red-700 
                                                    dark:bg-red-900/30 dark:text-red-300
                                                    rounded-xl 
                                                    hover:bg-red-200 dark:hover:bg-red-900/50
                                                    shadow-sm 
                                                    transition duration-200
                                                "
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center">
                                        <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
                                        <p className="text-gray-500 dark:text-gray-300 font-medium">
                                            Aucune activité trouvée
                                        </p>
                                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                                            Ajoutez votre première activité pour commencer
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ActiviterTable
