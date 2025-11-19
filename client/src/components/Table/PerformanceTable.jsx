import { TrendingUp, User } from 'lucide-react'
import React from 'react'

const PerformanceTable = ({performances, isAdmin}) => {
    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-green-500/10 to-blue-500/10">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs uppercase font-semibold text-gray-700">Semaine</th>
                            <th className="px-6 py-4 text-left text-xs uppercase font-semibold text-gray-700">Mois</th>
                            <th className="px-6 py-4 text-left text-xs uppercase font-semibold text-gray-700">Productivité</th>
                            {isAdmin && (
                                <th className="px-6 py-4 text-left text-xs uppercase font-semibold text-gray-700">Agent</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {performances.length > 0 ? (
                            performances.map((p) => (
                                <tr key={p.idperformance} className="hover:bg-white/50 transition-all duration-200">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-sm text-gray-900">{p.semaine}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-sm text-gray-900">{p.mois}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                                            <span className="font-semibold text-sm text-green-600">{(p.productiviter * 100).toFixed(1)} %</span>
                                        </div>
                                    </td>
                                    {
                                        isAdmin && (
                                            <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 text-blue-500 mr-2" />
                                            <span className="font-semibold text-sm text-gray-900">{p.nomutilisateur} </span>
                                        </div>
                                    </td>
                                        )
                                    }
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <TrendingUp className="w-12 h-12 text-gray-400 mb-4" />
                                        <p className="text-gray-500 font-medium">Aucune performance trouvée</p>
                                        <p className="text-gray-400 text-sm">Les performances seront calculées automatiquement</p>
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
