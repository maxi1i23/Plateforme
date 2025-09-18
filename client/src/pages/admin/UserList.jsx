import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { Mail, User, Eye, EyeOff, Edit, Trash, PlusCircle } from "lucide-react";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Charger les utilisateurs
    const loadUsers = async () => {
        try {
            const res = await api.get('/user');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de charger les utilisateurs' });
        }
    };

    useEffect(() => { loadUsers(); }, []);

    // Supprimer utilisateur
    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Supprimer cet utilisateur ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Oui, supprimer',
                cancelButtonText: 'Annuler'
            });

            if (result.isConfirmed) {
                await api.delete(`/user/delete/${id}`);
                Swal.fire({ icon: 'success', title: 'Utilisateur supprimé' });
                loadUsers();
            }
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de supprimer' });
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    <PlusCircle className='cursor-pointer' />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Nom</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Rôle</th>
                            <th className="px-6 py-3">Date d'inscription</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.idutilisateur} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                <td className="px-6 py-3">{user.nomutilisateur}</td>
                                <td className="px-6 py-3">{user.emailutilisateur}</td>
                                <td className="px-6 py-3">{user.roleutilisateur}</td>
                                <td className="px-6 py-3">{new Date(user.dateinscription).toLocaleDateString()}</td>
                                <td className="px-6 py-3 space-x-2">
                                    <button
                                        onClick={() => { setSelectedUser(user); setShowUpdateModal(true); }}
                                        className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
                                    >
                                        <Edit className='cursor-pointer' />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.idutilisateur)}
                                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    >
                                        <Trash className='cursor-pointer' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modales */}
            {showAddModal && <UserModal onClose={() => { setShowAddModal(false); loadUsers(); }} />}
            {showUpdateModal && selectedUser && (
                <UserModal user={selectedUser} onClose={() => { setShowUpdateModal(false); loadUsers(); }} />
            )}
        </div>
    );
}

// Modal pour création / modification
function UserModal({ user, onClose }) {
    const isEdit = !!user;
    const [editPassword, setEditPassword] = useState(false);
    const [nomUtilisateur, setNom] = useState(user?.nomutilisateur || "");
    const [emailUtilisateur, setEmail] = useState(user?.emailutilisateur || "");
    const [roleUtilisateur, setRole] = useState(user?.roleutilisateur || "");
    const [motDePasseUtilisateur, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Validation du formulaire
    const validate = () => {
        const newErrors = {};
        if (!nomUtilisateur.trim()) newErrors.nom = "Nom requis";
        if (!emailUtilisateur.trim()) newErrors.email = "Email requis";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailUtilisateur)) newErrors.email = "Email invalide";
        if (!roleUtilisateur) newErrors.role = "Rôle requis";

        // Mot de passe obligatoire si ajout ou modification choisie
        if (!isEdit || editPassword) {
            if (!motDePasseUtilisateur) newErrors.password = "Mot de passe requis";
            else if (motDePasseUtilisateur.length < 6) newErrors.password = "Mot de passe >= 6 caractères";
            if (motDePasseUtilisateur !== confirmPassword) newErrors.confirmPassword = "Mots de passe différents";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = { nomUtilisateur, emailUtilisateur, roleUtilisateur };
        if (!isEdit || editPassword) payload.motDePasseUtilisateur = motDePasseUtilisateur;

        try {
            if (isEdit) {
                await api.put(`/user/update/${user.idutilisateur}`, payload);
                Swal.fire({ icon: "success", title: "Utilisateur modifié" });
            } else {
                await api.post("/auth/register", payload);
                Swal.fire({ icon: "success", title: "Utilisateur inscrit" });
            }
            onClose();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: err.response?.data?.message || "Erreur serveur",
            });
        }
    };

    return (
        <div className="fixed inset-0 backdrop-filter backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                    {isEdit ? "Modifier utilisateur" : "Ajouter utilisateur"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Nom */}
                    <div className="relative mb-3">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Nom"
                            value={nomUtilisateur}
                            onChange={(e) => setNom(e.target.value)}
                            className={`pl-10 pr-3 py-2 w-full rounded border ${errors.nom ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                    </div>

                    {/* Email */}
                    <div className="relative mb-3">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={emailUtilisateur}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`pl-10 pr-3 py-2 w-full rounded border ${errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Role */}
                    <div className="mb-3">
                        <select
                            value={roleUtilisateur}
                            onChange={(e) => setRole(e.target.value)}
                            className={`pl-3 pr-3 py-2 w-full rounded border ${errors.role ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">Sélectionner le rôle</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Agent">Agent</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                    </div>

                    {/* Modifier le mot de passe pour édition */}
                    {isEdit && (
                        <div className="flex items-center mb-3">
                            <input
                                type="checkbox"
                                id="editPassword"
                                checked={editPassword}
                                onChange={() => setEditPassword(!editPassword)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="editPassword" className="ms-2 text-sm text-gray-900 dark:text-gray-300">
                                Modifier le mot de passe
                            </label>
                        </div>
                    )}

                    {/* Mot de passe et confirmation */}
                    {(!isEdit || editPassword) && (
                        <>
                            <div className="relative mb-3">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mot de passe"
                                    value={motDePasseUtilisateur}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`pl-3 pr-10 py-2 w-full rounded border ${errors.password ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {showPassword ? (
                                    <EyeOff
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                        onClick={() => setShowPassword(true)}
                                    />
                                )}
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div className="relative mb-4">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirmer mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`pl-3 pr-10 py-2 w-full rounded border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {showPassword ? (
                                    <EyeOff
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                        onClick={() => setShowPassword(true)}
                                    />
                                )}
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </>
                    )}

                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                            {isEdit ? "Modifier" : "Ajouter"}
                        </button>
                        <button
                            type="button"
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}