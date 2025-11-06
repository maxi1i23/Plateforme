import { X, Users } from 'lucide-react'

const CreateGroupModal = ({ isOpen, onClose, userList, handleSubmit, groupName, setGroupName, selectedMembers, toggleMember }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span>Nouveau groupe</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto bg-gradient-to-b from-gray-50/30 to-white dark:from-gray-900 dark:to-gray-900">
          {/* Nom du groupe */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Nom du groupe
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Projet React"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Membres */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Sélectionner les membres
            </label>
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-2 border border-gray-200 dark:border-gray-700">
              {userList.map((u) => (
                <label
                  key={u.idutilisateur}
                  className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(u.idutilisateur)}
                    onChange={() => toggleMember(u.idutilisateur)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {u.nomutilisateur.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white flex-1">
                    {u.nomutilisateur}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-all duration-200 border border-gray-200 dark:border-gray-600"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateGroupModal