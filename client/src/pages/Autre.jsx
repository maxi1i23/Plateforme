import React, { useContext, useState, useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import Card from '../components/Card'
import { Check, Clipboard, Clock, X } from 'lucide-react'
import api from '../services/api'
import FeedbackService from '../services/FeedBackService'
import DemandeTable from '../components/Table/DemandeTable'
import AutreForm from '../components/form/AutreForm'

const Autre = () => {
  const [listDemande, setListDemande] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { user } = useContext(AuthContext)
  const [managerList, setManagerList] = useState([])
  const { socket } = useSocket()
  const [openModal, setOpenModal] = useState(false)
  const [autre, setAutre] = useState({
    idAutreDemande: '',
    nomAutreDemande: "",
    descriptionAutreDemande: "",
    dateDemande: "",
    idManagerTraiteraAutreDemande: ''
  });

  {/** Statistiques des demandes */ }
  const stats = {
    total: listDemande.length,
    enAttente: listDemande.filter((d) => (d.statutautredemande || "").toLowerCase() === "en attente").length,
    acceptees: listDemande.filter((d) => (d.statutautredemande || "").toLowerCase() === "accepter").length,
    refusees: listDemande.filter((d) => (d.statutautredemande || "").toLowerCase() === "refuser").length,
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
      value: stats.enAttente,
      icon: Clock,
      style: "w-6 h-6 text-orange-600",
      bg: "bg-orange-500"
    },
    {
      title: "Acceptées",
      value: stats.acceptees,
      icon: Check,
      style: "w-6 h-6 text-green-600",
      bg: "bg-green-500"
    },
    {
      title: "Refusées",
      value: stats.refusees,
      icon: X,
      style: "w-6 h-6 text-red-600",
      bg: "bg-red-500"
    }
  ]

  {/** Prend les données dans la BD */ }
  const getDemande = async () => {
    try {
      setLoading(true)
      const response = await api.get("/autreDemande")
      const userData = await api.get("/user")
      if (user.role === 'Admin') {
        setListDemande(response.data)
      } else if (user.role === 'Manager') {
        // Filtrer les demandes des agents gérés par ce manager
        let value = response.data.filter(d => d.idmanagertraiterautredemande === user.idutilisateur)
        setListDemande(value)
      } else if (user.role === 'Agent') {
        setListDemande(response.data.filter((d) => d.idagentautredemande === user.idutilisateur))
      }
      // Filtrer seulement les demandes de ce manager
      setManagerList(userData.data.filter(user => user.roleutilisateur === "Manager"))
    } catch (err) {
      console.error("Erreur récupération demandes", err)
      Swal.fire("Erreur", "Impossible de récupérer les demandes", "error")
    } finally {
      setLoading(false)
    }
  }

  {/** Récupère les demandes au chargement du composant */ }
  useEffect(() => {
    getDemande()
  }, [])

  {/** Filtrage des demandes selon la recherche et le statut */ }
  const filteredDemandes = listDemande.filter((demande) => {
    const nom = demande.nomautredemande || "";
    const description = demande.descriptionautredemande || "";
    const statut = demande.statutautredemande || "";

    const matchesSearch =
      nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || statut.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    const result = await FeedbackService.confirm()
    if (result) {
      try {
        await api.delete(`autreDemande/delete/${id}`);
        // Suppression dans l'état avec fallback pour différentes clés possibles
        getDemande();
        FeedbackService.success("Supprimé avec succès");
      } catch (error) {
        console.error("Erreur suppression :", error);
        FeedbackService.error("Impossible de supprimer");
      }
    }

  };

  {/** Changement apres le form */ }
  const handleChange = (e) => {
    setAutre({ ...autre, [e.target.name]: e.target.value });
  };

  {/** Changement apres le form */ }
  const onClose = () => {
    setOpenModal(false);
    setAutre({
      idAutreDemande: '',
      nomAutreDemande: "",
      descriptionAutreDemande: "",
      dateDemande: "",
      idManagerTraiteraAutreDemande: ''
    })
  }

  {/** Mettre a jour une demande */ }
  const handleUpdate = async () => {
    try {
      const response = await api.put(
        `autreDemande/update/${autre.idAutreDemande}`,
        {
          nomAutreDemande: autre.nomAutreDemande,
          descriptionAutreDemande: autre.descriptionAutreDemande,
          dateDemande: autre.dateDemande,
          idManagerTraiterAutreDemande: autre.idManagerTraiteraAutreDemande
        }
      );
      getDemande();
      onClose();
      FeedbackService.success("Mis à jour avec succès");
    } catch (error) {
      console.error("Erreur update :", error);
      FeedbackService.error("Impossible de mettre à jour");
    }
  }

  {/** Ajouter une demande */ }
  const handleCreate = async () => {
    try {
      const response = await api.post('autreDemande/add',
        {
          nomAutreDemande: autre.nomAutreDemande,
          descriptionAutreDemande: autre.descriptionAutreDemande,
          dateDemande: autre.dateDemande,
          idManagerTraiterAutreDemande: autre.idManagerTraiteraAutreDemande
        }
      )
      setListDemande((prev) => [response.data, ...prev])
      onClose();
      getDemande();
      const notification = await api.post('notification/add',
        {
          contenu: `${user.nomutilisateur} vous a fait une demande}`,
          raisonNotification: "Nouvelle demande",
          idUtilisateurDestinataire: autre.idManagerTraiteraAutreDemande
        }
      )
      socket.emit('Demande', notification.data)

      FeedbackService.success("Demande envoyée avec succès");
    } catch (error) {
      console.error("Erreur création :", error)
      FeedbackService.error("Impossible de créer la demande ! vérifier la date !");
    }
  }

  {/** Soumission du formulaire */ }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (autre.idAutreDemande) {
      await handleUpdate()
    } else {
      await handleCreate()
    }
  }

  {/** Edition d'une demande */ }
  const onEdit = (demande) => {
    setAutre({
      idAutreDemande: demande.idautredemande,
      nomAutreDemande: demande.nomautredemande,
      descriptionAutreDemande: demande.descriptionautredemande,
      dateDemande: new Date(demande.datedemande).toISOString().split('T')[0],
      idManagerTraiteraAutreDemande: demande.idmanagertraiterautredemande
    })
    setOpenModal(true)
  }

  {/** Traitement d'une demande */ }
  const handleTraiter = async (id, statutAutreDemande) => {
    try {
      await api.put(`/autreDemande/traiter/${id}`, { statutAutreDemande })
      FeedbackService.success("Demande traitée avec succès")
      getDemande()
    } catch (err) {
      console.error(err.message)
      FeedbackService.error("Échec du traitement de la demande")
    }
  }

  return (
    <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6'>
      <Header
        title={"Autres Demandes"}
        description={"Organisez la gestion des autres demandes efficacement"}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        buttonText={"Faire une nouvelle demande"}
        openAddModal={setOpenModal}
        allowedRoles={['Agent']}
        userRole={user.role}
      />
      {
        loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/** Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {
                card.map((item) => (
                  <Card
                    key={item.title}
                    title={item.title}
                    value={item.value}
                    Icon={item.icon}
                    style={item.style}
                    bg={item.bg}
                  />
                ))
              }
            </div>
            {/** Filtres pour les stat */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl mb-8">
              <div className="flex flex-col md:flex-row gap-4">

                <div className="md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="En attente">En attente</option>
                    <option value="Accepter">Acceptées</option>
                    <option value="Refuser">Refusées</option>
                  </select>
                </div>
              </div>
            </div>
            {/** tableau pour afficher les demandes */}
            <DemandeTable
              demandes={filteredDemandes}
              typeDemande={'autre'}
              isAdmin={user.role === 'Admin'}
              isAgent={user.role === 'Agent'}
              isManager={user.role === 'Manager'}
              handleDelete={handleDelete}
              onEdit={onEdit}
              handleTraiter={handleTraiter}
            />
          </>
        )
      }
      {
        openModal && (
          <AutreForm autre={autre}
            handleChange={handleChange}
            managerList={managerList}
            onClose={onClose}
            handleSubmit={handleSubmit}
          />
        )
      }
    </div>
  )
}

export default Autre