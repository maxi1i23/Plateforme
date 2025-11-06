"use client"
import { X, Mail, Shield, Calendar, LogOut, User, Edit2Icon, Save } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import api from "../services/api"
import Swal from 'sweetalert2'

const Profile = ({ user, onClose, logout }) => {
    if (!user) return null

    const [nomUtilisateur, setNomUtilisateur] = useState(user.nomutilisateur)
    const [edit, setEdit] = useState(false)

    const inputRef = useRef(null)
    useEffect(() => {
        if (edit && inputRef.current) {
            inputRef.current.focus()
        }
    }, [edit])


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
            setEdit(false);
        }
    }
    const handleSubmit = async () => {
        try {
            if (nomUtilisateur == user.nomutilisateur || nomUtilisateur.trim() == "") {
                return;
            }
            await api.put(`/user/update/${user.idutilisateur}`, { nomUtilisateur })
            Swal.fire({
                title: 'Succès',
                icon: 'success',
                text: 'La mise à jour sera visible lors de votre prochaine connexion. Voulez-vous vous déconnecter maintenant ?',
                showCancelButton: true,
                confirmButtonText: 'Oui, me déconnecter',
                cancelButtonText: 'Non, plus tard'
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        logout()
                    }
                });
        } catch (error) {
            console.error(error);
        }
        setEdit(false);
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-200/50 transform transition-all duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-700 transition-all duration-200"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center pb-6 border-b border-gray-200/50">
                    {/* Avatar with gradient */}
                    {user.photo ? (
                        <img
                            src={user.photo || "/placeholder.svg"}
                            alt="Photo de profil"
                            className="w-28 h-28 rounded-full border-4 border-white shadow-xl ring-4 ring-gray-200/50"
                        />
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-gray-200/50">
                            {user.nomutilisateur?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">{user.nomutilisateur || "Utilisateur"}</h2>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-sm text-gray-500">En ligne</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                            <User size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Nom complet</p>
                            <div className="flex items-center justify-between">
                                {
                                    !edit ? (
                                        <>
                                            <p className="text-sm text-gray-800 font-semibold">{user.nomutilisateur}</p>
                                            <button
                                                className="px-2 py-1 rounded-md transition-all duration-200"
                                                onClick={() => setEdit(true)}
                                            >
                                                <Edit2Icon size={16} className="transition-all duration-200" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                ref={inputRef}  // 👈 on met la ref ici
                                                id="nom"
                                                type="text"
                                                className="text-sm p-1 text-gray-800 font-semibold focus:outline-none border-0 border-b-2 focus:border-blue-500"
                                                value={nomUtilisateur}
                                                onChange={(e) => setNomUtilisateur(e.target.value)}
                                                onKeyDown={handleKeyPress}
                                            />
                                            <button className="px-2 py-1 rounded-md transition-all duration-200">
                                                <Save
                                                    size={16}
                                                    className="transition-all duration-200"
                                                    onClick={handleSubmit}
                                                />
                                            </button>
                                        </>
                                    )
                                }



                            </div>

                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                            <Mail size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Email</p>
                            <p className="text-sm text-gray-800 font-semibold">{user.emailutilisateur}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                            <Shield size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Rôle</p>
                            <p className="text-sm text-gray-800 font-semibold">{user.role}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                            <Calendar size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Membre depuis</p>
                            <p className="text-sm text-gray-800 font-semibold">
                                {new Date(user.dateinscription).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-400 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium" onClick={logout}>
                        <LogOut size={18} />
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profile