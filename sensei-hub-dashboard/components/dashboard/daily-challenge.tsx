"use client"

import { motion } from "framer-motion"
import { Target, Timer, Coins, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export function DailyChallenge() {
  const { t } = useLanguage()

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-fuchsia-600/30 via-purple-700/20 to-indigo-900/30 border border-white/10"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 blur-3xl opacity-30" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 blur-3xl opacity-30" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 blur-md opacity-70" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 via-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/40">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-pink-200/80 font-bold">
                {t("section.challenge")}
              </div>
              <h3 className="text-base font-bold text-white">{t("challenge.title")}</h3>
            </div>
          </div>
          <span className="px-2 py-1 rounded-md bg-pink-500/20 text-pink-200 text-[10px] font-mono font-bold uppercase tracking-wider">
            {t("challenge.difficulty")}
          </span>
        </div>

        {/* Code preview */}
        <div className="mb-5 rounded-2xl bg-slate-950/60 border border-white/5 p-4 font-mono text-[11px] leading-relaxed">
          <div className="text-white/40">{"// Find two numbers that add up to target"}</div>
          <div className="text-cyan-300">
            function <span className="text-yellow-300">twoSum</span>
            <span className="text-white/80">(nums, target) {"{"}</span>
          </div>
          <div className="pl-4 text-pink-300">
            const <span className="text-white">map = </span>
            <span className="text-cyan-300">new</span> <span className="text-emerald-300">Map</span>
            <span className="text-white">()</span>
          </div>
          <div className="pl-4 text-white/30">{"// your solution here..."}</div>
          <div className="text-white/80">{"}"}</div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs text-white/90 font-bold">+150</span>
              <span className="text-[10px] text-white/50">{t("challenge.reward")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-white/90 font-bold">15</span>
              <span className="text-[10px] text-white/50">{t("challenge.time")}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full group relative overflow-hidden rounded-2xl py-3 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <span>{t("action.start")}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}
