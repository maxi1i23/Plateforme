import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [congesPending, setCongesPending] = useState(0);
  const [autresDemandesPending, setAutresDemandesPending] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get('/user');
        setUsersCount(users.data.length);

        const conges = await api.get('/demandeConger');
        setCongesPending(conges.data.filter(c => c.statutconger === 'en attente').length);

        const autres = await api.get('/autreDemande');
        setAutresDemandesPending(autres.data.filter(a => a.statutautredemande === 'En attente').length);

        const perf = await api.get('/activiter/performance'); 
        setPerformanceData(perf.data.map(p => ({
          label: `S${p.semaine}-${p.mois}`,
          value: parseFloat(p.productiviter.toFixed(2))
        })));

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: performanceData.map(p => p.label),
    datasets: [
      {
        label: 'Productivité',
        data: performanceData.map(p => p.value),
        backgroundColor: 'rgba(75,192,192,0.6)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Productivité par semaine' }
    },
    scales: {
      y: { beginAtZero: true, max: 1 } // Productivité entre 0 et 1
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded shadow">
          <h2 className="text-lg font-semibold">Utilisateurs</h2>
          <p className="text-3xl">{usersCount}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow">
          <h2 className="text-lg font-semibold">Congés en attente</h2>
          <p className="text-3xl">{congesPending}</p>
        </div>
        <div className="p-4 bg-red-100 rounded shadow">
          <h2 className="text-lg font-semibold">Autres demandes en attente</h2>
          <p className="text-3xl">{autresDemandesPending}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div style={{ width: '100%', maxWidth: '700px', height: '300px', margin: '0 auto' }}>
            <Bar data={data} options={options} />
        </div>
</div>
    </div>
  );
};

export default Dashboard;
