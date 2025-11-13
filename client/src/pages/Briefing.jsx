import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import Header from '../components/Header'
import Card from '../components/Card'
import { CalendarRange, Clock, Presentation, User } from 'lucide-react'
import api from '../services/api'
import FeedbackService from '../services/FeedBackService'
import Info from '../components/information/Info'
import BriefingForm from '../components/form/BriefingForm'
import InfoDisplay from '../components/information/InfoDisplay'
import FeedBack from '../components/FeedBack/FeedBack'

const Briefing = () => {
    const [briefingList, setBriefingList] = useState([])
    const [filteredBriefings, setFilteredBriefings] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [openMenuId, setOpenMenuId] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useContext(AuthContext)
    const { socket } = useSocket()
    const [briefing, setBriefing] = useState({
        idBriefing: '',
        nomBriefing: '',
        contenuBriefing: ''
    })
    const [openModal, setOpenModal] = useState(false)
    const [see, setSee] = useState(null)
    const [feedback, setFeedback] = useState(false)
    const isAuthor = user.role === 'Admin' || user.role === 'Manager' || false // Pour savoir si l'utilisateurs peut publier

    {/** Liste des briefings cette semaine */ }
    const semaine = briefingList.filter((b) => {
        const briefingDate = new Date(b.datebriefing)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return briefingDate >= weekAgo
    })
    const mois = briefingList.filter((f) => {
        const briefingDate = new Date(f.datebriefing)
        const monthAgo = new Date()
        monthAgo.setDate(monthAgo.getDate() - 12)
        return briefingDate >= monthAgo
    })

    {/** Pour le composant card */ }
    const card = [
        {
            title: "Total Briefings",
            value: briefingList.length,
            icon: Presentation,
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
            title: "Mes briefings",
            value: briefingList.filter((b) => b.idmanager === user.idutilisateur).length,
            icon: User,
            style: "w-6 h-6 text-purple-600",
            bg: "bg-purple-500"
        } : false
    ].filter(Boolean)

    {/** En cas de recherche de briefing */ }
    useEffect(() => {
        const filtered = briefingList.filter((briefing) => {
            const nom = briefing.nombriefing || briefing.nomBriefing || ""
            const contenu = briefing.contenubriefing || briefing.contenuBriefing || ""
            return (
                nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contenu.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })
        setFilteredBriefings(filtered)
    }, [briefingList, searchTerm])

    {/** Récuperer la liste des briefings via la bd */ }
    const getBriefing = async () => {
        try {
            setLoading(true)
            const response = await api.get("/briefing")
            setBriefingList(response.data)
            setFilteredBriefings(response.data)
        } catch (error) {
            console.error("Erreur récupération briefing :", error)
        } finally {
            setLoading(false)
        }
    }

    {/** Fonction éxécuter au chargement de la page */ }
    useEffect(() => {
        getBriefing()
    }, [])

    {/** Reformer les donner pour la carte info */ }
    const info = filteredBriefings.map((f) => (
        {
            id: f.idbriefing,
            idAuthor: f.idmanager,
            author: f.nommanager,
            title: f.nombriefing,
            description: f.contenubriefing,
            date: f.datebriefing
        }
    ))

    {/** Supprimer un briefing */ }
    const handleDelete = async (idbriefing) => {
        const result = await FeedbackService.confirm()
        if (result) {
            try {
                await api.delete(`/briefing/delete/${idbriefing}`)
                getBriefing()
                FeedbackService.success("Briefing supprimé avec succès")
            } catch (error) {
                console.error("Erreur suppression :", error)
                FeedbackService.error()
            }
        }
    }

    {/** Ouvrir modal de modification */ }
    const handleEdit = (b) => {
        setOpenModal(true)
        setBriefing({
            idBriefing: b.id,
            nomBriefing: b.description,
            contenuBriefing: b.title
        })
        setOpenMenuId(null)
    }

    {/** On close */ }
    const onClose = () => {
        setOpenModal(false)
        setBriefing({
            idBriefing: '',
            nomBriefing: '',
            contenuBriefing: ''
        })
        setFeedback(false)
    }

    {/** Quand l'utilisateur sélectionne un briefing */ }
    const handleInfo = (info) => {
        setSee(info)
    }

    {/** Bouton cliquer quand l'utilisateur veut donner un avis */ }
    const feed = (b) => {
        setBriefing({
            idBriefing: b.id,
            nomBriefing: b.title,
            contenuBriefing: b.description
        })
        setFeedback(true)
    }

    return (
        <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6'>
            <Header
                title={"Gestion des Briefings"}
                description={"Organisez la communications d'équipe efficacement"}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                buttonText={"Créer un briefing"}
                openAddModal={setOpenModal}
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
                                        Icon={Presentation}
                                        handleDelete={handleDelete}
                                        handleEdit={handleEdit}
                                        handleInfo={handleInfo}
                                        isBriefing={true}
                                        feed={feed}
                                    />
                                ))
                            }
                        </div>
                    </>
                )
            }
            {
                openModal && (
                    <BriefingForm
                        briefing={briefing}
                        getBriefing={getBriefing}
                        setBriefing={setBriefing}
                        setBriefingList={setBriefingList}
                        socket={socket}
                        onClose={onClose}
                    />
                )
            }
            {
                see && (
                    <InfoDisplay info={see} setInfo={setSee} Icon={Presentation}/>
                )
            }
            {
                feedback && (
                    <FeedBack briefing={briefing} user={user} onClose={onClose} />
                )
            }
        </div>
    )
}

export default Briefing