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

  const handleRetire = async (idMembre) =>{
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Les participants : </span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto ">
          {
            listeMembre.map(membre => (
              <div key={membre.idMembre} className="bg-gray-100 ">

                <div className="flex items-center justify-between" >
                  {/**Les membres */}
                  <div className=" w-full p-2">
                    <h4 className="text-sm">{membre.nomUtilisateur} - <span>{membre.roleUtilisateur}</span></h4>
                  </div>
                  {/** Boutons pour retirer ou envoyer un message à un membre */}
                  <div className="flex items-center justify-center space-x-2">
                    <button className="text-gray-500" onClick={()=>handleRetire(membre.idMembre)}>
                      <MinusCircle className="w-8 h-8" />
                    </button>
                    <button className="text-gray-500">
                      <MessageCircle className="w-8 h-8" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ListeMembre