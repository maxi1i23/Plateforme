import { FileText, X, Calendar, User, Clock } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const InfoDisplay = React.memo(({ info, setInfo, Icon = FileText }) => {
  if (!info) return null;

  const handleClose = () => setInfo(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-start gap-4 flex-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg"
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                  {info.title}
                </h2>
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {new Date(info.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Description</h3>
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed max-h-64 overflow-y-auto pr-2 custom-scrollbar"
              dangerouslySetInnerHTML={{ __html: info.description }}
            />
          </motion.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auteur */}
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-5 border border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Auteur</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{info.author}</p>
                </div>
              </div>
            </motion.div>

            {/* Date */}
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-indigo-200/50 dark:border-indigo-700/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-md">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Créée le</p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {new Date(info.date).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

InfoDisplay.displayName = "InfoDisplay";
export default InfoDisplay;