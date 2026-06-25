"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Flame, Zap, CheckCircle2, CalendarDays, BarChart3, ChevronRight } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/i18n"
import { useUserProgress } from "@/components/user-progress-provider"
import { getActivityDays, getStreak, getXp } from "@/lib/activity"
import { buildStreakHeatmap, countActiveInRange } from "@/lib/streak-heatmap"
import { cn } from "@/lib/utils"

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  accent: string
}) {
  return (
    <div className="glass-card border border-white/10 rounded-2xl p-4 flex items-center gap-3">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", accent)}>{icon}</div>
      <div className="min-w-0">
        <div className="text-lg font-extrabold text-white leading-tight">{value}</div>
        <div className="text-[11px] text-white/50 truncate">{label}</div>
      </div>
    </div>
  )
}

export default function ProgressPage() {
  const { t, lang } = useLanguage()
  const { subjects, overallStats } = useUserProgress()
  const [days, setDays] = useState<string[]>([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setDays(getActivityDays())
    setStreak(getStreak())
  }, [])

  const weeks = useMemo(() => buildStreakHeatmap(days, new Date(), 182), [days])
  const studyDays = useMemo(() => countActiveInRange(weeks), [weeks])
  const xp = getXp(overallStats.completedLessons)

  // 学習した教科のみ（progress>0）を上位に、進捗降順で表示。
  const ranked = useMemo(
    () => [...subjects].sort((a, b) => b.progress - a.progress),
    [subjects],
  )

  const dow = lang === "ja" ? ["日", "月", "火", "水", "木", "金", "土"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
      </div>

      <Sidebar />

      <div className="relative z-10 lg:ml-72 min-h-screen flex flex-col">
        <TopBar />

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <header className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/20 border border-cyan-400/30">
                <BarChart3 className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight">{t("progress.title")}</h1>
                <p className="text-xs text-white/50">{t("progress.subtitle")}</p>
              </div>
            </header>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                icon={<Flame className="h-5 w-5 text-orange-300" />}
                label={t("progress.streak")}
                value={`${streak} ${t("streak.days")}`}
                accent="bg-orange-500/15"
              />
              <StatCard
                icon={<CheckCircle2 className="h-5 w-5 text-emerald-300" />}
                label={t("progress.completed")}
                value={overallStats.completedLessons}
                accent="bg-emerald-500/15"
              />
              <StatCard
                icon={<Zap className="h-5 w-5 text-yellow-300" />}
                label="XP"
                value={xp}
                accent="bg-yellow-500/15"
              />
              <StatCard
                icon={<CalendarDays className="h-5 w-5 text-cyan-300" />}
                label={t("progress.study_days")}
                value={studyDays}
                accent="bg-cyan-500/15"
              />
            </div>

            {/* Streak heatmap */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white">{t("progress.heatmap_title")}</h2>
                <span className="text-[11px] text-white/40">{t("progress.last_6_months")}</span>
              </div>

              {/* 横スクロールでどの画面幅でも崩れない */}
              <div className="overflow-x-auto scrollbar-thin pb-1">
                <div className="flex gap-[3px] min-w-max">
                  {/* 曜日ラベル列 */}
                  <div className="flex flex-col gap-[3px] pr-1 text-[9px] text-white/30 justify-around">
                    {dow.map((d, i) => (
                      <span key={i} className="h-[12px] leading-[12px]">
                        {i % 2 === 1 ? d : ""}
                      </span>
                    ))}
                  </div>
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((cell, di) => (
                        <div
                          key={di}
                          title={cell.inRange ? `${cell.date}${cell.active ? " ✓" : ""}` : ""}
                          className={cn(
                            "h-[12px] w-[12px] rounded-[3px]",
                            !cell.inRange
                              ? "bg-transparent"
                              : cell.active
                                ? "bg-gradient-to-br from-cyan-400 to-emerald-400 shadow-[0_0_6px_rgba(34,211,238,0.4)]"
                                : "bg-white/[0.06] border border-white/5",
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-white/40">
                <span>{t("progress.less")}</span>
                <span className="h-[10px] w-[10px] rounded-[3px] bg-white/[0.06] border border-white/5" />
                <span className="h-[10px] w-[10px] rounded-[3px] bg-cyan-400/40" />
                <span className="h-[10px] w-[10px] rounded-[3px] bg-gradient-to-br from-cyan-400 to-emerald-400" />
                <span>{t("progress.more")}</span>
              </div>
            </motion.section>

            {/* Per-subject progress */}
            <section className="glass-card border border-white/10 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4">{t("progress.by_subject")}</h2>
              <div className="space-y-3">
                {ranked.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/subject/${s.slug}`}
                    className="group block rounded-xl p-2 -mx-2 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="text-xs font-semibold text-white/85 truncate flex items-center gap-1.5">
                        {s.name}
                        <ChevronRight className="h-3 w-3 text-white/20 group-hover:text-white/50 transition-colors" />
                      </span>
                      <span className="text-[11px] font-mono text-white/50 shrink-0">
                        {s.completedLessons}/{s.totalLessons} · {s.progress}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full bg-gradient-to-r", s.colorFrom, s.colorTo)}
                        style={{ width: `${Math.min(100, Math.max(0, s.progress))}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
