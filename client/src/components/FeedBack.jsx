import React, { useState } from "react";
import { User, Send, X, Star } from "lucide-react";
import api from "../services/api";
import { useEffect } from "react";

const FeedBack = ({onClose, briefing }) => {
  const [commentaire, setCommentaire] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get(`/avis/${briefing.idbriefing}`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des feedbacks :", error);
    }
  }

  useEffect(()=>{
    fetchFeedbacks();
  },[])

  const onSubmit = async() => {
    // Logique pour envoyer le feedback au serveur ou le traiter
    try {
        const response = await api.post("/avis", { commentaire, idBriefing: briefing.idbriefing });
        let newFeedback = response.data;
        fetchFeedbacks()
    } catch (error) {
        console.error("Erreur lors de l'envoi du feedback :", error);
    }
  }

  const handleSubmit = () => {
    if (commentaire.trim()) {
      onSubmit();
      setCommentaire("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl w-full max-w-md shadow-2xl border border-white/20 relative flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-800 flex items-center"><Star className="mr-2" /> Feedback</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Liste des avis */}
        <div className="max-h-64 overflow-y-auto flex flex-col gap-3">
          {feedbacks.length > 0 ? (
            feedbacks.map((fb, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl shadow-sm">
                <div className="p-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">{fb.commentaire}</p>
                  <span className="text-gray-400 text-xs">{fb.nomUtilisateur}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Aucun feedback pour le moment.</p>
          )}
        </div>

        {/* Formulaire */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            placeholder="Votre avis..."
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            <Send className="w-4 h-4" />
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedBack;
