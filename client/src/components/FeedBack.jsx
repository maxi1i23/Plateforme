import React, { useState, useEffect } from "react";
import { User, Send, X, Star, Trash } from "lucide-react";
import api from "../services/api";

const FeedBack = ({ onClose, briefing, user }) => {
  const [commentaire, setCommentaire] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/avis/${briefing.idbriefing}`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des feedbacks :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const onSubmit = async () => {
    try {
      setSending(true);
      await api.post("/avis", {
        commentaire,
        idBriefing: briefing.idbriefing,
      });
      setCommentaire("");
      fetchFeedbacks();
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback :", error);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/avis/${id}`);
      fetchFeedbacks();
    } catch (error) {
      console.error("Erreur lors de la suppression du feedback :", error);
    }
  };

  const handleSubmit = () => {
    if (commentaire.trim()) onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative bg-white/95 backdrop-blur-lg p-6 rounded-2xl w-full max-w-md shadow-xl border border-gray-100 flex flex-col gap-5 animate-fadeIn">

        {/* --- HEADER --- */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Avis sur le briefing
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* --- LISTE DES AVIS --- */}
        <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <p className="text-center text-gray-400 text-sm">Chargement...</p>
          ) : feedbacks.length > 0 ? (
            feedbacks.map((fb, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 p-1.5 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 text-sm leading-snug break-words">
                      {fb.commentaire}
                    </p>
                    <span className="text-gray-400 text-xs">
                      {fb.nomUtilisateur}
                    </span>
                  </div>
                </div>

                {user.id === fb.idUtilisateur && (
                  <button
                    onClick={() => handleDelete(fb.id)}
                    className="ml-2 flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <Trash className="w-4 h-4 text-red-500 hover:text-red-600" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm italic">
              Aucun avis pour le moment.
            </p>
          )}
        </div>

        {/* --- INPUT --- */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            placeholder="Partagez votre avis..."
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            disabled={sending}
          />
          <button
            onClick={handleSubmit}
            disabled={!commentaire.trim() || sending}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 ${sending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 shadow-sm"
              }`}
          >
            <Send className="w-4 h-4" />
            {sending ? "..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedBack;
