import { BarChart3, Clock, Coffee, Edit, Phone, Trash2, User } from 'lucide-react'
import React from 'react'

const ActiviterTable = ({ filteredActivites, onEdit, handleDelete, isAdmin = false }) => {

    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
                <table className="min-w-[800px] w-full">
                    <thead className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold text-gray-700">Date</th>
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold text-gray-700">Appels</th>
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold text-gray-700">Pauses</th>
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold text-gray-700">Durée appels (min)</th>
                            {isAdmin && (
                                <th className="px-4 py-3 text-left text-xs uppercase font-semibold text-gray-700">
                                    Agent
                                </th>
                            )}
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredActivites.length > 0 ? (
                            filteredActivites.map((a) => (
                                <tr key={a.idactiviter} className="hover:bg-blue-50/50 transition-colors duration-200">
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {new Date(a.dateactiviter).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <Phone className="w-4 h-4 text-green-500 mr-2" />
                                            <span className="font-semibold text-sm text-gray-900">{a.nbappelle}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <Coffee className="w-4 h-4 text-orange-500 mr-2" />
                                            <span className="font-semibold text-sm text-gray-900">{a.pauses}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 text-purple-500 mr-2" />
                                            <span className="font-semibold text-sm text-gray-900">{a.dureeappelle.toFixed(2)}</span>
                                        </div>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 text-blue-500 mr-2" />
                                                <span className="font-semibold text-sm text-gray-900">{a.nomutilisateur}</span>
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-4 py-3">
                                        <div className="flex space-x-2">
                                            {!isAdmin && (
                                                <button
                                                    onClick={() => onEdit(a)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(a.idactiviter)}
                                                className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
                                        <p className="text-gray-500 font-medium">Aucune activité trouvée</p>
                                        <p className="text-gray-400 text-sm">
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
