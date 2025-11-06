import { FileText, X, Calendar, User, Clock } from 'lucide-react'
import React from 'react'


const InfoDisplay = ({ info, setInfo, Icon }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in   duration-200">
            <div 
                className="bg-white/90 backdrop-blur-md rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">{info.title}</h2>
                                <div className="flex items-center gap-2 text-white/90">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {new Date(info.date).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setInfo(null)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:rotate-90 group"
                        >
                            <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Description Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-justify max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {info.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Manager Card */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-0.5">Autheur</p>
                                    <p className="font-semibold text-gray-800">{info.author}</p>
                                </div>
                            </div>
                        </div>

                        {/* Date Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-0.5">Date  </p>
                                    <p className="font-semibold text-gray-800">
                                        {new Date(info.date).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoDisplay
