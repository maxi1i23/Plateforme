import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const CongerList = () => {
    const [listConger, setListConger] = useState([])

    const getConger = async ()=>{
        const response = await api.get('/demandeConger')
        setListConger(response.data)
        console.log(response.data)
    }

    useEffect(()=>{
        getConger()
    }, [])

    const handleDelete = (id)=>{
        Swal.fire({
            icon: 'warning',
            title: 'Attention !',
            text: 'Etes-vous sûr de vouloir supprimer ?',
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler'
        })
        .then(async (result)=>{
            if(result.isConfirmed){
                await api.delete('/demandeConger/delete/' + id)
                Swal.fire({
                    title: 'Succés',
                    icon: 'success',
                    text: 'Element supprimer avec succés !'
                })
            }
        }).catch((err)=>{
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
        <h2>Liste des conger</h2>
      </div>
      <div>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3">Date de début</th>
                    <th scope="col" className="px-6 py-3">Date fin</th>
                    <th scope="col" className="px-6 py-3">Statut</th>
                    <th scope="col" className="px-6 py-3">Agent</th>
                    <th scope="col" className="px-6 py-3">Manager</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {listConger.length > 0 ? 
                    listConger.map(conger=>(
                        <tr  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200' key={conger.iddemandeconger}>
                            <td className='px-6 py-4'>{conger.typeconger}</td>
                            <td className='px-6 py-4'>{conger.datedebutconger}</td>
                            <td className='px-6 py-4'>{conger.datefinconger}</td>
                            <td className='px-6 py-4'>{conger.statutconger}</td>
                            <td className='px-6 py-4'>{conger.idagentdemander}</td>
                            <td className='px-6 py-4'>{conger.idmanagertraiter}</td>
                            <td className='px-6 py-4'>
                                <button className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                                onClick={()=>{handleDelete(conger.iddemandeconger)}}
                                >Supprimer</button>
                            </td>
                        </tr>
                    )) : 
                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200'>
                        <td colSpan={6} className='px-6 py-4 text-center'>Aucun formation trouvé</td>
                    </tr>
                }
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default CongerList
