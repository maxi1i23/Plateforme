import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import api from '../services/api'
import Sidebar from "../components/chat/sidebar/Sidebar"
import ChatHeader from "../components/chat/ChatHeader"
import MessageList from "../components/chat/MessageList"
import MessageInput from "../components/chat/MessageInput"
import CreateGroupModal from "../components/chat/CreateGroupModal"
import Swal from 'sweetalert2'
import ListeMembre from "../components/chat/ListeMembre"
import { useSocket } from "../context/SocketContext"
import { MessageSquare } from "lucide-react"

// Connexion au serveur Socket.IO
//const socket = io.connect("http://localhost:8000")

const Discussion = () => {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedGroupe, setSelectedGroupe] = useState(null)
  const [goupeDiscussion, setGoupeDiscussion] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([user?.idutilisateur])
  const [showMembre, setShowMembre] = useState(false)
  const [lastMessageUser, setLastMessageUser] = useState({})
  const [lastMessageGroupe, setLastMessageGroupe] = useState({})
  const [onLineUser, setOnLineUser] = useState([])
  const { socket } = useSocket()

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
  const handleQuitte = () => {
    try {

      Swal.fire({
        title: "Etes-vous sûr?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, je quitte!",
        cancelButtonText: "Non, annuler!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          await api.delete("/groupe/quitter/" + selectedGroupe.idgroupe)
          Swal.fire({
            title: "Succés",
            icon: "success",
            text: "Vous avez quitter le groupe !",
            timer: 1500
          })
          getGroupe();
        }
      })
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

  const getLastMessageUser = async () => {
    try {
      const response = await api.get('/message/last/message')
      let data = {};
      response.data.forEach(msg => {
        data[msg.idutilisateurrecepteur === user.idutilisateur ? msg.idutilisateurexpediteur : msg.idutilisateurrecepteur] = msg;
      });
      setLastMessageUser(data);
    } catch (error) {
      console.log(error)
    }
  }

  const getLastMessageGroupe = async () => {
    try {
      const response = await api.get('/message/last/message/groupe')
      let data = {};
      response.data.forEach(msg => {
        data[msg.idgroupe] = msg
      });
      setLastMessageGroupe(data);
    } catch (error) {
      console.log(error)
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
      getLastMessageUser()
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
      getLastMessageGroupe()
      setMessages(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Rejoindre room Socket.IO
  useEffect(() => {
    if (!user) return
    if (!socket) return;
    //socket.emit("joinRoom", user.idutilisateur.toString())
    socket.emit('GetOnLineUser', user.idutilisateur.toString())
  }, [user])

  const getOnleLineUser = (userId) => {
    return onLineUser.includes(String(userId)) ? true : false;
  }

  // Écoute messages entrants
  useEffect(() => {
    if (!socket) return;

    const handleCheckOnLineUser = (user) => {
      setOnLineUser(user)
    }

    const handleReceiveMessage = (msg) => {
      if (
        (selectedUser && (msg.idutilisateurexpediteur === selectedUser.idutilisateur
          || msg.idutilisateurrecepteur === selectedUser.idutilisateur))
      ) {
        setMessages(prev => prev.find(m => m.idmessage === msg.idmessage) ? prev : [...prev, msg])
      }

      if ((selectedGroupe && msg.idgroupe === selectedGroupe.idgroupe)) {
        setMessages(prev =>
          prev.find(m => Number(m.idmessage) === Number(msg.idmessage)) ? prev : [...prev, msg]
        )
      }

      const otherUserId = msg.idutilisateurexpediteur === user.idutilisateur ? msg.idutilisateurrecepteur : msg.idutilisateurexpediteur;

      setLastMessageUser(prev => ({
        ...prev,
        [otherUserId]: msg
      }));

      if (msg.idgroupe) {
        setLastMessageGroupe(prev => ({
          ...prev,
          [msg.idgroupe]: msg
        }));
      }
    }
    socket.on('OnLineUser', handleCheckOnLineUser)
    socket.on("receiveMessage", handleReceiveMessage)
    return () => {
      socket.off("receiveMessage", handleReceiveMessage)
      socket.off('OnLineUser', handleCheckOnLineUser)
    }
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
    getLastMessageGroupe()
    getLastMessageUser()
  }, [])

  // Envoi message
  const handleSendMessage = async (e) => {
    if (!newMessage.trim() && selectedFiles.length === 0) return

    try {
      const formData = new FormData()
      formData.append("contenuMessage", newMessage || "")
      formData.append("idUtilisateurExpediteur", user.idutilisateur)
      formData.append("nomUtilisateur", user.nomutilisateur)
      if (selectedUser) {
        formData.append("idUtilisateurRecepteur", selectedUser.idutilisateur)
      }
      if (selectedGroupe) formData.append("idGroupe", selectedGroupe.idgroupe)
      selectedFiles.forEach(file => formData.append("fichiers", file))

      const res = await api.post("/message/add", formData, { headers: { "Content-Type": "multipart/form-data" } })
      const msg = res.data.data
      socket.emit("sendMessage", msg)
      socket.emit("NouveauxMessage", msg)

      setNewMessage("")
      setSelectedFiles([])
    } catch (err) {
      console.error(err)
    }
  }

  const getColor = (role = null) => {
    if (role === "Admin") return "bg-red-500"
    else if (role === "Manager") return "bg-blue-500"
    else if (role === "Agent") return "bg-emerald-500"
    return "bg-purple-500"
  }

  return (
    <div className="flex h-[85vh] w-full max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">

      {/* Sidebar */}
      <Sidebar
        user={user}
        users={users}
        groupes={goupeDiscussion}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSelectedUser={setSelectedUser}
        setSelectedGroupe={setSelectedGroupe}
        selectedUser={selectedUser}
        selectedGroupe={selectedGroupe}
        onCreateGroup={() => setShowCreateGroup(true)}
        lastMessageGroupe={lastMessageGroupe}
        lastMessageUser={lastMessageUser}
        getOnleLineUser={getOnleLineUser}
        getColor={getColor}
      />

      {/* Chat */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {selectedUser || selectedGroupe ? (
          <>
            <ChatHeader
              selectedUser={selectedUser}
              selectedGroupe={selectedGroupe}
              onBack={() => { setSelectedUser(null); setSelectedGroupe(null) }}
              onQuit={handleQuitte}
              getMessages={getMessages}
              getMessagesGroupe={getMessagesGroupe}
              setShowMembre={() => setShowMembre(!showMembre)}
              getOnleLineUser={getOnleLineUser}
              getColor={getColor}
            />
            <MessageList messages={messages} user={user} selectedGroupe={selectedGroupe}
              getGroupeMessage={getMessagesGroupe}
              getMessage={() => getMessages(selectedUser.idutilisateur)} getColor={getColor} selectedUser={selectedUser} />
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              handleSendMessage={handleSendMessage}
            />
          </>
        ) : (
          // Écran vide
          <div className="hidden md:flex flex-1 items-center gap-2 justify-center italic font-semibold text-gray-400">
           <MessageSquare className="w-5 h-5"/><span>Séléctionner une conversation</span>
          </div>
        )}
      </div>

      {showCreateGroup && (
        <CreateGroupModal
          isOpen={showCreateGroup}
          userList={users}
          groupName={groupName}
          setGroupName={setGroupName}
          selectedMembers={selectedGroupMembers}
          toggleMember={toggleMember}
          handleSubmit={handleCreateGroup}
          onClose={() => setShowCreateGroup(false)}
        />
      )}
      {showMembre && (
        <ListeMembre
          isOpen={showMembre}
          onClose={() => setShowMembre(!showMembre)}
          idGroupe={selectedGroupe.idgroupe}
          user={user}
          setSelectedUser={setSelectedUser}
          setSelectedGroupe={setSelectedGroupe} />
      )}
    </div>
  )
}

export default Discussion