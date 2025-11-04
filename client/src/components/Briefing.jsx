"use client"
import { FileText, Calendar, User, X } from "lucide-react"

const Briefing = ({ briefing, setBriefing }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-200/50 relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="text-2xl font-bold text-white line-clamp-1">{briefing.nombriefing}</h5>
                <p className="text-gray-200 text-sm mt-1">Détails du briefing</p>
              </div>
            </div>
            <button
              onClick={() => setBriefing(null)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Card */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-gray-500 to-slate-600 rounded-lg shadow-md">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date de publication</p>
                <p className="text-gray-800 font-semibold">
                  {new Date(briefing.datebriefing).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <h6 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contenu du briefing</h6>
            <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-gray-700 leading-relaxed text-justify indent-8">{briefing.contenubriefing}</p>
            </div>
          </div>

          {/* Manager Info Card */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Publié par</p>
                <p className="text-gray-800 font-semibold">{briefing.nommanager}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default Briefing
