"use client"

import { useContext, useEffect, useState } from "react"
import api from "../../services/api"
import { Calendar, User, FileText, Search, BookOpen } from "lucide-react"
import { AuthContext } from "../../context/AuthContext"
import Display from "../../components/Display"

const FormationListAgent = () => {
  const [formationList, setFormationList] = useState([])
  const [filteredFormations, setFilteredFormations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openMenuId, setOpenMenuId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useContext(AuthContext)
  const [selectedFormation, setSelectedFormation] = useState(null)

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
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
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
                className="relative p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
                onClick={() => setSelectedFormation(formation)}
              >
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
                  <p className="text-gray-700 line-clamp-1 mb-4 leading-relaxed">{formation.descriptionformation}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200/50">

                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center justify-between text-sm ">
                      <div className="p-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-medium ms-2 text-gray-700">{formation.nommanager}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFormations.length === 0 && !isLoading && (
          <div className="text-center py-20 w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "Aucune formation trouvée" : "Aucune formation disponible"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? "Essayez avec d'autres mots-clés" : "Aucune formation disponiblen"}
              </p>
            </div>
          </div>
        )}
      </div>
      {
        selectedFormation && (
          <Display formation={selectedFormation} setFormation={setSelectedFormation} />
        )
      }
    </div>
  )
}

export default FormationListAgent