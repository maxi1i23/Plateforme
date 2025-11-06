import React, { useEffect } from 'react'
import { MoreVertical, Edit, Trash, Calendar, User, Eye, Star } from 'lucide-react'

const Info = ({ user, info, openMenuId, setOpenMenuId, Icon, handleDelete, handleEdit, handleInfo, isBriefing = false, feed }) => {
    {/**
    - id : id formation ou briefing
    - idAuthor : id du manager ou de l'admin
    - author : nom du manager ou de l'admin
    - title : nom du formation/brief
    - description : description
    - date
    */}

    {/** Fermer le menu en cas de clic en dehors => onBlur */ }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".menu-formation")) {
                setOpenMenuId(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div
            key={info.id}
            className="relative p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            {info.idAuthor === user.idutilisateur && (
                <div className="absolute top-4 right-4 menu-formation">
                    <button
                        onClick={() => setOpenMenuId(openMenuId === info.id ? null : info.id)}
                        className="p-2 rounded-full hover:bg-white/50 transition-all duration-200 opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    {openMenuId === info.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg z-10 overflow-hidden">
                            <button
                                onClick={() => handleEdit(info)}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                            >
                                <Edit className="w-4 h-4 mr-2 text-indigo-600" /> Modifier
                            </button>
                            <button
                                onClick={() => handleDelete(info.id)}
                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash className="w-4 h-4 mr-2" /> Supprimer
                            </button>
                        </div>
                    )}
                </div>
            )}
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h5 className="text-xl font-bold text-gray-800 line-clamp-1">{info.title}</h5>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>
                        {new Date(info.date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>
                <p className="text-gray-700 line-clamp-3 mb-4 leading-relaxed">{info.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200/50">
                <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center justify-between text-sm ">
                        <div className="p-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                            <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium ms-2 text-gray-700"> {info.author}</span>
                    </div>
                    {/** Les boutons voir , avis */}
                    <div className="flex items-center justify-between gap-2 mt-2">
                        {/** Bouton voir */}
                        <button
                            onClick={() => handleInfo(info)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-emerald-100 text-emerald-600 rounded-lg  hover:bg-emerald-100 hover:shadow transition-all duration-200">
                            <Eye className="w-4 h-4" />
                            Voir
                        </button>
                        {
                            isBriefing && (
                                <button onClick={() => feed(info)}className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 hover:shadow transition-all duration-200">
                                    <Star className="w-4 h-4" />
                                    Avis
                                </button>
                            )
                        }
                        {info.idAuthor === user.idutilisateur && (
                            <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                                {isBriefing ? "Mes Briefings" : " Mes Formations"}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Info