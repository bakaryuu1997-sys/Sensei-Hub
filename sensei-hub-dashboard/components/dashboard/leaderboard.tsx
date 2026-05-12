"use client"

import { motion } from "framer-motion"
import { Trophy, TrendingUp, Crown } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

const leaders = [
  { rank: 1, name: "Aiko Tanaka", xp: 14820, gradient: "from-yellow-400 to-amber-500", change: "+12" },
  { rank: 2, name: "Liam Chen", xp: 13540, gradient: "from-slate-300 to-slate-400", change: "+8" },
  { rank: 3, name: "Maya Patel", xp: 12180, gradient: "from-orange-400 to-amber-600", change: "+5" },
  { rank: 4, name: "You", xp: 8450, gradient: "from-cyan-400 to-purple-500", change: "+24", isYou: true },
  { rank: 5, name: "Hugo Silva", xp: 7920, gradient: "from-pink-400 to-rose-500", change: "+3" },
]

export function Leaderboard() {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base font-bold text-white">{t("section.leaderboard")}</h3>
        </div>
        <button className="text-xs text-white/50 hover:text-white transition-colors">{t("action.view_all")}</button>
      </div>

      <div className="space-y-2">
        {leaders.map((leader, i) => (
          <motion.div
            key={leader.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${
              leader.isYou
                ? "bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-400/30"
                : "hover:bg-white/5"
            }`}
          >
            {/* Rank */}
            <div className="w-7 flex justify-center">
              {leader.rank === 1 ? (
                <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ) : (
                <span
                  className={`text-sm font-mono font-bold ${
                    leader.rank === 2 ? "text-slate-300" : leader.rank === 3 ? "text-orange-400" : "text-white/40"
                  }`}
                >
                  #{leader.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${leader.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
              {leader.name[0]}
            </div>

            {/* Name + XP */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold truncate ${leader.isYou ? "text-cyan-300" : "text-white"}`}>
                  {leader.name}
                </span>
                {leader.isYou && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-400/20 text-cyan-200 uppercase">
                    You
                  </span>
                )}
              </div>
              <div className="text-[11px] text-white/40 font-mono">{leader.xp.toLocaleString()} XP</div>
            </div>

            {/* Change */}
            <div className="flex items-center gap-1 text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span className="text-[11px] font-mono font-bold">{leader.change}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
