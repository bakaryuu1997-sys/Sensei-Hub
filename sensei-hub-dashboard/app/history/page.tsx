"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { History as HistoryIcon, BookOpen, ListChecks, Flame, Zap } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/i18n"
import { useUserProgress } from "@/components/user-progress-provider"
import { getLessonHistory, getStreak, getXp, type LessonHistoryItem } from "@/lib/activity"
import { getQuizResults, type QuizResultRecord } from "@/lib/quiz"

function timeAgo(ts: number, lang: string): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return lang === "ja" ? "たった今" : lang === "vi" ? "vừa xong" : "just now"
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export default function HistoryPage() {
  const { t, lang } = useLanguage()
  const { subjects, overallStats } = useUserProgress()
  const [lessons, setLessons] = useState<LessonHistoryItem[]>([])
  const [quizzes, setQuizzes] = useState<QuizResultRecord[]>([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setLessons(getLessonHistory())
    setQuizzes([...getQuizResults()].reverse().slice(0, 20))
    setStreak(getStreak())
  }, [])

  const subjectName = (slug: string) => subjects.find((s) => s.slug === slug.split("/")[0])?.name ?? slug

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
      </div>

      <Sidebar />

      <div className="relative z-10 lg:ml-72 min-h-screen flex flex-col">
        <TopBar />

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                <HistoryIcon className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">{t("history.title")}</h1>
                <p className="text-sm text-white/50">{t("history.subtitle")}</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <Stat icon={<Flame className="h-4 w-4 text-orange-300" />} value={`${streak}`} label={t("stats.streak")} />
              <Stat icon={<Zap className="h-4 w-4 text-cyan-300" />} value={`${getXp(overallStats.completedLessons)}`} label={t("stats.xp")} />
              <Stat icon={<ListChecks className="h-4 w-4 text-purple-300" />} value={`${quizzes.length}`} label={t("history.quiz_results")} />
            </div>

            {/* Recent lessons */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/60">{t("history.recent_lessons")}</h2>
              {lessons.length === 0 ? (
                <p className="text-sm text-white/40">{t("history.empty")}</p>
              ) : (
                <div className="space-y-2">
                  {lessons.map((l) => (
                    <motion.div key={`${l.slug}/${l.path}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <Link
                        href={`/subject/${l.slug}/lesson/${l.path}`}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] transition-colors"
                      >
                        <BookOpen className="h-4 w-4 flex-shrink-0 text-cyan-300" />
                        <span className="flex-1 truncate text-sm text-white/85">{l.title}</span>
                        <span className="text-xs text-white/35 font-mono">{timeAgo(l.ts, lang)}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Quiz results */}
            {quizzes.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/60">{t("history.quiz_results")}</h2>
                <div className="space-y-2">
                  {quizzes.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <ListChecks className="h-4 w-4 flex-shrink-0 text-purple-300" />
                      <span className="flex-1 truncate text-sm text-white/85">{subjectName(r.slug)}</span>
                      <span className="text-sm font-bold text-white">{r.score}/{r.total}</span>
                      <span className="text-xs text-white/35 font-mono">{timeAgo(r.ts, lang)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 text-center">
      <div className="flex items-center justify-center mb-1">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-[10px] text-white/50 uppercase tracking-wider">{label}</div>
    </div>
  )
}
