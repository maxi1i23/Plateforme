"use client"

import { useEffect, useState, useContext } from "react"
import api from "../services/api"
import { MoreVertical, Bell, BellOff, Trash, ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react"
import Swal from "sweetalert2"
import { AuthContext } from '../context/AuthContext'

const Notification = () => {
    const [notification, setNotification] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useContext(AuthContext)
    const notificationsPerPage = 9

    const getNotifications = async () => {
        try {
            setLoading(true)
            const response = await api.get("/notification")
            const raisonForgetPass = "Mot de passe oublié"
            const result = response.data.filter(
                (item) => item.idutilisateurdestinataire == user.idutilisateur || (item.idutilisateurdestinataire == null && item.raisonnotification != raisonForgetPass) 
            );
            console.log(result)
            if (user.role == "Admin") {
                setNotification(response.data)
            } else {
                setNotification(result)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (idnotification) => {
        const result = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Cette notification sera supprimée définitivement !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Oui, supprimer !",
            cancelButtonText: "Annuler",
        })

        if (result.isConfirmed) {
            try {
                await api.delete(`/notification/delete/${idnotification}`)
                setNotification((prev) => prev.filter((n) => n.idnotification !== idnotification))
                Swal.fire({
                    icon: "success",
                    title: "Notification supprimée",
                    showConfirmButton: false,
                    timer: 1500,
                })
            } catch (error) {
                console.error("Erreur suppression :", error)
                Swal.fire({
                    icon: "error",
                    title: "Erreur lors de la suppression",
                    showConfirmButton: false,
                    timer: 1500,
                })
            }
        }
    }

    const indexOfLastNotification = currentPage * notificationsPerPage
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage
    const currentNotifications = notification.slice(indexOfFirstNotification, indexOfLastNotification)
    const totalPages = Math.ceil(notification.length / notificationsPerPage)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".menu-notification")) {
                setOpenMenuId(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        getNotifications()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Notifications
                    </h1>
                    <p className="text-gray-600">Restez informé de toutes vos activités</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Notifications</p>
                            <p className="text-2xl font-bold text-gray-900">{notification.length}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Aujourd'hui</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {
                                    notification.filter((n) => {
                                        const notifDate = new Date(n.datenotification)
                                        const today = new Date()
                                        return notifDate.toDateString() === today.toDateString()
                                    }).length
                                }
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Cette semaine</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {
                                    notification.filter((n) => {
                                        const notifDate = new Date(n.datenotification)
                                        const weekAgo = new Date()
                                        weekAgo.setDate(weekAgo.getDate() - 7)
                                        return notifDate >= weekAgo
                                    }).length
                                }
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {currentNotifications.map((notif, index) => (
                            <div
                                className="group relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                                key={notif.idnotification}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative p-6">
                                    <div className="absolute top-4 right-4 menu-notification">
                                        {
                                            user.role === "Admin" && (<div>
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === notif.idnotification ? null : notif.idnotification)}
                                                    className="p-2 rounded-full hover:bg-gray-100/80 transition-colors duration-200 backdrop-blur-sm">
                                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                                </button>
                                                {openMenuId === notif.idnotification && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden">
                                                        <button
                                                            onClick={() => handleDelete(notif.idnotification)}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                                                            <Trash className="w-4 h-4 mr-3" /> Supprimer
                                                        </button>
                                                    </div>
                                                )}
                                            </div>)
                                        }
                                    </div>
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                            <Bell className="w-5 h-5 text-white" />
                                        </div>
                                        <h5 className="text-xl font-bold text-gray-900 leading-tight flex-1 line-clamp-2">
                                            {notif.raisonnotification}
                                        </h5>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700 leading-relaxed line-clamp-3">{notif.contenu}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {new Date(notif.datenotification).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {notification.length > notificationsPerPage && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>

                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${currentPage === index + 1
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                            : "bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 hover:shadow-lg hover:scale-105"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>
                    )}

                    {notification.length === 0 && !loading && (
                        <div className="text-center py-20">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
                                <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune notification</h3>
                                <p className="text-gray-600">Vous n'avez aucune notification pour le moment</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Notification
