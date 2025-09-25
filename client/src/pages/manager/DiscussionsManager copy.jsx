"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import api from "../../services/api"
import { Send, Search, Paperclip, Circle, ArrowLeft, PlusCircle } from "lucide-react"
import io from "socket.io-client"
import Swal from 'sweetalert2'

const socket = io.connect("http://localhost:8000")

const DiscussionsManager = () => {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedChat, setSelectedChat] = useState(null) // utilisateur ou groupe
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const messagesEndRef = useRef(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([user.idutilisateur])

  // Toggle membre pour création de groupe
  const toggleMember = (id) => {
    setSelectedGroupMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  // Créer un groupe
  const handleCreateGroup = async () => {
    try {
      await api.post("/groupe", { nomGroupe: groupName, membres: selectedGroupMembers })
      setShowCreateGroup(false)
      setGroupName("")
      setSelectedGroupMembers([user.idutilisateur])
      fetchGroups()
      Swal.fire({ icon: 'success', title: 'Groupe créé avec succès!' })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur lors de la création du groupe!' })
    }
  }

  // Sélection de fichiers
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files)
    const valid = files.filter(f => f.size <= 10 * 1024 * 1024)
    setSelectedFiles(valid)
  }

  // Récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const res = await api.get("/user")
      setUsers(res.data.filter(u => u.idutilisateur !== user.idutilisateur))
    } catch (err) { console.error(err) }
  }

  // Récupérer les groupes
  const fetchGroups = async () => {
    try {
      const res = await api.get(`/groupe/utilisateur/${user.idutilisateur}`)
      setGroups(res.data)
    } catch (err) { console.error(err) }
  }

  // Récupérer les messages d'un chat (user ou groupe)
  const fetchMessages = async (chat) => {
    if (!chat) return
    try {
      if (chat.idGroupe) {
        const res = await api.get(`/message/group/${chat.idGroupe}`)
        setMessages(res.data)
      } else {
        const res = await api.get(`/message/${chat.idutilisateur}`)
        setMessages(res.data)
      }
    } catch (err) { console.error(err) }
  }

  // Join room socket.io
  useEffect(() => {
    if (!user) return
    socket.emit("joinRoom", user.idutilisateur.toString())
  }, [user])

  // Réception messages en temps réel
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (!selectedChat) return
      // Pour messages utilisateur
      if (selectedChat.idutilisateur && 
          (msg.idutilisateurexpediteur === selectedChat.idutilisateur || msg.idutilisateurrecepteur === selectedChat.idutilisateur)) {
        setMessages(prev => prev.find(m => m.idmessage === msg.idmessage) ? prev : [...prev, msg])
      }
      // Pour messages groupe
      if (selectedChat.idGroupe && msg.idGroupe === selectedChat.idGroupe) {
        setMessages(prev => prev.find(m => m.idmessage === msg.idmessage) ? prev : [...prev, msg])
      }
    }
    socket.on("receiveMessage", handleReceiveMessage)
    return () => socket.off("receiveMessage", handleReceiveMessage)
  }, [selectedChat])

  // Charger messages quand on change de chat
  useEffect(() => { fetchMessages(selectedChat) }, [selectedChat])

  // Envoyer message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() && selectedFiles.length === 0) return
    if (!selectedChat) return

    try {
      const formData = new FormData()
      formData.append("contenuMessage", newMessage || "")
      formData.append("idUtilisateurExpediteur", user.idutilisateur)
      if (selectedChat.idGroupe) formData.append("idGroupe", selectedChat.idGroupe)
      else formData.append("idUtilisateurRecepteur", selectedChat.idutilisateur)
      selectedFiles.forEach(f => formData.append("fichiers", f))

      const res = await api.post("/message/add", formData, { headers: { "Content-Type": "multipart/form-data" } })
      const msg = res.data.data
      socket.emit("sendMessage", msg)
      socket.emit("SendNouveauMessage", msg)
      setNewMessage("")
      setSelectedFiles([])
    } catch (err) { console.error(err) }
  }

  // Scroll automatique
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  // Charger utilisateurs et groupes au montage
  useEffect(() => { fetchUsers(); fetchGroups() }, [])

  const filteredUsers = users.filter(u => u.nomutilisateur.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex h-[85vh] w-full max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      
      {/* Sidebar utilisateurs + groupes */}
      <div className={`${selectedChat ? "hidden md:flex" : "flex"} md:w-1/3 lg:w-80 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
            <button onClick={() => setShowCreateGroup(true)} className="text-blue-600 hover:text-blue-800">
              <PlusCircle size={24} />
            </button>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
        </div>

        {/* Liste des groupes */}
        <div className="px-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Groupes</h3>
          {groups.map(g => (
            <div key={g.idGroupe} onClick={() => setSelectedChat(g)}
              className={`p-2 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-all mb-1`}>
              {g.nomgroupe}
            </div>
          ))}
        </div>

        {/* Liste utilisateurs */}
        <div className="flex-1 overflow-y-auto px-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contacts</h3>
          {filteredUsers.map(u => (
            <div key={u.idutilisateur} onClick={() => setSelectedChat(u)}
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-800 ${selectedChat?.idutilisateur === u.idutilisateur ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500" : ""}`}>
              <div className="flex items-center space-x-3">
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

      {/* Chat */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
              <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {selectedChat.nomutilisateur ? selectedChat.nomutilisateur.charAt(0).toUpperCase() : selectedChat.nomGroupe.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{selectedChat.nomutilisateur || selectedChat.nomGroupe}</h3>
                <p className="text-sm text-green-500">{selectedChat.nomutilisateur ? "En ligne" : "Groupe"}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/30 to-white dark:from-gray-900 dark:to-gray-900">
              {messages.map(msg => {
                const isOwn = msg.idutilisateurexpediteur === user.idutilisateur
                return (
                  <div key={msg.idmessage} className={`flex items-end ${isOwn ? "justify-end" : "justify-start"}`}>
                    {!isOwn && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {selectedChat.nomutilisateur ? selectedChat.nomutilisateur.charAt(0).toUpperCase() : selectedChat.nomGroupe.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={`px-4 py-3 rounded-2xl ${isOwn ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"}`}>
                      <p>{msg.contenumessage}</p>
                      {msg.fichiers && msg.fichiers.map(f => (
                        f.typefichier.startsWith("image/") ?
                          <img key={f.idfichier} src={`http://localhost:8000${f.urlfichier}`} className="w-32 rounded mt-1" /> :
                          <a key={f.idfichier} href={`http://localhost:8000${f.urlfichier}`} target="_blank" className="text-blue-500 underline block mt-1">{f.nomfichier}</a>
                      ))}
                      <span className="text-xs text-gray-500 mt-1 block">{new Date(msg.datemessage).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Zone d'écriture */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3">
              <label htmlFor="fileInput" className="p-3 cursor-pointer"><Paperclip className="w-5 h-5 text-gray-500" /></label>
              <input type="file" multiple id="fileInput" className="hidden" onChange={handleFilesChange} />
              <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Écrire un message..." className="flex-1 px-4 py-2 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-full"><Send className="w-5 h-5" /></button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Sélectionnez un utilisateur ou un groupe pour discuter</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscussionsManager
