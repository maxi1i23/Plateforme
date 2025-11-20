import { TrendingUp, User } from 'lucide-react'
import React from 'react'

const PerformanceTable = ({ performances, isAdmin }) => {
    return (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 
                        shadow-xl overflow-hidden transition-all duration-300">
            
            <div className="overflow-x-auto">
                <table className="min-w-[600px] w-full">
                    
                    {/* En-tête */}
                    <thead className="bg-gradient-to-r from-green-500/10 to-blue-500/10 
                                     dark:from-green-900/20 dark:to-blue-900/20 backdrop-blur-xl">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold 
                                           text-gray-700 dark:text-gray-300">Semaine</th>

                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold 
                                           text-gray-700 dark:text-gray-300">Mois</th>

                            <th className="px-4 py-3 text-left text-xs uppercase font-semibold 
                                           text-gray-700 dark:text-gray-300">Productivité</th>

                            {isAdmin && (
                                <th className="px-4 py-3 text-left text-xs uppercase font-semibold 
                                               text-gray-700 dark:text-gray-300">Agent</th>
                            )}
                        </tr>
                    </thead>

                    {/* Corps */}
                    <tbody className="divide-y divide-gray-200/50 dark:divide-white/10">
                        {performances.length > 0 ? (
                            performances.map((p) => (
                                <tr
                                    key={p.idperformance}
                                    className="hover:bg-white/50 dark:hover:bg-white/10 
                                               transition-all duration-200"
                                >
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                            {p.semaine}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                            {p.mois}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400 mr-2" />
                                            <span className="font-semibold text-sm text-green-600 dark:text-green-400">
                                                {(p.productiviter * 100).toFixed(1)} %
                                            </span>
                                        </div>
                                    </td>

                                    {isAdmin && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2" />
                                                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                                    {p.nomutilisateur}
                                                </span>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? 4 : 3} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
                                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                                            Aucune performance trouvée
                                        </p>
                                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                                            Les performances seront calculées automatiquement
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

export default PerformanceTable
