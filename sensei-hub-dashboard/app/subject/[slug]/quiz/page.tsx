"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { ArrowLeft, ListChecks, CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { useLanguage } from "@/lib/i18n"
import { useUserProgress } from "@/components/user-progress-provider"
import { recordActivity } from "@/lib/activity"
import { cn } from "@/lib/utils"
import {
  pickText,
  saveQuizResult,
  getBestScore,
  type Quiz,
  type QuizQuestion,
  type QuizSet,
  type QuizResultRecord,
} from "@/lib/quiz"

type Phase = "set-selection" | "intro" | "playing" | "done"

export default function SubjectQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t, lang } = useLanguage()
  const { subjects } = useUserProgress()
  const subject = subjects.find((s) => s.slug === slug)

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [status, setStatus] = useState<"loading" | "missing" | "ready">("loading")
  const [selectedSet, setSelectedSet] = useState<QuizSet | null>(null)
  const [phase, setPhase] = useState<Phase>("intro")
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [best, setBest] = useState<QuizResultRecord | null>(null)
  const [activeTab, setActiveTab] = useState<"part-a" | "part-b">("part-a")

  useEffect(() => {
    let active = true
    setStatus("loading")
    fetch(`/api/subject/${slug}/quiz`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Quiz | null) => {
        if (!active) return
        if (
          data &&
          ((Array.isArray(data.questions) && data.questions.length > 0) ||
            (Array.isArray(data.sets) && data.sets.length > 0))
        ) {
          setQuiz(data)
          if (data.sets && data.sets.length > 0) {
            setPhase("set-selection")
          }
          setStatus("ready")
        } else {
          setStatus("missing")
        }
      })
      .catch(() => active && setStatus("missing"))
    return () => {
      active = false
    }
  }, [slug])

  useEffect(() => {
    if (!quiz) return
    if (quiz.sets && selectedSet) {
      setBest(getBestScore(slug, selectedSet.id))
    } else {
      setBest(getBestScore(slug))
    }
  }, [slug, quiz, selectedSet, phase])

  const questions = selectedSet ? selectedSet.questions : (quiz?.questions || [])
  const total = questions.length
  const score = quiz ? answers.filter((a, i) => a === questions[i]?.answer).length : 0

  const hasCategories = quiz?.sets?.some((set) => set.category) ?? false
  const filteredSets = quiz?.sets
    ? hasCategories
      ? quiz.sets.filter((set) => set.category === activeTab)
      : quiz.sets
    : []

  const start = () => {
    setPhase("playing")
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setAnswers([])
  }

  const submit = () => {
    if (selected === null) return
    setRevealed(true)
    setAnswers((prev) => {
      const next = [...prev]
      next[current] = selected
      return next
    })
  }

  const next = () => {
    if (!quiz) return
    if (current < total - 1) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      const finalScore = answers.filter((a, i) => a === questions[i]?.answer).length
      saveQuizResult({ slug, score: finalScore, total, ts: Date.now() }, selectedSet?.id)
      recordActivity()
      setPhase("done")
      if (total > 0 && finalScore / total >= 0.8) {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.7 },
          colors: ["#22d3ee", "#8b5cf6", "#f43f5e", "#10b981"],
        })
      }
    }
  }

  const q = questions[current]

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
            {/* Back button */}
            {selectedSet ? (
              <button
                onClick={() => {
                  setSelectedSet(null)
                  setPhase("set-selection")
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("quiz.back_to_sets")}
              </button>
            ) : (
              <Link
                href={`/subject/${slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("lesson.back_to_subject")} {subject?.name ?? ""}
              </Link>
            )}

            {/* Loading */}
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400" />
                <p className="text-sm text-white/50 font-mono">{t("common.loading")}</p>
              </div>
            )}

            {/* No quiz available */}
            {status === "missing" && (
              <div className="glass-card border border-white/10 rounded-2xl p-10 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                  <ListChecks className="h-8 w-8 text-cyan-300" />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                  {t("quiz.coming_soon_title")}
                </h1>
                <p className="text-sm text-white/60 max-w-md mx-auto">{t("quiz.coming_soon_desc")}</p>
              </div>
            )}

            {/* Selection Screen (Multiple Sets) */}
            {status === "ready" && quiz && quiz.sets && !selectedSet && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card border border-white/10 rounded-2xl p-6 lg:p-8 space-y-3 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                    <ListChecks className="h-7 w-7 text-cyan-300" />
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white mt-2">
                    {pickText(quiz.title, lang)}
                  </h1>
                  <p className="text-sm text-white/60 max-w-md mx-auto">
                    {t("quiz.select_set")}
                  </p>
                </div>

                {/* Category Tabs */}
                {hasCategories && (
                  <div className="flex justify-center">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex gap-1">
                      <button
                        onClick={() => setActiveTab("part-a")}
                        className={cn(
                          "px-4 py-1.5 text-sm font-bold rounded-lg transition-all",
                          activeTab === "part-a"
                            ? "bg-white/10 text-cyan-400 shadow-sm"
                            : "text-white/60 hover:text-white"
                        )}
                      >
                        {t("quiz.part_a")}
                      </button>
                      <button
                        onClick={() => setActiveTab("part-b")}
                        className={cn(
                          "px-4 py-1.5 text-sm font-bold rounded-lg transition-all",
                          activeTab === "part-b"
                            ? "bg-white/10 text-cyan-400 shadow-sm"
                            : "text-white/60 hover:text-white"
                        )}
                      >
                        {t("quiz.part_b")}
                      </button>
                    </div>
                  </div>
                )}

                {filteredSets.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredSets.map((set) => {
                      const setBest = getBestScore(slug, set.id)
                      return (
                        <motion.button
                          key={set.id}
                          whileHover={{ y: -4, scale: 1.01 }}
                          onClick={() => {
                            setSelectedSet(set)
                            setPhase("intro")
                          }}
                          className="glass-card border border-white/10 hover:border-cyan-500/30 rounded-2xl p-5 text-left flex flex-col justify-between space-y-4 hover:bg-white/[0.02] transition-colors group"
                        >
                          <div className="space-y-2 w-full">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-base leading-tight">
                                {pickText(set.title, lang)}
                              </h3>
                              {setBest ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/20 font-mono flex-shrink-0">
                                  <Trophy className="h-3 w-3" />
                                  {setBest.score}/{setBest.total}
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/50 border border-white/10 font-mono flex-shrink-0">
                                  {t("quiz.unattempted")}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                              {pickText(set.description, lang)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono w-full">
                            <span className="text-cyan-200/70">
                              {set.questions.length} {t("quiz.questions")}
                            </span>
                            <span className="inline-flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                              {t("action.start")} <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="glass-card border border-white/10 rounded-2xl p-10 text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                      <ListChecks className="h-8 w-8 text-cyan-300" />
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                      {t("quiz.coming_soon_title")}
                    </h2>
                    <p className="text-sm text-white/60 max-w-md mx-auto">{t("quiz.coming_soon_desc")}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Intro (Single quiz, or selected set intro) */}
            {status === "ready" && quiz && (!quiz.sets || selectedSet) && phase === "intro" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card border border-white/10 rounded-2xl p-8 lg:p-10 text-center space-y-5"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                  <ListChecks className="h-8 w-8 text-cyan-300" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                  {selectedSet ? pickText(selectedSet.title, lang) : pickText(quiz.title, lang)}
                </h1>
                <p className="text-sm text-white/60">
                  {selectedSet ? pickText(selectedSet.description, lang) : t("quiz.intro")}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-cyan-200/70 font-mono">
                  <span>
                    {total} {t("quiz.questions")}
                  </span>
                  {best && (
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-amber-300" />
                      {t("quiz.best_score")}: {best.score}/{best.total}
                    </span>
                  )}
                </div>
                <button
                  onClick={start}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-opacity"
                >
                  {t("quiz.start")}
                </button>
              </motion.div>
            )}

            {/* Playing */}
            {status === "ready" && quiz && phase === "playing" && q && (
              <div className="space-y-5">
                {/* Progress */}
                <div className="flex items-center justify-between text-xs font-mono text-white/50">
                  <span>
                    {t("quiz.question")} {current + 1} / {total}
                  </span>
                  <span>{score} ✓</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(current / total) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="glass-card border border-white/10 rounded-2xl p-6 lg:p-8 space-y-5"
                  >
                    <h2 className="text-lg lg:text-xl font-bold text-white leading-relaxed">
                      {pickText(q.question, lang)}
                    </h2>

                    <div className="space-y-3">
                      {q.options.map((opt, idx) => {
                        const isCorrect = idx === q.answer
                        const isChosen = idx === selected
                        let state = "idle"
                        if (revealed) {
                          if (isCorrect) state = "correct"
                          else if (isChosen) state = "wrong"
                        } else if (isChosen) {
                          state = "chosen"
                        }
                        return (
                          <button
                            key={idx}
                            disabled={revealed}
                            onClick={() => setSelected(idx)}
                            className={cn(
                              "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                              state === "idle" && "border-white/10 bg-white/5 hover:bg-white/10 text-white/85",
                              state === "chosen" && "border-cyan-400/50 bg-cyan-500/10 text-white",
                              state === "correct" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
                              state === "wrong" && "border-rose-500/40 bg-rose-500/10 text-rose-200",
                            )}
                          >
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-white/15 text-xs font-mono">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1">{pickText(opt, lang)}</span>
                            {revealed && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                            {revealed && state === "wrong" && <XCircle className="h-5 w-5 text-rose-400" />}
                          </button>
                        )
                      })}
                    </div>

                    {/* Explanation */}
                    {revealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75"
                      >
                        <span className="font-bold text-cyan-300">{t("quiz.explanation")}: </span>
                        {pickText(q.explanation, lang)}
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end pt-1">
                      {!revealed ? (
                        <button
                          onClick={submit}
                          disabled={selected === null}
                          className={cn(
                            "rounded-xl px-6 py-2.5 text-sm font-bold transition-all",
                            selected === null
                              ? "bg-white/5 text-white/30 cursor-not-allowed"
                              : "text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90",
                          )}
                        >
                          {t("quiz.submit")}
                        </button>
                      ) : (
                        <button
                          onClick={next}
                          className="rounded-xl px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-opacity"
                        >
                          {current < total - 1 ? t("quiz.next") : t("quiz.finish")}
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Done */}
            {status === "ready" && quiz && phase === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card border border-white/10 rounded-2xl p-8 lg:p-10 text-center space-y-5"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                  <Trophy className="h-10 w-10 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wider text-white/50 font-mono">
                    {t("quiz.your_score")}
                  </p>
                  <p className="text-5xl font-extrabold text-white mt-1">
                    {score}
                    <span className="text-2xl text-white/40">/{total}</span>
                  </p>
                </div>
                <p className="text-sm text-white/65">
                  {score / total >= 0.8
                    ? t("quiz.result_great")
                    : score / total >= 0.5
                      ? t("quiz.result_good")
                      : t("quiz.result_retry")}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    onClick={start}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-opacity"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t("quiz.retry")}
                  </button>
                  {quiz.sets ? (
                    <button
                      onClick={() => {
                        setSelectedSet(null)
                        setPhase("set-selection")
                      }}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      {t("quiz.back_to_sets")}
                    </button>
                  ) : (
                    <Link
                      href={`/subject/${slug}`}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      {t("lesson.back")}
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
