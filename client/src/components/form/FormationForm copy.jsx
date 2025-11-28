import React from 'react'
import { X, Plus } from 'lucide-react'

const FormationForm = React.memo(({formation, handleChange, onClose, handleSubmit}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl"></div>
                <button
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/50 transition-colors"
                    onClick={onClose}
                >
                    <X size={20} className="text-gray-600" />
                </button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                    {
                        formation.id ? (<h3 className="text-2xl font-bold text-gray-800">Créer une formation</h3>) : (
                            <h3 className="text-2xl font-bold text-gray-800">Modifier la formation</h3>
                        )
                    }
                </div>
                <form onSubmit={handleSubmit} className="space-y-4" autoComplete='off'>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la formation</label>
                        <input
                            type="text"
                            name='nomFormation'
                            value={formation.nomFormation}
                            onChange={handleChange}
                            className="w-full p-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                            className="w-full p-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                            placeholder="Description de la formation"
                            rows={4}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        {
                            formation.idFormation ? "Modifier la formation" : "Créer la formation"
                        }
                    </button>
                </form>
            </div>
        </div>
    )
})

FormationForm.displayName = 'FormationForm'

export default FormationForm
