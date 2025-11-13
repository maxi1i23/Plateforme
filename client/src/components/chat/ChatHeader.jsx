import { useState, useRef, useEffect } from "react"
import { ArrowLeft, LogOut, MoreVertical, Trash2, Users } from "lucide-react"
import api from '../../services/api'
import Swal from "sweetalert2"

const ChatHeader = ({ selectedUser, selectedGroupe, onBack, onQuit, getMessages, getMessagesGroupe, setShowMembre, getOnleLineUser, getColor }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)



  // Ferme le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDelete = async (idUtilisateur = null, idGroupe = null) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Voulez vous vraiment supprimer ce ${idUtilisateur ? "utilisateur" : "groupe"}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, je veux le supprimer!',
      cancelButtonText: 'Non, annuler la suppression.'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post("/message/supprimer/tout", { idGroupe, idUtilisateur });
          if (idUtilisateur) {
            getMessages(idUtilisateur)
          } else {
            getMessagesGroupe(idGroupe)
          }
          Swal.fire('Supprimé!', `${idUtilisateur ? "Les messages ont été supprimés avec succées" : "Les messages de groupe ont été supprimés avec succées"}`, 'success')
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error || "Une erreur est survenue lors de la suppression des messages.",
          })
          console.error(error);
        }
      }
    })
  }

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 
      bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 
      flex items-center space-x-3 relative">

      {/* Bouton retour (mobile only) */}
      <button
        onClick={onBack}
        className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Avatar cercle */}
      <div className={`w-10 h-10 ${getColor(selectedUser?.roleutilisateur)} rounded-full 
        flex items-center justify-center text-white font-semibold`}>
        {(selectedUser ? selectedUser.nomutilisateur : selectedGroupe.nomgroupe)
          ?.charAt(0)
          .toUpperCase()}
      </div>

      {/* Infos utilisateur/groupe */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {selectedUser ? selectedUser.nomutilisateur : selectedGroupe.nomgroupe}
        </h3>
        <p className="text-sm text-green-500">
          {selectedUser ? <span>{ getOnleLineUser(selectedUser.idutilisateur) ? "En ligne" : "Déconnecté"}</span> : "Groupe"}
        </p>
      </div>

      {/* Menu MoreVertical */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center w-8 h-8 rounded-lg 
            hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 z-10 bg-white dark:bg-gray-700 
            divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow-lg w-40">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (!selectedUser) {
                      handleDelete(null, selectedGroupe.idgroupe)
                    } else {
                      handleDelete(selectedUser.idutilisateur, null)
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </li>

              {!selectedUser && (
                <>
                <li>
                  <button
                    onClick={setShowMembre}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <Users className="w-4 h-4" />
                    Membres
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setMenuOpen(false); onQuit?.() }}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    Quitter
                  </button>
                </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatHeader