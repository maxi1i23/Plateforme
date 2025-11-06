import React from "react";
import { Calendar, Trash, Edit, User, FileText, Check, X } from "lucide-react";

const DemandeTable = ({ demandes, typeDemande, onEdit, handleDelete, isAgent, isAdmin, isManager, handleTraiter }) => {

    // === Style badge selon statut ===
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "en attente":
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        En attente
                    </span>
                );
            case "accepté":
            case "accepter":
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Accepté
                    </span>
                );
            case "refusé":
            case "refuser":
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        Refusé
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {status || "—"}
                    </span>
                );
        }
    };

    {/** Style */ }
    const thStyle = "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
    const tdStyle = "px-6 py-4 whitespace-nowrap"
    const trStyle = "hover:bg-blue-50/50 transition-colors duration-200"

    // === Colonnes dynamiques selon le type de demande ===
    const isAutre = typeDemande === "autre";

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
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

                    <tbody className="divide-y divide-gray-100">
                        {demandes?.length > 0 ? (
                            demandes.map((d, index) => (
                                <tr
                                    key={d.idautredemande || d.iddemandeconger}
                                    className={trStyle}>
                                    <td className={tdStyle}>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center  text-sm font-semibold mr-3">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {d.nomagentdemander || d.nomagentautredemande || "--"}
                                            </span>
                                        </div>
                                    </td>
                                    {isAutre ? (
                                        <>
                                            <td className={tdStyle + " text-sm font-medium text-gray-900"}>{d.nomautredemande}</td>
                                            <td className={tdStyle + " text-sm font-medium max-w-xs truncate"}>
                                                {d.descriptionautredemande}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(d.datedemande).toLocaleDateString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.typeconger}</td>
                                            <td className="px-6 py-4 text-gray-600 text-sm ">
                                                {new Date(d.datedebutconger).toLocaleDateString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {new Date(d.datefinconger).toLocaleDateString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </td>
                                        </>
                                    )}

                                    <td className="px-6 py-4">{getStatusBadge(d.statutconger || d.statutautredemande)}</td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-gray-600 font-semibold text-sm">
                                                {d.nommanagertraiter || d.nommanagertraiterautredemande || "—"}
                                            </span>
                                        </div>
                                    </td>

                                    { // S'il s'agit d'un agent, afficher les actions d'édition/suppression
                                        isAgent && (
                                            <td className="px-6 py-4">
                                                {(d.statutautredemande || d.statutconger)?.toLowerCase() === "en attente" ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                                            onClick={() => onEdit(d)}>
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                                            onClick={() =>
                                                                handleDelete(d.idautredemande || d.iddemandeconger)
                                                            }
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 italic">Déjà traitée</span>
                                                )}
                                            </td>
                                        )
                                    }
                                    {
                                        isAdmin && (
                                            <td className="px-6 py-4 flex items-center">
                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                                    onClick={() =>
                                                        handleDelete(d.idautredemande || d.iddemandeconger)
                                                    }
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </td>
                                        )
                                    }
                                    {
                                        isManager && (
                                            <td className="px-6 py-4">
                                                {(d.statutautredemande || d.statutconger)?.toLowerCase() === "en attente" ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                                            onClick={() => handleTraiter(d.iddemandeconger || d.idautredemande, "Accepter")}>
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                                            onClick={() =>
                                                                handleTraiter(d.iddemandeconger || d.idautredemande, "Refuser")
                                                            }
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 italic">Déjà traitée</span>
                                                )}
                                            </td>
                                        )
                                    }
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <FileText className="w-12 h-12 text-gray-400 mb-4" />
                                        <p className="text-gray-500 font-medium">Aucune demande trouvée</p>
                                        <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
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