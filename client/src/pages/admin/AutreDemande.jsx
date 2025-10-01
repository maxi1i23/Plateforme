import React, { useState, useEffect, useContext } from "react"
import api from "../../services/api"
import { AuthContext } from "../../context/AuthContext"
import Swal from "sweetalert2"
import { Search, Plus, X } from "lucide-react";

const AutreDemandeAgent = () => {
    const [listDemande, setListDemande] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const { user } = useContext(AuthContext)
    const [createDemande, setCreateDemande] = useState(false)
    const [managerList, setManagerList] = useState([])
    const [editingDemande, setEditingDemande] = useState(null)

    const getDemande = async () => {
        try {
            setLoading(true)
            const response = await api.get("/autreDemande")
            const userData = await api.get("/user")
            // Filtrer seulement les demandes de ce manager
            setListDemande(response.data)
            setManagerList(userData.data.filter(user => user.roleutilisateur === "Manager"))
        } catch (err) {
            console.error("Erreur récupération demandes", err)
            Swal.fire("Erreur", "Impossible de récupérer les demandes", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDemande()
    }, [])

    const handleDelete = async (id) => {
        if (!id) {
            console.error("ID invalide pour la suppression :", id);
            Swal.fire("Erreur", "ID de demande invalide", "error");
            return;
        }

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
                    await api.delete(`autreDemande/delete/${id}`);

                    // Suppression dans l'état avec fallback pour différentes clés possibles
                    setListDemande((prev) =>
                        prev.filter((demande) =>
                            demande.idautredemande !== id &&
                            demande.idAutreDemande !== id
                        )
                    );

                    Swal.fire("Supprimé !", "La demande a été supprimée.", "success");
                } catch (error) {
                    console.error("Erreur suppression :", error);
                    Swal.fire("Erreur", "Impossible de supprimer", "error");
                }
            }
        });
    };


    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('autreDemande/add',
                {
                    nomAutreDemande: createDemande.nomAutreDemande,
                    descriptionAutreDemande: createDemande.descriptionAutreDemande,
                    dateDemande: createDemande.dateDemande,
                    idManagerTraiterAutreDemande: createDemande.idManagerTraiterAutreDemande
                }
            )
            setListDemande((prev) => [response.data, ...prev])
            setCreateDemande(false)
            getDemande();
            Swal.fire({
                icon: "success",
                title: "Demande envoyée",
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
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const response = await api.put(
                `autreDemande/update/${editingDemande.idautredemande}`,
                {
                    nomAutreDemande: editingDemande.nomautredemande,
                    descriptionAutreDemande: editingDemande.descriptionautredemande,
                    dateDemande: editingDemande.dateDemande,
                    idManagerTraiterAutreDemande: editingDemande.idmanagertraiterautredemande
                }
            );
            setListDemande((prev) =>
                prev.map((c) =>
                    c.idautredemande === response.data.idautredemande
                        ? { ...c, ...response.data }
                        : c
                )
            );
            getDemande();
            setEditingDemande(null);
            Swal.fire("Succès", "Demande mise à jour", "success");
        } catch (error) {
            console.error("Erreur update :", error);
            Swal.fire("Erreur", "Impossible de mettre à jour", "error");
        }
    }

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

    const stats = {
        total: listDemande.length,
        enAttente: listDemande.filter((d) => (d.statutautredemande || "").toLowerCase() === "en attente").length,
        acceptees: listDemande.filter((d) => (d.statutautredemande || "").toLowerCase() === "accepter").length,
        refusees: listDemande.filter((d) => (d.statutautredemande || "").toLowerCase() === "refuser").length,
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            "En attente": "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
            Accepter: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
            Refuser: "bg-gradient-to-r from-red-400 to-rose-500 text-white",
        }

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[status] || "bg-gray-200 text-gray-800"}`}
            >
                {status}
            </span>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Chargement des demandes...</p>
                </div>
            </div>
        )
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

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Autres Demandes
                        </h1>
                        <p className="text-gray-600">Gérez les demandes spéciales de vos agents</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-80"
                            />

                        </div>

                        <button
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                            onClick={() => setCreateDemande({ nomAutreDemande: "", descriptionAutreDemande: "", dateDemande: "", idManagerTraiterAutreDemande: 0 })}
                        >
                            <Plus size={20} />Faire une demande
                        </button>

                    </div>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">En Attente</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.enAttente}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <p className="text-3xl font-bold text-green-600">{stats.acceptees}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Refusées</p>
                                <p className="text-3xl font-bold text-red-600">{stats.refusees}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                                <option value="En attente">En attente</option>
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
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nom</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date demande</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Agent</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Manager</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredDemandes.length > 0 ? (
                                    filteredDemandes.map((demande, index) => (
                                        <tr key={demande.idautredemande} className="hover:bg-white/50 transition-all duration-200 group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{demande.nomautredemande}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-600 max-w-xs truncate">{demande.descriptionautredemande}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-600">{new Date(demande.datedemande).toLocaleDateString("fr-FR")}</div>
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(demande.statutautredemande)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                                                        {demande.idagentautredemande.toString().slice(-2)}
                                                    </div>
                                                    <span className="">{demande.nomagentautredemande}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                                                        {demande.idmanagertraiterautredemande.toString().slice(-2)}
                                                    </div>
                                                    <span className="">{demande.nommanagertraiterautredemande}</span>
                                                </div>

                                            </td>
                                            <td className="px-6 py-4">
                                                {demande.statutautredemande === "En attente" ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                                            onClick={() => {
                                                                setEditingDemande(
                                                                    {
                                                                        ...demande,
                                                                        nomAutreDemande: demande.nomautredemande,
                                                                        descriptionAutreDemande: demande.descriptionautredemande,
                                                                        dateDemande: demande.datedemande,
                                                                        idManagerTraiterAutreDemande: demande.idmanagertraiterautredemande
                                                                    }
                                                                )
                                                            }}
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                                            onClick={() => handleDelete(demande.idautredemande)}
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 italic">Déjà traitée</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
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
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                <p className="text-gray-500 font-medium">Aucune demande trouvée</p>
                                                <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
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
                createDemande && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div
                            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
                            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-t-2xl">
                                <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200" onClick={() => setCreateDemande(false)}>
                                    <X size={20} className="text-white" />
                                </button>
                                <h3 className="text-2xl font-bold text-white">Faire votre demande</h3>
                                <p className="text-green-100 mt-1">Faire votre demande pour envoyer au manager</p>
                            </div>

                            <form className="p-6 space-y-6" onSubmit={handleCreate}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type du demande</label>
                                    <input type="text"
                                        value={createDemande.nomAutreDemande}
                                        onChange={(event) => setCreateDemande({ ...createDemande, nomAutreDemande: event.target.value })}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2"> Déscriptions</label>
                                    <input
                                        type="text"
                                        value={createDemande.descriptionAutreDemande}
                                        onChange={(event) => setCreateDemande({ ...createDemande, descriptionAutreDemande: event.target.value })}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2"> Date</label>
                                    <input
                                        type="date"
                                        value={createDemande.dateDemande}
                                        onChange={(event) => setCreateDemande({ ...createDemande, dateDemande: event.target.value })}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                                    <select className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        value={createDemande.idManagerTraiteraAutreDemande}
                                        onChange={(event) => setCreateDemande({ ...createDemande, idManagerTraiterAutreDemande: Number(event.target.value) })}
                                    >
                                        <option value={0}>Séléctionner le manager</option>
                                        {
                                            managerList.map((user) => (
                                                <option value={user.idutilisateur} key={user.idutilisateur}>{user.nomutilisateur}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer" onClick={() => setCreateDemande(false)}>
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
            {
                editingDemande && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
                            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-t-2xl">
                                <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                                    onClick={() => { setEditingDemande(null) }}>
                                    <X size={20} className="text-white" />
                                </button>
                                <h3 className="text-2xl font-bold text-white">Modifier votre demande</h3>
                                <p className="text-green-100 mt-1">Modifier votre demande pour envoyer au manager</p>
                            </div>

                            <form className="p-6 space-y-6" onSubmit={handleUpdate}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type du demande</label>
                                    <input type="text"
                                        value={editingDemande.nomAutreDemande}
                                        onChange={(event) => setEditingDemande({ ...editingDemande, nomAutreDemande: event.target.value })}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2"> Descriptions </label>
                                    <input
                                        type="text"
                                        value={editingDemande.descriptionAutreDemande}
                                        onChange={(event) => setEditingDemande({ ...editingDemande, descriptionAutreDemande: event.target.value })}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2"> Date</label>
                                    <input
                                        type="date"
                                        value={editingDemande.dateDemande ? editingDemande.dateDemande.split("T")[0] : ""}
                                        onChange={(event) => setEditingDemande({ ...editingDemande, dateDemande: event.target.value })}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"

                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                                    <select className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        value={editingDemande.idManagerTraiterAutreDemande}
                                        onChange={(event) => setEditingDemande({ ...editingDemande, idManagerTraiterAutreDemande: Number(event.target.value) })}
                                    >
                                        <option value="">Séléctionner le manager</option>
                                        {
                                            managerList.map((user) => (
                                                <option value={user.idutilisateur}

                                                    key={user.idutilisateur}>
                                                    {user.nomutilisateur}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer" onClick={() => setEditingDemande(null)}>
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
        </div>
    )
}

export default AutreDemandeAgent