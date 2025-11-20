"use client"

import { useEffect, useState } from "react"
import api from "../../services/api"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import { BarChart3, Users, Calendar, FileText } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Admin() {
  const [usersCount, setUsersCount] = useState(0)
  const [congesPending, setCongesPending] = useState(0)
  const [autresDemandesPending, setAutresDemandesPending] = useState(0)
  const [performanceData, setPerformanceData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/user")
        setUsersCount(users.data.length)

        const conges = await api.get("/demandeConger")
        setCongesPending(conges.data.filter((c) => c.statutconger === "en attente").length)

        const autres = await api.get("/autreDemande")
        setAutresDemandesPending(
          autres.data.filter((a) => a.statutautredemande?.toLowerCase() === "en attente").length
        )

        const perf = await api.get("/activiter/performance")
        setPerformanceData(
          perf.data.map((p) => ({
            label: `S${p.semaine}-${p.mois}`,
            value: Number.parseFloat(p.productiviter.toFixed(2)),
          }))
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = [
    { title: "Utilisateurs", value: usersCount, icon: Users, gradient: "from-blue-500 to-indigo-600" },
    { title: "Congés en attente", value: congesPending, icon: Calendar, gradient: "from-amber-500 to-orange-600" },
    { title: "Autres demandes", value: autresDemandesPending, icon: FileText, gradient: "from-emerald-500 to-teal-600" },
    { title: "Formations actives", value: 8, icon: BarChart3, gradient: "from-purple-500 to-pink-600" },
  ]

  const chartData = {
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "rgb(107 114 128)" } },
      title: { display: true, text: "Productivité par semaine", color: "#374151" },
    },
    scales: {
      x: { ticks: { color: "#374151" }, grid: { color: "#e5e7eb" } },
      y: { beginAtZero: true, max: 1, ticks: { color: "#374151" }, grid: { color: "#e5e7eb" } },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950 relative overflow-hidden p-6">
      {/* Blobs décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Vue d'ensemble de votre espace de gestion</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <DashboardCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={<stat.icon size={24} />}
              gradient={stat.gradient}
            />
          ))}
        </div>

        {/* Graphique */}
        <div className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Analyse de performance</h3>
          </div>
          <div className="h-64">
            <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Carte stylisée pour le dashboard
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
