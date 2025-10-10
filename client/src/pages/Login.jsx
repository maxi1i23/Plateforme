"use client"

// src/pages/Login.jsx
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { jwtDecode } from "jwt-decode"
import vite from "../assets/favicon.png"
import { Mail, Lock, EyeOff, Eye } from "lucide-react"
import 'animate.css';

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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Left Side - Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-12 flex-col justify-between relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-2 z-10">
          <img src={vite || "/placeholder.svg"} className="h-10 w-10" alt="MGX Logo" />
          <span className="text-2xl font-bold text-gray-800">Success MDG</span>
        </div>

        {/* Main Content */}
        <div className="z-10 space-y-6 animate__animated animate__backInDown">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Communiquer, Collaborer
            <br />
            Votre {" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
            équipe digitale 24/7
            </span>
          </h1>
          <p className="text-lg text-gray-600 font-medium">Centraliser toutes vos communications et de collaborer efficacement</p>
        </div>

        {/* Character Illustration */}
        <div className="z-10 flex justify-center">
          <p className="w-full max-w-lg drop-shadow-2xl"> </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={vite || "/placeholder.svg"} className="h-16" alt="Logo" />
          </div>

          {/* Welcome Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Connectez-vous</h2>
          </div>
          

          {/* Error Message */}
          {worngConnection && (
            <div className="p-4 text-center text-sm text-red-800 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 animate-fade-in">
              Identifiant ou mot de passe incorrect.
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative group">
              <Mail
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors duration-200"
                size={20}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                required
                className="pl-12 pr-4 py-3.5 w-full rounded-xl border-2 border-gray-200 focus:outline-none focus:border-gray-900 focus:ring-4 focus:ring-indigo-50 bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors duration-200"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                className="pl-12 pr-12 py-3.5 w-full rounded-xl border-2 border-gray-200 focus:outline-none focus:border-gray-900 focus:ring-4 focus:ring-indigo-50 bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
             Se connecter
            </button>
            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 underline decoration-1 underline-offset-2 transition-colors duration-200"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

}