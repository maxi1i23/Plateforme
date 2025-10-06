import React from 'react'
import {Link, useNavigate} from "react-router-dom";

const NotFound = () => {
    const navigation = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-6xl font-bold text-gray-700">404</h1>
      <p className="text-xl text-gray-500  m-5">Oups ! La page que vous recherchez n'existe pas.</p>
      <Link to={navigation(-1)} className='px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition'>
        Retour à la page précédente
      </Link>
    </div>
  )
}

export default NotFound
