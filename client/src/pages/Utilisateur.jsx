import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import FeedbackService from '../services/FeedBackService'
import api from '../services/api'
import { Shield, User, Users } from 'lucide-react'
import Card from '../components/Card'
import UserTable from '../components/Table/UserTable'
import UserForm from '../components/form/UserForm'

const Utilisateur = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)

  {/** Quand la valeur de l'utilisateur change ou on fais un recherche */ }
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.nomutilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.emailutilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.roleutilisateur.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  {/** Charger les utilisateurs */ }
  const loadUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get("/user")
      setUsers(res.data)
    } catch (err) {
      console.error(err)
      Swal.fire({ icon: "error", title: "Erreur", text: "Impossible de charger les utilisateurs" })
    } finally {
      setLoading(false)
    }
  }

  {/** Chargement aux rendu du composants */ }
  useEffect(() => {
    loadUsers()
  }, [])

  const card = [
    {
      title: "Total Utilisateurs",
      value: users.length,
      icon: Users,
      style: "w-6 h-6 text-blue-600",
      bg: "bg-purple-500"
    },
    {
      title: "Admin",
      value: users.filter((u) => u.roleutilisateur === "Admin").length,
      icon: Shield,
      style: "w-6 h-6 text-red-600",
      bg: "bg-red-500"
    },
    {
      title: "Manager",
      value: users.filter((u) => u.roleutilisateur === "Manager").length,
      icon: User,
      style: "w-6 h-6 text-blue-600",
      bg: "bg-blue-500"
    },
    {
      title: "Agent",
      value: users.filter((u) => u.roleutilisateur === "Agent").length,
      icon: Users,
      style: "w-6 h-6 text-green-600",
      bg: "bg-green-500"
    }
  ]

  {/** Pour supprimer un utilisateur */ }
  const handleDelete = async (id) => {
    try {
      const result = await FeedbackService.confirm()
      if (result) {
        await api.delete(`/user/delete/${id}`)
        setUsers((prev) => prev.filter((user) => user.idutilisateur !== id))
        FeedbackService.success()
      }
    } catch (err) {
      console.error(err)
      FeedbackService.error()
    }
  }


  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        openAddModal={() => setShowAddModal(true)}
      />
      {
        loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
              {card.map((item) => (
                <Card
                  title={item.title}
                  value={item.value}
                  Icon={item.icon}
                  style={item.style}
                  bg={item.bg}
                  key={item.title}
                />
              ))}
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <UserTable setSelectedUser={setSelectedUser} setShowUpdateModal={setShowUpdateModal} users={filteredUsers} handleDelete={handleDelete} />
            </div>
          </>
        )
      }
      {/** Ajout et modification pour les formulaire */}
      {showAddModal && (
        <UserForm
          onClose={() => {
            setShowAddModal(false)
            loadUsers()
          }}
        />
      )}
      {showUpdateModal && selectedUser && (
        <UserForm
          user={selectedUser}
          onClose={() => {
            setShowUpdateModal(false)
            loadUsers()
          }}
        />
      )}
    </div>
  )
}

export default Utilisateur