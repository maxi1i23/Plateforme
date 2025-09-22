"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import api from "../../services/api"
import { Send, Search, MoreVertical, Phone, Video, Smile, Paperclip, Circle } from "lucide-react"

const DiscussionsManager = () => {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Récupérer les utilisateurs
  const getUsers = async () => {
    try {
      const response = await api.get("/user") // endpoint pour récupérer les utilisateurs
      setUsers(response.data.filter((u) => u.idUtilisateur !== user.idutilisateur)) // on exclut soi-même
    } catch (error) {
      console.error("Erreur récupération utilisateurs :", error)
    }
  }

  // Récupérer les messages
  const getMessages = async () => {
    if (!selectedUser) return
    try {
      const response = await api.get(`/message/${selectedUser.idutilisateur}`)
      setMessages(response.data)
    } catch (error) {
      console.error("Erreur récupération messages :", error)
    }
  }

  // Envoyer un message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    try {
      const response = await api.post("/message/add", {
        contenuMessage: newMessage,
        idUtilisateurExpediteur: user.idutilisateur,
        idUtilisateurRecepteur: selectedUser.idutilisateur,
      })
      setMessages((prev) => [...prev, response.data])
      setNewMessage("")
    } catch (error) {
      console.error("Erreur envoi message :", error)
    }
  }

  // Simulation de frappe
  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  // Scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    getMessages()
    const interval = setInterval(getMessages, 3000) // refresh tous les 3s
    return () => clearInterval(interval)
  }, [selectedUser])

  const filteredUsers = users.filter((u) => u.nomutilisateur.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex h-[85vh] max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Sidebar améliorée avec recherche et meilleure mise en page */}
      <div className="w-80 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher des contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((u) => (
            <div
              key={u.idutilisateur}
              onClick={() => setSelectedUser(u)}
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-800 ${
                selectedUser?.idutilisateur === u.idutilisateur
                  ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {u.nomutilisateur.charAt(0).toUpperCase()}
                  </div>
                  <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{u.nomutilisateur}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{u.roleutilisateur}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de discussion améliorée avec meilleure mise en page */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {selectedUser ? (
          <>
            {/* En-tête du chat */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedUser.nomutilisateur.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedUser.nomutilisateur}</h3>
                    <p className="text-sm text-green-500">En ligne</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/30 to-white dark:from-gray-900 dark:to-gray-900">
              {messages.map((msg, index) => {
                const isOwn = msg.idUtilisateur === user.idutilisateur
                const showAvatar = index === 0 || messages[index - 1].idUtilisateur !== msg.idUtilisateur

                return (
                  <div
                    key={msg.idmessage}
                    className={`flex items-end space-x-2 ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    {!isOwn && showAvatar && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {selectedUser.nomutilisateur.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!isOwn && !showAvatar && <div className="w-8" />}

                    <div
                      className={`group relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        isOwn
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{msg.contenumessage}</p>
                      <span
                        className={`block text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {new Date(msg.datemessage).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Indicateur de frappe */}
              {isTyping && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {selectedUser.nomutilisateur.charAt(0).toUpperCase()}
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Champ d'envoi amélioré avec meilleure mise en page et fonctionnalités */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="flex items-end space-x-3">
                

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder={`Écrivez votre message à ${selectedUser.nomutilisateur}...`}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    style={{ minHeight: "44px" }}
                  />
                </div>

                

                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Commencez une conversation</h3>
              <p className="text-gray-500 dark:text-gray-400">Sélectionnez un contact pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscussionsManager
