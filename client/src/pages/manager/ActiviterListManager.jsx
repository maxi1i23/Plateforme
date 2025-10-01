import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ActiviterListManager = () => {
  const [activiterList, setActiviterList] = useState([]);
  const [performanceList, setPerformanceList] = useState([]);

  // Charger les activités
  const getActiviter = async () => {
    try {
      const res = await api.get("/activiter"); // endpoint backend
      setActiviterList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Charger les performances
  const getPerformance = async () => {
    try {
      const res = await api.get("/activiter/performance"); // endpoint backend
      setPerformanceList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getActiviter();
    getPerformance();
  }, []);

  // Préparer données pour Chart.js
  const chartData = {
    labels: performanceList.map((p) => `Agent : ${p.idagent}`),
    datasets: [
      {
        label: "Productivité mensuelle",
        data: performanceList.map((p) => p.productiviter),
        backgroundColor: "#19a5ab",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Productivité des agents", font: { size: 18 } },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Tableau de bord des activités
      </h2>

      {/* Liste des activités */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Activités récentes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activiterList.map((act) => (
            <div
              key={act.idactiviter}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow"
            >
              <p className="font-medium text-gray-900 dark:text-white">Agent {act.iaAgent}</p>
              <p className="text-gray-600 dark:text-gray-400">Appels : {act.nbappelle}</p>
              <p className="text-gray-600 dark:text-gray-400">Pauses : {act.pauses}</p>
              <p className="text-gray-600 dark:text-gray-400">
                Durée appels : {act.dureeappelle} min
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {new Date(act.dateactiviter).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique performance */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Productivité par agent
        </h3>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ActiviterListManager;