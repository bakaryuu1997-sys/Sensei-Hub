"use client"

import { motion } from "framer-motion"
import { Flame, Trophy, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

type Stat = {
  labelKey: string
  value: string
  trend: string
  gradient: string
  shadowColor: string
  Icon: typeof Flame
  sparkline: number[]
}

const stats: Stat[] = [
  {
    labelKey: "stats.streak",
    value: "12",
    trend: "+2",
    gradient: "from-orange-400 via-pink-500 to-rose-500",
    shadowColor: "shadow-orange-500/40",
    Icon: Flame,
    sparkline: [3, 5, 4, 7, 6, 8, 12],
  },
  {
    labelKey: "stats.xp",
    value: "8,450",
    trend: "+24%",
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
    shadowColor: "shadow-yellow-500/40",
    Icon: Trophy,
    sparkline: [4, 6, 5, 8, 7, 10, 12],
  },
  {
    labelKey: "stats.lessons",
    value: "148",
    trend: "+8",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    shadowColor: "shadow-emerald-500/40",
    Icon: CheckCircle2,
    sparkline: [5, 4, 6, 5, 7, 8, 9],
  },
  {
    labelKey: "stats.hours",
    value: "342h",
    trend: "+12h",
    gradient: "from-cyan-400 via-blue-500 to-purple-500",
    shadowColor: "shadow-blue-500/40",
    Icon: Clock,
    sparkline: [2, 4, 3, 6, 5, 7, 8],
  },
]

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 80
      const y = 24 - ((v - min) / range) * 20
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width="80" height="28" className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline
        points={`${points} 80,28 0,28`}
        fill={color}
        opacity="0.15"
      />
    </svg>
  )
}

export function StatsRow() {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.labelKey}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="group relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-xl"
        >
          {/* Decorative glow */}
          <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} blur-2xl opacity-30 group-hover:opacity-60 transition-opacity`} />

          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div
                className={`relative w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadowColor}`}
              >
                <stat.Icon className="w-5 h-5 text-white drop-shadow" />
              </div>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300">
                <TrendingUp className="w-2.5 h-2.5" />
                <span className="text-[10px] font-mono font-bold">{stat.trend}</span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="text-3xl font-bold text-white tracking-tight leading-none">{stat.value}</div>
                <div className="text-[11px] text-white/50 mt-1.5 font-medium">{t(stat.labelKey)}</div>
              </div>
              <Sparkline data={stat.sparkline} color={`url(#grad-${i})`} />
            </div>

            {/* SVG gradient defs */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={
                    i === 0 ? "#fb923c" : i === 1 ? "#fbbf24" : i === 2 ? "#34d399" : "#22d3ee"
                  } />
                  <stop offset="100%" stopColor={
                    i === 0 ? "#f43f5e" : i === 1 ? "#f97316" : i === 2 ? "#06b6d4" : "#a855f7"
                  } />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
