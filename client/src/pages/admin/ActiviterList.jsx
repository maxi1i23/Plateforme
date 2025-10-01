"use client"

import { useEffect, useState } from "react"
import api from "../../services/api"
import Swal from "sweetalert2"
import { Phone, Clock, Coffee, TrendingUp, Calendar, BarChart3, Users, Trash2 } from "lucide-react"

const ActiviterList = () => {
  const [activiterList, setActiviterList] = useState([])
  const [performanceList, setPerformanceList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterAgent, setFilterAgent] = useState("")
  const [filterDate, setFilterDate] = useState("")

  // Charger les activités
  const getActiviter = async () => {
    try {
      setLoading(true)
      const response = await api.get("/activiter")
      setActiviterList(response.data)
      console.log("Activités:", response.data)
    } catch (error) {
      console.error(error)
      Swal.fire("Erreur", "Impossible de récupérer les activités", "error")
    } finally {
      setLoading(false)
    }
  }

  // Charger les performances
  const getPerformance = async () => {
    try {
      const response = await api.get("/activiter/performance")
      setPerformanceList(response.data)
      console.log("Performances:", response.data)
    } catch (error) {
      console.error(error)
      Swal.fire("Erreur", "Impossible de récupérer les performances", "error")
    }
  }

  useEffect(() => {
    getActiviter()
    getPerformance()
  }, [])

  // Filtrer les activités
  const filteredActivites = activiterList.filter((activite) => {
    const matchAgent = !filterAgent || activite.idagent.toString().includes(filterAgent)
    const matchDate =
      !filterDate || new Date(activite.dateactiviter).toLocaleDateString() === new Date(filterDate).toLocaleDateString()
    return matchAgent && matchDate
  })

  // Calculer les statistiques
  const totalActivites = activiterList.length
  const totalAppels = activiterList.reduce((sum, a) => sum + a.nbappelle, 0)
  const totalDuree = activiterList.reduce((sum, a) => sum + a.dureeappelle, 0)
  const totalPauses = activiterList.reduce((sum, a) => sum + a.pauses, 0)
  const agentsUniques = [...new Set(activiterList.map((a) => a.idagent))].length

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Attention !",
      text: "Êtes-vous sûr de vouloir supprimer cette activité ?",
      confirmButtonText: "Supprimer",
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete("/activiter/delete/" + id)
          Swal.fire({
            title: "Succès",
            icon: "success",
            text: "Activité supprimée avec succès !",
          })
          getActiviter()
          getPerformance()
        } catch (error) {
          Swal.fire({
            title: "Erreur",
            icon: "error",
            text: "Une erreur est survenue, veuillez réessayer !",
          })
          console.log(error)
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des activités...</p>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Gestion des Activités
          </h1>
          <p className="text-gray-600">Supervision et analyse des performances des agents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activités</p>
                <p className="text-3xl font-bold text-gray-900">{totalActivites}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agents Actifs</p>
                <p className="text-3xl font-bold text-blue-600">{agentsUniques}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appels Totaux</p>
                <p className="text-3xl font-bold text-green-600">{totalAppels}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Phone className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Durée Totale</p>
                <p className="text-3xl font-bold text-purple-600">{totalDuree.toFixed(0)}min</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pauses Totales</p>
                <p className="text-3xl font-bold text-orange-600">{totalPauses}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                <Coffee className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={filterAgent}
                  onChange={(e) => setFilterAgent(e.target.value)}
                  placeholder="Filtrer par agent..."
                  className="pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                onClick={() => {
                  setFilterAgent("")
                  setFilterDate("")
                }}
                className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-800">Liste des activités</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre d'appels</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pause (min)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Durée des appels</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Agent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredActivites.length > 0 ? (
                  filteredActivites.map((activiter) => (
                    <tr className="hover:bg-white/50 transition-all duration-200 group" key={activiter.idactiviter}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-green-500 mr-2" />
                          <span className="font-semibold text-gray-900">{activiter.nbappelle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Coffee className="w-4 h-4 text-orange-500 mr-2" />
                          <span className="font-semibold text-gray-900">{activiter.pauses}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-purple-500 mr-2" />
                          <span className="font-semibold text-gray-900">{activiter.dureeappelle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {new Date(activiter.dateactiviter).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="font-semibold text-gray-900">Agent {activiter.idagent}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                          onClick={() => {
                            handleDelete(activiter.idactiviter)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">Aucune activité trouvée</p>
                        <p className="text-gray-400 text-sm">Aucune activité ne correspond aux filtres sélectionnés</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-800">Performances</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-500/5 to-blue-500/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Semaine</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mois</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Productivité</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {performanceList.length > 0 ? (
                  performanceList.map((perf) => (
                    <tr className="hover:bg-white/50 transition-all duration-200" key={perf.idperformance}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{perf.semaine}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{perf.mois}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                          <span className="font-semibold text-green-600">{(perf.productiviter * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="font-semibold text-gray-900">Agent {perf.idagent}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <TrendingUp className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">Aucune performance trouvée</p>
                        <p className="text-gray-400 text-sm">Les performances seront calculées automatiquement</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiviterList