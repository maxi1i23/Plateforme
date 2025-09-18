"use client"

import { useEffect, useState } from "react"
import api from "../../services/api"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0)
  const [congesPending, setCongesPending] = useState(0)
  const [autresDemandesPending, setAutresDemandesPending] = useState(0)
  const [performanceData, setPerformanceData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/user")
        setUsersCount(users.data.length)

        const conges = await api.get("/demandeConger")
        setCongesPending(conges.data.filter((c) => c.statutconger === "en attente").length)

        const autres = await api.get("/autreDemande")
        setAutresDemandesPending(autres.data.filter((a) => a.statutautredemande === "En attente").length)

        const perf = await api.get("/activiter/performance")
        setPerformanceData(
          perf.data.map((p) => ({
            label: `S${p.semaine}-${p.mois}`,
            value: Number.parseFloat(p.productiviter.toFixed(2)),
          })),
        )
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  const data = {
    labels: performanceData.map((p) => p.label),
    datasets: [
      {
        label: "Productivité",
        data: performanceData.map((p) => p.value),
        backgroundColor: "rgba(107, 114, 128, 0.6)",
        borderColor: "rgba(107, 114, 128, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Productivité par semaine" },
    },
    scales: {
      y: { beginAtZero: true, max: 1 },
    },
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Utilisateurs</h2>
          <p className="text-3xl font-bold text-gray-900">{usersCount}</p>
          <p className="text-sm text-gray-500 mt-1">Total des utilisateurs</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Congés en attente</h2>
          <p className="text-3xl font-bold text-gray-900">{congesPending}</p>
          <p className="text-sm text-gray-500 mt-1">Demandes à traiter</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Autres demandes</h2>
          <p className="text-3xl font-bold text-gray-900">{autresDemandesPending}</p>
          <p className="text-sm text-gray-500 mt-1">En attente de validation</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse de performance</h3>
        <div style={{ width: "100%", maxWidth: "700px", height: "300px", margin: "0 auto" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
