import { X } from 'lucide-react'
import React from 'react'
import api from '../../services/api'
import FeedbackService from '../../services/FeedBackService'

const BriefingForm = React.memo(({ briefing, setBriefing, socket, getBriefing, setBriefingList, onClose, user }) => {

    {/** Modifier un briefing */ }
    const handleUpdate = async () => {
        try {
            const { idBriefing, nomBriefing, contenuBriefing } = briefing
            await api.put(`/briefing/update/${idBriefing}`, {
                nomBriefing: nomBriefing,
                contenuBriefing: contenuBriefing,
            })
            getBriefing()
            onClose()
            FeedbackService.success("Briefing modifié avec succès")
        } catch (error) {
            console.error("Erreur modification :", error)
            FeedbackService.error()
        }
    }

    const handleCreate = async () => {
        try {
            const response = await api.post("/briefing/add", {
                nomBriefing: briefing.nomBriefing,
                contenuBriefing: briefing.contenuBriefing,
                idManager: user.idutilisateur,
            })
            setBriefingList((prev) => [response.data, ...prev])
            getBriefing()

            const notification = await api.post('/notification/add', {
                raisonNotification: 'Nouvelle briefing',
                contenu: `La briefing ${briefing.nomBriefing} a été créée par le manager ${user.nomutilisateur}.`
            })

            // Creation de la notification via socket
            socket.emit('Publication', notification.data)

            FeedbackService.success("Briefing créé avec succès")
            onClose()
        } catch (error) {
            console.error("Erreur création :", error)
            FeedbackService.error()
        }
    }

    {/** Fonction de soumission du formulaire */ }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (briefing.idBriefing) {
            handleUpdate()
        } else {
            handleCreate()
        }
    }

    {/** A chaque changement dans le formulaire */ }
    const handleChange = (e) => {
        setBriefing({ ...briefing, [e.target.name]: e.target.value })
    }



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                        onClick={onClose}
                    >
                        <X size={20} className="text-white" />
                    </button>
                    {
                        briefing.idBriefing ?
                            (<>
                                <h3 className="text-2xl font-bold text-white">Modifier le briefing</h3>
                                <p className="text-blue-100 mt-1">Mettez à jour les informations de votre briefing</p>
                            </>)
                            :
                            (<>
                                <h3 className="text-2xl font-bold text-white">Créer un nouveau briefing</h3>
                                <p className="text-green-100 mt-1">Partagez vos informations importantes avec l'équipe</p>
                            </>)
                    }

                </div>

                <form onSubmit={handleSubmit} autoComplete='off' className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom du briefing</label>
                        <input
                            type="text"
                            name='nomBriefing'
                            value={briefing.nomBriefing}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="Entrez le nom du briefing"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contenu du briefing</label>
                        <textarea
                            value={briefing.contenuBriefing}
                            name='contenuBriefing'
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Décrivez le contenu de votre briefing"
                            rows={6}
                            required
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
                        >
                            {briefing.idBriefing ? 'Mettre à jour le briefing' : 'Créer le briefing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
})
BriefingForm.displayName = "BriefingForm"
export default BriefingForm