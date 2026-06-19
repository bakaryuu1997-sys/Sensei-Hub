"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Flame, Zap, CheckCircle2, Activity } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { useUserProgress } from "@/components/user-progress-provider"
import { getStreak, getXp } from "@/lib/activity"

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null
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
      <polyline points={`${points} 80,28 0,28`} fill={color} opacity="0.15" />
    </svg>
  )
}

export function StatsRow() {
  const { t } = useLanguage()
  const { overallStats: overall } = useUserProgress()
  const [streak, setStreak] = useState(0)

  // streak は localStorage 依存なのでマウント後に読む（ハイドレーション不一致回避）
  useEffect(() => {
    setStreak(getStreak())
  }, [overall.completedLessons])

  const stats = [
    {
      label: t("stats.streak"),
      value: `${streak}`,
      gradient: "from-orange-400 via-pink-500 to-rose-500",
      shadowColor: "shadow-orange-500/40",
      Icon: Flame,
      sparkline: overall.perSubjectProgress,
      gradId: "grad-0",
      from: "#fb923c",
      to: "#f43f5e",
    },
    {
      label: t("stats.lessons"),
      value: `${overall.completedLessons}`,
      gradient: "from-emerald-400 via-teal-500 to-cyan-500",
      shadowColor: "shadow-emerald-500/40",
      Icon: CheckCircle2,
      sparkline: overall.perSubjectProgress,
      gradId: "grad-1",
      from: "#34d399",
      to: "#06b6d4",
    },
    {
      label: t("stats.xp"),
      value: `${getXp(overall.completedLessons)}`,
      gradient: "from-cyan-400 via-blue-500 to-purple-500",
      shadowColor: "shadow-blue-500/40",
      Icon: Zap,
      sparkline: overall.perSubjectProgress,
      gradId: "grad-2",
      from: "#22d3ee",
      to: "#a855f7",
    },
    {
      label: t("stats.progress"),
      value: `${overall.averageProgress}%`,
      gradient: "from-yellow-400 via-amber-500 to-orange-500",
      shadowColor: "shadow-yellow-500/40",
      Icon: Activity,
      sparkline: overall.perSubjectProgress,
      gradId: "grad-3",
      from: "#fbbf24",
      to: "#f97316",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="group relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-xl"
          suppressHydrationWarning
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
            </div>

            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight leading-none drop-shadow-sm">{stat.value}</div>
                <div className="text-[11px] text-cyan-100/70 mt-2 font-medium tracking-wide uppercase">{stat.label}</div>
              </div>
              <Sparkline data={stat.sparkline} color={`url(#${stat.gradId})`} />
            </div>

            {/* SVG gradient defs */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id={stat.gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={stat.from} />
                  <stop offset="100%" stopColor={stat.to} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
