import { ArrowLeft, LogOut } from "lucide-react"

const ChatHeader = ({ selectedUser, selectedGroupe, onBack, onQuit }) => (
  <div className="p-4 border-b border-gray-200 dark:border-gray-700 
    bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 
    flex items-center space-x-3">
    
    <button onClick={onBack} className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
      <ArrowLeft className="w-5 h-5" />
    </button>

    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
      {(selectedUser ? selectedUser.nomutilisateur : selectedGroupe.nomgroupe).charAt(0).toUpperCase()}
    </div>

    <div className="flex-1">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        {selectedUser ? selectedUser.nomutilisateur : selectedGroupe.nomgroupe}
      </h3>
      <p className="text-sm text-green-500">{selectedUser ? "En ligne" : "Groupe"}</p>
    </div>

    {!selectedUser && (
      <button onClick={onQuit}
        className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
        <LogOut className="w-4 h-4" />
        <span>Quitter</span>
      </button>
    )}
  </div>
)

export default ChatHeader