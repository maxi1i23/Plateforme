import { useState } from "react"
import ImageModal from "./ImageModal "
import { Paperclip, Trash2 } from "lucide-react"
import api from "../../../../services/api"
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
          if(idUtilisateurRecepteur) return getMessage()
          else return getGroupeMessage(idGroupe)
        }
        catch (error) { console.log(error) }
      }
    })
  }

  return (
    <>
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
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
        {/* Bubble */}
        <div className="group flex">
          <div className="flex">
            <div
              className={`max-w-[70%] rounded-2xl p-4 shadow-md transition-all duration-200 rounded-e-xl rounded-es-xl 
           ${isOwn
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white "
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}>
              {/* Nom expéditeur */}
              {!isOwn && (
                <p className=" mb-1 flex items-center space-x-1">
                  <span className={`text-sm text-right font-semibold  text-purple-600 dark:text-purple-400`}>
                    {message.nomutilisateur}
                  </span>
                  <span className={`text-sm font-normal text-right text-gray-500 dark:text-gray-400}`}>
                    {new Date(message.datemessage).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </p>
              )}
              {/* Contenu texte */}
              {message.contenumessage && (
                <p className="text-sm whitespace-pre-wrap break-words">{message.contenumessage}</p>
              )}
              {/* Fichiers attachés */}
              {message.fichiers && message.fichiers.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  {message.fichiers.map((f) => (
                    <div key={f.idfichier}>
                      {f.typefichier.startsWith("image/") ? (
                        <img
                          src={`http://localhost:8000${f.urlfichier}`}
                          alt={f.nomfichier}
                          className="w-32 h-auto rounded cursor-pointer"
                          onClick={() => setModalSrc(`http://localhost:8000${f.urlfichier}`)}
                        />
                      ) : (
                        <a
                          href={`http://localhost:8000${f.urlfichier}`}
                          download={f.nomfichier}
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gray-900 dark:text-white pb-2 underline"
                        >
                          {f.nomfichier}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Heure */}
            </div>
            <button className="p-2 rounded-full hover:bg-white/50 transition-all duration-200 opacity-0 group-hover:opacity-100"
              onClick={() => deleteMessage(message.idmessage, message.idutilisateurrecepteur, message.idgroupe)}>
              <Trash2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      {/* Modal */}
      {modalSrc && <ImageModal src={modalSrc} alt="image" onClose={() => setModalSrc(null)} />}
    </>
  )
}
export default MessageBubble