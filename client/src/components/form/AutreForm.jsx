import { X } from 'lucide-react'
import React from 'react'

const AutreForm = React.memo(({ autre, handleChange, handleSubmit, onClose, managerList }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative transform transition-all duration-300 scale-100">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                    <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200" onClick={onClose}>
                        <X size={20} className="text-white" />
                    </button>
                    {
                        autre.idAutreDemande ? (
                            <>
                                <h3 className="text-2xl font-bold text-white">Modifier votre demande</h3>
                                <p className="text-green-100 mt-1">Modifier votre demande pour envoyer au manager</p>
                            </>) : (
                            <>
                                <h3 className="text-2xl font-bold text-white">Faire votre demande</h3>
                                <p className="text-green-100 mt-1">Faire votre demande pour envoyer au manager</p>
                            </>
                        )
                    }
                </div>

                <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type du demande</label>
                        <input type="text"
                            value={autre.nomAutreDemande}
                            name='nomAutreDemande'
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2"> Déscriptions</label>
                        <input
                            type="text"
                            name='descriptionAutreDemande'
                            value={autre.descriptionAutreDemande}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            required

                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2"> Date</label>
                        <input
                            type="date"
                            value={autre.dateDemande}
                            name='dateDemande'
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            required

                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                        <select className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" required
                            value={autre.idManagerTraiteraAutreDemande}
                            onChange={handleChange}
                            name='idManagerTraiteraAutreDemande'
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
                            {autre.idAutreDemande ? 'Mettre à jour la demande' : 'Envoyer la demande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
})

AutreForm.displayName = "AutreForm";

export default AutreForm
