// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import vite from '../assets/favicon.png'

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
    <div className="flex items-center justify-center p-4 w-full max-w-md max-h-full">
      <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
        <div className='p-4 md:p-5  rounded-t dark:border-gray-600 border-gray-200'>
          <div className='flex items-center'>
            <img src={vite} className='h-40' alt="Logo_Success_MDG" />
          </div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>Connexion aux plateforme Success MDG</h2>
        </div>
        <div className='p-4 md:p-5'>
          <form onSubmit={handleSubmit}>

            <div>
              <label htmlFor="" className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Adresse email :</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email"
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white '
              />
            </div>
            <div>
              <label htmlFor="" className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Mot de passe :</label>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder='.......'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
              />
            </div>

            <div>
              <button type="submit"
                className='w-full mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
