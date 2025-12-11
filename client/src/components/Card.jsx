import { User } from "lucide-react";
import React from "react";

const Card = ({ title, value, Icon, bg, style }) => {
  return (
    <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer dark:bg-white/5 dark:shadow-2xl dark:shadow-indigo-900/20 dark:border-white/10 ">
      {/* Haut de la carte */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center text-white shadow-lg dark:bg-opacity-80 dark:ring-black/20`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right">
          <p className="fluoro text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {value ?? 0}
          </p>
        </div>
      </div>

      {/* Titre et sous-titre */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-indigo-600 transition-colors">
        {title || "Titre"}
      </h3>

      {/* Ligne d'accent en bas */}
      <div
        className={`mt-4 h-1 ${bg} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
      ></div>
    </div>
  );
};

export default Card;
