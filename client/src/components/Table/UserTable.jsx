import { Clock, Edit, Mail, Trash, User } from 'lucide-react'
import React from 'react'

const UserTable = ({ users, setSelectedUser, setShowUpdateModal, handleDelete}) => {

    {/** Pour personaliser le badge selon le role de l'utilisateur */ }
    const getRoleColor = (role) => {
        switch (role) {
            case "Admin":
                return "bg-red-500 text-white"
            case "Manager":
                return "bg-blue-500 text-white"
            case "Agent":
                return "bg-green-500 text-white"
            default:
                return "bg-gray-500 text-white"
        }
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
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
                    {users?.map((user, index) => (
                        <tr
                            key={user.idutilisateur}
                            className="hover:bg-blue-50/50 transition-colors duration-200"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className={`${getRoleColor(user.roleutilisateur)} p-2 rounded-full mr-3`}>
                                        <User className="w-4 h-4 font-semibold" />
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
                                        {new Date(user.dateinscription).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                    onClick={() => {
                                        setSelectedUser(user)
                                        setShowUpdateModal(true)
                                    }}
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.idutilisateur)}
                                    className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserTable