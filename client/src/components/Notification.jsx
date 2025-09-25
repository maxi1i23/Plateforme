import React, { use, useEffect, useState } from 'react'
import api from '../services/api'
import { MoreVertical } from 'lucide-react'
import { useSocket } from '../context/SocketContext'

const Notification = () => {
    const [notification, setNotification] = useState([])
    const { socket } = useSocket()

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
    }, [])

    
    const handleEmettreNotif = () =>{
        socket.emit('emettreNotification', {message:"test"})
    }

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1>Notifications</h1>
                <span>
                    <MoreVertical />
                </span>
            </div>
            <div>
                {notification.map((notif) => (
                    <div key={notif.idnotification} style={{ marginBottom: "1rem", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "8px" }}>
                        <p><strong>Raison :</strong> {notif.raisonnotification}</p>
                        <p><strong>Contenu :</strong> {notif.contenu}</p>
                        <p><strong>Date :</strong> {new Date(notif.datenotification).toLocaleString("fr-FR")}</p>
                    </div>
                ))}
            </div>

            <button onClick={handleEmettreNotif} className='border-2 rounded-md w-full h-[40px] text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out mt-4 mb-4'>Emettre</button>
        </div>
    )
}

export default Notification
