"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home, Play, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { computeSubjectStats, type Subject } from "@/lib/subjects"
import { useLanguage } from "@/lib/i18n"
import { ThreePlanet } from "./three-planet"

export function SubjectHeader({ subject }: { subject: Subject }) {
  const { t } = useLanguage()
  const Icon = subject.icon
  const stats = computeSubjectStats(subject)

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 text-xs text-white/50"
      >
        <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
          <Home className="h-3 w-3" />
          {t("nav.dashboard")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white/70">{t("nav.subjects")}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white font-medium">{subject.name}</span>
      </motion.div>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl glass-card border border-white/10"
      >
        {/* Background gradient blob */}
        <div
          className={cn(
            "absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-40 bg-gradient-to-br",
            subject.colorFrom,
            subject.colorTo,
          )}
        />
        <div
          className={cn(
            "absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 bg-gradient-to-br",
            subject.colorFrom,
            subject.colorTo,
          )}
        />

        <div className="relative p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <ThreePlanet slug={subject.slug} size={100} />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/70">
                    {subject.level}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-mono uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    Active
                  </div>
                </div>
                <p className="text-xs text-white/50 font-mono tracking-wider truncate max-w-[280px] lg:max-w-md">
                  {subject.fullName}
                </p>
              </div>
            </div>

            <h1 className={cn(
              "text-3xl lg:text-5xl font-extrabold tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-r",
              subject.colorFrom,
              subject.colorTo
            )}>
              {subject.name}
            </h1>
            <p
              className={cn(
                "mt-2 text-base lg:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r",
                subject.colorFrom,
                subject.colorTo,
              )}
            >
              {subject.tagline}
            </p>
            <p className="mt-3.5 text-sm text-slate-300 leading-relaxed max-w-2xl text-pretty">
              {subject.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                className={cn(
                  "group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 bg-gradient-to-r",
                  subject.colorFrom,
                  subject.colorTo,
                )}
              >
                <Play className="h-4 w-4 fill-white" />
                {t("action.resume")}
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                {t("action.view_all")}
              </button>
            </div>
          </div>

          {/* Big progress ring */}
          <div className="hidden lg:flex items-center justify-center">
            <ProgressRing progress={stats.progress} colorFrom={subject.colorFrom} colorTo={subject.colorTo} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ProgressRing({
  progress,
  colorFrom,
  colorTo,
}: {
  progress: number
  colorFrom: string
  colorTo: string
}) {
  const size = 180
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  // Map tailwind colors to hex for SVG gradient
  const colorMap: Record<string, string> = {
    "from-orange-400": "#fb923c",
    "from-pink-500": "#ec4899",
    "from-emerald-400": "#34d399",
    "from-cyan-400": "#22d3ee",
    "from-violet-500": "#8b5cf6",
    "from-blue-500": "#3b82f6",
    "from-yellow-400": "#facc15",
    "from-red-500": "#ef4444",
    "to-amber-500": "#f59e0b",
    "to-rose-500": "#f43f5e",
    "to-green-500": "#22c55e",
    "to-teal-500": "#14b8a6",
    "to-purple-600": "#9333ea",
    "to-indigo-600": "#4f46e5",
    "to-orange-500": "#f97316",
  }

  const startColor = colorMap[colorFrom] ?? "#22d3ee"
  const endColor = colorMap[colorTo] ?? "#a855f7"

  return (
    <div className="relative">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 12px ${startColor}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest">Progress</span>
        <span className="text-4xl font-bold text-white tracking-tight">{progress}%</span>
        <span className="text-[10px] text-white/40 font-mono mt-1">Keep going</span>
      </div>
    </div>
  )
}
