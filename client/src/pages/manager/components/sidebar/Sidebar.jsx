import { PlusCircle, Search, Circle } from "lucide-react"

const Sidebar = ({ users, groupes, searchTerm, setSearchTerm, setSelectedUser, setSelectedGroupe, selectedUser, selectedGroupe,
  onCreateGroup, user, lastMessageUser, lastMessageGroupe, getOnleLineUser
}) => {
  const filteredUsers = users.filter(u => u.nomutilisateur.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className={`${selectedUser || selectedGroupe ? "hidden md:flex" : "flex"}
      md:w-1/3 lg:w-80 bg-gradient-to-b from-slate-50 to-slate-100 
      dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 
      dark:border-gray-700 flex-col`}>

      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
          <button onClick={onCreateGroup} className="text-blue-600 hover:text-blue-800">
            <PlusCircle size={24} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 
              border border-gray-300 dark:border-gray-600 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Groupes */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4 mt-4 mb-2">
          Groupes
        </h3>
        {groupes.map(g => (
          <div key={g.idgroupe}
            onClick={() => { setSelectedGroupe(g); setSelectedUser(null) }}
            className={`p-4 cursor-pointer transition-all duration-200 
              hover:bg-white/50 dark:hover:bg-gray-700/50 
              border-b border-gray-100 dark:border-gray-800 
              ${selectedGroupe?.idgroupe === g.idgroupe
                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                : ""}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {g.nomgroupe.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{g.nomgroupe}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {lastMessageGroupe[g.idgroupe] ? (
                    lastMessageGroupe[g.idgroupe].idutilisateurexpediteur === user.idutilisateur
                      ? <>Vous : {lastMessageGroupe[g.idgroupe].contenumessage}</>
                      : <strong>{lastMessageGroupe[g.idgroupe].contenumessage}</strong>
                  ) : 'Groupe de discussion'}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Utilisateurs */}
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4 mt-4 mb-2">
          Utilisateurs
        </h3>
        {filteredUsers.map(u => (
          <div key={u.idutilisateur}
            onClick={() => { setSelectedUser(u); setSelectedGroupe(null) }}
            className={`p-4 cursor-pointer transition-all duration-200 
              hover:bg-white/50 dark:hover:bg-gray-700/50 
              border-b border-gray-100 dark:border-gray-800 
              ${selectedUser?.idutilisateur === u.idutilisateur
                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                : ""}`}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {u.nomutilisateur.charAt(0).toUpperCase()}
                </div>
                {getOnleLineUser(u.idutilisateur) && <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{u.nomutilisateur}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {lastMessageUser[u.idutilisateur] ? (
                    <>
                      {lastMessageUser[u.idutilisateur].idutilisateurexpediteur === user.idutilisateur
                        ? <>Vous : {lastMessageUser[u.idutilisateur].contenumessage}</>
                        : <strong>{lastMessageUser[u.idutilisateur].contenumessage}</strong>
                      }
                    </>
                  ) : u.roleutilisateur}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
