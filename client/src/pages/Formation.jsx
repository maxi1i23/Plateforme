import React, { useContext, useState, useEffect, useMemo } from 'react'
import Header from '../components/Header'
import { useSocket } from '../context/SocketContext'
import { AuthContext } from '../context/AuthContext'
import { BookOpen, CalendarRange, Clock, User } from 'lucide-react'
import Card from '../components/Card'
import api from '../services/api'
import FeedbackService from '../services/FeedBackService'
import Info from '../components/information/Info'
import FormationForm from '../components/form/FormationForm'
import InfoDisplay from '../components/information/InfoDisplay'

const Formation = () => {
    const [formationList, setFormationList] = useState([])
    const [filteredFormations, setFilteredFormations] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [openMenuId, setOpenMenuId] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useContext(AuthContext)
    const { socket } = useSocket() // Initialisation du socke
    const [formation, setFormation] = useState({ idFormation: '', nomFormation: '', descriptionFormation: '' })
    const [openModal, setopenModal] = useState(false)
    const [see, setSee] = useState(null)
    const isAuthor = user.role === 'Admin' || user.role === 'Manager' || false // Pour savoir si l'utilisateurs peut publier

    {/** Liste des formatons cette semaine */ }
    const semaine = useMemo(() => formationList.filter((f) => {
        const formationDate = new Date(f.dateformation)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return formationDate >= weekAgo
    }), [formationList])

    const mois = useMemo(() => formationList.filter((f) => {
        const formationDate = new Date(f.dateformation)
        const monthAgo = new Date()
        monthAgo.setDate(monthAgo.getDate() - 12)
        return formationDate >= monthAgo
    }), [formationList])

    {/** Pour le composant card */ }
    const card = useMemo(() => [
        {
            title: "Total Formations",
            value: formationList.length,
            icon: BookOpen,
            style: "w-6 h-6 text-blue-600",
            bg: "bg-blue-500"
        },
        {
            title: "Ce mois",
            value: mois.length,
            icon: CalendarRange,
            style: "w-6 h-6 text-red-600",
            bg: "bg-red-500"
        },
        {
            title: "Cette semaine",
            value: semaine.length,
            icon: Clock,
            style: "w-6 h-6 text-green-600",
            bg: "bg-green-500"
        }, isAuthor ? {
            title: "Mes formations",
            value: formationList.filter((f) => f.idutilisateurmanager === user.idutilisateur).length,
            icon: User,
            style: "w-6 h-6 text-purple-600",
            bg: "bg-purple-500"
        } : false
    ].filter(Boolean), [formationList, mois, semaine, isAuthor, user.idutilisateur])

    {/** Quand on rechercher une formation */ }
    useEffect(() => {
        const filtered = formationList.filter((formation) => {
            const nom = formation.nomformation || formation.nomFormation || ""
            const description =
                formation.descriptionformation || formation.descriptionFormation || ""
            return (
                nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })
        setFilteredFormations(filtered)
    }, [formationList, searchTerm])

    {/** Recharger les informations depuis la base de données  */ }
    const getFormation = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/formation`)
            setFormationList(response.data)
        } catch (error) {
            console.error("Erreur récupération formations :", error)
        } finally {
            setLoading(false)
        }
    }

    {/** Fonction a éxécuter lors du rendu du composant */ }
    useEffect(() => {
        getFormation()
    }, [])

    {/** Reformer les donner pour la carte info */ }
    const info = useMemo(() => filteredFormations.map((f) => (
        {
            id: f.idformation,
            idAuthor: f.idutilisateurmanager,
            author: f.nommanager,
            title: f.nomformation,
            description: f.descriptionformation,
            date: f.dateformation
        }
    )), [filteredFormations])

    {/** Supprimer une formation */ }
    const handleDelete = async (idformation) => {
        try {
            const result = await FeedbackService.confirm()
            if (result) {
                await api.delete(`/formation/delete/${idformation}`)
                setFormationList((prev) => prev.filter((f) => f.idformation !== idformation))
                FeedbackService.success("Formation supprimée")
            }
        } catch (error) {
            console.error("Erreur suppression :", error)
            FeedbackService.error()
        }
    }

    {/** Modifier une formation */ }
    const handleEdit = (f) => {
        setFormation({
            idFormation: f.id,
            nomFormation: f.title,
            descriptionFormation: f.description
        })
        setOpenMenuId(null)
        setopenModal(true)
    }

    {/** Fermer le modal / la formulaire */ }
    const onClose = () => {
        setopenModal(false)
        setFormation({ idFormation: '', nomFormation: '', descriptionFormation: '' })
    }

    {/** Quand l'utilisateur sélectionne une formation */ }
    const handleInfo = (info) => {
        setSee(info)
    }

    return (
        <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6'>
            <Header
                title={"Gestion des Formations"}
                description={"Organisez et suivez vos programmes de formation"}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                buttonText={"Créer une formation"}
                openAddModal={() => setopenModal(true)}
                allowedRoles={['Admin', 'Manager']}
                userRole={user.role}
            />
            {
                loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        <div className={`grid grid-cols-1 md:grid-cols-${isAuthor ? '4' : '3'} gap-6 mb-8`}>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {
                                info.map((item) => (
                                    <Info
                                        info={item}
                                        user={user}
                                        openMenuId={openMenuId}
                                        setOpenMenuId={setOpenMenuId}
                                        key={item.id}
                                        Icon={BookOpen}
                                        handleDelete={handleDelete}
                                        handleEdit={handleEdit}
                                        handleInfo={handleInfo}
                                    />
                                ))
                            }
                        </div>
                    </>
                )
            }

            {
                openModal && (
                    <FormationForm
                        formation={formation}
                        onClose={onClose}
                        setFormation={setFormation}
                        setFormationList={setFormationList}
                        socket={socket}
                        user={user}
                        getFormation={getFormation}
                    />
                )
            }
            {
                see && (<InfoDisplay info={see} setInfo={setSee} Icon={BookOpen} />)
            }
            {filteredFormations.length === 0 && !loading && (
                <div className="text-center py-20 w-full">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchTerm ? "Aucune formation trouvée" : "Aucune formation disponible"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm ? "Essayez avec d'autres mots-clés" : "Aucune formation disponible"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Formation