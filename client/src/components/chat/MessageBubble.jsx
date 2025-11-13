import { useState } from "react";
import ImageModal from "./ImageModal ";
import { Paperclip, Trash2, DownloadIcon } from "lucide-react";
import api from "../../services/api";
import Swal from "sweetalert2";

const MessageBubble = ({ message, isOwn, getMessage, getGroupeMessage, color }) => {
  const [modalSrc, setModalSrc] = useState(null);

  const deleteMessage = async (idMessage, idUtilisateurRecepteur = null, idGroupe = null) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce message ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/message/supprimer/${idMessage}`);
        if (idUtilisateurRecepteur) {
          getMessage();
        } else {
          getGroupeMessage(idGroupe);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du message :", error);
      }
    }
  };

  const formattedTime = new Date(message.datemessage).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <div className={`flex items-end ${isOwn ? "justify-end" : "justify-start"} mb-4 group`}>
        {/* Avatar pour les messages des autres */}
        {!isOwn && (
          <div className="flex-shrink-0 mr-3">
            <div
              className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white font-bold`}
            >
              {message.nomutilisateur?.charAt(0).toUpperCase() ?? "?"}
            </div>
          </div>
        )}

        {/* Bouton de suppression pour les messages propres (à gauche de la bulle) */}
        {isOwn && (
          <button
            aria-label="Supprimer le message"
            className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100 mr-2"
            onClick={() => deleteMessage(message.idmessage, message.idutilisateurrecepteur, message.idgroupe)}
          >
            <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}

        {/* Bulle du message */}
        <div
          className={`flex flex-col gap-1 max-w-xs md:max-w-md leading-relaxed p-4 rounded-lg shadow-sm
            ${isOwn
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tl-xl rounded-bl-xl rounded-tr-xl"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tr-xl rounded-br-xl rounded-tl-xl"
            }`}
        >
          {/* En-tête avec nom et heure pour les messages des autres */}
          {!isOwn && (
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {message.nomutilisateur}
              </span>
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                {formattedTime}
              </span>
            </div>
          )}

          {/* Contenu texte */}
          {message.contenumessage && (
            <p className={`text-sm font-normal break-words py-1 dark:text-white ${isOwn ? "text-white" : "text-gray-900"}`}>
              {message.contenumessage}
            </p>
          )}

          {/* Fichiers attachés */}
          {message.fichiers && message.fichiers.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.fichiers.map((f) => (
                <div key={f.idfichier} className="relative">
                  {f.typefichier.startsWith("image/") ? (
                    <img
                      src={`http://localhost:8000${f.urlfichier}`}
                      alt={f.nomfichier || "Image attachée"}
                      className="w-full h-auto rounded-lg cursor-pointer object-cover"
                      onClick={() => setModalSrc(`http://localhost:8000${f.urlfichier}`)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between p-3 gap-2">
                      <a
                        href={`http://localhost:8000${f.urlfichier}`}
                        download={f.nomfichier}
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        <span>{f.nomfichier}</span>
                      </a>
                      <Paperclip className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Heure pour les messages propres (en bas à droite) */}
          {isOwn && (
            <span className="text-xs font-normal text-gray-200 self-end mt-1">
              {formattedTime}
            </span>
          )}
        </div>

        {/* Bouton de suppression pour les messages des autres (à droite de la bulle) */}
        {!isOwn && (
          <button
            aria-label="Supprimer le message"
            className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100 ml-2"
            onClick={() => deleteMessage(message.idmessage, message.idutilisateurrecepteur, message.idgroupe)}
          >
            <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Modal pour les images */}
      {modalSrc && <ImageModal src={modalSrc} alt="Image agrandie" onClose={() => setModalSrc(null)} />}
    </>
  );
};

export default MessageBubble;