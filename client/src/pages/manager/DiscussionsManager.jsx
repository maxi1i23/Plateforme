"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import api from "../../services/api"
import { Send, Search, Paperclip, Circle } from "lucide-react"
import  io  from "socket.io-client"

// Connexion au serveur Socket.IO
const socket = io.connect("http://localhost:8000")

const DiscussionsManager = () => {
  const { user } = useContext(AuthContext) // Récupère l'utilisateur connecté
  const [users, setUsers] = useState([]) // Liste des utilisateurs
  const [selectedUser, setSelectedUser] = useState(null) // Utilisateur avec qui discuter
  const [messages, setMessages] = useState([]) // Messages de la conversation
  const [newMessage, setNewMessage] = useState("") // Nouveau message à envoyer
  const [searchTerm, setSearchTerm] = useState("") // Recherche dans la liste d'utilisateurs
  const [isTyping, setIsTyping] = useState(false) // Indicateur de saisie
  const [selectedFiles, setSelectedFiles] = useState([]) // Fichiers attachés au message
  const messagesEndRef = useRef(null) // Pour scroll automatique à la fin de la conversation

  // Gestion de la sélection des fichiers
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files)
    // Limite à 10 Mo par fichier
    const valid = files.filter(f => f.size <= 10 * 1024 * 1024)
    setSelectedFiles(valid)
  }

  // Fetch des utilisateurs depuis l'API
  const getUsers = async () => {
    try {
      const res = await api.get("/user")
      // Exclure l'utilisateur connecté de la liste
      setUsers(res.data.filter(u => u.idutilisateur !== user.idutilisateur))
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch des messages avec un utilisateur spécifique
  const getMessages = async (otherUserId) => {
    if (!otherUserId) return
    try {
      const res = await api.get(`/message/${otherUserId}`)
      setMessages(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Rejoindre sa room Socket.IO (room personnelle = userId)
  useEffect(() => {

    if (!user) return ""
    socket.emit("joinRoom", user.idutilisateur.toString())
  }, [user])

  // Écoute des messages entrants en temps réel
  useEffect(() => {
    
    const handleReceiveMessage = (msg) => {
      
       // Maintenant, cette ligne affichera la valeur correcte
      
      if (
        selectedUser && // Vérifiez que selectedUser n'est pas null
        (msg.idutilisateurexpediteur.toString() === selectedUser.idutilisateur.toString() ||
        msg.idutilisateurrecepteur.toString() === selectedUser.idutilisateur.toString())
      ) {
        
        setMessages(prev => {
          // Si un message avec le même id existe déjà, on ne fait rien
          if (prev.find(m => m.idmessage === msg.idmessage)) {
            return prev;
          }
          // Sinon, on ajoute le nouveau message
          return [...prev, msg];
        });
      }
    };
  
    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [selectedUser]);

  // Charger les messages quand on change de conversation
  useEffect(() => {
    if (!selectedUser) return

    // Clear the messages state for the new conversation
    setMessages([]);

    getMessages(selectedUser.idutilisateur)
    /* Plan B ................
    const intervalId = setInterval(() => {
      console.log('Cet effet s\'exécute toutes les secondes !');
      getMessages(selectedUser.idutilisateur)
    }, 1000); 
    */

  }, [selectedUser])

  // Envoi d'un message (texte + fichiers)
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() && selectedFiles.length === 0) return
    if (!selectedUser) return

    try {
      const formData = new FormData()
      formData.append("contenuMessage", newMessage || "")
      formData.append("idUtilisateurExpediteur", user.idutilisateur)
      formData.append("idUtilisateurRecepteur", selectedUser.idutilisateur)
      selectedFiles.forEach(file => formData.append("fichiers", file))

      // Envoi via API REST
      const res = await api.post("/message/add", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      const msg = res.data.data // message normalisé renvoyé par le backend
      socket.emit("sendMessage", msg)
      socket.emit("SendNouveauMessage", msg)

      

      // setMessages(prev => [...prev, msg]) // Ajouter le message localement
      //getMessages(selectedUser.idutilisateur)
      setNewMessage("") // Réinitialiser input
      setSelectedFiles([]) // Réinitialiser fichiers
    } catch (err) {
      console.error(err)
    }
  }

  // Détecter la saisie pour l'animation "en train d'écrire"
  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000) // indicateur disparaît après 1s
  }

  // Scroll automatique à la fin de la conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Charger les utilisateurs au montage du composant
  useEffect(() => { getUsers() }, [])

  // Filtrer les utilisateurs selon le terme de recherche
  const filteredUsers = users.filter(u => u.nomutilisateur.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex h-[85vh] max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Sidebar utilisateurs */}
      <div className="w-80 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher des contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map(u => (
            <div
              key={u.idutilisateur}
              onClick={() => setSelectedUser(u)}
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-800 ${selectedUser?.idutilisateur === u.idutilisateur ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500" : ""}`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {u.nomutilisateur.charAt(0).toUpperCase()}
                  </div>
                  <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" /> {/* indicateur en ligne */}
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

      {/* Chat avec utilisateur sélectionné */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {selectedUser ? (
          <>
            {/* Header chat */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedUser.nomutilisateur.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{selectedUser.nomutilisateur}</h3>
                  <p className="text-sm text-green-500">En ligne</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/30 to-white dark:from-gray-900 dark:to-gray-900">
              {messages.map((msg, index) => {
                const isOwn = msg.idutilisateurexpediteur == user.idutilisateur
                const showAvatar = index === 0 || messages[index - 1].idutilisateurexpediteur !== msg.idutilisateurexpediteur

                return (
                  <div key={msg.idmessage} className={`flex items-end space-x-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                    {!isOwn && showAvatar && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {selectedUser.nomutilisateur.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!isOwn && !showAvatar && <div className="w-8" />}

                    <div className={`group relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${isOwn ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md"}`}>
                      <p className="text-sm leading-relaxed break-words">{msg.contenumessage}</p>

                      {/* Affichage fichiers */}
                      {msg.fichiers && msg.fichiers.length > 0 && (
                        <div className="mt-2 flex flex-col gap-2">
                          {msg.fichiers.map(f => (
                            <div key={f.idfichier}>
                              {f.typefichier.startsWith("image/") ? (
                                <img src={`http://localhost:8000${f.urlfichier}`} alt={f.nomfichier} className="w-32 h-auto rounded" />
                              ) : (
                                <a href={`http://localhost:8000${f.urlfichier}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{f.nomfichier}</a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <span className={`block text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                        {new Date(msg.datemessage).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Indicateur "en train d'écrire" */}
              {isTyping && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {selectedUser.nomutilisateur.charAt(0).toUpperCase()}
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} /> {/* Point pour scroll automatique */}
            </div>

            {/* Zone d'écriture */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center space-x-3">
                {/* Bouton pour attacher fichiers */}
                <div>
                  <label htmlFor="fileInput" className="p-3 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer">
                    <Paperclip className="w-5 h-5" />
                  </label>
                  <input type="file" multiple id="fileInput" className="hidden" onChange={handleFilesChange} />
                </div>

                {/* Input texte + affichage fichiers */}
                <div className="flex-1">
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {selectedFiles.map((f, i) => (
                        <div key={i} className="text-xs bg-gray-100 p-2 rounded">{f.name} • {(f.size/1024|0)}KB</div>
                      ))}
                    </div>
                  )}
                  <input type="text" value={newMessage} onChange={handleInputChange} placeholder={`Écrivez votre message à ${selectedUser.nomutilisateur}...`} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                </div>

                {/* Bouton envoyer */}
                <button type="submit" disabled={!newMessage.trim() && selectedFiles.length === 0} className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          // Message lorsqu'aucun utilisateur n'est sélectionné
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
