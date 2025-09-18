import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import Swal from 'sweetalert2'

const FormationList = () => {
    const [formationList, setFormationList] = useState([])

    const getFormation = async ()=>{
        const response = await api.get('/formation')
        setFormationList(response.data)
        console.log(response.data)
    }

    useEffect(()=>{
        getFormation()
    }, [])

    const handleDelete = (id)=>{
        Swal.fire({
            icon: 'warning',
            title: 'Attention !',
            text: 'Etes-vous sûr de vouloir supprimer ?',
            confirmButtonText: 'Supprimer',
            showCancelButton: true,
            cancelButtonText: 'Annuler'
        })
        .then(async (result)=>{
            if(result.isConfirmed){
                await api.delete('/formation/delete/' + id)
                Swal.fire({
                    title: 'Succés',
                    icon: 'success',
                    text: 'Element supprimer avec succés !'
                })
                getFormation()
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
        <h2>Liste des formations</h2>
      </div>
      <div>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Titre</th>
                    <th scope="col" className="px-6 py-3">Description</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Manager</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {formationList.length > 0 ? 
                    formationList.map(formation=>(
                        <tr  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200' key={formation.idformation}>
                            <td className='px-6 py-4'>{formation.nomformation}</td>
                            <td className='px-6 py-4'>{formation.descriptionformation}</td>
                            <td className='px-6 py-4'>{formation.dateformation}</td>
                            <td className='px-6 py-4'>{formation.idutilisateurmanager}</td>
                            <td className='px-6 py-4'>
                                <button className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                                onClick={()=>{handleDelete(formation.idformation)}}
                                >Supprimer</button>
                            </td>
                        </tr>
                    )) : 
                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200'>
                        <td colSpan={5} className='px-6 py-4 text-center'>Aucun formation trouvé</td>
                    </tr>
                }
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default FormationList
