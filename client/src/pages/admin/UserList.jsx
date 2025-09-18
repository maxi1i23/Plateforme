import api from '../../services/api';
import {  useEffect, useState } from 'react';
import Swal from 'sweetalert2'

export default function UserList(){
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  async function load(){ 
    const res = await api.get('/user'); // backend: GET /api/user
    console.log(res.data);
    setUsers(res.data);
  }

  useEffect(()=>{
    load();
  },[]);

  const handleDelete = async (id)=>{
    try {
        await api.delete('/user/delete/' + id)
        Swal.fire({
            icon: 'success',
            title: 'OK'
        })
        load();
        
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <>
    
    <div className='relative overflow-x-auto'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Nom utilisateurs
                </th>
                <th scope="col" className="px-6 py-3">
                    Email utilisateurs
                </th>
                <th scope="col" className="px-6 py-3">
                    Role de l'utilisateurs
                </th>
                <th scope="col" className="px-6 py-3">
                    Date d'inscription
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            {
                users.map(user =>(
                    <tr key={user.idutilisateur} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200'>
                        <td className='px-6 py-4'>{user.nomutilisateur}</td>
                        <td className='px-6 py-4'>{user.emailutilisateur}</td>
                        <td className='px-6 py-4'>{user.roleutilisateur}</td>
                        <td className='px-6 py-4'>{new Date(user.dateinscription).toLocaleDateString()}</td>
                        <td className='px-6 py-4'>
                            <button
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                            onClick={()=>{
                                setShowModal(!showModal)
                                setSelectedUser(user)
                            }}
                                >Modifier
                                </button>
                            <button 
                            className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                            onClick={()=>{handleDelete(user.idutilisateur)}}>Supprimer</button>
                        </td>
                    </tr>
                ))
            }
        </tbody>
        </table>
                {
                    showModal && <UpdateModal user={selectedUser} onClose={setShowModal} getAllUser={load}/>
                }
    </div>

    </>
  )
}


function UpdateModal({user, onClose, getAllUser}){
    const [nomUtilisateur, setNomUtilisateur] = useState(user.nomutilisateur || '')
    const [roleUtilisateur, setRoleUtilisateur] = useState(user.roleutilisateur || '')
    const [emailUtilisateur, setEmailutilisateur] = useState(user.emailutilisateur || '')

    const handleUpdate = async (e)=> {
        e.preventDefault()
        console.log(user)
        getAllUser()
    }

    return(
        <>
        <div className='mt-5'>
            <div>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white text-center'>Modifier un utilisateur</h2>
            </div>
            <div>
                <form action="">
                    <div>
                        <label htmlFor="nomUtilisateur" className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                            Nom de l'utilisateur :</label>
                        <input type="text" name="nomUtilisateur" id="nomUtilisateur" 
                        value={nomUtilisateur}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white' />
                    </div>
                    <div>
                        <label htmlFor="emailUtilisateur" className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Adresse email :</label>
                        <input type="email" name="emailUtilisateur" id="emailUtilisateur" 
                        value={emailUtilisateur} 
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'/>
                    </div>
                    <div>
                        <label htmlFor="roleUtilisateur" className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Rôle :</label>
                        <select name="roleUtilisateur" id="roleUtilisateur" value={roleUtilisateur}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Agent">Agent</option>
                        </select>
                    </div>
                    <div className='mt-2 flex items-center justify-between'>
                        <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                        onClick={handleUpdate}
                        >Valider</button>
                        <button className='text-white bg-gray-500 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
                        onClick={onClose}
                        >Annuler</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}