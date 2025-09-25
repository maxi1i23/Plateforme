"use client";

import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { Search, Plus, X } from "lucide-react";

const CongerListAgent = () => {
    const [listConger, setListConger] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { user } = useContext(AuthContext);
    const [createDemandeConger, setDemandeConger] = useState(false)
    const [managerList, setManagerList] = useState([])
    const [editingConger, setEditingConger] = useState(null)

    const getConger = async () => {
        try {
            setLoading(true);
            const response = await api.get("/demandeConger");
            const userData = await api.get("/user")
            setListConger( response.data);
            setManagerList(userData.data.filter(user=>user.roleutilisateur === "Manager"))
        } catch (err) {
            console.error("Erreur récupération congés", err);
            Swal.fire("Erreur", "Impossible de récupérer les congés", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getConger();
    }, []);

// Statistiques
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

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('demandeConger/add',
                {
                    typeConger: createDemandeConger.typeConger,
                    dateDebutConger : createDemandeConger.dateDebutConger ,
                    dateFinConger : createDemandeConger.dateFinConger,
                    idManagerTraiter: createDemandeConger.idManagerTraiter
                }
            )
            setListConger((prev)=>[response.data,  ...prev])
            setDemandeConger(false)
            getConger();
            Swal.fire({
                icon: "success",
                title: "Demande de conger envoyée",
                showConfirmButton: false,
                timer: 1500,
              })
        } catch (error) {
            console.error("Erreur création :", error)
            Swal.fire({
                icon: "error",
                title: "Erreur lors de l'envoi",
                showConfirmButton: false,
                timer: 1500,
            })
        }
    };

     // Mettre à jour une demande
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `demandeConger/update/${editingConger.idDemandeConger}`,
        {
            typeConger : editingConger.typeConger,
            dateDebutConger: editingConger.dateDebutConger,
            dateFinConger: editingConger.dateFinConger,
            idManagerTraiter: editingConger.idManagerTraiter
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
      setEditingConger(null);
      Swal.fire("Succès", "Demande mise à jour", "success");
    } catch (error) {
      console.error("Erreur update :", error);
      Swal.fire("Erreur", "Impossible de mettre à jour", "error");
    }
  };


     //  Supprimer une demande
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Supprimer ?",
      text: "Cette action est irréversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`demandeConger/delete/${id}`);
          setListConger((prev) =>
            prev.filter((c) => c.iddemandeconger !== id)
          );
          Swal.fire("Supprimé !", "La demande a été supprimée.", "success");
        } catch (error) {
          console.error("Erreur suppression :", error);
          Swal.fire("Erreur", "Impossible de supprimer", "error");
        }
      }
    });
  };


  // ✅ Recherche + filtre
  const filteredConger = listConger.filter((conger) => {
    const matchesSearch =
      (conger.typeconger || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conger.idagentdemander.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || conger.statutconger === statusFilter;
    return matchesSearch && matchesStatus;
  });

    const StatusBadge = ({ status }) => {
        // Badge pour les statuts selon la valeur
        const getStatusStyle = (status) => {
            switch (status) {
                case "en attente":
                    return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
                case "Accepter":
                    return "bg-gradient-to-r from-green-400 to-emerald-500 text-white";
                case "Refuser":
                    return "bg-gradient-to-r from-red-400 to-rose-500 text-white";
                default:
                    return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
            }
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                    status
                )}`}
            >
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des demandes de congés...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                    <div>

                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Gestion des Congés
                        </h1>
                        <p className="text-gray-600">
                            Gérez et traitez les demandes de congés de votre équipe
                        </p>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher par type ou agent..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-80"
                            />
                        </div>
                        <button

                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                            onClick={()=>setDemandeConger({typeConger : "", dateDebutConger : "", dateFinConger : "", idManagerTraiter : 0})}
                            >
                            <Plus size={20} />Faire une demande de conger
                        </button>

                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">En attente</p>
                                <p className="text-3xl font-bold text-orange-600">
                                    {stats.pending}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.accepted}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Refusées</p>
                                <p className="text-3xl font-bold text-red-600">
                                    {stats.rejected}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

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

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Date début
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Date fin
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Statut
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Manager
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredConger.length > 0 ? (
                                    filteredConger.map((conger, index) => (
                                        <tr
                                            key={conger.iddemandeconger}
                                            className="hover:bg-white/50 transition-all duration-200 group"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900">
                                                    {conger.typeconger}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(conger.datedebutconger).toLocaleDateString(
                                                    "fr-FR"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(conger.datefinconger).toLocaleDateString(
                                                    "fr-FR"
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={conger.statutconger} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                                        {conger.idmanagertraiter?.toString().slice(-2) || ""}
                                                    </div>
                                                    <span className="text-gray-900 font-medium">
                                                        Agent {conger.idmanagertraiter}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {conger.statutconger === "en attente" ? (
                                                    <div className="flex space-x-2">
                                                        <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg" onClick={()=>{
                                                            setEditingConger({
                                                                ...conger,
                                                                idDemandeConger : conger.iddemandeconger,
                                                                typeConger: conger.typeconger,
                                                                dateDebutConger: conger.datedebutconger,
                                                                dateFinConger: conger.datefinconger,
                                                                idManagerTraiter: conger.idmanagertraiter
                                                              });
                                                              
                                                        }}>
                                                            Modifier
                                                        </button>
                                                        <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg" onClick={()=>handleDelete(conger.iddemandeconger)}>
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 italic">
                                                        Déjà traité
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-12 h-12 text-gray-400 mb-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                    />
                                                </svg>
                                                <p className="text-gray-500 font-medium">
                                                    Aucune demande de congé trouvée
                                                </p>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    Essayez de modifier vos critères de recherche
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {
                editingConger && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
                            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-t-2xl">
                                <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                                onClick={()=>{setEditingConger(false)}}>
                                <X size={20} className="text-white"/>
                                </button>
                                <h3 className="text-2xl font-bold text-white">Modifier votre demande</h3>
                                <p className="text-green-100 mt-1">Modifier votre demande pour envoyer au manager</p>
                            </div>

                            <form className="p-6 space-y-6" onSubmit={handleUpdate}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type du conger</label>
                                    <input type="text" 
                                        value={editingConger.typeConger}
                                        onChange={(e)=> setEditingConger({ ...editingConger, typeConger : e.target.value})}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2"> Date de début</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        onChange={(e)=> setEditingConger({ ...editingConger, dateDebutConger : e.target.value})}
                                        value={editingConger.dateDebutConger ? editingConger.dateDebutConger.split("T")[0] : ""}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2"> Date de fin</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        onChange={(e)=> setEditingConger({ ...editingConger, dateFinConger : e.target.value})}
                                        value={editingConger.dateFinConger ? editingConger.dateFinConger.split("T")[0] : ""}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                                    <select className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    onChange={(e)=> setEditingConger({ ...editingConger, idManagerTraiter : e.target.value})}
                                    value={editingConger.idManagerTraiter} 
                                    >
                                        <option value="">Séléctionner le manager</option>
                                        {
                                            managerList.map((user)=>(
                                                <option value={user.idutilisateur}
                                                
                                                key={user.idutilisateur}>
                                                    {user.nomutilisateur}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer" onClick={()=>setEditingConger(false)}>
                                    Annuler
                                    </button>
                                    <button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg font-medium cursor-pointer">
                                        Modifier la demande
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                createDemandeConger && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div 
                            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
                            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-t-2xl">
                                <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200" onClick={()=>setDemandeConger(false)}>
                                <X size={20} className="text-white"/>
                                </button>
                                <h3 className="text-2xl font-bold text-white">Faire votre demande</h3>
                                <p className="text-green-100 mt-1">Faire votre demande pour envoyer au manager</p>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type du conger</label>
                                    <input type="text" 
                                        value={createDemandeConger.typeConger}
                                        onChange={(e)=> setDemandeConger({ ...createDemandeConger, typeConger : e.target.value})}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2"> Date de début</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        onChange={(e)=> setDemandeConger({ ...createDemandeConger, dateDebutConger : e.target.value})}
                                        value={createDemandeConger.dateDebutConger}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2"> Date de fin</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        onChange={(e)=> setDemandeConger({ ...createDemandeConger, dateFinConger : e.target.value})}
                                        value={createDemandeConger.dateFinConger}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                                    <select className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    onChange={(e)=> setDemandeConger({ ...createDemandeConger, idManagerTraiter : e.target.value})}
                                    value={createDemandeConger.idManagerTraiter}
                                    >
                                        <option value={0}>Séléctionner le manager</option>
                                        {
                                            managerList.map((user)=>(
                                                <option value={user.idutilisateur} key={user.idutilisateur}>{user.nomutilisateur}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer" onClick={()=>setDemandeConger(false)}>
                                    Annuler
                                    </button>
                                    <button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg font-medium cursor-pointer">
                                        Faire la demande
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

        <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
};

export default CongerListAgent;
