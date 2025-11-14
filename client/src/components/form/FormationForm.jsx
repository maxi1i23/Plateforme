import { X } from 'lucide-react'
import React from 'react'

const FormationForm = React.memo(({ formation, handleChange, onClose, handleSubmit }) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                        onClick={onClose}
                    >
                        <X size={20} className="text-white" />
                    </button>
                    {
                        formation.id ?
                            (<>
                                <h3 className="text-2xl font-bold text-white">Modifier la formation</h3>
                                <p className="text-blue-100 mt-1">Mettez à jour les informations de votre formation</p>
                            </>)
                            :
                            (<>
                                <h3 className="text-2xl font-bold text-white">Créer une formation</h3>
                                <p className="text-green-100 mt-1">Partagez vos informations importantes avec l'équipe</p>
                            </>)
                    }

                </div>

                <form onSubmit={handleSubmit} autoComplete='off' className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom du briefing</label>
                        <input
                            ttype="text"
                            name='nomFormation'
                            value={formation.nomFormation}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nom de la formation"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formation.descriptionFormation}
                            name='descriptionFormation'
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Description de la formation"
                            rows={6}
                            required
                        />
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
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
                        >
                            {
                                formation.idFormation ? "Modifier la formation" : "Créer la formation"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
})
FormationForm.displayName = "FormationForm"
export default FormationForm