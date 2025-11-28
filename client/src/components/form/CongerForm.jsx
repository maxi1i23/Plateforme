import { X } from 'lucide-react'
import React from 'react'

const CongerForm = React.memo(({ conger, onClose, handleChange, handleSubmit, managerList }) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                    <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200" onClick={onClose}>
                        <X size={20} className="text-white" />
                    </button>
                    {
                        conger.idDemandeConger ? (
                            <>
                                <h3 className="text-2xl font-bold text-white">Modifier votre demande</h3>
                                <p className="text-green-100 mt-1">Modifier votre demande pour envoyer au manager</p>
                            </>
                        ) :
                            (
                                <>
                                    <h3 className="text-2xl font-bold text-white">Faire votre demande</h3>
                                    <p className="text-green-100 mt-1">Faire votre demande pour envoyer au manager</p>
                                </>)
                    }
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6" autoComplete='off'>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type du conger</label>
                        <input type="text"
                            value={conger.typeConger}
                            name='typeConger'
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2"> Date de début</label>
                        <input
                            type="date"
                            name='dateDebutConger'
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            onChange={handleChange}
                            value={conger.dateDebutConger}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2"> Date de fin</label>
                        <input
                            type="date"
                            name='dateFinConger'
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            onChange={handleChange}
                            value={conger.dateFinConger}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                        <select className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            name='idManagerTraiter'
                            onChange={handleChange}
                            value={conger.idManagerTraiter}
                            required
                        >
                            <option value={0}>Séléctionner le manager</option>
                            {
                                managerList.map((user) => (
                                    <option value={user.idutilisateur} key={user.idutilisateur}>{user.nomutilisateur}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium cursor-pointer">
                            {
                                conger.idDemandeConger ? "Modifier la demande" : "Envoyer la demande"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
})
CongerForm.displayName = 'CongerForm'
export default CongerForm
