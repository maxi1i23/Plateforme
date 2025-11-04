"use client"

import { useContext, useEffect, useState } from "react"
import api from "../../services/api"
import { Calendar, User, FileText, MoreVertical, Edit, Trash, X, Plus, Search, Clock, Star, Eye } from "lucide-react"
import { AuthContext } from "../../context/AuthContext"
import Swal from "sweetalert2"
import FeedBack from "../../components/FeedBack.jsx"
import Briefing from "../../components/Briefing.jsx"

const BriefingListManager = () => {
  const [briefingList, setBriefingList] = useState([])
  const [filteredBriefings, setFilteredBriefings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editingBriefing, setEditingBriefing] = useState(null)
  const [creatingBriefing, setCreatingBriefing] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)
  const [feedback, setFeedback] = useState(false)
  const [selectedBriefing, setSelectedBriefing] = useState(null)
  const [see, setSee] = useState(false)

  // 🔎 Sécurisation de la recherche
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

  // Récupérer la liste des briefings
  const getBriefing = async () => {
    try {
      setLoading(true)
      const response = await api.get("/briefing")
      setBriefingList(response.data)
    } catch (error) {
      console.error("Erreur récupération briefing :", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (idbriefing) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    })

    if (result.isConfirmed) {
      try {
        await api.delete(`/briefing/delete/${idbriefing}`)
        setBriefingList((prev) => prev.filter((b) => b.idbriefing !== idbriefing))
        Swal.fire({
          icon: "success",
          title: "Suppression réussie",
          showConfirmButton: false,
          timer: 1500,
        })
      } catch (error) {
        console.error("Erreur suppression :", error)
        Swal.fire({
          icon: "error",
          title: "Erreur lors de la suppression",
          showConfirmButton: false,
          timer: 1500,
        })
      }
    }
  }

  // Ouvrir modal de modification
  const handleEdit = (briefing) => {
    setEditingBriefing(briefing)
    setOpenMenuId(null)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const { idbriefing, nombriefing, contenubriefing } = editingBriefing
      await api.put(`/briefing/update/${idbriefing}`, {
        nomBriefing: nombriefing,
        contenuBriefing: contenubriefing,
      })
      setBriefingList((prev) =>
        prev.map((b) => (b.idbriefing === idbriefing ? { ...b, nombriefing, contenubriefing } : b)),
      )
      setEditingBriefing(null)
      Swal.fire({
        icon: "success",
        title: "Briefing modifié avec succès",
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      console.error("Erreur modification :", error)
      Swal.fire({
        icon: "error",
        title: "Erreur lors de la modification",
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  // Créer un nouveau briefing
  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("/briefing/add", {
        nomBriefing: creatingBriefing.nombriefing,
        contenuBriefing: creatingBriefing.contenubriefing,
        idManager: user.idutilisateur,
      })
      setBriefingList((prev) => [response.data, ...prev])
      setCreatingBriefing(false)
      getBriefing()
      Swal.fire({
        icon: "success",
        title: "Briefing créé avec succès",
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      console.error("Erreur création :", error)
      Swal.fire({
        icon: "error",
        title: "Erreur lors de la création",
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  // Fermer menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-briefing")) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    getBriefing()
  }, [])

  const feed = (briefing) => {
    setFeedback(true)
    setSelectedBriefing(briefing)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">

        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Gestion des Briefings
          </h2>
          <p className="text-gray-600">Gérez vos briefings et communications d'équipe</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un briefing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-80"
            />
          </div>

          <button
            onClick={() => setCreatingBriefing({ nombriefing: "", contenubriefing: "" })}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
            <Plus size={20} /> Créer un briefing
          </button>
        </div>

      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Briefings</p>
                  <p className="text-2xl font-bold text-gray-900">{briefingList.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Mes Briefings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {briefingList.filter((b) => b.idmanager === user.idutilisateur).length}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Cette semaine</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      briefingList.filter((b) => {
                        const briefingDate = new Date(b.datebriefing)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return briefingDate >= weekAgo
                      }).length
                    }
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBriefings.map((briefing, index) => (
              <div
                key={briefing.idbriefing}
                className="group relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative p-6">

                  <div className="absolute top-4 right-4 menu-briefing">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === briefing.idbriefing ? null : briefing.idbriefing)}
                      className="p-2 rounded-full hover:bg-gray-100/80 transition-colors duration-200 backdrop-blur-sm"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {openMenuId === briefing.idbriefing && (
                      <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden">
                        <button
                          onClick={() => handleEdit(briefing)}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4 mr-3" /> Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(briefing.idbriefing)}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash className="w-4 h-4 mr-3" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>


                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h5 className="text-xl font-bold text-gray-900 leading-tight flex-1">{briefing.nombriefing}</h5>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(briefing.datebriefing).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed line-clamp-1">{briefing.contenubriefing}</p>
                  </div>

                  <div className="flex-1 flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    {/* --- Manager info --- */}
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1.5 rounded-full shadow-sm">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {briefing.nommanager}
                      </span>
                    </div>
                    {/* --- Action buttons --- */}
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() => {
                          setSee(true);
                          setSelectedBriefing(briefing);
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg  hover:bg-indigo-100 hover:shadow transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </button>

                      <button
                        onClick={() => feed(briefing)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 
                        bg-yellow-50 text-yellow-600 rounded-lg 
                        hover:bg-yellow-100 hover:shadow transition-all duration-200"
                      >
                        <Star className="w-4 h-4" />
                        Avis
                      </button>

                      {briefing.idmanager === user.idutilisateur && (
                        <div
                          className="flex items-center gap-1 px-3 py-1.5 
                          bg-gradient-to-r from-blue-500 to-indigo-500 
                          text-white rounded-lg text-xs font-semibold 
                          shadow-sm"
                        >
                          <User className="w-3.5 h-3.5" />
                          Mes briefings
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBriefings.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? "Aucun briefing trouvé" : "Aucun briefing disponible"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? "Essayez avec d'autres mots-clés" : "Commencez par créer votre premier briefing"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setCreatingBriefing({ nombriefing: "", contenubriefing: "" })}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    Créer un briefing
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {editingBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                onClick={() => setEditingBriefing(null)}
              >
                <X size={20} className="text-white" />
              </button>
              <h3 className="text-2xl font-bold text-white">Modifier le briefing</h3>
              <p className="text-blue-100 mt-1">Mettez à jour les informations de votre briefing</p>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du briefing</label>
                <input
                  type="text"
                  value={editingBriefing.nombriefing}
                  onChange={(e) => setEditingBriefing({ ...editingBriefing, nombriefing: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Entrez le nom du briefing"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenu du briefing</label>
                <textarea
                  value={editingBriefing.contenubriefing}
                  onChange={(e) => setEditingBriefing({ ...editingBriefing, contenubriefing: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Décrivez le contenu de votre briefing"
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBriefing(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {creatingBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                onClick={() => setCreatingBriefing(false)}
              >
                <X size={20} className="text-white" />
              </button>
              <h3 className="text-2xl font-bold text-white">Créer un nouveau briefing</h3>
              <p className="text-green-100 mt-1">Partagez vos informations importantes avec l'équipe</p>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du briefing</label>
                <input
                  type="text"
                  value={creatingBriefing.nombriefing}
                  onChange={(e) => setCreatingBriefing({ ...creatingBriefing, nombriefing: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Entrez le nom du briefing"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenu du briefing</label>
                <textarea
                  value={creatingBriefing.contenubriefing}
                  onChange={(e) => setCreatingBriefing({ ...creatingBriefing, contenubriefing: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Décrivez le contenu de votre briefing"
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setCreatingBriefing(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg font-medium"
                >
                  Créer le briefing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {
        feedback && (<FeedBack onClose={() => setFeedback(false)} briefing={selectedBriefing} user={user} />)
      }
      {
        selectedBriefing && see && (<Briefing briefing={selectedBriefing} setBriefing={() => { setSelectedBriefing(null); setSee(false) }} />)
      }
    </div>
  )
}

export default BriefingListManager