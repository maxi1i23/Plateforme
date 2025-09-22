"use client"

import { useEffect, useState } from "react"
import api from "../../services/api"
import Swal from "sweetalert2"
import { Mail, User, Eye, EyeOff, Edit, Trash, PlusCircle, Search, Users, Shield, Clock, X } from "lucide-react"

export default function UserList() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.nomutilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.emailutilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.roleutilisateur.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  // Charger les utilisateurs
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

  useEffect(() => {
    loadUsers()
  }, [])

  // Supprimer utilisateur
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Supprimer cet utilisateur ?",
        text: "Cette action est irréversible !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Oui, supprimer !",
        cancelButtonText: "Annuler",
      })

      if (result.isConfirmed) {
        await api.delete(`/user/delete/${id}`)
        setUsers((prev) => prev.filter((user) => user.idutilisateur !== id))
        Swal.fire({
          icon: "success",
          title: "Utilisateur supprimé",
          showConfirmButton: false,
          timer: 1500,
        })
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de supprimer",
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-600"
      case "Manager":
        return "bg-blue-100 text-blue-600"
      case "Agent":
        return "bg-green-100 text-green-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Gestion des Utilisateurs
            </h2>
            <p className="text-gray-600">Gérez les comptes utilisateurs et leurs permissions</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-80"
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <PlusCircle size={20} /> Ajouter un utilisateur
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Administrateurs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.roleutilisateur === "Admin").length}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Managers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.roleutilisateur === "Manager").length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Agents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.roleutilisateur === "Agent").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.idutilisateur}
                      className="hover:bg-blue-50/50 transition-colors duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full mr-3">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{user.nomutilisateur}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{user.emailutilisateur}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.roleutilisateur)}`}
                        >
                          {user.roleutilisateur}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {new Date(user.dateinscription).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUpdateModal(true)
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.idutilisateur)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? "Aucun utilisateur trouvé" : "Aucun utilisateur disponible"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? "Essayez avec d'autres mots-clés" : "Commencez par ajouter votre premier utilisateur"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    Ajouter un utilisateur
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modales */}
      {showAddModal && (
        <UserModal
          onClose={() => {
            setShowAddModal(false)
            loadUsers()
          }}
        />
      )}
      {showUpdateModal && selectedUser && (
        <UserModal
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

function UserModal({ user, onClose }) {
  const isEdit = !!user
  const [editPassword, setEditPassword] = useState(false)
  const [nomUtilisateur, setNom] = useState(user?.nomutilisateur || "")
  const [emailUtilisateur, setEmail] = useState(user?.emailutilisateur || "")
  const [roleUtilisateur, setRole] = useState(user?.roleutilisateur || "")
  const [motDePasseUtilisateur, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  // Validation du formulaire
  const validate = () => {
    const newErrors = {}
    if (!nomUtilisateur.trim()) newErrors.nom = "Nom requis"
    if (!emailUtilisateur.trim()) newErrors.email = "Email requis"
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailUtilisateur)) newErrors.email = "Email invalide"
    if (!roleUtilisateur) newErrors.role = "Rôle requis"

    // Mot de passe obligatoire si ajout ou modification choisie
    if (!isEdit || editPassword) {
      if (!motDePasseUtilisateur) newErrors.password = "Mot de passe requis"
      else if (motDePasseUtilisateur.length < 6) newErrors.password = "Mot de passe >= 6 caractères"
      if (motDePasseUtilisateur !== confirmPassword) newErrors.confirmPassword = "Mots de passe différents"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(localStorage.getItem("token"))
    if (!validate()) return

    const payload = { nomUtilisateur, emailUtilisateur, roleUtilisateur }
    if (!isEdit || editPassword) payload.motDePasseUtilisateur = motDePasseUtilisateur

    try {
      if (isEdit) {
        await api.put(`/user/update/${user.idutilisateur}`, payload)
        Swal.fire({
          icon: "success",
          title: "Utilisateur modifié",
          showConfirmButton: false,
          timer: 1500,
        })
      } else {
        await api.post("/auth/register", payload)
        Swal.fire({
          icon: "success",
          title: "Utilisateur inscrit",
          showConfirmButton: false,
          timer: 1500,
        })
      }
      onClose()
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: err.response?.data?.message || "Erreur serveur",
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
        <div
          className={`${isEdit ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-green-600 to-blue-600"} p-6 rounded-t-2xl`}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
            onClick={onClose}
          >
            <X size={20} className="text-white" />
          </button>
          <h3 className="text-2xl font-bold text-white">
            {isEdit ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </h3>
          <p className={`${isEdit ? "text-blue-100" : "text-green-100"} mt-1`}>
            {isEdit ? "Mettez à jour les informations de l'utilisateur" : "Créez un nouveau compte utilisateur"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Nom complet"
                value={nomUtilisateur}
                onChange={(e) => setNom(e.target.value)}
                className={`pl-10 pr-4 py-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.nom ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={emailUtilisateur}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 pr-4 py-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
            <select
              value={roleUtilisateur}
              onChange={(e) => setRole(e.target.value)}
              className={`px-4 py-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.role ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="">Sélectionner le rôle</option>
              <option value="Admin">Administrateur</option>
              <option value="Manager">Manager</option>
              <option value="Agent">Agent</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          {/* Modifier le mot de passe pour édition */}
          {isEdit && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="editPassword"
                checked={editPassword}
                onChange={() => setEditPassword(!editPassword)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="editPassword" className="ml-2 text-sm text-gray-700">
                Modifier le mot de passe
              </label>
            </div>
          )}

          {/* Mot de passe et confirmation */}
          {(!isEdit || editPassword) && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={motDePasseUtilisateur}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`px-4 pr-10 py-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {showPassword ? (
                    <EyeOff
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirmer mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`px-4 pr-10 py-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {showPassword ? (
                    <EyeOff
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`flex-1 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg font-medium ${
                isEdit
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              }`}
            >
              {isEdit ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
