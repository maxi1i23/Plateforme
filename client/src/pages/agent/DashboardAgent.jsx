"use client"

import { useEffect, useState, useContext } from "react"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,Filler
} from "chart.js"
import { Calendar, Activity, Phone, TrendingUp, Clock, Target } from "lucide-react"
import api from "../../services/api"
import { AuthContext } from "../../context/AuthContext"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const DashboardAgent = () => {
  const { user } = useContext(AuthContext)
  const [weeklyData, setWeeklyData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalCalls: 0,
    avgSuccessRate: 0,
    totalBreaks: 0,
    avgCallDuration: 0,
  })

  // Récupération des données
  const fetchData = async () => {
    try {
      setLoading(true)
      const activitesRes = await api.get("/activiter")
      const performancesRes = await api.get("/activiter/performance")

      const activites = activitesRes.data
      const performances = performancesRes.data

      const totalCalls = activites.reduce((acc, a) => acc + a.nbappelle, 0)
      const avgSuccessRate =
        performances.length > 0
          ? (performances.reduce((acc, p) => acc + p.productiviter, 0) / performances.length) * 100
          : 0
      const totalBreaks = activites.reduce((acc, a) => acc + a.pauses, 0)
      const avgCallDuration =
        activites.length > 0 ? activites.reduce((acc, a) => acc + a.dureeappelle, 0) / activites.length : 0

      setStats({
        totalCalls: Math.round(totalCalls),
        avgSuccessRate: Math.round(avgSuccessRate),
        totalBreaks: Math.round(totalBreaks),
        avgCallDuration: Math.round(avgCallDuration),
      })

      // Hebdomadaire
      const weeks = [1, 2, 3, 4]
      const callsPerWeek = weeks.map((week) =>
        activites
          .filter((a) => Math.ceil(new Date(a.dateactiviter).getDate() / 7) === week)
          .reduce((acc, a) => acc + a.nbappelle, 0),
      )
      setWeeklyData({ labels: weeks.map((w) => `Semaine ${w}`), data: callsPerWeek })

      // Mensuel
      const months = [...new Set(performances.map((p) => p.mois))].sort((a, b) => a - b)
      const callsPerMonth = months.map((m) =>
        activites
          .filter((a) => new Date(a.dateactiviter).getMonth() + 1 === m)
          .reduce((acc, a) => acc + a.nbappelle, 0),
      )
      const successRate = months.map((m) => performances.find((p) => p.mois === m)?.productiviter || 0)
      setMonthlyData({ labels: months.map((m) => `Mois ${m}`), calls: callsPerMonth, success: successRate })
    } catch (err) {
      console.error(err)
      setError("Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const weeklyChart = {
    labels: weeklyData.labels || [],
    datasets: [
      {
        label: "Nombre d'appels",
        data: weeklyData.data || [],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const monthlyChart = {
    labels: monthlyData.labels || [],
    datasets: [
      {
        type: "bar",
        label: "Nombre d'appels",
        data: monthlyData.calls || [],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "#10b981",
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        type: "line",
        label: "Taux de réussite (%)",
        data: monthlyData.success ? monthlyData.success.map((v) => v * 100) : [],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        yAxisID: "y1",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const optionsWeekly = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: "bold" },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.1)" },
        ticks: { font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  }

  const optionsMonthly = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    stacked: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: "bold" },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        position: "left",
        title: { display: true, text: "Appels", font: { size: 12, weight: "bold" } },
        grid: { color: "rgba(0,0,0,0.1)" },
        ticks: { font: { size: 11 } },
      },
      y1: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Taux (%)", font: { size: 12, weight: "bold" } },
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
            <Activity size={40} className="text-indigo-600" />
            Dashboard Agent
          </h1>
          <p className="text-gray-600">Suivi de vos performances et activités</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedCard
            title="Total Appels"
            value={stats.totalCalls}
            subtitle="Appels effectués"
            icon={<Phone size={24} />}
            gradient="from-blue-500 to-indigo-600"
          />
          <EnhancedCard
            title="Taux de Réussite"
            value={`${stats.avgSuccessRate}%`}
            subtitle="Moyenne générale"
            icon={<Target size={24} />}
            gradient="from-emerald-500 to-teal-600"
          />
          <EnhancedCard
            title="Temps de Pause"
            value={`${stats.totalBreaks}min`}
            subtitle="Total des pauses"
            icon={<Clock size={24} />}
            gradient="from-amber-500 to-orange-600"
          />
          <EnhancedCard
            title="Durée Moyenne"
            value={`${stats.avgCallDuration}min`}
            subtitle="Par appel"
            icon={<TrendingUp size={24} />}
            gradient="from-purple-500 to-pink-600"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-3 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                Appels par semaine
              </h3>
            </div>
            <div className="h-64">
              <Line data={weeklyChart} options={optionsWeekly} />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-3 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-600" />
                Statistiques mensuelles
              </h3>
            </div>
            <div className="h-64">
              <Bar data={monthlyChart} options={optionsMonthly} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EnhancedCard({ title, value, subtitle, icon, gradient }) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
      <div
        className={`mt-4 h-1 bg-gradient-to-r ${gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
      ></div>
    </div>
  )
}

export default DashboardAgent
