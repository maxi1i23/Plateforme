"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import api from "../../services/api"
import { Send, Search, Paperclip, Circle, ArrowLeft, PlusCircle, LogOut } from "lucide-react"
import io from "socket.io-client"
import Swal from 'sweetalert2'

// Connexion au serveur Socket.IO
const socket = io.connect("http://localhost:8000")

const DiscussionsManager = () => {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedGroupe, setSelectedGroupe] = useState(null)
  const [goupeDiscussion, setGoupeDiscussion] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const messagesEndRef = useRef(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([user?.idutilisateur])

  // Toggle membres pour création de groupe
  const toggleMember = (id) => {
    setSelectedGroupMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  // Création groupe
  const handleCreateGroup = async () => {
    try {
      await api.post("/groupe", { nomGroupe: groupName, membres: selectedGroupMembers })
      setShowCreateGroup(false)
      setGroupName("")
      setSelectedGroupMembers([user.idutilisateur])
      Swal.fire({ icon: 'success', title: 'Groupe créé avec succès!' })
      getGroupe()
    } catch (err) {
      console.error(err)
      Swal.fire({ icon: 'error', title: 'Erreur lors de la création du groupe' })
    }
  }

  // Quitter un groupe 
  const handleQuitte = async () => {
    console.log(selectedGroupe)
    try {
      await api.delete("/groupe/quitter/" + selectedGroupe.idgroupe)
      Swal.fire({
        title: "Succés",
        icon: "success",
        text: "Vous avez quitter le groupe !",
        timer: 1500
      })
      getGroupe();

    } catch (error) {
      console.log(error.message)
      Swal.fire({
        title: "Erreur",
        icon: "error",
        text: "Veuillez réessayer! une erreur est survenue",
        timer: 1500
      })
    }
  }

  // Gestion fichiers
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files)
    const valid = files.filter(f => f.size <= 10 * 1024 * 1024)
    setSelectedFiles(valid)
  }

  // Fetch utilisateurs
  const getUsers = async () => {
    try {
      const res = await api.get("/user")
      setUsers(res.data.filter(u => u.idutilisateur !== user.idutilisateur))
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch groupes
  const getGroupe = async () => {
    try {
      const res = await api.get("/groupe/utilisateur/" + user.idutilisateur)
      setGoupeDiscussion(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch messages utilisateur
  const getMessages = async (otherUserId) => {
    if (!otherUserId) return
    try {
      const res = await api.get(`/message/${otherUserId}`)
      setMessages(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch messages groupe
  const getMessagesGroupe = async (idGroupe) => {
    if (!idGroupe) return
    try {
      const res = await api.get(`/message/groupe/${idGroupe}`)
      setMessages(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Rejoindre room Socket.IO
  useEffect(() => {
    if (!user) return
    socket.emit("joinRoom", user.idutilisateur.toString())
  }, [user])

  // Écoute messages entrants
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      console.log(selectedGroupe)
      console.log(msg)
      if (
        (selectedUser && (msg.idutilisateurexpediteur === selectedUser.idutilisateur
          || msg.idutilisateurrecepteur === selectedUser.idutilisateur))
      ) { setMessages(prev => prev.find(m => m.idmessage === msg.idmessage) ? prev : [...prev, msg]) }

      if ((selectedGroupe && msg.idgroupe === selectedGroupe.idgroupe)) {
        setMessages(prev =>
          prev.find(m => Number(m.idmessage) === Number(msg.idmessage)) ? prev : [...prev, msg]
        )
        console.log('ok')
      }
    }
    socket.on("receiveMessage", handleReceiveMessage)
    return () => socket.off("receiveMessage", handleReceiveMessage)
  }, [selectedUser, selectedGroupe])

  // Charger messages quand on change de conversation
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser.idutilisateur)
    if (selectedGroupe) {
      socket.emit("joinGroup", selectedGroupe.idgroupe);
      getMessagesGroupe(selectedGroupe.idgroupe)
    }
  }, [selectedUser, selectedGroupe])

  // Charger utilisateurs et groupes
  useEffect(() => {
    getUsers()
    getGroupe()
  }, [])

  const filteredUsers = users.filter(u => u.nomutilisateur.toLowerCase().includes(searchTerm.toLowerCase()))

  // Envoi message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() && selectedFiles.length === 0) return

    try {
      const formData = new FormData()
      formData.append("contenuMessage", newMessage || "")
      formData.append("idUtilisateurExpediteur", user.idutilisateur)
      if (selectedUser) formData.append("idUtilisateurRecepteur", selectedUser.idutilisateur)
      if (selectedGroupe) formData.append("idGroupe", selectedGroupe.idgroupe)
      selectedFiles.forEach(file => formData.append("fichiers", file))

      const res = await api.post("/message/add", formData, { headers: { "Content-Type": "multipart/form-data" } })
      const msg = res.data.data
      socket.emit("sendMessage", msg)

      setNewMessage("")
      setSelectedFiles([])
    } catch (err) {
      console.error(err)
    }
  }

  const handleInputChange = (e) => setNewMessage(e.target.value)

  return (
    <div className="flex h-[85vh] w-full max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Sidebar utilisateurs */}
      {/* Sidebar utilisateurs et groupes */}
      <div
        className={`${selectedUser || selectedGroupe ? "hidden md:flex" : "flex"
          } md:w-1/3 lg:w-80 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              <PlusCircle size={24} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Liste scrollable (Groupes + Utilisateurs) */}
        <div className="flex-1 overflow-y-auto">
          {/* Groupes */}
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4 mt-4 mb-2">
            Groupes
          </h3>
          {goupeDiscussion.map((g) => (
            <div
              key={g.idgroupe}
              onClick={() => {
                setSelectedGroupe(g);
                setSelectedUser(null);
              }}
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-800 ${selectedGroupe?.idgroupe === g.idgroupe
                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                : ""
                }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {g.nomgroupe.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {g.nomgroupe}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    Groupe de discussion
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Utilisateurs */}
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4 mt-4 mb-2">
            Utilisateurs
          </h3>
          {filteredUsers.map((u) => (
            <div
              key={u.idutilisateur}
              onClick={() => {
                setSelectedUser(u);
                setSelectedGroupe(null);
              }}
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-800 ${selectedUser?.idutilisateur === u.idutilisateur
                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                : ""
                }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {u.nomutilisateur.charAt(0).toUpperCase()}
                  </div>
                  <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {u.nomutilisateur}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {u.roleutilisateur}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {(selectedUser || selectedGroupe) ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 flex items-center space-x-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedGroupe(null);
                }}
                className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {(selectedUser ? selectedUser.nomutilisateur : selectedGroupe.nomgroupe)
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedUser ? selectedUser.nomutilisateur : selectedGroupe.nomgroupe}
                </h3>
                <p className="text-sm text-green-500">
                  {selectedUser ? "En ligne" : "Groupe"}
                </p>
              </div>

              {/* Bouton quitter */}
              {!selectedUser && (
                <button
                  onClick={handleQuitte}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Quitter</span>
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/30 to-white dark:from-gray-900 dark:to-gray-900">
              {messages.map((msg) => {
                const isOwn = msg.idutilisateurexpediteur === user.idutilisateur;

                return (
                  <div
                    key={msg.idmessage}
                    className={`flex flex-col ${isOwn ? "items-end" : "items-start"} mb-3`}
                  >
                    {/* Nom de l’expéditeur si groupe et pas son propre message */}
                    {selectedGroupe && !isOwn && (
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 ml-2">
                        {msg.nomutilisateur}
                      </p>
                    )}

                    <div className="flex items-end gap-2">
                      {/* Avatar seulement si ce n’est pas toi */}
                      {!isOwn && (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {msg.nomutilisateur
                            ? msg.nomutilisateur.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}

                      {/* Bulle de message */}
                      <div
                        className={`group relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${isOwn
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md"
                          }`}
                      >
                        <p className="text-sm leading-relaxed break-words">
                          {msg.contenumessage}
                        </p>

                        {/* Fichiers attachés */}
                        {msg.fichiers && msg.fichiers.length > 0 && (
                          <div className="mt-2 flex flex-col gap-2">
                            {msg.fichiers.map((f) => (
                              <div key={f.idfichier}>
                                {f.typefichier.startsWith("image/") ? (
                                  <img
                                    src={`http://localhost:8000${f.urlfichier}`}
                                    alt={f.nomfichier}
                                    className="w-32 h-auto rounded"
                                  />
                                ) : (
                                  <a
                                    href={`http://localhost:8000${f.urlfichier}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                  >
                                    {f.nomfichier}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Heure */}
                        <span
                          className={`block text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                          {new Date(msg.datemessage).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Zone d'écriture */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center space-x-3">
                <div>
                  <label htmlFor="fileInput" className="p-3 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer">
                    <Paperclip className="w-5 h-5" />
                  </label>
                  <input type="file" multiple id="fileInput" className="hidden" onChange={handleFilesChange} />
                </div>
                <div className="flex-1">
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {selectedFiles.map((f, i) => (
                        <div key={i} className="text-xs bg-gray-100 p-2 rounded truncate max-w-[120px]">
                          {f.name} • {(f.size / 1024) | 0}KB
                        </div>
                      ))}
                    </div>
                  )}
                  <input type="text" value={newMessage} onChange={handleInputChange} placeholder={`Écrivez votre message...`} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <button type="submit" disabled={!newMessage.trim() && selectedFiles.length === 0} className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Commencez une conversation</h3>
              <p className="text-gray-500 dark:text-gray-400">Sélectionnez un contact ou un groupe pour discuter</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal création groupe */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-96 shadow-xl">
            <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-5 text-center">
              Créer un groupe
            </h3>

            {/* Input nom du groupe */}
            <input
              type="text"
              placeholder="Nom du groupe"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              className="w-full mb-4 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required
            />

            {/* Liste des membres */}
            <div className="max-h-48 overflow-y-auto mb-4">
              {users.map(u => (
                <label
                  key={u.idutilisateur}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedGroupMembers.includes(u.idutilisateur)}
                    onChange={() => toggleMember(u.idutilisateur)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-gray-900 dark:text-white text-sm font-medium">
                    {u.nomutilisateur}
                  </span>
                </label>
              ))}
            </div>

            {/* Bouton créer */}
            <button
              onClick={handleCreateGroup}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Créer le groupe
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscussionsManager
