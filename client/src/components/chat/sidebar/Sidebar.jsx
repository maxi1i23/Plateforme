import { PlusCircle, Search, Circle } from "lucide-react"
import { useState } from "react"

const Sidebar = ({
  users,
  groupes,
  searchTerm,
  setSearchTerm,
  setSelectedUser,
  setSelectedGroupe,
  selectedUser,
  selectedGroupe,
  onCreateGroup,
  user,
  lastMessageUser,
  lastMessageGroupe,
  getOnleLineUser,
  getColor
}) => {
  const [showUser, setShowUser] = useState(true)
  const filteredUsers = users.filter(u =>
    u.nomutilisateur.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div
      className={`${selectedUser || selectedGroupe ? "hidden md:flex" : "flex"} 
      md:w-1/3 lg:w-80 flex-col 
      bg-gradient-to-b from-slate-50/80 to-slate-100/80 dark:from-gray-800/80 dark:to-gray-900/80 
      backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 transition-all`}
    >
      {/* ---- HEADER ---- */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Messages
          </h2>
          <button
            onClick={onCreateGroup}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            title="Créer un groupe"
          >
            <PlusCircle size={24} />
          </button>
        </div>

        {/* Champ de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 
              border border-gray-300/50 dark:border-gray-600/50 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* ---- TOGGLE UTILISATEURS / GROUPES ---- */}
      <div className="flex items-center justify-between px-4 mt-2 mb-1">
        <button
          className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-all 
            ${showUser
              ? "text-blue-600 dark:text-blue-400 border-b-4 border-blue-500"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          onClick={() => setShowUser(true)}
        >
          Utilisateurs
        </button>
        <button
          className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 justify-center
            ${!showUser
              ? "text-blue-600 dark:text-blue-400 border-b-4 border-blue-500"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          onClick={() => setShowUser(false)}
        >
          Groupes <span className="block w-2 h-2 rounded-full bg-red-500"></span>
        </button>
      </div>

      {/* ---- LISTE ---- */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {/* Groupes */}
        {!showUser && groupes.length > 0 && (
          <div className="mt-2">
            {groupes.map((g) => {
              const lastMsg = lastMessageGroupe[g.idgroupe]
              const isActive = selectedGroupe?.idgroupe === g.idgroupe

              return (
                <div
                  key={g.idgroupe}
                  onClick={() => { setSelectedGroupe(g); setSelectedUser(null) }}
                  className={`p-4 cursor-pointer transition-all duration-200 
                    hover:bg-white/60 dark:hover:bg-gray-800/40 
                    border-b border-gray-100/50 dark:border-gray-800/50 
                    ${isActive ? "bg-blue-50/70 dark:bg-blue-900/20 border-l-4 border-l-blue-500" : ""}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow">
                      {g.nomgroupe.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{g.nomgroupe}</p>
                      <p className="text-sm text-gray-500 flex items-center justify-between dark:text-gray-400 truncate">
                        {lastMsg
                          ? lastMsg.idutilisateurexpediteur === user.idutilisateur
                            ? <>Vous : {lastMsg.contenumessage}</>
                            : <strong>{lastMsg.contenumessage}</strong>
                          : "Groupe de discussion"}
                          <span className="block w-2 h-2 rounded-full bg-red-500"></span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Utilisateurs */}
        {showUser && filteredUsers.length > 0 && (
          <div className="mt-2">
            {filteredUsers.map((u) => {
              const isActive = selectedUser?.idutilisateur === u.idutilisateur
              const lastMsg = lastMessageUser[u.idutilisateur]
              const isOnline = getOnleLineUser(u.idutilisateur)

              return (
                <div
                  key={u.idutilisateur}
                  onClick={() => { setSelectedUser(u); setSelectedGroupe(null) }}
                  className={`p-4 cursor-pointer transition-all duration-200 
                    hover:bg-white/60 dark:hover:bg-gray-800/40 
                    border-b border-gray-100/50 dark:border-gray-800/50 
                    ${isActive ? "bg-blue-50/70 dark:bg-blue-900/20 border-l-4 border-l-blue-500" : ""}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-12 h-12 ${getColor(u.roleutilisateur)} rounded-full flex items-center justify-center text-white font-semibold text-lg shadow`}>
                        {u.nomutilisateur.charAt(0).toUpperCase()}
                      </div>
                      {isOnline && (
                        <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current drop-shadow-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{u.nomutilisateur}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {lastMsg ? (
                          lastMsg.idutilisateurexpediteur === user.idutilisateur
                            ? <>Vous : {lastMsg.contenumessage || "Fichier envoyé"}</>
                            : <span className="font-semibold">{lastMsg.contenumessage || `${u.nomutilisateur} a envoyé un fichier`}</span>
                        ) : (
                          u.roleutilisateur
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Aucun résultat */}
        {(showUser && filteredUsers.length === 0) || (!showUser && groupes.length === 0) ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm italic">
            Aucun résultat trouvé.
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default Sidebar