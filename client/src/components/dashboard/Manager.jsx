"use client"

import { useContext, useEffect, useState } from "react"
import api from "../../services/api"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { AuthContext } from "../../context/AuthContext"
import Discussion from "../../pages/Discussion"
import { BookOpen, CalendarDays, ClipboardList } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Manager = () => {
  const { user } = useContext(AuthContext)

  const [congesPending, setCongesPending] = useState(0)
  const [autresDemandesPending, setAutresDemandesPending] = useState(0)
  const [formationCreer, setFormationCreer] = useState(0)
  const [performanceData, setPerformanceData] = useState([])
  const [activiterData, setActiviterData] = useState([])
  const [agentList, setAgentList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Formations
        const formations = await api.get(`/formation/${user.idutilisateur}`)
        setFormationCreer(formations.data.length)

        // Congés
        const conges = await api.get("/demandeConger")
        setCongesPending(
          conges.data.filter((c) => c.statutconger === "en attente" && c.idmanagertraiter === user.idutilisateur)
            .length,
        )

        // Autres demandes
        const autres = await api.get("/autreDemande")
        setAutresDemandesPending(
          autres.data.filter(
            (a) => a.statutautredemande === "En attente" && a.idmanagertraiterautredemande === user.idutilisateur,
          ).length,
        )

        // Performance
        const perf = await api.get("/activiter/performance")
        setPerformanceData(
          perf.data.map((p) => ({
            label: `S${p.semaine}-${p.mois}`,
            value: Number.parseFloat(p.productiviter.toFixed(2)),
          })),
        )

        // Activités
        const activiter = await api.get("/activiter")
        setActiviterData(activiter.data)

        // Liste des agents supervisés
        const agents = await api.get("/user")
        setAgentList(agents.data.filter((u) => u.roleutilisateur === "Agent"))
      } catch (err) {
        console.error(err)
        setError("Erreur lors du chargement des données")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user.idutilisateur])

  // Données graphiques
  const performanceChart = {
    labels: performanceData.map((p) => p.label),
    datasets: [
      {
        label: "Productivité",
        data: performanceData.map((p) => p.value),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  const activiterChart = {
    labels: activiterData.map((a) => `Agent ${a.idagent}`),
    datasets: [
      {
        label: "Nombre d'appels",
        data: activiterData.map((a) => a.nbappelle),
        backgroundColor: "rgba(16, 185, 129, 0.6)",
      },
      {
        label: "Pauses (min)",
        data: activiterData.map((a) => a.pauses),
        backgroundColor: "rgba(251, 191, 36, 0.6)",
      },
      {
        label: "Durée appels (min)",
        data: activiterData.map((a) => a.dureeappelle),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-200">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950 relative overflow-hidden p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">Vue d'ensemble des activités et performances de vos agents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Formations créées"
            value={formationCreer}
            subtitle="Publié"
            icon={<BookOpen />}
            gradient="from-blue-500 to-indigo-600"
          />
          <DashboardCard
            title="Congés en attente"
            value={congesPending}
            subtitle="À traiter"
            icon={<CalendarDays />}
            gradient="from-amber-500 to-orange-600"
          />
          <DashboardCard
            title="Autres demandes"
            value={autresDemandesPending}
            subtitle="En attente de validation"
            icon={<ClipboardList />}
            gradient="from-emerald-500 to-teal-600"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Productivité par semaine</h3>
            </div>
            <div className="h-64">
              <Bar data={performanceChart} options={{ ...options, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-3 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Activités des agents</h3>
            </div>
            <div className="h-64">
              <Bar data={activiterChart} options={{ ...options, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Agents supervisés</h3>
            <span className="ml-auto bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {agentList.length} agents
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentList.map((agent) => (
              <div
                key={agent.idutilisateur}
                className="group p-4 bg-gradient-to-r from-white/50 to-gray-50/50 backdrop-blur-sm rounded-xl border border-white/30 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {agent.nomutilisateur.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">
                      {agent.nomutilisateur}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{agent.roleutilisateur}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Manager
DashboardCard
function DashboardCard({ title, value, icon, gradient }) {
  return (
    <div className="group bg-white/80 dark:bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <div className={`mt-4 h-1 bg-gradient-to-r ${gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </div>
  )
}
