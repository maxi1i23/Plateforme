"use client"

import { useEffect, useState, useContext } from "react"
import api from "../services/api"
import { MoreVertical, Bell, BellOff, Trash, ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react"
import Swal from "sweetalert2"
import { AuthContext } from '../context/AuthContext'
import Header from "./Header"
import Card from "./Card"

const Notification = () => {
    const [notification, setNotification] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useContext(AuthContext)
    const notificationsPerPage = 9
    const isAdmin = user.role === "Admin"

    const getNotifications = async () => {
        try {
            setLoading(true)
            if (isAdmin) {
                const response = await api.get("/notification")
                setNotification(response.data)
            } else {
                const response = await api.get("/notification/" + user.id)
                setNotification(response.data)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
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
                if(isAdmin){
                    await api.delete(`/notification/delete/${id}`)
                    setNotification((prev) => prev.filter((n) => n.idnotification !== id))
                }else{
                    await api.delete(`/notification/deleteNotifUser/${id}`)
                    setNotification((prev) => prev.filter((n) => n.idusernotif !== id))
                }
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
        <div className="min-h-screenbg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 transition-all duration-500 p-6">
            <Header
                title={'Notifications'}
                description={'Restez informé de toutes vos activités'}
                allowedRoles={['']}
                search={false}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card Icon={Bell}
                    title={'Total Notifications'}
                    value={notification.length}
                    bg={'bg-purple-500'}
                    style={'w-6 h-6 text-purple-600'}
                />
                <Card Icon={Clock}
                    title={"Aujourd'hui"}
                    value={notification.filter((n) => {
                        const notifDate = new Date(n.datenotification)
                        const today = new Date()
                        return notifDate.toDateString() === today.toDateString()
                    }).length}
                    bg={'bg-blue-500'}
                    style={'w-6 h-6 text-blue-600'}
                />
                <Card Icon={CheckCircle}
                    title={"Cette semaine"}
                    value={notification.filter((n) => {
                        const notifDate = new Date(n.datenotification)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return notifDate >= weekAgo
                    }).length}
                    bg={'bg-emerald-500'}
                    style={'w-6 h-6 text-emerald-600'}
                />
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
                                className="group relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden dark:bg-white/5"
                                key={notif.idnotification}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative p-6">
                                    <div className="absolute top-4 right-4 menu-notification">
                                        <div>
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === notif.idnotification ? null : notif.idnotification)}
                                                className="p-2 rounded-full hover:bg-gray-100/80 transition-colors duration-200 backdrop-blur-sm dark:hover:bg-gray-600">
                                                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300 " />
                                            </button>
                                            {openMenuId === notif.idnotification && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden">
                                                    <button
                                                        onClick={() => handleDelete(isAdmin ? notif.idnotification : notif.idusernotif)}
                                                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                                                        <Trash className="w-4 h-4 mr-3" /> Supprimer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                            <Bell className="w-5 h-5 text-white" />
                                        </div>
                                        <h5 className="text-xl font-bold text-gray-900 leading-tight flex-1 line-clamp-2 dark:text-gray-100">
                                            {notif.raisonnotification}
                                        </h5>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700 leading-relaxed line-clamp-3 dark:text-gray-300">{notif.contenu}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
