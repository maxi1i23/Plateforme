import React from "react";
import { Calendar, Trash, Edit, User, FileText, Check, X } from "lucide-react";

const DemandeTable = ({ demandes, typeDemande, onEdit, handleDelete, isAgent, isAdmin, isManager, handleTraiter }) => {

    // Badge stylé selon statut
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "en attente":
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">En attente</span>;
            case "accepté":
            case "accepter":
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Accepté</span>;
            case "refusé":
            case "refuser":
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">Refusé</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800/20 dark:text-gray-400">{status || "—"}</span>;
        }
    };

    const thStyle = "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300";
    const tdStyle = "px-6 py-4 whitespace-nowrap";
    const trStyle = "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors duration-300";

    const isAutre = typeDemande === "autre";

    return (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20">
                        <tr>
                            <th className={thStyle}>Agent</th>
                            {isAutre ? (
                                <>
                                    <th className={thStyle}>Type</th>
                                    <th className={thStyle}>Description</th>
                                    <th className={thStyle}>Date demande</th>
                                </>
                            ) : (
                                <>
                                    <th className={thStyle}>Type</th>
                                    <th className={thStyle}>Date début</th>
                                    <th className={thStyle}>Date fin</th>
                                </>
                            )}
                            <th className={thStyle}>Statut</th>
                            <th className={thStyle}>Manager</th>
                            <th className={thStyle}>Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200/50 dark:divide-white/10">
                        {demandes?.length > 0 ? (
                            demandes.map((d) => (
                                <tr key={d.idautredemande || d.iddemandeconger} className={trStyle}>

                                    {/* Agent */}
                                    <td className={tdStyle}>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 dark:bg-green-900/20 dark:text-green-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {d.nomagentdemander || d.nomagentautredemande || "--"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Colonnes dynamiques */}
                                    {isAutre ? (
                                        <>
                                            <td className={`${tdStyle} text-sm font-medium text-gray-900 dark:text-gray-100`}>{d.nomautredemande}</td>
                                            <td className={`${tdStyle} text-sm font-medium max-w-xs truncate text-gray-900 dark:text-gray-100`}>{d.descriptionautredemande}</td>
                                            <td className={`${tdStyle} text-gray-600 dark:text-gray-400`}>
                                                {new Date(d.datedemande).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className={`${tdStyle} text-sm font-medium text-gray-900 dark:text-gray-100`}>{d.typeconger}</td>
                                            <td className={`${tdStyle} text-sm text-gray-600 dark:text-gray-400`}>
                                                {new Date(d.datedebutconger).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            <td className={`${tdStyle} text-sm text-gray-600 dark:text-gray-400`}>
                                                {new Date(d.datefinconger).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                        </>
                                    )}

                                    {/* Statut */}
                                    <td className={tdStyle}>{getStatusBadge(d.statutconger || d.statutautredemande)}</td>

                                    {/* Manager */}
                                    <td className={tdStyle}>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 dark:bg-blue-900/20 dark:text-blue-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                {d.nommanagertraiter || d.nommanagertraiterautredemande || "—"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className={tdStyle}>
                                        <div className="flex space-x-2">
                                            {isAgent && (d.statutautredemande || d.statutconger)?.toLowerCase() === "en attente" && (
                                                <>
                                                    <button className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition duration-200" onClick={() => onEdit(d)}>
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition duration-200" onClick={() => handleDelete(d.idautredemande || d.iddemandeconger)}>
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {isAgent && (d.statutautredemande || d.statutconger)?.toLowerCase() !== "en attente" && (
                                                <span className="text-gray-500 italic">Déjà traitée</span>
                                            )}
                                            {isAdmin && (
                                                <button className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition duration-200" onClick={() => handleDelete(d.idautredemande || d.iddemandeconger)}>
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            )}
                                            {isManager && (d.statutautredemande || d.statutconger)?.toLowerCase() === "en attente" && (
                                                <>
                                                    <button className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition duration-200" onClick={() => handleTraiter(d.iddemandeconger || d.idautredemande, "Accepter")}>
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition duration-200" onClick={() => handleTraiter(d.iddemandeconger || d.idautredemande, "Refuser")}>
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {isManager && (d.statutautredemande || d.statutconger)?.toLowerCase() !== "en attente" && (
                                                <span className="text-gray-500 italic">Déjà traitée</span>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
                                        <p className="text-gray-500 dark:text-gray-300 font-medium">Aucune demande trouvée</p>
                                        <p className="text-gray-400 dark:text-gray-500 text-sm">Essayez de modifier vos critères de recherche</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DemandeTable;
