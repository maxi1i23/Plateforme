import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import Swal from 'sweetalert2'

const ActiviterList = () => {
  const [activiterList, setActiviterList] = useState([])
  const [performanceList, setPerformanceList] = useState([])

  // Charger les activités
  const getActiviter = async () => {
    try {
      const response = await api.get('/activiter')
      setActiviterList(response.data)
      console.log("Activités:", response.data)
    } catch (error) {
      console.error(error)
    }
  }

  // Charger les performances
  const getPerformance = async () => {
    try {
      const response = await api.get('/activiter/performance')
      setPerformanceList(response.data)
      console.log("Performances:", response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getActiviter()
    getPerformance()
  }, [])

  const handleDelete = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Attention !',
      text: 'Etes-vous sûr de vouloir supprimer ?',
      confirmButtonText: 'Supprimer',
      showCancelButton: true,
      cancelButtonText: 'Annuler'
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await api.delete('/activiter/delete/' + id)
          Swal.fire({
            title: 'Succès',
            icon: 'success',
            text: 'Activité supprimée avec succès !'
          })
          getActiviter()
          getPerformance() // ⚡ recharge aussi les performances
        }
      }).catch((err) => {
        Swal.fire({
          title: 'Erreur',
          icon: 'error',
          text: 'Une erreur est survenue, veuillez réessayer !'
        })
        console.log(err)
      })
  }

  return (
    <div className='relative overflow-x-auto'>
      <div>
        <h2 className='text-lg font-bold mb-2'>Liste des activités</h2>
      </div>
      <div className='mb-6'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Nombre d'appels</th>
              <th className="px-6 py-3">Pause (min)</th>
              <th className="px-6 py-3">Durée des appels</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Agent</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {activiterList.length > 0 ?
              activiterList.map(activiter => (
                <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200' key={activiter.idactiviter}>
                  <td className='px-6 py-4'>{activiter.nbappelle}</td>
                  <td className='px-6 py-4'>{activiter.pauses}</td>
                  <td className='px-6 py-4'>{activiter.dureeappelle}</td>
                  <td className='px-6 py-4'>{new Date(activiter.dateactiviter).toLocaleDateString()}</td>
                  <td className='px-6 py-4'>{activiter.idagent}</td>
                  <td className='px-6 py-4'>
                    <button
                      className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                      onClick={() => { handleDelete(activiter.idactiviter) }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              )) :
              <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200'>
                <td colSpan={6} className='px-6 py-4 text-center'>Aucune activité trouvée</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div>
        <h2 className='text-lg font-bold mb-2'>Performances</h2>
      </div>
      <div>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Semaine</th>
              <th className="px-6 py-3">Mois</th>
              <th className="px-6 py-3">Productivité</th>
              <th className="px-6 py-3">Agent</th>
            </tr>
          </thead>
          <tbody>
            {performanceList.length > 0 ?
              performanceList.map(perf => (
                <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200' key={perf.idperformance}>
                  <td className='px-6 py-4'>{perf.semaine}</td>
                  <td className='px-6 py-4'>{perf.mois}</td>
                  <td className='px-6 py-4'>{perf.productiviter.toFixed(2)}</td>
                  <td className='px-6 py-4'>{perf.idagent}</td>
                </tr>
              )) :
              <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200'>
                <td colSpan={4} className='px-6 py-4 text-center'>Aucune performance trouvée</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ActiviterList
