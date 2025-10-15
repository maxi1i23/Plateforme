import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import Swal from 'sweetalert2'
import api from '../services/api'

const ForgotPassword = ({ setForgotPassword }) => {
    const [email, setEmail] = useState('')

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            await api.post('/notification/add', {
                contenu : `L'utilisateur avec l'adresse email ${email} à perdu son mot de passe et demande une reinitialisation !`, 
                raisonNotification: "Mot de passe oublié"}
            )
            Swal.fire({
                icon: 'success',
                title: 'Demande envoyée !',
                text: "Votre demande a été bien envoyée ! l'administrateur va vous contacter dans les plus brefs délais !"
            })
        } catch (error) {
            console.log(error)
        }
        setEmail('')
        setForgotPassword(false)
    }

    return (
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié ?</h2>
                </div>
                {/** Pour les mots de passe oubliés */}
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div className="relative group">
                    <Mail
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors duration-200"
                        size={20}
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Saisissez votre email"
                        required
                        className="pl-12 pr-4 py-3.5 w-full rounded-xl border-2 border-gray-200 focus:outline-none focus:border-gray-900 focus:ring-4 focus:ring-indigo-50 bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gray-300">
                    Faire la demande
                </button>
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setForgotPassword(false)}
                        className="text-sm text-gray-500 hover:text-gray-700 underline decoration-1 underline-offset-2 transition-colors duration-200">
                        Se connecter
                    </button>
                </div>
                </form>
            </div>
        
    )
}

export default ForgotPassword
