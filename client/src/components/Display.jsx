import React from 'react'
import { FileText, Calendar, User, X } from 'lucide-react'

const Display = ({ formation, setFormation }) => {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/20 relative">
                <div>
                    <div className='flex items-center justify-between  mb-3'>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h5 className="text-xl font-bold text-gray-800 line-clamp-1">{formation.nomformation}</h5>
                        </div>
                        <div>
                            <button onClick={() => setFormation(null)}>
                                <X className="cursor-pointer" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {new Date(formation.dateformation).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>

                    <p className="text-gray-700 mb-4 max-h-56 overflow-y-auto p-2">
                        {formation.descriptionformation}
                    </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200/50">

                    <div className="flex items-center justify-between gap-2 text-sm">
                        <div className="flex items-center justify-between text-sm ">
                            <div className="p-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                                <User className="w-3 h-3 text-white" />
                            </div>
                            <span className="font-medium ms-2 text-gray-700">{formation.nommanager}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Display
