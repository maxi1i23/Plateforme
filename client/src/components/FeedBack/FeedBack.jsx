"use client"

import { useState, useEffect } from "react"
import { User, Send, X, Star, Trash, MessageCircle } from "lucide-react"
import api from "../../services/api"
import FeedbackService from "../../services/FeedBackService"

const FeedBack = ({ onClose, briefing, user }) => {
  const [commentaire, setCommentaire] = useState("")
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/avis/${briefing.idBriefing}`)
      setFeedbacks(response.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des feedbacks :", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const onSubmit = async () => {
    try {
      setSending(true)
      await api.post("/avis", {
        commentaire,
        idBriefing: briefing.idBriefing,
      })
      setCommentaire("")
      fetchFeedbacks()
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback :", error)
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/avis/${id}`)
      fetchFeedbacks()
    } catch (error) {
      console.error("Erreur lors de la suppression du feedback :", error)
    }
  }

  const handleSubmit = () => {
    if (commentaire.trim()) onSubmit()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all duration-300 scale-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            <X size={20} className="text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Avis sur le briefing</h2>
              <p className="text-blue-100 mt-1">{briefing.nomBriefing}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats section */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">
                  {feedbacks.length} {feedbacks.length > 1 ? "avis" : "avis"}
                </span>
              </div>
              <div className="text-xs text-gray-500">Partagez votre opinion</div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : feedbacks.length > 0 ? (
              feedbacks.map((fb, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg shadow-sm">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 text-sm leading-relaxed break-words mb-2">{fb.commentaire}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                              {fb.nomUtilisateur}
                            </span>
                          </div>
                        </div>
                      </div>

                      {user.id === fb.idUtilisateur && (
                        <button
                          onClick={() => handleDelete(fb.id)}
                          className="flex-shrink-0 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 group/delete"
                        >
                          <Trash className="w-4 h-4 text-red-500 group-hover/delete:text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm font-medium">Aucun avis pour le moment</p>
                  <p className="text-gray-400 text-xs mt-1">Soyez le premier à partager votre opinion</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <input
              type="text"
              placeholder="Partagez votre avis..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              disabled={sending}
            />
            <button
              onClick={handleSubmit}
              disabled={!commentaire.trim() || sending}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium transition-all duration-200 shadow-lg ${
                sending || !commentaire.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              <Send className="w-4 h-4" />
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedBack
