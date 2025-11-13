import { User } from 'lucide-react'
import React from 'react'

const Card = ({ title, value, Icon, bg, style }) => {

    return (
        <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            {/* Haut de la carte */}
            <div className="flex items-start justify-between mb-4">
                <div
                    className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {value ?? 0}
                    </p>
                </div>
            </div>

            {/* Titre et sous-titre */}
            <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                {title || "Titre"}
            </h3>

            {/* Ligne d'accent en bas */}
            <div
                className={`mt-4 h-1 ${bg} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
            ></div>
        </div>
    )
}

export default Card
