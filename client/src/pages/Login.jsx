// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import vite from '../assets/favicon.png'
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      // Exemple: backend retourne user.roleUtilisateur dans res.data.user
      const role = res.data.user?.roleUtilisateur || (res.data.token ? jwtDecode(res.data.token).role : null);
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Manager') navigate('/manager');
      else navigate('/agent');
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert('Erreur connexion');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-center">
          <img src={vite} className="h-20 mx-auto mb-4" alt="Logo_Success_MDG" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Plateforme Success MDG
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Adresse email"
                required
                className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
