import React, {useState} from 'react'
import FeedbackService from '../../services/FeedBackService'
import { X, User, Mail, EyeOff, Eye } from 'lucide-react'
import api from '../../services/api'

function UserForm({ user, onClose }) {
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
                FeedbackService.success("Utilisateur modifié")
            } else {
                await api.post("/auth/register", payload)
                FeedbackService.success('Utilisateur inscrit')
            }
            onClose()
        } catch (err) {
            console.error(err)
            FeedbackService.error(err.response?.data?.message || "Erreur serveur")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
                <div
                    className={`bg-gradient-to-r from-blue-600 to-purple-600  p-6 rounded-t-2xl`}
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
                                className={`pl-10 pr-4 py-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.nom ? "border-red-500" : "border-gray-200"
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
                                className={`pl-10 pr-4 py-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.email ? "border-red-500" : "border-gray-200"
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
                            className={`px-4 py-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.role ? "border-red-500" : "border-gray-200"
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
                                        className={`px-4 pr-10 py-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.password ? "border-red-500" : "border-gray-200"
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
                                        className={`px-4 pr-10 py-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.confirmPassword ? "border-red-500" : "border-gray-200"
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
                            className={`flex-1 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700`}
                        >
                            {isEdit ? "Modifier" : "Créer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserForm