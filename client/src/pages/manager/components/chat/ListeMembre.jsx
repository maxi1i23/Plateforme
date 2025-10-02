import { X, Users, MinusCircle, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import api from "../../../../services/api"
import Swal from "sweetalert2"

const ListeMembre = ({ isOpen, onClose, idGroupe }) => {
  const [listeMembre, setListeMembre] = useState([])

  const getListeMembre = async () => {
    const response = await api.get(`groupe/${idGroupe}/membres`)
    setListeMembre(response.data)
  }

  const handleRetire = async (idMembre) => {
    try {
      const result = await api.delete(`/groupe/supprimer/${idMembre}/${idGroupe}`)
      Swal.fire({
        title: "Succés",
        text: "L'utilisateur a été retirer avec succée",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
      })
      getListeMembre()
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Veuillez réessayer !",
        icon: "error",
        timer: 1000,
        showConfirmButton: false
      })
      console.log(error.message)
    }
  }

  useEffect(() => {
    getListeMembre()
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-gray-200/50 dark:border-gray-700/50 p-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span>Les participants</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gradient-to-br hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {listeMembre.map((membre) => (
            <div
              key={membre.idMembre}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between p-4">
                {/* Les membres */}
                <div className="flex items-center space-x-3 flex-1">
                  {/* Gradient avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {membre.nomUtilisateur.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{membre.nomUtilisateur}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {membre.roleUtilisateur}
                    </span>
                  </div>
                </div>

                {/* Boutons pour retirer ou envoyer un message à un membre */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRetire(membre.idMembre)}
                    className="p-2 rounded-lg text-red-500 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 transition-all duration-200 hover:scale-110"
                    title="Retirer le membre"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded-lg text-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-200 hover:scale-110"
                    title="Envoyer un message"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ListeMembre