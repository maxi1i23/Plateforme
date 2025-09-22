"use client"

import { useContext, useEffect, useState } from "react"
import api from "../../services/api"
import {
  Calendar,
  User,
  FileText,
  MoreVertical,
  Edit,
  Trash,
  X,
  Plus,
  Search,
  BookOpen,
  Award,
  TrendingUp,
} from "lucide-react"
import { AuthContext } from "../../context/AuthContext"
import Swal from "sweetalert2"

const FormationListManager = () => {
  const [formationList, setFormationList] = useState([])
  const [filteredFormations, setFilteredFormations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editingFormation, setEditingFormation] = useState(null)
  const [creatingFormation, setCreatingFormation] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useContext(AuthContext)

  // 🔎 Correction de la recherche (évite les erreurs undefined)
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

  const getFormation = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/formation`)
      setFormationList(response.data)
    } catch (error) {
      console.error("Erreur récupération formations :", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Supprimer une formation
  const handleDelete = async (idformation) => {
    try {
      await api.delete(`/formation/delete/${idformation}`)
      setFormationList((prev) => prev.filter((f) => f.idformation !== idformation))
      Swal.fire({
        icon: "success",
        title: "Formation supprimée",
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      console.error("Erreur suppression :", error)
    }
  }

  // Modifier une formation
  const handleEdit = (formation) => {
    setEditingFormation(formation)
    setOpenMenuId(null)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const { idformation, nomformation, descriptionformation } = editingFormation
      await api.put(`/formation/update/${idformation}`, {
        nomFormation: nomformation,
        descriptionFormation: descriptionformation,
      })
      setFormationList((prev) =>
        prev.map((f) => (f.idformation === idformation ? { ...f, nomformation, descriptionformation } : f)),
      )
      setEditingFormation(null)
    } catch (error) {
      console.error("Erreur modification :", error)
    }
  }

  // Créer une formation
  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("/formation/add", {
        nomFormation: creatingFormation.nomformation,
        descriptionFormation: creatingFormation.descriptionformation,
        idUtilisateurManager: user.idutilisateur,
      })
      setFormationList((prev) => [response.data, ...prev])
      setCreatingFormation(false)
      getFormation()
    } catch (error) {
      console.error("Erreur création :", error)
    }
  }

  // Fermer menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-formation")) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    getFormation()
  }, [])

  const totalFormations = formationList.length
  const myFormations = formationList.filter((f) => f.idutilisateurmanager === user.idutilisateur).length
  const completedFormations = Math.floor(totalFormations * 0.7) // Mock data
  const activeFormations = totalFormations - completedFormations

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Gestion des Formations
            </h1>
            <p className="text-gray-600">Organisez et suivez vos programmes de formation</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-80"
            />
          </div>



          <button
            onClick={() => setCreatingFormation({ nomformation: "", descriptionformation: "" })}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Plus size={20} /> Créer une formation
          </button>

          </div>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Formations</p>
                <p className="text-3xl font-bold text-indigo-600">{totalFormations}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mes Formations</p>
                <p className="text-3xl font-bold text-green-600">{myFormations}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFormations.map((formation) => (
              <div
                key={formation.idformation}
                className="relative p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {formation.idutilisateurmanager === user.idutilisateur && (
                  <div className="absolute top-4 right-4 menu-formation">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === formation.idformation ? null : formation.idformation)}
                      className="p-2 rounded-full hover:bg-white/50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {openMenuId === formation.idformation && (
                      <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg z-10 overflow-hidden">
                        <button
                          onClick={() => handleEdit(formation)}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-2 text-indigo-600" /> Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(formation.idformation)}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash className="w-4 h-4 mr-2" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h5 className="text-xl font-bold text-gray-800 line-clamp-1">{formation.nomformation}</h5>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(formation.dateformation).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-gray-700 line-clamp-3 mb-4 leading-relaxed">{formation.descriptionformation}</p>


                </div>

                <div className="mt-4 pt-4 border-t border-gray-200/50">

                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center justify-between text-sm ">
                      <div className="p-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-medium ms-2 text-gray-700">Manager: {formation.idutilisateurmanager}</span>
                    </div>

                    {formation.idutilisateurmanager === user.idutilisateur && (
                      <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        Mes formations
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editingFormation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/20 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl"></div>
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/50 transition-colors"
                onClick={() => setEditingFormation(null)}
              >
                <X size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Modifier la formation</h3>
              </div>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la formation</label>
                  <input
                    type="text"
                    value={editingFormation.nomformation}
                    onChange={(e) => setEditingFormation({ ...editingFormation, nomformation: e.target.value })}
                    className="w-full p-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nom de la formation"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingFormation.descriptionformation}
                    onChange={(e) => setEditingFormation({ ...editingFormation, descriptionformation: e.target.value })}
                    className="w-full p-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="Description de la formation"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Enregistrer les modifications
                </button>
              </form>
            </div>
          </div>
        )}

        {creatingFormation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/20 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl"></div>
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/50 transition-colors"
                onClick={() => setCreatingFormation(false)}
              >
                <X size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Créer une formation</h3>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la formation</label>
                  <input
                    type="text"
                    value={creatingFormation.nomformation}
                    onChange={(e) => setCreatingFormation({ ...creatingFormation, nomformation: e.target.value })}
                    className="w-full p-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Nom de la formation"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={creatingFormation.descriptionformation}
                    onChange={(e) =>
                      setCreatingFormation({ ...creatingFormation, descriptionformation: e.target.value })
                    }
                    className="w-full p-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    placeholder="Description de la formation"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Créer la formation
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormationListManager
