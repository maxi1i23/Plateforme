import React, { use, useEffect, useState } from 'react'
import api from '../services/api'
import { MoreVertical } from 'lucide-react'
import { useSocket } from '../context/SocketContext'

const Notification = () => {
    const [notification, setNotification] = useState([])

    const getNotifications = async () => {
        try {
            const response = await api.get('/notification')
            setNotification(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getNotifications()
        console.log(location.pathname)
    }, [])

    return (
        <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6'>
            <div className='flex justify-between items-center'>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Notifications</h1>
                <span>
                    <MoreVertical />
                </span>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>

            {notification.map((notif) => (
                <div className="relative p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group mb-3"
                key={notif.idnotification}>
                    <div className="mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <h5 className="text-xl font-bold text-gray-800 line-clamp-1">{notif.raisonnotification}</h5>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <span>
                                {notif.contenu}
                            </span>
                        </div>
                        <p className="text-gray-700 line-clamp-3 mb-4 leading-relaxed">
                            {new Date(notif.datenotification).toLocaleString("fr-FR")}
                        </p>
                    </div>
                </div>
            ))}

            </div>
            

        </div>
    )
}

export default Notification
