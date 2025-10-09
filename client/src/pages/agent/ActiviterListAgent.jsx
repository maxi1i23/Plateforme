"use client"

import { useState, useEffect, useContext } from "react"
import api from "../../services/api"
import { AuthContext } from "../../context/AuthContext"
import Swal from "sweetalert2"
import { Plus, X, Phone, Clock, Coffee, TrendingUp, Calendar, BarChart3, Edit, Trash2 } from "lucide-react"

const ActiviterListAgent = () => {
  const { user } = useContext(AuthContext)
  const [activites, setActivites] = useState([])
  const [performances, setPerformances] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingActivite, setEditingActivite] = useState(null)
  const [formData, setFormData] = useState({
    nbappelle: 0,
    pauses: 0,
    dureeappelle: 0,
  })

  // Récupération des activités
  const getActivites = async () => {
    try {
      setLoading(true)
      const response = await api.get("/activiter")
      setActivites(
        response.data.filter((a) => a.idagent === user.idutilisateur)
      )
    } catch (error) {
      console.error("Erreur récupération activités :", error)
      Swal.fire("Erreur", "Impossible de récupérer les activités", "error")
    } finally {
      setLoading(false)
    }
  }

  // Récupération des performances
  const getPerformances = async () => {
    try {
      const response = await api.get("/activiter/performance")
      setPerformances(response.data.filter((val)=>(val.idagent == user.idutilisateur)))
      console.log(response.data.filter((val)=>(val.idagent == user.idutilisateur)))
    } catch (error) {
      console.error("Erreur récupération performances :", error)
      Swal.fire("Erreur", "Impossible de récupérer les performances", "error")
    }
  }

  useEffect(() => {
    getActivites()
    getPerformances()
  }, [])

  // Filtrer par date
  const filteredActivites = filterDate ? activites.filter((a) => a.dateactiviter === filterDate) : activites

  // Ajouter ou modifier
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingActivite) {
        const response = await api.put(`/activiter/${editingActivite.idactiviter}`, {
          nbAppelle: formData.nbappelle,
          pauses: formData.pauses,
          dureeAppelle: formData.dureeappelle,
        })
        setActivites((prev) =>
          prev.map((a) => (a.idactiviter === editingActivite.idactiviter ? response.data.activite : a)),
        )
        Swal.fire("Modifié !", "L'activité a été modifiée.", "success")
      } else {
        const response = await api.post("/activiter", {
          nbAppelle: formData.nbappelle,
          pauses: formData.pauses,
          dureeAppelle: formData.dureeappelle,
        })
        setActivites((prev) => [response.data.activite, ...prev])
        Swal.fire("Ajouté !", "L'activité a été ajoutée.", "success")
      }

      // Mise à jour performances après modification ou ajout
      await getPerformances()

      setShowForm(false)
      setEditingActivite(null)
      setFormData({ nbappelle: 0, pauses: 0, dureeappelle: 0 })
    } catch (error) {
      console.error("Erreur :", error)
      Swal.fire("Erreur", "Impossible de sauvegarder l'activité", "error")
    }
  }

  // Supprimer
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
          await api.delete(`/activiter/delete/${id}`)
          setActivites((prev) => prev.filter((a) => a.idactiviter !== id))
          Swal.fire("Supprimé !", "L'activité a été supprimée.", "success")
          await getPerformances()
        } catch (error) {
          console.error("Erreur suppression :", error)
          Swal.fire("Erreur", "Impossible de supprimer", "error")
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
            Activité de l'agent
          </h1>
          <p className="text-gray-600">Suivez et gérez vos performances quotidiennes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activités</p>
                <p className="text-3xl font-bold text-gray-900">{activites.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appels Totaux</p>
                <p className="text-3xl font-bold text-green-600">
                  {activites.reduce((sum, a) => sum + a.nbappelle, 0)}
                </p>
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
                <p className="text-3xl font-bold text-purple-600">
                  {activites.reduce((sum, a) => sum + a.dureeappelle, 0).toFixed(0)}min
                </p>
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
                <p className="text-3xl font-bold text-orange-600">{activites.reduce((sum, a) => sum + a.pauses, 0)}min</p>
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
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                onClick={() => setFilterDate("")}
                className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg"
              >
                Réinitialiser
              </button>
            </div>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingActivite(null)
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <Plus size={18} /> Ajouter une activité
            </button>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Appels</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pauses</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Durée appels (min)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredActivites.length > 0 ? (
                  filteredActivites.map((a) => (
                    <tr key={a.idactiviter} className="hover:bg-white/50 transition-all duration-200 group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{new Date(a.dateactiviter).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-green-500 mr-2" />
                          <span className="font-semibold text-gray-900">{a.nbappelle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Coffee className="w-4 h-4 text-orange-500 mr-2" />
                          <span className="font-semibold text-gray-900">{a.pauses}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-purple-500 mr-2" />
                          <span className="font-semibold text-gray-900">{a.dureeappelle.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingActivite(a)
                              setFormData({
                                nbappelle: a.nbappelle,
                                pauses: a.pauses,
                                dureeappelle: a.dureeappelle,
                              })
                              setShowForm(true)
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            <Edit className="w-4 h-4"/>
                          </button>
                          <button
                            onClick={() => handleDelete(a.idactiviter)}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">Aucune activité trouvée</p>
                        <p className="text-gray-400 text-sm">Ajoutez votre première activité pour commencer</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Performances
          </h2>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-500/10 to-blue-500/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Semaine</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mois</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Productivité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {performances.length > 0 ? (
                    performances.map((p) => (
                      <tr key={p.idperformance} className="hover:bg-white/50 transition-all duration-200">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{p.semaine}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{p.mois}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                            <span className="font-semibold text-green-600">{(p.productiviter * 100).toFixed(1)} %</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
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

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
                <button
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                  onClick={() => {
                    setShowForm(false)
                    setEditingActivite(null)
                  }}
                >
                  <X size={20} className="text-white" />
                </button>
                <h3 className="text-2xl font-bold text-white">
                  {editingActivite ? "Modifier l'activité" : "Ajouter une activité"}
                </h3>
                <p className="text-indigo-100 mt-1">
                  {editingActivite ? "Mettez à jour vos données d'activité" : "Enregistrez votre nouvelle activité"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'appels</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.nbappelle}
                      onChange={(e) => setFormData({ ...formData, nbappelle: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nombre d'appels effectués"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pauses (minutes)</label>
                  <div className="relative">
                    <Coffee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.pauses}
                      onChange={(e) => setFormData({ ...formData, pauses: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nombre de pauses prises"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée des appels (minutes)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.1"
                      value={formData.dureeappelle}
                      onChange={(e) => setFormData({ ...formData, dureeappelle: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Durée totale des appels"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingActivite(null)
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
                  >
                    {editingActivite ? "Modifier" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActiviterListAgent