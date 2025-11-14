"use client";

import React,{ useState, useEffect, useCallback, useRef } from "react";
import { User, Send, X, Star, Trash, MessageCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import FeedbackService from "../../services/FeedBackService";

const FeedBack = React.memo(({ onClose, briefing, user }) => {
  const [commentaire, setCommentaire] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/avis/${briefing.idBriefing}`);
      setFeedbacks(response.data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des feedbacks :", error);
      FeedbackService.error("Impossible de charger les avis");
    } finally {
      setLoading(false);
    }
  }, [briefing.idBriefing]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [feedbacks]);

  const onSubmit = async () => {
    if (!commentaire.trim() || sending) return;

    try {
      setSending(true);
      await api.post("/avis", {
        commentaire: commentaire.trim(),
        idBriefing: briefing.idBriefing,
      });
      setCommentaire("");
      fetchFeedbacks();
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback :", error);
      FeedbackService.error("Échec de l'envoi");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/avis/${id}`);
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
      FeedbackService.success("Avis supprimé");
    } catch (error) {
      console.error("Erreur suppression :", error);
      FeedbackService.error("Échec suppression");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg"
              >
                <Star className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">Avis sur le briefing</h2>
                <p className="text-indigo-100 text-sm mt-1 line-clamp-1">{briefing.nomBriefing}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-700">
                {feedbacks.length} {feedbacks.length > 1 ? "avis" : "avis"}
              </span>
            </div>
            <span className="text-xs text-gray-500">Partagez votre avis</span>
          </div>
        </div>

        {/* Feedbacks List */}
        <div
          ref={scrollRef}
          className="max-h-96 overflow-y-auto p-4 space-y-3 custom-scrollbar"
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center py-12"
              >
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </motion.div>
            ) : feedbacks.length > 0 ? (
              feedbacks.map((fb, idx) => (
                <motion.div
                  key={fb.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-sm">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 text-sm leading-relaxed break-words">
                            {fb.commentaire}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                              {fb.nomUtilisateur}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(fb.dateAvis).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {user.idutilisateur === fb.idUtilisateur && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(fb.id)}
                          className="flex-shrink-0 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          aria-label="Supprimer"
                        >
                          <Trash className="w-4 h-4 text-red-500 hover:text-red-600" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border border-gray-100">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Aucun avis</p>
                  <p className="text-gray-400 text-xs mt-1">Soyez le premier à commenter</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="p-4 bg-gradient-to-t from-gray-50/50 to-transparent border-t border-gray-100">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Écrivez votre avis..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
              disabled={sending}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSubmit}
              disabled={!commentaire.trim() || sending}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-medium transition-all duration-200 shadow-lg ${
                !commentaire.trim() || sending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
              }`}
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {sending ? "Envoi..." : "Envoyer"}
            </motion.button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Appuyez sur <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Entrée</kbd> pour envoyer
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
});

FeedBack.displayName = "FeedBack";
export default FeedBack;