// src/pages/NotAuthorized.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotAuthorized = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-6xl font-bold text-gray-700">403</h1>
      <p className="text-xl text-gray-500 m-5">Accès refusé : vous n'êtes pas autorisé à voir cette page.</p>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          Retour à la page précédente
        </button>
      </div>
    </div>
  )
}

export default NotAuthorized
