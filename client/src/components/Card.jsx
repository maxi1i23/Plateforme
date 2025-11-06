import { User } from 'lucide-react'
import React from 'react'

const Card = ({ title, value, Icon, style, bg }) => {
    const tab = style.split(' ')
    const textStyle = tab[2]
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title || "Total"}</p>
                    <p className={`text-2xl mt-2 font-bold ${textStyle}`}>{value || 0}</p>
                </div>
                <div className={` ${bg || 'bg-blue-100'} p-3 rounded-lg`}>
                    <Icon className={style || "w-6 h-6 text-blue-600"} />
                </div>
            </div>
        </div>
    )
}

export default Card
