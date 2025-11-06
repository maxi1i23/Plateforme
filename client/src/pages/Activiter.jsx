import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import { AuthContext } from '../context/AuthContext'
import { BarChart3, Clock, Coffee, Phone } from 'lucide-react'
import Card from '../components/Card'
import api from '../services/api'
import ActiviterTable from '../components/Table/ActiviterTable'
import PerformanceTable from '../components/Table/PerformanceTable'
import ActiviterForm from '../components/form/ActiviterForm'
import FeedBackService from '../services/FeedBackService'

const Activiter = () => {
    const { user } = useContext(AuthContext)
    const [activites, setActivites] = useState([])
    const [performances, setPerformances] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterDate, setFilterDate] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingActivite, setEditingActivite] = useState(null)
    const [formData, setFormData] = useState({
        nbappelle: 0,
        pauses: 0,
        dureeappelle: 0,
    })

    {/** Récupérer les activité */ }
    const getActivites = async () => {
        try {
            setLoading(true)
            const response = await api.get("/activiter")
            if (user.role === 'Admin') {
                setActivites(response.data)
            } else {
                setActivites(response.data.filter((a) => a.idagent === user.idutilisateur))
            }
        } catch (error) {
            console.error("Erreur récupération activités :", error)
        } finally {
            setLoading(false)
        }
    }

    {/** Récupérer les performances */ }
    const getPerformances = async () => {
        try {
            const response = await api.get("/activiter/performance")
            if (user.role === 'Admin') {
                setPerformances(response.data)
            } else {
                setPerformances(response.data.filter((val) => (val.idagent == user.idutilisateur)))
            }
        } catch (error) {
            console.error("Erreur récupération performances :", error)
        }
    }

    {/** Chargement aux rendu du composant */ }
    useEffect(() => {
        getActivites()
        getPerformances()
    }, [])

    {/** Filtrage par date */ }
    const filteredActivites = filterDate ? activites.filter((a) => a.dateactiviter === filterDate) : activites

    // Calculer les statistiques
    const totalActivites = activites.length
    const totalAppels = activites.reduce((sum, a) => sum + a.nbappelle, 0)
    const totalDuree = activites.reduce((sum, a) => sum + a.dureeappelle, 0)
    const totalPauses = activites.reduce((sum, a) => sum + a.pauses, 0)
    const agentsUniques = [...new Set(activites.map((a) => a.idagent))].length

    const card = [
        {
            title: "Total Activités",
            value: totalActivites,
            icon: BarChart3,
            style: "w-6 h-6 text-blue-600",
            bg: "bg-blue-100"
        }, {
            title: "Appels Totaux",
            value: totalAppels,
            icon: Phone,
            style: "w-6 h-6 text-emerald-600",
            bg: "bg-emerald-100"
        }, {
            title: "Durée Totale",
            value: totalDuree + " min",
            icon: Clock,
            style: "w-6 h-6 text-indigo-600",
            bg: "bg-indigo-100"
        }, {
            title: "Pauses Totales",
            value: totalPauses,
            icon: Coffee,
            style: "w-6 h-6 text-orange-600",
            bg: "bg-orange-100"
        }
    ]

    {/** Pour la modification */ }
    const onEdit = (a) => {
        setEditingActivite(a)
        setFormData({
            nbappelle: a.nbappelle,
            pauses: a.pauses,
            dureeappelle: a.dureeappelle,
        })
        setShowForm(true)
    }

    {/** Fermer le formulaire */ }
    const onClose = () => {
        setShowForm(false)
        setEditingActivite(null)
    }

    {/** Ajouter ou modifier une activiter */ }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingActivite) {
                const response = await api.put(`/activiter/${editingActivite.idactiviter}`, {
                    nbAppelle: formData.nbappelle,
                    pauses: formData.pauses,
                    dureeAppelle: formData.dureeappelle,
                })
                setActivites((prev) =>
                    prev.map((a) => (a.idactiviter === editingActivite.idactiviter ? response.data.activite : a)),
                )
            } else {
                const response = await api.post("/activiter", {
                    nbAppelle: formData.nbappelle,
                    pauses: formData.pauses,
                    dureeAppelle: formData.dureeappelle,
                })
                setActivites((prev) => [response.data.activite, ...prev])
            }
            // Mise à jour performances après modification ou ajout
            await getPerformances()
            setShowForm(false)
            setEditingActivite(null)
            setFormData({ nbappelle: 0, pauses: 0, dureeappelle: 0 })
            FeedBackService.success()
        } catch (error) {
            console.error("Erreur :", error)
            FeedBackService.error
        }
    }

    {/** Supprimer une activiter */ }
    const handleDelete = async (id) => {
        const result = await FeedBackService.confirm()
        if (result) {
            try {
                await api.delete(`/activiter/delete/${id}`)
                setActivites((prev) => prev.filter((a) => a.idactiviter !== id))
                FeedBackService.success("L'activité a été supprimée")
                await getPerformances()
            } catch (error) {
                console.error("Erreur suppression :", error)
                FeedBackService.error()
            }
        }
    }

    return (
        <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6'>
            <Header
                title={"Activité de l'agent"}
                description={"Suivez et gérez vos performances quotidiennes"}
                buttonText={"Enregistrer votre activité"}
                allowedRoles={['Agent']}
                search = {false}
                userRole={user.role}
                openAddModal={setShowForm}
            />
            {
                loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {
                                card.map((item) => (
                                    <Card
                                        title={item.title}
                                        Icon={item.icon}
                                        bg={item.bg}
                                        style={item.style}
                                        value={item.value}
                                        key={item.title}
                                    />
                                ))
                            }
                        </div>
                        {
                            <ActiviterTable
                                filteredActivites={filteredActivites}
                                onEdit={onEdit}
                                handleDelete={handleDelete}
                                isAdmin={user.role === 'Admin'}
                            />
                        }
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
                                Performances
                            </h2>
                            <PerformanceTable performances={performances} />
                        </div>
                    </>
                )
            }
            {
                showForm && (
                    <ActiviterForm
                        editingActivite={editingActivite}
                        formData={formData}
                        onClose={onClose}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                    />
                )
            }
        </div>
    )
}

export default Activiter