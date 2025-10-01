"use client"

// src/pages/Login.jsx
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { jwtDecode } from "jwt-decode"
import vite from "../assets/favicon.png"
import { Mail, Lock, EyeOff, Eye } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [worngConnection, setWorngConnection] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await login(email, password)
      // Exemple: backend retourne user.roleUtilisateur dans res.data.user
      const role = res.data.user?.roleUtilisateur || (res.data.token ? jwtDecode(res.data.token).role : null)
      if (role === "Admin") navigate("/admin")
      else if (role === "Manager") navigate("/manager")
      else navigate("/agent")
    } catch (err) {
      console.error(err?.response?.data || err.message)
      setWorngConnection(true)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 text-center">
          <img src={vite || "/placeholder.svg"} className="h-16 mx-auto mb-6" alt="Logo_Success_MDG" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Plateforme Success MDG</h2>

          {
            worngConnection && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                Identifiant ou mot de passe incorrect.
              </div>
            )
          }

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
                required
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white text-gray-700 placeholder-gray-400"
              />
              {
                showPassword ? <EyeOff className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-300 cursor-pointer" size={18}
                  onClick={() => setShowPassword(!showPassword)} />
                  :
                  <Eye className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-300 cursor-pointer" size={18}
                    onClick={() => setShowPassword(!showPassword)} />
              }
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200 cursor-pointer"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}