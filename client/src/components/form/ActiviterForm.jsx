import { Clock, Coffee, Phone, X } from 'lucide-react'
import React from 'react'

const ActiviterForm = React.memo(({formData, setFormData, handleSubmit, onClose, editingActivite}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                        onClick={onClose}
                    >
                        <X size={20} className="text-white" />
                    </button>
                    <h3 className="text-2xl font-bold text-white">
                        {editingActivite ? "Modifier l'activité" : "Ajouter une activité"}
                    </h3>
                    <p className="text-indigo-100 mt-1">
                        {editingActivite ? "Mettez à jour vos données d'activité" : "Enregistrez votre nouvelle activité"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'appels</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="number"
                                value={formData.nbappelle}
                                onChange={(e) => setFormData({ ...formData, nbappelle: Number(e.target.value) })}
                                className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="Nombre d'appels effectués"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pauses (minutes)</label>
                        <div className="relative">
                            <Coffee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="number"
                                value={formData.pauses}
                                onChange={(e) => setFormData({ ...formData, pauses: Number(e.target.value) })}
                                className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="Nombre de pauses prises"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Durée des appels (minutes)</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="number"
                                step="0.1"
                                value={formData.dureeappelle}
                                onChange={(e) => setFormData({ ...formData, dureeappelle: Number(e.target.value) })}
                                className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="Durée totale des appels"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
                        >
                            {editingActivite ? "Modifier" : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
})

ActiviterForm.displayName = "ActiviterForm";
export default ActiviterForm
