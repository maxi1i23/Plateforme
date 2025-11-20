import React, { useContext, useState, useEffect } from 'react'
import Header from '../components/Header'
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import FeedbackService from '../services/FeedBackService';
import Card from '../components/Card';
import { Check, Clipboard, Clock, X } from 'lucide-react';
import DemandeTable from '../components/Table/DemandeTable';
import CongerForm from '../components/form/CongerForm';

const Conger = () => {
    const [listConger, setListConger] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { user } = useContext(AuthContext);
    const [managerList, setManagerList] = useState([])
    const { socket } = useSocket() // Initialisation du socket
    const [conger, setConger] = useState({
        idDemandeConger: '',
        typeConger: "",
        dateDebutConger: "",
        dateFinConger: "",
        idManagerTraiter: ""
    });
    const [openModal, setOpenModal] = useState(false);

    {/** Prendre les données dans la BD */ }
    const getConger = async () => {
        try {
            setLoading(true);
            let response = []
            const userData = await api.get("/user")
            if (user.role === 'Admin') { //Si admin, voir tous les congés
                response = await api.get("/demandeConger");
                setListConger(response.data);
                console.log(response.data);
            } else if (user.role === 'Agent') { // Si agent, voir seulement ses congés
                response = await api.get("/demandeConger/agent");
                setListConger(response.data.filter((c) => c.idagentdemander === user.idutilisateur));
            } else if (user.role === 'Manager') { // Si manager, voir les congés de ses agents
                response = await api.get("/demandeConger/");
                setListConger(
                    response.data.filter((c) => c.idmanagertraiter === user.idutilisateur)
                );
            }
            setManagerList(userData.data.filter(user => user.roleutilisateur === "Manager"))
        } catch (err) {
            console.error("Erreur récupération congés", err);
            Swal.fire("Erreur", "Impossible de récupérer les congés", "error");
        } finally {
            setLoading(false);
        }
    };

    {/** Récupérer les congés lors du chargement du composant */ }
    useEffect(() => {
        getConger();
    }, []);

    {/** Statistiques des congés selon leur statut */ }
    const stats = {
        total: listConger?.length || 0,
        pending:
            listConger.filter(
                (c) => (c.statutconger || "").toLowerCase() === "en attente"
            ).length || 0,
        accepted:
            listConger.filter(
                (c) => (c.statutconger || "").toLowerCase() === "accepter"
            ).length || 0,
        rejected:
            listConger.filter(
                (c) => (c.statutconger || "").toLowerCase() === "refuser"
            ).length || 0,
    };

    const card = [
        {
            title: "Total",
            value: stats.total,
            icon: Clipboard,
            style: "w-6 h-6 text-blue-600",
            bg: "bg-blue-500"
        },
        {
            title: "En attente",
            value: stats.pending,
            icon: Clock,
            style: "w-6 h-6 text-orange-600",
            bg: "bg-orange-500"
        },
        {
            title: "Acceptées",
            value: stats.accepted,
            icon: Check,
            style: "w-6 h-6 text-green-600",
            bg: "bg-green-500"
        },
        {
            title: "Refusées",
            value: stats.rejected,
            icon: X,
            style: "w-6 h-6 text-red-600",
            bg: "bg-red-500"
        }
    ]

    {/** Supprimer une demande de congé */ }
    const handleDelete = async (id) => {
        const result = await FeedbackService.confirm();
        if (result) {
            try {
                await api.delete(`demandeConger/delete/${id}`);
                setListConger((prev) =>
                    prev.filter((c) => c.iddemandeconger !== id)
                );
                FeedbackService.success("Demande de congé supprimée avec succès");
            } catch (error) {
                console.error("Erreur suppression :", error);
                FeedbackService.error("Impossible de supprimer la demande de congé");
            }

        }
    }

    {/** Ajouter un conger */ }
    const handleCreate = async () => {
        try {
            const response = await api.post('demandeConger/add',
                {
                    typeConger: conger.typeConger,
                    dateDebutConger: conger.dateDebutConger,
                    dateFinConger: conger.dateFinConger,
                    idManagerTraiter: conger.idManagerTraiter
                }
            )
            setListConger((prev) => [response.data, ...prev])
            getConger();
            const notification = await api.post('notification/add',
                {
                    contenu: "Nouvelle demande de congé",
                    raisonNotification: "Demande de conger",
                    idUtilisateurDestinataire: conger.idManagerTraiter
                }
            )
            // Creation de la notification via socket
            socket.emit('Demande', notification.data)
            onClose()
            FeedbackService.success("Demande de congé envoyée avec succès");
        } catch (error) {
            console.error("Erreur création :", error)
            FeedbackService.error("Impossible d'envoyer la demande de congé! Vérifiez les dates");
        }
    };

    {/**Modification d'un congé */ }
    const handleUpdate = async () => {
        try {
            const response = await api.put(
                `demandeConger/update/${conger.idDemandeConger}`,
                {
                    typeConger: conger.typeConger,
                    dateDebutConger: conger.dateDebutConger,
                    dateFinConger: conger.dateFinConger,
                    idManagerTraiter: conger.idManagerTraiter
                }
            );
            setListConger((prev) =>
                prev.map((c) =>
                    c.iddemandeconger === response.data.iddemandeconger
                        ? { ...c, ...response.data }
                        : c
                )
            );
            getConger();
            onClose()
            FeedbackService.success("Demande de congé mise à jour avec succès");
        } catch (error) {
            console.error("Erreur update :", error);
            FeedbackService.error("Impossible de mettre à jour la demande de congé! Vérifiez les dates");
        }
    };

    {/** A chaque changement dans le formulaire */ }
    const handleChange = (e) => {
        setConger({ ...conger, [e.target.name]: e.target.value });
    }

    {/** Soumettre le formulaire de création/modification */ }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (conger.idDemandeConger) {
            handleUpdate()
        } else {
            handleCreate()
        }
    }

    {/** Fermer le modal et réinitialiser le formulaire */ }
    const onClose = () => {
        setConger({
            idDemandeConger: '',
            typeConger: "",
            dateDebutConger: "",
            dateFinConger: "",
            idManagerTraiter: ""
        })
        setOpenModal(false);
    }

    {/** Éditer une demande de congé */ }
    const onEdit = (c) => {
        console.log(c);
        setConger({
            idDemandeConger: c.iddemandeconger,
            typeConger: c.typeconger,
            dateDebutConger: new Date(c.datedebutconger).toISOString().split('T')[0],
            dateFinConger: new Date(c.datefinconger).toISOString().split('T')[0],
            idManagerTraiter: c.idmanagertraiter
        })
        setOpenModal(true);
    }

    {/** Traiter une demande de congé */ }
    const handleTraiter = async (id, statutConger) => {
        const result = await FeedbackService.confirm('Vous êtes sur le point de traiter cette demande. Êtes-vous sûr?');
        if (result) {
            try {
                await api.put(`/demandeConger/traiter/${id}`, { statutConger });
                FeedbackService.success("Demande de congé traitée avec succès");
                getConger();
            } catch (err) {
                console.error(err);
                FeedbackService.error("Échec du traitement de la demande");
            }
        }
    };

    // ✅ Recherche + filtre
    const filteredConger = listConger.filter((conger) => {
        const matchesSearch =
            (conger.typeconger || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            conger.nomagentdemander.toString().includes(searchTerm);
        const matchesStatus =
            statusFilter === "all" || conger.statutconger === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 transition-all duration-500 p-6'>
            <Header
                title={"Gestion des Congés"}
                description={"Organisez la gestion des congés efficacement"}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                buttonText={"Faire une demande de congé"}
                openAddModal={setOpenModal}
                allowedRoles={['Agent']}
                userRole={user.role}
            />
            {
                loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) :
                    (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                                {
                                    card.map((item) => (
                                        <Card
                                            key={item.title}
                                            Icon={item.icon}
                                            bg={item.bg}
                                            style={item.style}
                                            title={item.title}
                                            value={item.value}
                                        />
                                    ))
                                }
                            </div>
                            {/** Pour le filtre de statut */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl mb-8">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="md:w-48">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="all">Tous les statuts</option>
                                            <option value="en attente">En attente</option>
                                            <option value="Accepter">Acceptées</option>
                                            <option value="Refuser">Refusées</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/** tableau pour afficher les demandes */}
                            <DemandeTable
                                demandes={filteredConger}
                                typeDemande={'conge'}
                                handleDelete={handleDelete}
                                onEdit={onEdit}
                                isAdmin={user.role === 'Admin' ? true : false}
                                isManager={user.role === 'Manager' ? true : false}
                                isAgent={user.role === 'Agent' ? true : false}
                                handleTraiter={handleTraiter}
                            />
                        </>
                    )
            }
            {
                openModal && (
                    <CongerForm
                        conger={conger}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        onClose={onClose}
                        managerList={managerList}
                    />
                )
            }
        </div>
    )
}

export default Conger;