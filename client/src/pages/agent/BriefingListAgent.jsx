"use client"

import { useContext, useEffect, useState } from "react"
import api from "../../services/api"
import { Calendar, User, FileText, MoreVertical, Edit, Trash, X, Plus, Search, Clock } from "lucide-react"
import { AuthContext } from "../../context/AuthContext"
import Swal from "sweetalert2"

const BriefingListAgent = () => {
  const [briefingList, setBriefingList] = useState([])
  const [filteredBriefings, setFilteredBriefings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editingBriefing, setEditingBriefing] = useState(null)
  const [creatingBriefing, setCreatingBriefing] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

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
        </div>

      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                    <p className="text-gray-700 leading-relaxed line-clamp-3">{briefing.contenubriefing}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-1.5 rounded-full">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{briefing.nommanager}</span>
                    </div>

                    {briefing.idmanager === user.idutilisateur && (
                      <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        Mes briefings
                      </div>
                    )}
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
                  {searchTerm ? "Essayez avec d'autres mots-clés" : "Aucun briefing disponible"}
                </p>
                
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BriefingListAgent