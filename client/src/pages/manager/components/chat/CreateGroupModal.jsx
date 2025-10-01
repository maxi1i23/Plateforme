import { X, Users } from "lucide-react"

const CreateGroupModal = ({ isOpen, onClose, userList, handleSubmit, groupName, setGroupName, selectedMembers, toggleMember }) => {
  

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Nouveau groupe</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Nom du groupe */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom du groupe
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Projet React"
              className="w-full mt-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Membres */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sélectionner les membres
            </label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {userList.map((u) => (
                <label
                  key={u.idutilisateur}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(u.idutilisateur)}
                    onChange={() => toggleMember(u.idutilisateur)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-200">
                    {u.nomutilisateur}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateGroupModal