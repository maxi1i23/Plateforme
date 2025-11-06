import { useState } from "react"
import ImageModal from "./ImageModal "
import { Paperclip, Trash2, DownloadIcon } from "lucide-react"
import api from "../../services/api"
import Swal from "sweetalert2"

const MessageBubble = ({ message, isOwn, getMessage, getGroupeMessage }) => {
  const [modalSrc, setModalSrc] = useState(null)

  const deleteMessage = async (idMessage, idUtilisateurRecepteur = null, idGroupe = null) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer ce message?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/message/supprimer/${idMessage}`)
          if (idUtilisateurRecepteur) return getMessage()
          else return getGroupeMessage(idGroupe)
        }
        catch (error) { console.log(error) }
      }
    })
  }

  return (
    <>
      <div className={`flex  ${isOwn ? "justify-end" : "justify-start"} mb-4 group`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {message.nomutilisateur
                ? message.nomutilisateur.charAt(0).toUpperCase()
                : "?"}
            </div>
          </div>
        )}

        {/* 1. Bouton "Supprimer" affiché en premier si c'est VOTRE message (isOwn) */}
        {isOwn && (
          <button
            className="flex-shrink-0 p-2 rounded-full hover:bg-white/50 transition-all duration-200 opacity-0 group-hover:opacity-100 mr-2"
            onClick={() => deleteMessage(message.idmessage, message.idutilisateurrecepteur, message.idgroupe)}>
            <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}

        {/* Bubble */}
        <div
          className={`flex flex-col gap-1 w-full max-w-[200px] leading-1.5 p-4 border-gray-200 bg-gray-100 l dark:bg-gray-700 
           ${isOwn
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-s-xl rounded-ee-2xl"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-e-xl rounded-es-2xl"
            }`}>
          {/* Nom expéditeur */}
          {!isOwn && (
            <p className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className={`text-sm font-semibold  text-purple-600 dark:text-purple-400`}>
                {message.nomutilisateur}
              </span>
              <span className={`text-sm font-normal text-gray-500 dark:text-gray-400}`}>
                {new Date(message.datemessage).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </p>
          )}
          {/* Contenu texte */}
          {message.contenumessage && (
            <p className="text-sm font-normal wrap-break-word py-1.5 ext-gray-900 dark:text-white">{message.contenumessage}</p>
          )}
          {/* Fichiers attachés */}
          {message.fichiers && message.fichiers.length > 0 && (
            <div className="group relative my-2.5">
              {message.fichiers.map((f) => (
                <div key={f.idfichier}>
                  {f.typefichier.startsWith("image/") ? (
                    <img
                      src={`http://localhost:8000${f.urlfichier}`}
                      alt={f.nomfichier}
                      className="w-full h-auto rounded-lg cursor-pointer"
                      onClick={() => setModalSrc(`http://localhost:8000${f.urlfichier}`)}
                    />
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                      <a
                        href={`http://localhost:8000${f.urlfichier}`}
                        download={f.nomfichier}
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white p-2 underline">
                        <DownloadIcon className="w-4 h-4" /> <span>{f.nomfichier}</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 2. Bouton "Supprimer" affiché en dernier si ce n'est PAS votre message (!isOwn) */}
        {!isOwn && (
          <button
            className="flex-shrink-0 p-2 rounded-full hover:bg-white/50 transition-all duration-200 opacity-0 group-hover:opacity-100 ml-2"
            onClick={() => deleteMessage(message.idmessage, message.idutilisateurrecepteur, message.idgroupe)}>
            <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>
      {/* Modal */}
      {modalSrc && <ImageModal src={modalSrc} alt="image" onClose={() => setModalSrc(null)} />}
    </>
  )
}
export default MessageBubble