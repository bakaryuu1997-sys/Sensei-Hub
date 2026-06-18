# Git & GitHub Quiz Sets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrades the Git & GitHub quiz from a 5-question flat quiz to a structured set of 5 distinct exams, each containing 10 high-quality, practical questions, while maintaining backward compatibility for other subjects.

**Architecture:** Extend the TypeScript interfaces for quizzes to support `sets`. Modify local storage functions to support sub-keys per set (`slug/setId`). Add set selection rendering to the quiz page, showing each set's name, description, and best score. Replace the Git quiz JSON content with 5 thematic sets of 10 scenario-based questions.

**Tech Stack:** Next.js (React), TypeScript, Tailwind CSS, Lucide icons, Local Storage.

---

### Task 1: Update Quiz Data Models & Storage Helpers

**Files:**
- Modify: `sensei-hub-dashboard/lib/quiz.ts`

- [ ] **Step 1: Modify types and functions in `quiz.ts`**
  Update the code of `sensei-hub-dashboard/lib/quiz.ts` to add `QuizSet` type, extend `Quiz` type, and update `getBestScore` and `saveQuizResult` to support `setId` parameters.

  Replace the contents of `sensei-hub-dashboard/lib/quiz.ts` with:
  ```typescript
  // クイズのデータ型と、結果履歴の保存（localStorage）ヘルパー。
  // クイズ本体は lessons/quizzes/<slug>.json に 3 言語フィールドで格納する。

  import type { Language } from "@/lib/i18n"

  export type QuizText = { en: string; ja: string; vi: string }

  export type QuizQuestion = {
    id: string
    question: QuizText
    options: QuizText[]
    /** options 配列内の正解インデックス（0 始まり） */
    answer: number
    explanation: QuizText
  }

  export type QuizSet = {
    id: string
    title: QuizText
    description: QuizText
    questions: QuizQuestion[]
  }

  export type Quiz = {
    title: QuizText
    questions?: QuizQuestion[] // Backward compatibility for single quiz
    sets?: QuizSet[]           // For multiple quiz sets
  }

  /** 3 言語テキストを現在の言語で取り出す（無ければ英語にフォールバック）。 */
  export function pickText(text: QuizText, lang: Language): string {
    return text[lang] || text.en
  }

  // ---- 結果履歴（localStorage） ----

  export type QuizResultRecord = {
    slug: string
    score: number
    total: number
    ts: number
  }

  const KEY = "sensei-quiz-results"

  export function getQuizResults(): QuizResultRecord[] {
    if (typeof window === "undefined") return []
    const raw = localStorage.getItem(KEY)
    if (!raw || raw === "undefined") return []
    try {
      const data = JSON.parse(raw)
      return Array.isArray(data) ? (data as QuizResultRecord[]) : []
    } catch {
      return []
    }
  }

  // Support checking best score by set id
  export function getBestScore(slug: string, setId?: string): QuizResultRecord | null {
    const key = setId ? `${slug}/${setId}` : slug
    const results = getQuizResults().filter((r) => r.slug === key)
    if (results.length === 0) return null
    return results.reduce((best, r) => (r.score / r.total > best.score / best.total ? r : best))
  }

  export function saveQuizResult(record: QuizResultRecord): void {
    if (typeof window === "undefined") return
    try {
      const all = getQuizResults()
      all.push(record)
      // 直近 50 件だけ保持
      localStorage.setItem(KEY, JSON.stringify(all.slice(-50)))
    } catch {
      // 容量超過などは無視
    }
  }
  ```

- [ ] **Step 2: Verify compilation and commit**
  Verify that the dashboard compiles without TypeScript errors in `lib/quiz.ts`.
  Run: `git commit -am "feat: update quiz types and helpers to support sets"`

---

### Task 2: Add Translations

**Files:**
- Modify: `sensei-hub-dashboard/lib/i18n.tsx`

- [ ] **Step 1: Add new strings in `i18n.tsx`**
  Modify `sensei-hub-dashboard/lib/i18n.tsx` to add keys for set selection.
  Find `"quiz.best_score"` and add these translations right below it:
  ```typescript
    "quiz.select_set": { en: "Select a Quiz Set", ja: "クイズセットを選択してください", vi: "Chọn một đề thi" },
    "quiz.unattempted": { en: "Unattempted", ja: "未挑戦", vi: "Chưa thử sức" },
    "quiz.questions_count": { en: "10 questions", ja: "10問", vi: "10 câu hỏi" },
    "quiz.back_to_sets": { en: "Back to sets", ja: "セット選択に戻る", vi: "Quay lại chọn đề" },
  ```

- [ ] **Step 2: Commit translation changes**
  Run: `git commit -am "i18n: add quiz set selection translation strings"`

---

### Task 3: Implement Set Selection UI

**Files:**
- Modify: `sensei-hub-dashboard/app/subject/[slug]/quiz/page.tsx`

- [ ] **Step 1: Implement Phase and Set Selection logic**
  Modify the quiz page to handle `sets` and transition to the selection screen.
  Replace the entire content of `sensei-hub-dashboard/app/subject/[slug]/quiz/page.tsx` with:
  ```tsx
  "use client"

  import { use, useEffect, useState } from "react"
  import Link from "next/link"
  import { motion, AnimatePresence } from "framer-motion"
  import confetti from "canvas-confetti"
  import { ArrowLeft, ListChecks, CheckCircle2, XCircle, RotateCcw, Trophy, Play } from "lucide-react"

  import { Sidebar } from "@/components/dashboard/sidebar"
  import { TopBar } from "@/components/dashboard/top-bar"
  import { Starfield } from "@/components/dashboard/starfield"
  import { useLanguage } from "@/lib/i18n"
  import { useUserProgress } from "@/components/user-progress-provider"
  import { cn } from "@/lib/utils"
  import {
    pickText,
    saveQuizResult,
    getBestScore,
    type Quiz,
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
    const [phase, setPhase] = useState<Phase>("intro")
    const [selectedSet, setSelectedSet] = useState<QuizSet | null>(null)
    
    const [current, setCurrent] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [revealed, setRevealed] = useState(false)
    const [answers, setAnswers] = useState<number[]>([])
    
    // Scores cache for sets
    const [setScores, setSetScores] = useState<Record<string, QuizResultRecord | null>>({})
    const [singleBest, setSingleBest] = useState<QuizResultRecord | null>(null)

    useEffect(() => {
      let active = true
      setStatus("loading")
      fetch(`/api/subject/${slug}/quiz`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: Quiz | null) => {
          if (!active) return
          if (data) {
            const hasSets = Array.isArray(data.sets) && data.sets.length > 0
            const hasQuestions = Array.isArray(data.questions) && data.questions.length > 0
            if (hasSets || hasQuestions) {
              setQuiz(data)
              setStatus("ready")
              if (hasSets) {
                setPhase("set-selection")
              } else {
                setPhase("intro")
              }
            } else {
              setStatus("missing")
            }
          } else {
            setStatus("missing")
          }
        })
        .catch(() => active && setStatus("missing"))
      return () => {
        active = false
      }
    }, [slug])

    // Load best scores whenever phase changes or set-selection enters
    useEffect(() => {
      if (!quiz) return
      if (quiz.sets) {
        const scores: Record<string, QuizResultRecord | null> = {}
        quiz.sets.forEach((s) => {
          scores[s.id] = getBestScore(slug, s.id)
        })
        setSetScores(scores)
      } else {
        setSingleBest(getBestScore(slug))
      }
    }, [slug, quiz, phase])

    const activeQuestions = selectedSet ? selectedSet.questions : (quiz?.questions ?? [])
    const total = activeQuestions.length
    const score = answers.filter((a, i) => a === activeQuestions[i]?.answer).length

    const selectSet = (set: QuizSet) => {
      setSelectedSet(set)
      setPhase("intro")
    }

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

    const nextQuestion = () => {
      if (current < total - 1) {
        setCurrent((c) => c + 1)
        setSelected(null)
        setRevealed(false)
      } else {
        const finalScore = answers.filter((a, i) => a === activeQuestions[i]?.answer).length
        const recordSlug = selectedSet ? `${slug}/${selectedSet.id}` : slug
        saveQuizResult({ slug: recordSlug, score: finalScore, total, ts: Date.now() })
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

    const q = activeQuestions[current]

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
              
              {/* Back Link */}
              {phase === "set-selection" || (!quiz?.sets && phase === "intro") ? (
                <Link
                  href={`/subject/${slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-cyan-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("lesson.back_to_subject")} {subject?.name ?? ""}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    if (quiz?.sets) {
                      setPhase("set-selection")
                      setSelectedSet(null)
                    } else {
                      setPhase("intro")
                    }
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-cyan-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {quiz?.sets ? t("quiz.back_to_sets") : t("lesson.back_to_subject")}
                </button>
              )}

              {/* Loading */}
              {status === "loading" && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400" />
                  <p className="text-sm text-white/50 font-mono">{t("common.loading")}</p>
                </div>
              )}

              {/* Missing */}
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

              {/* Phase: Set Selection */}
              {status === "ready" && quiz && phase === "set-selection" && quiz.sets && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                      {pickText(quiz.title, lang)}
                    </h1>
                    <p className="text-sm text-white/60">{t("quiz.select_set")}</p>
                  </div>

                  <div className="grid gap-4">
                    {quiz.sets.map((set) => {
                      const bestScore = setScores[set.id]
                      return (
                        <div
                          key={set.id}
                          onClick={() => selectSet(set)}
                          className="group relative cursor-pointer glass-card border border-white/10 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-cyan-500/5 hover:shadow-2xl hover:-translate-y-0.5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {pickText(set.title, lang)}
                              </h3>
                              <p className="text-sm text-white/60">
                                {pickText(set.description, lang)}
                              </p>
                              <div className="flex items-center gap-3 pt-2 text-xs text-white/40">
                                <span className="flex items-center gap-1">
                                  <ListChecks className="h-3.5 w-3.5" />
                                  {t("quiz.questions_count")}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Trophy className="h-3.5 w-3.5 text-yellow-400/80" />
                                  {bestScore
                                    ? `${t("quiz.best_score")}: ${bestScore.score}/${bestScore.total}`
                                    : t("quiz.unattempted")}
                                </span>
                              </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                              <Play className="h-4 w-4 fill-current ml-0.5" />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Phase: Intro */}
              {status === "ready" && quiz && phase === "intro" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card border border-white/10 rounded-2xl p-8 lg:p-10 text-center space-y-5"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                    <ListChecks className="h-8 w-8 text-cyan-300" />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">
                      {selectedSet ? pickText(selectedSet.title, lang) : pickText(quiz.title, lang)}
                    </h1>
                    {selectedSet && (
                      <p className="text-sm text-white/60 max-w-md mx-auto">
                        {pickText(selectedSet.description, lang)}
                      </p>
                    )}
                    {!selectedSet && (
                      <p className="text-sm text-white/60">{t("quiz.intro")}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-4 text-sm font-mono text-white/40">
                    <span>{total} {t("quiz.questions")}</span>
                    {selectedSet ? (
                      setScores[selectedSet.id] && (
                        <>
                          <span>•</span>
                          <span className="text-cyan-400">
                            {t("quiz.best_score")}: {setScores[selectedSet.id]?.score}/{setScores[selectedSet.id]?.total}
                          </span>
                        </>
                      )
                    ) : (
                      singleBest && (
                        <>
                          <span>•</span>
                          <span className="text-cyan-400">
                            {t("quiz.best_score")}: {singleBest.score}/{singleBest.total}
                          </span>
                        </>
                      )
                    )}
                  </div>

                  <button
                    onClick={start}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all"
                  >
                    {t("quiz.start")}
                  </button>
                </motion.div>
              )}

              {/* Phase: Playing */}
              {status === "ready" && quiz && phase === "playing" && q && (
                <div className="space-y-6">
                  {/* Progress bar */}
                  <div className="flex items-center justify-between text-xs text-white/40 font-mono">
                    <span>{t("quiz.question")} {current + 1} / {total}</span>
                    <span>{Math.round(((current) / total) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                      style={{ width: `${((current) / total) * 100}%` }}
                    />
                  </div>

                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6"
                  >
                    <h2 className="text-lg font-bold leading-relaxed text-white">
                      {pickText(q.question, lang)}
                    </h2>

                    <div className="grid gap-3">
                      {q.options.map((opt, idx) => {
                        const isSelected = selected === idx
                        const isCorrect = idx === q.answer
                        const optionText = pickText(opt, lang)

                        return (
                          <button
                            key={idx}
                            disabled={revealed}
                            onClick={() => setSelected(idx)}
                            className={cn(
                              "w-full text-left px-5 py-4 rounded-xl border text-sm font-semibold transition-all duration-200 flex items-start justify-between gap-4",
                              !revealed && isSelected && "bg-cyan-500/10 border-cyan-400/50 text-cyan-300 shadow-md",
                              !revealed && !isSelected && "bg-white/5 border-white/10 hover:bg-white/10 text-white/80",
                              revealed && isCorrect && "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/5",
                              revealed && isSelected && !isCorrect && "bg-rose-500/15 border-rose-500/50 text-rose-400 shadow-lg shadow-rose-500/5",
                              revealed && !isSelected && !isCorrect && "opacity-40 bg-white/5 border-white/10 text-white/60",
                            )}
                          >
                            <span>{optionText}</span>
                            {revealed && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />}
                            {revealed && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />}
                          </button>
                        )
                      })}
                    </div>

                    <AnimatePresence>
                      {revealed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="pt-4 border-t border-white/10 space-y-2 overflow-hidden"
                        >
                          <p className="text-sm leading-relaxed text-white/70">
                            <span className="font-bold text-cyan-300">{t("quiz.explanation")}: </span>
                            {pickText(q.explanation, lang)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-end pt-2">
                      {!revealed ? (
                        <button
                          disabled={selected === null}
                          onClick={submit}
                          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                        >
                          {t("quiz.submit")}
                        </button>
                      ) : (
                        <button
                          onClick={nextQuestion}
                          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-colors"
                        >
                          {current < total - 1 ? t("quiz.next") : t("quiz.finish")}
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Phase: Done */}
              {status === "ready" && quiz && phase === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card border border-white/10 rounded-2xl p-8 lg:p-10 text-center space-y-6"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Trophy className="h-10 w-10 animate-bounce" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm uppercase tracking-wider text-white/50 font-mono">{t("quiz.your_score")}</p>
                    <h2 className="text-4xl lg:text-5xl font-black text-white">
                      {score} <span className="text-lg lg:text-2xl text-white/40">/ {total}</span>
                    </h2>
                  </div>

                  <p className="text-sm text-white/70 max-w-md mx-auto">
                    {score / total >= 0.8
                      ? t("quiz.result_great")
                      : score / total >= 0.5
                        ? t("quiz.result_good")
                        : t("quiz.result_retry")}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <button
                      onClick={start}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {t("quiz.retry")}
                    </button>
                    {quiz.sets && (
                      <button
                        onClick={() => {
                          setPhase("set-selection")
                          setSelectedSet(null)
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        {t("quiz.back_to_sets")}
                      </button>
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
  ```

- [ ] **Step 2: Commit UI changes**
  Run: `git commit -am "feat: implement quiz set selection and details view in frontend page"`

---

### Task 4: Add New Practical Git & GitHub Questions (5 Sets, 50 Questions)

**Files:**
- Modify: `lessons/quizzes/git-and-github.json`

- [ ] **Step 1: Replace content of `git-and-github.json`**
  Modify `lessons/quizzes/git-and-github.json` to have the new 5 sets format with 10 scenario-based questions per set.
  Write the content shown below. (Since this file is large, write the full content in one contiguous block).

  *See details in file contents:*
  Write target content to `lessons/quizzes/git-and-github.json`:
  ```json
  {
    "title": { "en": "Git & GitHub Quiz", "ja": "Git & GitHub クイズ", "vi": "Quiz Git & GitHub" },
    "sets": [
      {
        "id": "set-1",
        "title": { "en": "Set 1: Git Basics & Staging", "ja": "セット1：Gitの基本とステージング", "vi": "Đề 1: Cơ bản về Git & Staging" },
        "description": {
          "en": "Focus on repository setup, staging area mechanics, status tracking, config defaults, and commits.",
          "ja": "リポジトリの初期化、ステージング、インデックス、config設定、コミットなど基礎知識に焦点を当てます。",
          "vi": "Tập trung vào khởi tạo repo, vùng staging, tracking, config và commit cơ bản."
        },
        "questions": [
          {
            "id": "s1_q1",
            "question": {
              "en": "Which configuration file is edited when you execute the command `git config --global user.name \"John\"` on a Unix-like system?",
              "ja": "Unix系システムで `git config --global user.name \"John\"` を実行した際、編集される設定ファイルはどれ？",
              "vi": "Tệp cấu hình nào sẽ được sửa đổi khi bạn chạy lệnh `git config --global user.name \"John\"` trên hệ điều hành Unix-like?"
            },
            "options": [
              { "en": "~/.gitconfig", "ja": "~/.gitconfig", "vi": "~/.gitconfig" },
              { "en": ".git/config (inside repository)", "ja": ".git/config (リポジトリ内)", "vi": ".git/config (trong repository)" },
              { "en": "/etc/gitconfig", "ja": "/etc/gitconfig", "vi": "/etc/gitconfig" },
              { "en": "~/.config/git/user.config", "ja": "~/.config/git/user.config", "vi": "~/.config/git/user.config" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`--global` writes to `~/.gitconfig` (or `~/.config/git/config`). `--local` (default) writes to `.git/config` within the repo, and `--system` writes to `/etc/gitconfig`.",
              "ja": "`--global` オプションは `~/.gitconfig`（または `~/.config/git/config`）に書き込みます。`--local` はリポジトリ内の `.git/config`、`--system` は `/etc/gitconfig` です。",
              "vi": "`--global` ghi cấu hình vào `~/.gitconfig` (hoặc `~/.config/git/config`). `--local` (mặc định) ghi vào `.git/config` trong repo, và `--system` ghi vào `/etc/gitconfig`."
            }
          },
          {
            "id": "s1_q2",
            "question": {
              "en": "You ran `git status` and see a file under 'Changes not staged for commit' and the same file under 'Untracked files'. What does this mean?",
              "ja": "`git status`を実行すると、同じファイル名が「Changes not staged for commit」と「Untracked files」の両方に表示されました。これは何を意味する？",
              "vi": "Bạn chạy `git status` và thấy một tệp vừa nằm trong 'Changes not staged for commit' vừa nằm trong 'Untracked files'. Điều này nghĩa là gì?"
            },
            "options": [
              { "en": "The file was modified, staged, and then modified again in the working directory", "ja": "ファイルがステージングされた後、ワークツリーでさらに変更された", "vi": "Tệp đã được sửa đổi, staged, sau đó lại tiếp tục được sửa đổi ở working tree (lưu ý: đây là kịch bản của files already tracked)" },
              { "en": "The file was created, partially staged using git add -p, leaving some lines untracked", "ja": "新規ファイルが作成され、git add -p で一部のみステージされ、残りは未追跡になっている", "vi": "Tệp mới được tạo, được stage một phần qua git add -p, phần còn lại chưa được track" },
              { "en": "This is a bug in Git; a single file cannot appear in two states simultaneously", "ja": "これはGitのバグです。同じファイルが同時に2つの状態になることはありません", "vi": "Đây là lỗi của Git; một tệp không thể xuất hiện ở hai trạng thái cùng lúc" },
              { "en": "A folder and a file with the same name coexist, one tracked and one untracked", "ja": "同名のフォルダとファイルが混在し、一方が追跡対象、もう一方が未追跡である", "vi": "Một thư mục và một tệp trùng tên cùng tồn tại, một cái đã được track và một cái chưa" }
            ],
            "answer": 1,
            "explanation": {
              "en": "For a brand new (untracked) file, if you stage only part of it (e.g., via interactive staging `git add -N` then `git add -p`), the staged lines are tracked modifications, while the remaining unstaged lines of this new file appear as 'untracked'. For existing files, it would show as staged and unstaged, not untracked.",
              "ja": "新規作成された（未追跡の）ファイルを `git add -N` 後に `git add -p` 等で一部だけステージングすると、ステージされた部分は「追跡中」、ステージされていない部分は「未追跡」として同時に表示されます。",
              "vi": "Với tệp hoàn toàn mới (chưa track), nếu bạn chỉ stage một phần (ví dụ qua `git add -N` rồi `git add -p`), phần được stage sẽ ở trạng thái track/staged, phần còn lại chưa stage sẽ hiển thị dưới dạng 'untracked'."
            }
          },
          {
            "id": "s1_q3",
            "question": {
              "en": "Which command allows you to interactively review and stage specific parts (hunks) of changes made to a file, rather than staging the entire file?",
              "ja": "ファイル全体をステージするのではなく、変更点の一部（ハング）を選択して対話的にステージングするコマンドはどれ？",
              "vi": "Lệnh nào cho phép bạn xem và đưa từng phần thay đổi (hunks) của một tệp vào staging thay vì stage toàn bộ tệp?"
            },
            "options": [
              { "en": "git add -i", "ja": "git add -i", "vi": "git add -i" },
              { "en": "git add -p", "ja": "git add -p", "vi": "git add -p" },
              { "en": "git stage --interactive", "ja": "git stage --interactive", "vi": "git stage --interactive" },
              { "en": "Both git add -i and git add -p are correct", "ja": "git add -i と git add -p の両方とも正しい", "vi": "Cả git add -i và git add -p đều đúng" }
            ],
            "answer": 3,
            "explanation": {
              "en": "`git add -p` (or `--patch`) directly opens the patch selection mode for hunks. `git add -i` (or `--interactive`) opens an interactive menu that includes the patch mode as option 5 (patch). Both can be used to stage hunks.",
              "ja": "`git add -p`（または `--patch`）は直接パッチ編集モードを開きます。`git add -i`（対話モード）からもパッチ選択オプションを呼び出せるため、両方とも正しいです。",
              "vi": "`git add -p` (hoặc `--patch`) mở trực tiếp chế độ chọn hunk. `git add -i` mở menu tương tác và có tùy chọn patch. Do đó cả hai đều thực hiện được."
            }
          },
          {
            "id": "s1_q4",
            "question": {
              "en": "If you modified `index.js` and want to view the difference between your staged changes and the last commit, which command should you use?",
              "ja": "`index.js`を変更し、ステージング（インデックス）されている変更と、直前のコミットとの差分を確認するコマンドはどれ？",
              "vi": "Bạn đã sửa `index.js` và muốn xem sự khác biệt giữa những thay đổi đã được staged và commit gần nhất, bạn dùng lệnh nào?"
            },
            "options": [
              { "en": "git diff index.js", "ja": "git diff index.js", "vi": "git diff index.js" },
              { "en": "git diff --staged index.js", "ja": "git diff --staged index.js", "vi": "git diff --staged index.js" },
              { "en": "git diff --working index.js", "ja": "git diff --working index.js", "vi": "git diff --working index.js" },
              { "en": "git diff --cached --head index.js", "ja": "git diff --cached --head index.js", "vi": "git diff --cached --head index.js" }
            ],
            "answer": 1,
            "explanation": {
              "en": "`git diff` compares the working directory with the index (unstaged changes). `git diff --cached` (or `--staged`) compares the staged changes (index) with the HEAD commit.",
              "ja": "オプション無しの `git diff` はワークツリーとインデックス（未ステージ）の差分を表示します。ステージされた変更と直前コミットとの差分は `git diff --cached`（または `--staged`）を使用します。",
              "vi": "`git diff` so sánh working directory với index (chưa staged). `git diff --cached` (hoặc `--staged`) so sánh index với HEAD commit."
            }
          },
          {
            "id": "s1_q5",
            "question": {
              "en": "You have a `.gitignore` containing `/logs/` and `logs/`. What is the difference between these two patterns?",
              "ja": "`.gitignore` ファイル内に `/logs/` と `logs/` の2つが記述されています。この2つのパターンの違いは何？",
              "vi": "Trong `.gitignore` của bạn có hai dòng `/logs/` và `logs/`. Sự khác biệt giữa hai mẫu này là gì?"
            },
            "options": [
              { "en": "No difference; both ignore logs directory recursively", "ja": "違いはありません。両方ともlogsディレクトリを再帰的に除外します", "vi": "Không có sự khác biệt; cả hai đều bỏ qua thư mục logs một cách đệ quy" },
              { "en": "`/logs/` ignores logs directory only at the repository root, while `logs/` ignores any directory named logs anywhere in the project root or subdirectories", "ja": "`/logs/` はリポジトリのルート直下にあるlogsのみを除外し、`logs/` はプロジェクト内のどの階層にある logs フォルダもすべて除外する", "vi": "`/logs/` chỉ bỏ qua thư mục logs ở root của repository, còn `logs/` bỏ qua mọi thư mục tên logs ở bất kỳ cấp độ nào trong dự án" },
              { "en": "`/logs/` ignores files inside logs, while `logs/` ignores the directory folder structure itself", "ja": "`/logs/` はlogs内のファイルを除外し、`logs/` はフォルダ自体の構造を除外する", "vi": "`/logs/` bỏ qua các tệp bên trong logs, còn `logs/` bỏ qua chính thư mục logs" },
              { "en": "`/logs/` is an invalid pattern causing git to throw a syntax warning", "ja": "`/logs/` は無効なパターンであり、Git が構文警告を出します", "vi": "`/logs/` là mẫu không hợp lệ khiến Git báo lỗi cú pháp" }
            ],
            "answer": 1,
            "explanation": {
              "en": "A leading slash `/` anchors the pattern to the directory level of the `.gitignore` file. Without a leading slash, the pattern matches directories with that name at any subdirectory depth.",
              "ja": "先頭のスラッシュ `/` は、`.gitignore` ファイルがあるルートレベルで一致させます。スラッシュが無い場合は、サブディレクトリの下層にある同名フォルダもすべてマッチします。",
              "vi": "Dấu gạch chéo `/` ở đầu định vị mẫu tại cùng cấp với tệp `.gitignore`. Không có `/`, nó sẽ bỏ qua mọi thư mục trùng tên ở bất kỳ thư mục con nào."
            }
          },
          {
            "id": "s1_q6",
            "question": {
              "en": "You staged a modified file `config.json` by running `git add config.json`. How do you unstage this file without losing the changes you made in the working directory?",
              "ja": "`git add config.json` を実行してファイルをステージしました。ワークツリーの変更内容を失うことなく、このファイルをステージから外す（unstage）コマンドはどれ？",
              "vi": "Bạn đã stage tệp `config.json` bằng lệnh `git add config.json`. Làm cách nào để hủy stage (unstage) tệp này mà không làm mất các thay đổi trong working directory?"
            },
            "options": [
              { "en": "git reset config.json", "ja": "git reset config.json", "vi": "git reset config.json" },
              { "en": "git restore --staged config.json", "ja": "git restore --staged config.json", "vi": "git restore --staged config.json" },
              { "en": "git checkout config.json", "ja": "git checkout config.json", "vi": "git checkout config.json" },
              { "en": "Both git reset config.json and git restore --staged config.json are correct", "ja": "git reset config.json と git restore --staged config.json の両方が正しい", "vi": "Cả git reset config.json và git restore --staged config.json đều đúng" }
            ],
            "answer": 3,
            "explanation": {
              "en": "Both `git reset <file>` and the modern `git restore --staged <file>` safely remove the file from the staging area while leaving its working directory contents untouched. `git checkout <file>` overwrites the working directory changes.",
              "ja": "従来の `git reset <file>` と、モダンな `git restore --staged <file>` の両方が、ワークツリーの変更を保持したままステージングエリアからファイルを取り除きます。`git checkout` はワークツリーの変更を消去します。",
              "vi": "Cả `git reset <file>` truyền thống và `git restore --staged <file>` hiện đại đều gỡ tệp khỏi staging mà vẫn giữ nguyên thay đổi ở thư mục làm việc. Lệnh `git checkout <file>` sẽ ghi đè và làm mất thay đổi."
            }
          },
          {
            "id": "s1_q7",
            "question": {
              "en": "You made a commit but realized you forgot to include changes in `utils.js`. The commit is local and has not been pushed. What is the safest way to include those changes in that same commit?",
              "ja": "コミットを行った直後、`utils.js`の変更を含め忘れたことに気づきました。コミットはローカルのみでプッシュしていません。同じコミットにその変更を含める最も安全な手順はどれ？",
              "vi": "Bạn vừa commit nhưng nhận ra đã quên đưa các sửa đổi trong `utils.js` vào. Commit này mới ở local và chưa được push. Cách an toàn nhất để đưa các thay đổi đó vào cùng commit đó là gì?"
            },
            "options": [
              { "en": "Stage utils.js, then run `git commit --amend --no-edit`", "ja": "utils.jsをステージし、`git commit --amend --no-edit` を実行する", "vi": "Stage utils.js, sau đó chạy `git commit --amend --no-edit`" },
              { "en": "Run `git commit --amend utils.js`", "ja": "`git commit --amend utils.js` を実行する", "vi": "Chạy `git commit --amend utils.js`" },
              { "en": "Run `git reset --soft HEAD~1`, stage utils.js, and commit again", "ja": "`git reset --soft HEAD~1` を行い、utils.jsをステージして再度コミットする", "vi": "Chạy `git reset --soft HEAD~1`, stage utils.js, rồi commit lại" },
              { "en": "All of the options are correct and safe", "ja": "上記のすべての選択肢が正しく安全である", "vi": "Tất cả các lựa chọn trên đều đúng và an toàn" }
            ],
            "answer": 3,
            "explanation": {
              "en": "All these methods are correct for local commits. `git commit --amend --no-edit` is the quickest. `git reset --soft HEAD~1` rolls back the commit but leaves files staged, allowing you to add more and commit again. `--amend <file>` stages and amends in one step.",
              "ja": "ローカルの未プッシュコミットであればどれも安全に使用できます。`git commit --amend --no-edit` が最も手軽です。`git reset --soft HEAD~1` もコミット前の状態に戻して再構築できます。",
              "vi": "Tất cả các phương án đều đúng đối với commit chưa push. `git commit --amend --no-edit` là nhanh nhất. `git reset --soft HEAD~1` đưa HEAD về commit trước nhưng giữ nguyên staging để bạn sửa và commit lại."
            }
          },
          {
            "id": "s1_q8",
            "question": {
              "en": "What does the command `git commit -a -m \"Fix logic\"` do?",
              "ja": "`git commit -a -m \"Fix logic\"` コマンドを実行したときの挙動はどれ？",
              "vi": "Lệnh `git commit -a -m \"Fix logic\"` thực hiện hành động nào?"
            },
            "options": [
              { "en": "Commits all changes in the working directory, including untracked files", "ja": "未追跡（Untracked）を含む、ワークツリー内のすべての変更をコミットする", "vi": "Commit toàn bộ thay đổi trong thư mục làm việc, bao gồm cả các tệp untracked" },
              { "en": "Commits changes to all tracked files, automatically staging modified/deleted files, but ignores untracked files", "ja": "追跡済みのすべてのファイルの変更（修正・削除）を自動的にステージしてコミットするが、未追跡のファイルは無視する", "vi": "Commit các thay đổi của tất cả các tệp đã được track (tự động stage các tệp bị sửa đổi hoặc xóa), nhưng bỏ qua các tệp untracked" },
              { "en": "Commits only files that are currently in the staging area", "ja": "現在ステージングエリアにあるファイルのみをコミットする", "vi": "Chỉ commit các tệp hiện đang nằm trong vùng staging" },
              { "en": "Creates a new branch named 'Fix logic' and commits changes there", "ja": "'Fix logic' という名前のブランチを作成し、そこにコミットする", "vi": "Tạo một nhánh mới tên là 'Fix logic' và commit các thay đổi lên đó" }
            ],
            "answer": 1,
            "explanation": {
              "en": "The `-a` (or `--all`) option automatically stages files that have been modified or deleted, but it does NOT add new, untracked files. These must still be added with `git add` first.",
              "ja": "`-a` オプションは「追跡済み」の変更ファイルを自動でステージしてコミットします。新しく作成した「未追跡」のファイルは、事前または同時に `git add` しない限りコミットされません。",
              "vi": "Tùy chọn `-a` tự động stage các tệp đã được track khi chúng bị sửa đổi hoặc xóa, nhưng KHÔNG tự động thêm các tệp mới (untracked). Các tệp mới vẫn cần phải chạy `git add` trước."
            }
          },
          {
            "id": "s1_q9",
            "question": {
              "en": "Which command displays the commit history as a graph showing branch lines, with abbreviated hashes and one-line summaries?",
              "ja": "コミット履歴をブランチの分岐線グラフ付きで、ハッシュ値を短縮し、1コミット1行で表示するコマンドはどれ？",
              "vi": "Lệnh nào hiển thị lịch sử commit dưới dạng sơ đồ nhánh, với mã hash viết tắt và mỗi commit nằm trên một dòng?"
            },
            "options": [
              { "en": "git log --oneline --graph --all", "ja": "git log --oneline --graph --all", "vi": "git log --oneline --graph --all" },
              { "en": "git log --pretty=short --branches", "ja": "git log --pretty=short --branches", "vi": "git log --pretty=short --branches" },
              { "en": "git show-branch --graph", "ja": "git show-branch --graph", "vi": "git show-branch --graph" },
              { "en": "git graph-log", "ja": "git graph-log", "vi": "git graph-log" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git log --oneline --graph --all` shows a ASCII graph (`--graph`), collapses each commit to a single line (`--oneline`), and displays all branches (`--all`).",
              "ja": "`git log --oneline --graph --all` は、ASCIIアートによるブランチグラフ（`--graph`）、1行短縮表示（`--oneline`）、および全ブランチの履歴（`--all`）を同時に満たします。",
              "vi": "`git log --oneline --graph --all` hiển thị sơ đồ phân nhánh (`--graph`), rút gọn thông tin mỗi commit trên một dòng (`--oneline`), và hiển thị tất cả các nhánh (`--all`)."
            }
          },
          {
            "id": "s1_q10",
            "question": {
              "en": "You want to clone a remote repository but check out the files directly into a specific folder named `my-app` instead of the default repository name. What is the correct syntax?",
              "ja": "リモートリポジトリをクローンする際、デフォルトのリポジトリ名ではなく、`my-app` という指定したフォルダにファイルを展開する正しいコマンドはどれ？",
              "vi": "Bạn muốn clone một remote repository nhưng tải các tệp trực tiếp vào một thư mục cụ thể tên là `my-app` thay vì thư mục mặc định của repo. Cú pháp nào đúng?"
            },
            "options": [
              { "en": "git clone <url> my-app", "ja": "git clone <url> my-app", "vi": "git clone <url> my-app" },
              { "en": "git clone <url> --dir=my-app", "ja": "git clone <url> --dir=my-app", "vi": "git clone <url> --dir=my-app" },
              { "en": "git clone <url> -o my-app", "ja": "git clone <url> -o my-app", "vi": "git clone <url> -o my-app" },
              { "en": "git clone my-app <url>", "ja": "git clone my-app <url>", "vi": "git clone my-app <url>" }
            ],
            "answer": 0,
            "explanation": {
              "en": "The syntax for `git clone` allows specifying an optional directory name as the last argument: `git clone <repository-url> [<directory>]`.",
              "ja": "`git clone` の引数構成は `git clone <URL> [<ディレクトリ名>]` です。末尾にフォルダ名を指定することで、デフォルト名以外に展開できます。",
              "vi": "Cú pháp của `git clone` cho phép truyền thêm tên thư mục tùy chọn ở cuối: `git clone <repository-url> [<directory>]`."
            }
          }
        ]
      },
      {
        "id": "set-2",
        "title": { "en": "Set 2: Branching & Merging", "ja": "セット2：ブランチ作成とマージ", "vi": "Đề 2: Nhánh & Merge" },
        "description": {
          "en": "Master branch operations, fast-forward vs 3-way merges, conflict markers, and conflict resolution workflows.",
          "ja": "ブランチ操作、Fast-forward マージ vs 3-wayマージの違い、競合マーカーの構造、および競合の解決方法を学びます。",
          "vi": "Làm chủ thao tác với nhánh, so sánh fast-forward vs 3-way merge, đọc hiểu dấu xung đột và quy trình giải quyết."
        },
        "questions": [
          {
            "id": "s2_q1",
            "question": {
              "en": "What is the primary difference between `git checkout -b feature` and `git switch -c feature`?",
              "ja": "`git checkout -b feature` と `git switch -c feature` の主な違いは何？",
              "vi": "Sự khác biệt chính giữa `git checkout -b feature` và `git switch -c feature` là gì?"
            },
            "options": [
              { "en": "There is no difference in outcome; `git switch` is a newer, more focused command introduced to separate branch switching from file discarding", "ja": "実行結果に違いはありません。`git switch` はファイルの破棄とブランチ切り替えの役割を分離するために新設された、ブランチ操作に特化したコマンドです", "vi": "Không có sự khác biệt về kết quả; `git switch` là lệnh mới hơn, tập trung hơn được giới thiệu để tách biệt việc chuyển nhánh khỏi việc khôi phục tệp" },
              { "en": "`git switch` only works on remote tracking branches, while `git checkout` is for local branches", "ja": "`git switch` はリモート追跡ブランチ専用であり、`git checkout` はローカルブランチ用である", "vi": "`git switch` chỉ hoạt động trên các remote tracking branch, còn `git checkout` dùng cho local branch" },
              { "en": "`git checkout -b` creates a branch without switching, whereas `git switch -c` switches immediately", "ja": "`git checkout -b` は切り替えずにブランチを作成し、`git switch -c` は即座に切り替える", "vi": "`git checkout -b` tạo nhánh mà không chuyển, còn `git switch -c` chuyển nhánh ngay lập tức" },
              { "en": "`git checkout` writes to reflog, but `git switch` does not", "ja": "`git checkout` は reflog に記録するが、`git switch` は記録しない", "vi": "`git checkout` ghi dữ liệu vào reflog, còn `git switch` thì không" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git switch` was introduced in Git 2.23 alongside `git restore` to split the overloaded responsibilities of `git checkout` (which did both branch switching and restoring files). Outcome is identical.",
              "ja": "Git 2.23 で、多機能すぎた `git checkout` の役割を分割するために `git switch`（ブランチ切り替え用）と `git restore`（ファイル復元用）が導入されました。処理結果自体は同じです。",
              "vi": "`git switch` được giới thiệu từ bản Git 2.23 cùng với `git restore` nhằm tách các chức năng bị quá tải của `git checkout` (vừa dùng để chuyển nhánh vừa khôi phục tệp). Kết quả đầu ra là như nhau."
            }
          },
          {
            "id": "s2_q2",
            "question": {
              "en": "Under what condition will Git perform a Fast-Forward merge when merging branch `feature` into `main`?",
              "ja": "`feature` ブランチを `main` ブランチにマージする際、Git が Fast-Forward マージを行う条件はどれ？",
              "vi": "Trong điều kiện nào Git sẽ thực hiện merge kiểu Fast-Forward khi gộp nhánh `feature` vào `main`?"
            },
            "options": [
              { "en": "The history of `main` has not diverged since `feature` was branched (no new commits on `main`)", "ja": "`feature` 分岐後に `main` ブランチに新しいコミットが存在しない（履歴が分岐していない）場合", "vi": "Lịch sử của `main` không bị rẽ nhánh kể từ khi `feature` được tách ra (không có commit mới trên `main`)" },
              { "en": "There are no merge conflicts between the two branches", "ja": "2つのブランチの間に競合が一切存在しない場合", "vi": "Không có xung đột merge nào giữa hai nhánh" },
              { "en": "Both branches have identical files, and only file metadata has changed", "ja": "双方のブランチのファイルが同一で、ファイルのメタデータのみが変更されている場合", "vi": "Cả hai nhánh có các tệp giống hệt nhau, chỉ thay đổi metadata" },
              { "en": "You explicitly pass the `--fast-forward-only` parameter to the branch creation", "ja": "ブランチ作成時に `--fast-forward-only` パラメータを明示的に指定した場合", "vi": "Bạn truyền tham số `--fast-forward-only` khi khởi tạo nhánh" }
            ],
            "answer": 0,
            "explanation": {
              "en": "A Fast-Forward merge occurs when the destination branch (`main`) has no new commits since the source branch (`feature`) was created. Git simply moves the HEAD pointer forward to point to the latest commit of `feature`.",
              "ja": "マージ先（`main`）に、分岐開始後に新たなコミットが無い場合、ポインタを進めるだけで完了するため Fast-Forward（早送り）マージになります。相手側の変更履歴が一列に連なる形になります。",
              "vi": "Merge Fast-Forward xảy ra khi nhánh đích (`main`) không có thêm commit nào mới kể từ khi nhánh nguồn (`feature`) được tạo ra. Git chỉ cần di chuyển con trỏ HEAD của `main` lên commit mới nhất của `feature`."
            }
          },
          {
            "id": "s2_q3",
            "question": {
              "en": "Why would a development team enforce using `git merge --no-ff feature` even if a fast-forward merge is possible?",
              "ja": "Fast-Forward（早送り）マージが可能な状態であるにもかかわらず、開発チームが `git merge --no-ff feature` の使用を強制する理由はなぜ？",
              "vi": "Tại sao một nhóm phát triển lại bắt buộc dùng `git merge --no-ff feature` ngay cả khi có thể thực hiện merge fast-forward?"
            },
            "options": [
              { "en": "To prevent merge conflicts from occurring", "ja": "マージ競合が発生するのを防ぐため", "vi": "Để ngăn chặn xung đột merge xảy ra" },
              { "en": "To create a merge commit, preserving the historical existence of the feature branch and keeping related commits grouped together", "ja": "マージコミットを強制作成し、フィーチャーブランチが過去に存在した事実を残して関連コミットをまとめやすくするため", "vi": "Để tạo ra một merge commit, giúp bảo toàn lịch sử sự tồn tại của nhánh feature và giữ các commit liên quan gộp chung với nhau" },
              { "en": "To make pushing to GitHub faster by reducing file size", "ja": "ファイルサイズを縮小してGitHubへのプッシュを高速化するため", "vi": "Để push lên GitHub nhanh hơn nhờ giảm dung lượng tệp" },
              { "en": "To automatically delete the feature branch after merging", "ja": "マージ完了後にフィーチャーブランチを自動で削除するため", "vi": "Để tự động xóa nhánh feature sau khi merge" }
            ],
            "answer": 1,
            "explanation": {
              "en": "`--no-ff` forces Git to create a merge commit. This maintains the context of the feature branch's lifecycle in the graphical log, making it easy to identify when a feature was integrated and revert the entire merge as a single unit if needed.",
              "ja": "`--no-ff` は常にマージコミットを作ります。これにより、履歴グラフ上でブランチが分岐してマージされた構造が残り、特定の機能開発がどのコミット群で行われたか一目で分かります。",
              "vi": "`--no-ff` bắt buộc Git tạo ra một merge commit. Điều này giúp giữ lại sơ đồ phân nhánh trong lịch sử, ghi nhận sự tồn tại của nhánh feature và giúp dễ dàng revert toàn bộ tính năng đó khi cần."
            }
          },
          {
            "id": "s2_q4",
            "question": {
              "en": "During a merge conflict, you open a file and see this block. What does the section between `<<<<<<< HEAD` and `=======` represent?\n```\n<<<<<<< HEAD\nconst port = 3000;\n=======\nconst port = 8080;\n>>>>>>> feature-api\n```",
              "ja": "マージ競合の発生時にファイルを開くと以下のブロックがありました。`<<<<<<< HEAD` と `=======` の間の内容は表すものはどれ？\n```\n<<<<<<< HEAD\nconst port = 3000;\n=======\nconst port = 8080;\n>>>>>>> feature-api\n```",
              "vi": "Khi xảy ra xung đột merge, bạn mở tệp và thấy khối mã sau. Phần nằm giữa `<<<<<<< HEAD` và `=======` đại diện cho điều gì?\n```\n<<<<<<< HEAD\nconst port = 3000;\n=======\nconst port = 8080;\n>>>>>>> feature-api\n```"
            },
            "options": [
              { "en": "The changes in the branch you are merging into (the current branch you are on)", "ja": "マージ先のブランチ（現在自分がチェックアウトしているブランチ）のコード", "vi": "Các thay đổi ở nhánh đích mà bạn đang merge vào (nhánh hiện tại bạn đang đứng)" },
              { "en": "The changes from the incoming branch being merged (`feature-api`)", "ja": "マージされようとしているブランチ（`feature-api`）のコード", "vi": "Các thay đổi đi vào từ nhánh nguồn đang được merge (`feature-api`)" },
              { "en": "The common ancestor code before both branches made changes", "ja": "双方のブランチが変更を加える前の共通祖先のコード", "vi": "Mã nguồn chung của tổ tiên trước khi cả hai nhánh thực hiện thay đổi" },
              { "en": "A proposed automated resolve suggested by Git database", "ja": "Gitのデータベースが推奨する自動解決案のコード", "vi": "Đề xuất giải quyết tự động do Git gợi ý" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`HEAD` represents your current checked-out branch. The code between `<<<<<<< HEAD` and `=======` is what existed on your current branch before the merge. The code below `=======` and above `>>>>>>> branch-name` is the incoming change.",
              "ja": "`HEAD` は現在の作業ブランチを指します。`<<<<<<< HEAD` から `=======` までは現在チェックアウト中のブランチにある記述で、`=======` から `>>>>>>> feature-api` までは取り込もうとしているブランチの記述です。",
              "vi": "`HEAD` đại diện cho nhánh hiện tại bạn đang đứng. Đoạn code giữa `<<<<<<< HEAD` và `=======` là những gì đang có trên nhánh hiện tại của bạn. Đoạn dưới `=======` là thay đổi đi vào từ nhánh kia."
            }
          },
          {
            "id": "s2_q5",
            "question": {
              "en": "You have resolved a conflict in `index.html` by editing the file. What is the correct next step to complete the merge?",
              "ja": "`index.html`内の競合をファイルを編集して解決しました。マージを完了させるための正しい次の操作はどれ？",
              "vi": "Bạn đã giải quyết xong xung đột trong `index.html` bằng cách sửa tệp. Bước tiếp theo đúng nhất để hoàn tất merge là gì?"
            },
            "options": [
              { "en": "Run `git merge --continue` immediately", "ja": "即座に `git merge --continue` を実行する", "vi": "Chạy ngay lệnh `git merge --continue`" },
              { "en": "Run `git commit -am \"Resolved conflict\"`", "ja": "`git commit -am \"Resolved conflict\"` を実行する", "vi": "Chạy lệnh `git commit -am \"Resolved conflict\"`" },
              { "en": "Run `git add index.html` then run `git merge --continue` (or `git commit`)", "ja": "`git add index.html` でステージングし、その後 `git merge --continue` （または `git commit`）を実行する", "vi": "Chạy `git add index.html` rồi chạy `git merge --continue` (hoặc `git commit`)" },
              { "en": "Run `git push origin current-branch` to let remote server merge it", "ja": "`git push origin current-branch` を行い、リモートサーバーでマージさせる", "vi": "Chạy `git push origin current-branch` để phía remote server tự động merge" }
            ],
            "answer": 2,
            "explanation": {
              "en": "After editing conflicted files, you must stage them using `git add` to mark them as resolved. Then, you run `git merge --continue` (or `git commit`) to write the merge commit.",
              "ja": "手動で競合を解消した後は、まず `git add <file>` でインデックスに追加し、解決したことを Git に知らせる必要があります。その後、`git merge --continue` または `git commit` でマージ処理を締めくくります。",
              "vi": "Sau khi sửa xung đột, bạn phải stage tệp đó bằng `git add` để đánh dấu đã giải quyết xong. Sau đó chạy `git merge --continue` (hoặc `git commit`) để hoàn thành."
            }
          },
          {
            "id": "s2_q6",
            "question": {
              "en": "You started merging a branch but realized there are too many conflicts and you are not ready. Which command restores your workspace to the state before the merge attempt?",
              "ja": "マージを開始したところ想定以上の競合が発生したため、一度作業を取りやめたいです。マージ開始前の状態に安全に戻すコマンドはどれ？",
              "vi": "Bạn bắt đầu merge một nhánh nhưng nhận ra có quá nhiều xung đột và chưa sẵn sàng xử lý. Lệnh nào khôi phục workspace về nguyên trạng trước khi merge?"
            },
            "options": [
              { "en": "git reset --hard HEAD", "ja": "git reset --hard HEAD", "vi": "git reset --hard HEAD" },
              { "en": "git merge --abort", "ja": "git merge --abort", "vi": "git merge --abort" },
              { "en": "git merge --rollback", "ja": "git merge --rollback", "vi": "git merge --rollback" },
              { "en": "git checkout -f main", "ja": "git checkout -f main", "vi": "git checkout -f main" }
            ],
            "answer": 1,
            "explanation": {
              "en": "`git merge --abort` aborts the merge process and tries to reconstruct the pre-merge state. `git reset --hard HEAD` also works but might destroy uncommitted changes you had before starting the merge.",
              "ja": "`git merge --abort` はマージプロセスを中断し、マージ開始前の状態の再現を試みます。`git reset --hard HEAD` でも戻せますが、マージ開始前にあった未コミットのクリーンな状態が失われるリスクがあります。",
              "vi": "`git merge --abort` hủy bỏ quá trình merge và cố gắng khôi phục trạng thái trước khi merge. `git reset --hard HEAD` cũng hoạt động nhưng có thể làm mất các thay đổi chưa commit trước khi bạn chạy lệnh merge."
            }
          },
          {
            "id": "s2_q7",
            "question": {
              "en": "Which command lists all local branches that have already been merged into the current branch?",
              "ja": "現在チェックアウトしているブランチに、すでに統合（マージ）が完了しているローカルブランチの一覧を表示するコマンドはどれ？",
              "vi": "Lệnh nào liệt kê tất cả các nhánh cục bộ đã được merge vào nhánh hiện tại?"
            },
            "options": [
              { "en": "git branch --merged", "ja": "git branch --merged", "vi": "git branch --merged" },
              { "en": "git branch --status", "ja": "git branch --status", "vi": "git branch --status" },
              { "en": "git branch -d", "ja": "git branch -d", "vi": "git branch -d" },
              { "en": "git show-branch --merged", "ja": "git show-branch --merged", "vi": "git show-branch --merged" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git branch --merged` lists branches whose commits are reachable from the current branch's HEAD. They are generally safe to delete using `git branch -d`.",
              "ja": "`git branch --merged` は現在のブランチHEADにマージ済みのブランチをリストします。これらはすでに親ブランチに含まれているため、`git branch -d` で安全に削除できます。",
              "vi": "`git branch --merged` liệt kê các nhánh có commit có thể tiếp cận từ HEAD hiện tại. Các nhánh này thông thường an toàn để xóa bằng `git branch -d`."
            }
          },
          {
            "id": "s2_q8",
            "question": {
              "en": "You try to delete a local branch using `git branch -d feature-x`, but Git prevents you with an error: 'The branch feature-x is not fully merged'. How can you force the deletion if you are sure you want to discard it?",
              "ja": "`git branch -d feature-x` でローカルブランチを削除しようとしましたが、「not fully merged」エラーで拒否されました。マージせずに強制的に削除するコマンドはどれ？",
              "vi": "Bạn muốn xóa nhánh local bằng `git branch -d feature-x`, nhưng Git từ chối với lỗi: 'The branch feature-x is not fully merged'. Làm thế nào để cưỡng chế xóa nếu bạn chắc chắn muốn bỏ nó?"
            },
            "options": [
              { "en": "git branch -D feature-x", "ja": "git branch -D feature-x", "vi": "git branch -D feature-x" },
              { "en": "git branch --force feature-x", "ja": "git branch --force feature-x", "vi": "git branch --force feature-x" },
              { "en": "git branch -d feature-x --force", "ja": "git branch -d feature-x --force", "vi": "git branch -d feature-x --force" },
              { "en": "Both git branch -D feature-x and git branch -d feature-x --force are correct", "ja": "git branch -D feature-x と git branch -d feature-x --force の両方が正しい", "vi": "Cả git branch -D feature-x và git branch -d feature-x --force đều đúng" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git branch -D` is a shortcut for `git branch --delete --force`. While `--force` is a valid modifier for `--delete`, the exact syntax is `git branch -d -f <branch>` or `-D`. Passing `--force` to the end of `-d` is not standard syntactical structure on all git versions, so `-D` is the correct standard choice.",
              "ja": "`git branch -D` は `git branch -d -f`（強制削除）のショートカットです。未マージの変更がありマージ後に完全に統合されていないブランチを強制消去する標準コマンドです。",
              "vi": "`git branch -D` là lối tắt cho `git branch --delete --force`. Nó xóa bỏ nhánh bất chấp việc nhánh đó có các commit chưa được merge vào nhánh chính."
            }
          },
          {
            "id": "s2_q9",
            "question": {
              "en": "How do you rename the current active branch you are working on to `new-feature`?",
              "ja": "現在チェックアウトして作業している現在のブランチの名前を `new-feature` に変更するコマンドはどれ？",
              "vi": "Làm thế ngào để đổi tên nhánh hiện tại bạn đang đứng thành `new-feature`?"
            },
            "options": [
              { "en": "git branch -m new-feature", "ja": "git branch -m new-feature", "vi": "git branch -m new-feature" },
              { "en": "git branch -r new-feature", "ja": "git branch -r new-feature", "vi": "git branch -r new-feature" },
              { "en": "git rename-branch new-feature", "ja": "git rename-branch new-feature", "vi": "git rename-branch new-feature" },
              { "en": "git checkout -m new-feature", "ja": "git checkout -m new-feature", "vi": "git checkout -m new-feature" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git branch -m <new-name>` (or `--move`) renames the current branch. If you want to rename a different branch without checking it out, use `git branch -m <old-name> <new-name>`.",
              "ja": "現在作業中のブランチ名を変更するには `git branch -m <新名>` を使います。別のブランチの名前を変える場合は `git branch -m <旧名> <新名>` です。",
              "vi": "`git branch -m <new-name>` (hoặc `--move`) đổi tên nhánh hiện tại. Để đổi tên một nhánh khác, bạn dùng `git branch -m <old-name> <new-name>`."
            }
          },
          {
            "id": "s2_q10",
            "question": {
              "en": "You need to find the commit where the branch `feature-login` diverged from the `main` branch. Which command finds this common ancestor?",
              "ja": "`feature-login` ブランチが `main` ブランチから分岐した時点のコミット（共通の祖先）を探し出すコマンドはどれ？",
              "vi": "Bạn cần tìm commit nơi nhánh `feature-login` bắt đầu rẽ nhánh khỏi nhánh `main`. Lệnh nào tìm tổ tiên chung này?"
            },
            "options": [
              { "en": "git merge-base main feature-login", "ja": "git merge-base main feature-login", "vi": "git merge-base main feature-login" },
              { "en": "git find-ancestor main feature-login", "ja": "git find-ancestor main feature-login", "vi": "git find-ancestor main feature-login" },
              { "en": "git show-branch --ancestor main feature-login", "ja": "git show-branch --ancestor main feature-login", "vi": "git show-branch --ancestor main feature-login" },
              { "en": "git diff --common main feature-login", "ja": "git diff --common main feature-login", "vi": "git diff --common main feature-login" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git merge-base` finds the best common ancestor(s) between two commits or branches. This commit represents the point where they diverged.",
              "ja": "`git merge-base <branch-A> <branch-B>` は2つのブランチの最良な共通の祖先コミットハッシュを返します。分岐点を確認するのに非常に便利です。",
              "vi": "`git merge-base <branch-A> <branch-B>` tìm commit tổ tiên chung gần nhất giữa hai nhánh, tức là điểm rẽ nhánh của chúng."
            }
          }
        ]
      },
      {
        "id": "set-3",
        "title": { "en": "Set 3: Collaboration & GitHub", "ja": "セット3：共同開発とリモート操作", "vi": "Đề 3: Nhánh remote & Hợp tác GitHub" },
        "description": {
          "en": "Fetch vs pull mechanics, upstream tracking, force-with-lease vs force, and GitHub pull request structures.",
          "ja": "fetchとpullの違い、リモート追跡ブランチの設定、--force-with-lease の安全性、GitHub上でのPR管理を学びます。",
          "vi": "Cơ chế fetch vs pull, upstream tracking, phân biệt force-with-lease vs force, và vận hành Pull Request."
        },
        "questions": [
          {
            "id": "s3_q1",
            "question": {
              "en": "What is the key technical difference between running `git fetch` and `git pull`?",
              "ja": "`git fetch` と `git pull` を実行した際の実装レベルの主な違いは何？",
              "vi": "Khác biệt kỹ thuật cốt lõi giữa hai lệnh `git fetch` và `git pull` là gì?"
            },
            "options": [
              { "en": "`git fetch` only downloads objects from the remote without modifying your local branches, while `git pull` is `git fetch` followed immediately by `git merge` (or rebase)", "ja": "`git fetch` はローカルブランチに影響を与えずにリモートの最新データを取得するだけで、`git pull` は `git fetch` を実行した後に現在のローカルブランチへ自動的に `git merge` （または rebase）を行う", "vi": "`git fetch` chỉ tải dữ liệu từ remote về máy mà không thay đổi nhánh local của bạn, còn `git pull` bằng `git fetch` cộng với việc tự động `git merge` (hoặc rebase) ngay sau đó" },
              { "en": "`git fetch` modifies files in your working directory directly, while `git pull` only updates the stage", "ja": "`git fetch` は直接作業ディレクトリのファイルを更新するが、`git pull` はステージ情報のみ更新する", "vi": "`git fetch` sửa đổi trực tiếp các tệp ở working directory, còn `git pull` chỉ cập nhật index" },
              { "en": "`git pull` uploads commits to the remote, while `git fetch` downloads them", "ja": "`git pull` はリモートにコミットを送信（アップロード）し、`git fetch` は取得（ダウンロード）する", "vi": "`git pull` gửi các commit lên remote, còn `git fetch` tải các commit về" },
              { "en": "There is no difference; `git fetch` is an obsolete alias for `git pull`", "ja": "違いはありません。`git fetch` は非推奨となった `git pull` のエイリアスです", "vi": "Không có sự khác biệt; `git fetch` là tên gọi cũ của `git pull` hiện đã lỗi thời" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git fetch` only downloads changes but doesn't change your working directory or checkout state. `git pull` = `git fetch` + `git merge` (or `git rebase` depending on settings) of the tracked remote branch into your current branch.",
              "ja": "`git fetch` はリモートのオブジェクトや参照情報をダウンロードしますが、手元のブランチは変更しません。`git pull` はそれをダウンロードした上で、現在の作業ブランチにマージ（またはリベース）まで実行します。",
              "vi": "`git fetch` tải về các đối tượng và tham chiếu mới từ remote nhưng không chạm vào thư mục làm việc của bạn. `git pull` tải về và tự động gộp (merge hoặc rebase) vào nhánh hiện tại."
            }
          },
          {
            "id": "s3_q2",
            "question": {
              "en": "You checked out a local branch `feature-dev` but it does not have a tracking upstream branch. Which command pushes this branch to the remote `origin` and configures it to track it?",
              "ja": "ローカルブランチ `feature-dev` にリモートの追跡設定（upstream）がありません。このブランチをリモートの `origin` にプッシュし、同時に追跡を設定するコマンドはどれ？",
              "vi": "Bạn đứng ở nhánh local `feature-dev` chưa được cấu hình upstream. Lệnh nào đẩy nhánh này lên remote `origin` và thiết lập tracking?"
            },
            "options": [
              { "en": "git push -u origin feature-dev", "ja": "git push -u origin feature-dev", "vi": "git push -u origin feature-dev" },
              { "en": "git push --track origin feature-dev", "ja": "git push --track origin feature-dev", "vi": "git push --track origin feature-dev" },
              { "en": "git push --set-upstream feature-dev", "ja": "git push --set-upstream feature-dev", "vi": "git push --set-upstream feature-dev" },
              { "en": "Both git push -u origin feature-dev and git push --set-upstream origin feature-dev are correct", "ja": "git push -u origin feature-dev と git push --set-upstream origin feature-dev の両方が正しい", "vi": "Cả git push -u origin feature-dev và git push --set-upstream origin feature-dev đều đúng" }
            ],
            "answer": 3,
            "explanation": {
              "en": "`-u` is the short alias for `--set-upstream`. Both `git push -u origin <branch>` and `git push --set-upstream origin <branch>` push the branch and configure it to track the remote branch.",
              "ja": "`git push` において `-u` オプションは `--set-upstream` の短縮表記です。一度設定しておけば、次回以降は単に `git push` や `git pull` と実行するだけでよくなります。",
              "vi": "`-u` là từ viết tắt của `--set-upstream`. Cả hai lệnh đều đẩy nhánh lên remote và liên kết nhánh local với nhánh remote tương ứng để phục vụ các lần push/pull sau."
            }
          },
          {
            "id": "s3_q3",
            "question": {
              "en": "Why is it highly recommended to use `git push --force-with-lease` instead of `git push --force` when updating a remote branch with rewritten history?",
              "ja": "履歴を書き換えたブランチをリモートに反映する際、`git push --force` ではなく `git push --force-with-lease` の使用が強く推奨される理由はなぜ？",
              "vi": "Tại sao được khuyến nghị dùng `git push --force-with-lease` thay vì `git push --force` khi cập nhật một remote branch có lịch sử bị sửa đổi?"
            },
            "options": [
              { "en": "`--force-with-lease` checks if anyone else has pushed new commits to the remote branch since your last fetch, and aborts if they have, preventing you from overwriting their work", "ja": "`--force-with-lease` は前回の取得以降に他の人がリモートブランチに新しいコミットをプッシュしているかを自動で検証し、存在する場合は処理を中止して上書きを防ぐため", "vi": "`--force-with-lease` sẽ kiểm tra xem có ai khác đã push commit mới lên remote branch kể từ lần fetch cuối cùng của bạn hay chưa, nếu có nó sẽ báo lỗi để tránh ghi đè lên code của người khác" },
              { "en": "`--force-with-lease` runs tests on GitHub Actions before applying the push", "ja": "`--force-with-lease` はプッシュ適用前に GitHub Actions でビルドチェックを走らせるため", "vi": "`--force-with-lease` bắt buộc kiểm tra build test qua GitHub Actions trước khi push thành công" },
              { "en": "`--force` requires administrator privileges on GitHub, whereas `--force-with-lease` does not", "ja": "`--force` はGitHubの管理者権限が必要だが、`--force-with-lease` は不要であるため", "vi": "`--force` yêu cầu quyền admin của repo, còn `--force-with-lease` thì không" },
              { "en": "`--force-with-lease` is faster because it only pushes the commit hashes", "ja": "`--force-with-lease` はハッシュ値のみを送信するためプッシュ速度が速いため", "vi": "`--force-with-lease` truyền tải nhẹ hơn do chỉ push các mã hash commit" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`--force` blindly overwrites the remote reference. `--force-with-lease` verifies that the remote ref hasn't changed since you last fetched it. If a teammate pushed commits you don't have, Git blocks the push.",
              "ja": "`--force` はリモートの変更を強制上書きし、仲間の新コミットを消去する危険があります。`--force-with-lease` は「自分が把握しているリモートの状態」と「現在の実際のリモート状態」が同一である場合のみ上書きを許可します。",
              "vi": "`--force` ghi đè mù quáng lên nhánh remote. `--force-with-lease` xác nhận xem bản copy remote ở local có khớp với remote thực tế không. Nếu có thành viên khác đã push code lên mà bạn chưa fetch về, lệnh sẽ bị chặn."
            }
          },
          {
            "id": "s3_q4",
            "question": {
              "en": "Which command deletes the remote branch named `feature-old` from the remote repository `origin`?",
              "ja": "リモートリポジトリ `origin` から、`feature-old` という名前のリモートブランチを削除するコマンドはどれ？",
              "vi": "Lệnh nào xóa nhánh remote `feature-old` khỏi remote repository `origin`?"
            },
            "options": [
              { "en": "git push origin --delete feature-old", "ja": "git push origin --delete feature-old", "vi": "git push origin --delete feature-old" },
              { "en": "git push origin :feature-old", "ja": "git push origin :feature-old", "vi": "git push origin :feature-old" },
              { "en": "git remote delete-branch origin feature-old", "ja": "git remote delete-branch origin feature-old", "vi": "git remote delete-branch origin feature-old" },
              { "en": "Both git push origin --delete feature-old and git push origin :feature-old are correct", "ja": "git push origin --delete feature-old と git push origin :feature-old の両方が正しい", "vi": "Cả git push origin --delete feature-old và git push origin :feature-old đều đúng" }
            ],
            "answer": 3,
            "explanation": {
              "en": "Both `git push origin --delete <branch>` and the older refspec syntax `git push origin :<branch>` delete a branch on the remote server. `--delete` is more readable.",
              "ja": "モダンな `git push origin --delete feature-old` と、古い refspec 記法である `git push origin :feature-old`（コロンの後ろを空にすることで空の参照をプッシュする）の両方が、リモートブランチを削除するために使えます。",
              "vi": "Cả `git push origin --delete <branch>` và cú pháp refspec truyền thống `git push origin :<branch>` đều dùng để xóa nhánh trên remote server."
            }
          },
          {
            "id": "s3_q5",
            "question": {
              "en": "What does 'Forking' a repository on GitHub do?",
              "ja": "GitHub上でリポジトリを「フォーク（Fork）」する操作は何を行うもの？",
              "vi": "'Forking' một repository trên GitHub thực chất là làm gì?"
            },
            "options": [
              { "en": "Creates a copy of the repository under your own GitHub account, allowing you to make modifications without affecting the original repository", "ja": "対象リポジトリの複製（コピー）を自分自身のGitHubアカウント配下に作成し、元のリポジトリに影響を与えずに自由に変更できるようにする", "vi": "Tạo một bản sao của repository đó dưới tài khoản GitHub của chính bạn, cho phép sửa đổi mà không ảnh hưởng đến repository gốc" },
              { "en": "Downloads the repository files onto your local hard drive", "ja": "リポジトリの全ファイルをローカルハードディスクにダウンロードする", "vi": "Tải các tệp của repository về ổ cứng local của bạn" },
              { "en": "Splits a branch into two separate distinct development cycles", "ja": "1つのブランチを2つの異なる独立した開発サイクルに分割する", "vi": "Tách một nhánh thành hai chu kỳ phát triển độc lập" },
              { "en": "Converts the Git repository into a Subversion repository format", "ja": "GitリポジトリをSubversionリポジトリ形式に変換する", "vi": "Chuyển đổi định dạng Git repository thành Subversion" }
            ],
            "answer": 0,
            "explanation": {
              "en": "Forking creates a personal copy of someone else's project on GitHub's servers. You can commit to your fork and submit changes back to the original project via a Pull Request.",
              "ja": "フォークはGitHubのサーバー上で他のプロジェクトの個人用コピーを作ります。自分専用の領域になるため自由にコミットやプッシュが行え、完成後に元のリポジトリへ「Pull Request」を送って貢献できます。",
              "vi": "Forking tạo ra một bản sao dự án của người khác trên tài khoản cá nhân của bạn ở máy chủ GitHub. Bạn có thể thay đổi trên fork và gửi đóng góp lại thông qua Pull Request."
            }
          },
          {
            "id": "s3_q6",
            "question": {
              "en": "You cloned a fork of a repository. To keep your fork synced with the original project, you added the original project's URL as a remote named `upstream`. Which command sequence pulls the latest changes from the original project's `main` branch into your active local `main` branch?",
              "ja": "リポジトリのフォークをクローンし、元のプロジェクトのURLを `upstream` という名前のリモートとして追加しました。元のプロジェクトの `main` の最新変更を、手元のローカルの `main` ブランチに同期（取り込み）する正しい手順はどれ？",
              "vi": "Bạn clone một bản fork. Để đồng bộ nó với dự án gốc, bạn đã cấu hình URL gốc làm remote tên là `upstream`. Chuỗi lệnh nào tải thay đổi mới nhất từ nhánh `main` của dự án gốc vào nhánh `main` local?"
            },
            "options": [
              { "en": "git fetch upstream && git merge upstream/main", "ja": "git fetch upstream && git merge upstream/main", "vi": "git fetch upstream && git merge upstream/main" },
              { "en": "git pull origin main --sync", "ja": "git pull origin main --sync", "vi": "git pull origin main --sync" },
              { "en": "git remote update upstream --sync", "ja": "git remote update upstream --sync", "vi": "git remote update upstream --sync" },
              { "en": "git merge upstream main", "ja": "git merge upstream main", "vi": "git merge upstream main" }
            ],
            "answer": 0,
            "explanation": {
              "en": "To sync with upstream: 1) `git fetch upstream` downloads the latest commits from the original repo. 2) `git merge upstream/main` merges the fetched upstream changes into your checked-out local branch.",
              "ja": "`git fetch upstream` で元プロジェクトのコミットを取得し、その後 `git merge upstream/main` を実行して、ローカルの `main` にそれらをマージします。これにより安全にフォーク元と同期できます。",
              "vi": "Để đồng bộ với upstream: 1) `git fetch upstream` tải về các commit mới nhất từ dự án gốc. 2) `git merge upstream/main` gộp các thay đổi đó vào nhánh local hiện tại."
            }
          },
          {
            "id": "s3_q7",
            "question": {
              "en": "What happens when you choose the 'Squash and merge' option on a GitHub Pull Request?",
              "ja": "GitHubのPull Requestにおいて「Squash and merge（スカッシュしてマージ）」オプションを選択すると何が起こる？",
              "vi": "Điều gì xảy ra khi bạn chọn tùy chọn 'Squash and merge' trên một GitHub Pull Request?"
            },
            "options": [
              { "en": "All commits from the PR are combined into a single commit, which is then added to the target branch", "ja": "PR内にあるすべてのコミットが1つのコミットにまとめられ（統合され）、その単一のコミットがマージ先ブランチに追加される", "vi": "Tất cả các commit trong PR sẽ được gộp chung lại thành một commit duy nhất, sau đó commit này được thêm vào nhánh đích" },
              { "en": "The PR branch is squashed to reduce code formatting size, but original commits are preserved in full history", "ja": "PRのブランチ内の空白などを圧縮するが、元の各コミット履歴はそのまま保存される", "vi": "Tối giản định dạng code của PR nhưng vẫn giữ nguyên đầy đủ lịch sử của các commit gốc" },
              { "en": "The changes are discarded and the PR is marked as closed", "ja": "変更内容が破棄され、PR が却下（クローズ）状態になる", "vi": "Các thay đổi bị từ chối và PR được đánh dấu đóng lại" },
              { "en": "It reorders the commits chronologically to clean up merging metadata", "ja": "マージ用メタデータをクリーンにするため、コミットの日時順を並べ替える", "vi": "Sắp xếp lại các commit theo thứ tự thời gian để dọn dẹp metadata của merge" }
            ],
            "answer": 0,
            "explanation": {
              "en": "'Squash and merge' combines all commits on the pull request's branch into a single commit. This helps keep the target branch's (e.g. `main`) commit history clean and linear, eliminating intermediate micro-commits.",
              "ja": "「Squash and merge」は、プルリクエストで発生した多数の細かな開発コミットをマージ時に1つにまとめ上げます。これにより、マージ先ブランチ（`main`など）の履歴が整理されて見やすくなります。",
              "vi": "'Squash and merge' gộp tất cả các commit nhỏ trong nhánh PR thành một commit duy nhất. Việc này giúp lịch sử commit của nhánh đích (ví dụ `main`) gọn gàng và có dạng tuyến tính."
            }
          },
          {
            "id": "s3_q8",
            "question": {
              "en": "When team members delete branches on the remote repository after merging PRs, your local Git repository still shows references to those remote branches (e.g., `origin/feature-x`). Which command cleans up these stale references locally?",
              "ja": "PRマージ後に他のメンバーがリモート上のブランチを削除しても、手元のローカルリポジトリには古いリモート追跡参照（例：`origin/feature-x`）が残ったままになります。これらの古い参照をローカルで掃除するコマンドはどれ？",
              "vi": "Khi thành viên trong nhóm xóa nhánh trên remote repo sau khi merge PR, máy local của bạn vẫn giữ tham chiếu cũ (ví dụ `origin/feature-x`). Lệnh nào dọn sạch các tham chiếu lỗi thời này?"
            },
            "options": [
              { "en": "git fetch --prune", "ja": "git fetch --prune", "vi": "git fetch --prune" },
              { "en": "git remote clean origin", "ja": "git remote clean origin", "vi": "git remote clean origin" },
              { "en": "git branch -d -r origin", "ja": "git branch -d -r origin", "vi": "git branch -d -r origin" },
              { "en": "git pull --delete-branches", "ja": "git pull --delete-branches", "vi": "git pull --delete-branches" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git fetch --prune` (or `git remote prune origin`) fetches updates and removes any local tracking branches that describe branches no longer existing on the remote server.",
              "ja": "`git fetch --prune`（または `git remote prune origin`）は、リモート上ですでに削除されたブランチに対応するローカルのリモート追跡ブランチを削除し、ローカルを最新の状態に同期します。",
              "vi": "`git fetch --prune` (hoặc `git remote prune origin`) sẽ đồng bộ thông tin và tự động xóa bỏ các liên kết đến các nhánh không còn tồn tại trên remote server."
            }
          },
          {
            "id": "s3_q9",
            "question": {
              "en": "What is the correct way to create a local tag named `v1.0.0` pointing to the current commit, and then push it to the remote repository `origin`?",
              "ja": "現在のコミットを指す `v1.0.0` という名前のタグをローカルで作成し、それをリモート `origin` にプッシュする正しいコマンドの組み合わせはどれ？",
              "vi": "Cách đúng để tạo một tag tên là `v1.0.0` chỉ vào commit hiện tại ở local, và đẩy tag này lên remote repository `origin`?"
            },
            "options": [
              { "en": "git tag v1.0.0 && git push origin v1.0.0", "ja": "git tag v1.0.0 && git push origin v1.0.0", "vi": "git tag v1.0.0 && git push origin v1.0.0" },
              { "en": "git create-tag v1.0.0 && git push origin --tags", "ja": "git create-tag v1.0.0 && git push origin --tags", "vi": "git create-tag v1.0.0 && git push origin --tags" },
              { "en": "git tag -a v1.0.0 && git push origin --all", "ja": "git tag -a v1.0.0 && git push origin --all", "vi": "git tag -a v1.0.0 && git push origin --all" },
              { "en": "git tag --push v1.0.0 origin", "ja": "git tag --push v1.0.0 origin", "vi": "git tag --push v1.0.0 origin" }
            ],
            "answer": 0,
            "explanation": {
              "en": "You create a tag locally using `git tag <tagname>`. Because tags are not pushed automatically by default `git push`, you must push them explicitly: `git push origin <tagname>` (or `git push origin --tags` to push all tags).",
              "ja": "まず `git tag v1.0.0` でローカルにタグを作ります。タグは通常の `git push` ではリモートに送られないため、`git push origin v1.0.0` または `git push origin --tags` を使って明示的にプッシュします。",
              "vi": "Bạn tạo tag local bằng `git tag v1.0.0`. Vì tag mặc định không được đẩy đi khi push thường, bạn cần push chỉ định: `git push origin v1.0.0` hoặc `git push origin --tags`."
            }
          },
          {
            "id": "s3_q10",
            "question": {
              "en": "What happens when you run `git remote set-url origin <new-url>`?",
              "ja": "`git remote set-url origin <new-url>` を実行すると、リポジトリにどのような変更が適用される？",
              "vi": "Khi bạn chạy lệnh `git remote set-url origin <new-url>`, thay đổi nào được áp dụng cho repository?"
            },
            "options": [
              { "en": "It changes the URL of your default remote named 'origin' to point to the new location", "ja": "'origin' という名前の既存のリモート接続先のURLアドレスを、新しい場所に変更する", "vi": "Nó thay đổi URL của remote mặc định tên là 'origin' trỏ sang địa chỉ mới" },
              { "en": "It registers a secondary backup URL for origin to pull from if the primary fails", "ja": "プライマリ接続が失敗した際に origin からデータを取得するための、予備のバックアップURLを登録する", "vi": "Nó đăng ký một URL dự phòng cho origin nếu kết nối chính bị lỗi" },
              { "en": "It deletes the local origin branch and clones the new URL in its place", "ja": "ローカルの origin ブランチを削除し、代わりに新しい URL をクローンし直す", "vi": "Nó xóa bỏ nhánh origin local và clone lại từ URL mới" },
              { "en": "It logs your system user credentials to authenticate with the new URL", "ja": "新しい URL に対するシステムの認証情報を記録する", "vi": "Nó ghi lại thông tin tài khoản đăng nhập để chứng thực với URL mới" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git remote set-url origin <new-url>` updates the fetch/push URL configured under the remote name `origin`. It is useful when renaming repositories or switching protocol from HTTPS to SSH.",
              "ja": "`git remote set-url origin <URL>` は、登録済みリモート名 `origin` の指し示すURL設定を書き換えます。HTTPSからSSH通信へ切り替える際などに多用します。",
              "vi": "`git remote set-url origin <new-url>` cập nhật địa chỉ URL dùng để fetch/push cho remote tên là `origin`. Thường dùng khi chuyển từ giao thức HTTPS sang SSH."
            }
          }
        ]
      },
      {
        "id": "set-4",
        "title": { "en": "Set 4: Advanced & History Rewriting", "ja": "セット4：応用と履歴操作", "vi": "Đề 4: Kỹ thuật nâng cao & Sửa đổi lịch sử" },
        "description": {
          "en": "Deeper understanding of rebase mechanics, interactive rebase, reset modes (soft/mixed/hard), revert safety, and reflogs.",
          "ja": "rebaseの仕組み、対話的リベース(rebase -i)、resetの3つのモード、revertによる公開履歴の安全な打消し、reflogでの復元を学びます。",
          "vi": "Hiểu sâu về cơ chế rebase, rebase tương tác (-i), các chế độ reset (soft/mixed/hard), độ an toàn của revert, và reflog."
        },
        "questions": [
          {
            "id": "s4_q1",
            "question": {
              "en": "Conceptually, how does `git rebase main` differ from `git merge main` when executed on a branch `feature`?",
              "ja": "`feature` ブランチ上で `git rebase main` を実行した場合、`git merge main` を実行したときと比べて履歴がどのように変化する？",
              "vi": "Về mặt khái niệm, `git rebase main` khác gì so với `git merge main` khi được thực thi trên nhánh `feature`?"
            },
            "options": [
              { "en": "`git merge` creates a new merge commit preserving branch branches, whereas `git rebase` temporarily stashes your feature commits, updates your branch's base to the latest commit on `main`, and re-applies your commits one-by-one on top of it, creating a linear history", "ja": "`git merge` はマージコミットを作り分岐構造を維持しますが、`git rebase` は現在のブランチのコミットを一時退避させ、ブランチの基点（ベース）を `main` の最新コミットまで進めた上で、退避していたコミットをその上に順番に適用し直し、直線的な履歴を作ります", "vi": "`git merge` tạo ra một merge commit mới bảo toàn nhánh cũ, còn `git rebase` tạm cất các commit của feature đi, cập nhật điểm xuất phát của nhánh feature lên commit mới nhất của `main`, rồi áp lại từng commit kia lên đầu tạo lịch sử tuyến tính" },
              { "en": "`git rebase` deletes the `main` branch, while `git merge` retains it", "ja": "`git rebase` は `main` ブランチを削除するが、`git merge` はそれを維持する", "vi": "`git rebase` sẽ xóa nhánh `main`, trong khi `git merge` giữ lại" },
              { "en": "`git merge` rewrites history, whereas `git rebase` guarantees that commit hashes are never changed", "ja": "`git merge` は履歴を書き換えるが、`git rebase` はコミットハッシュが絶対に変更されないことを保証する", "vi": "`git merge` viết lại lịch sử, còn `git rebase` đảm bảo các mã hash commit không bị thay đổi" },
              { "en": "Rebasing only synchronizes metadata, while merging moves physical file diffs", "ja": "リベースはメタデータの同期のみを行い、マージは物理的なファイルの差分を移動する", "vi": "Rebasing chỉ đồng bộ hóa metadata, còn merging di chuyển nội dung khác biệt vật lý của tệp" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git merge` combines branches with a merge commit. `git rebase` reapplies commits on top of another base tip, which rewrites history because new commits with different parentage (and thus new hashes) are created. This results in a cleaner, linear history.",
              "ja": "`git merge` は分岐履歴をそのまま残すのに対し、`git rebase` は現在のブランチの根元を他のブランチの先端にすげ替えます。コミットは再適用（新ハッシュで再作成）され、履歴は一本のクリーンな直線になります。",
              "vi": "`git merge` gộp hai nhánh bằng một merge commit. `git rebase` áp dụng lại các commit lên trên một điểm xuất phát mới, điều này viết lại lịch sử vì nó tạo ra các commit mới với mã hash mới."
            }
          },
          {
            "id": "s4_q2",
            "question": {
              "en": "You are doing an interactive rebase (`git rebase -i HEAD~3`). In the editor, you see lines representing the three commits. Which instruction action should you use if you want to modify a commit's message but keep its changes intact?",
              "ja": "対話的リベース（`git rebase -i HEAD~3`）を実行しました。エディタ内で、コミットの内容を変更せず、コミットメッセージのみを修正したい場合に指定するコマンド指示はどれ？",
              "vi": "Bạn chạy rebase tương tác (`git rebase -i HEAD~3`). Trong trình soạn thảo, lệnh nào dùng để sửa tin nhắn commit (commit message) của commit đó nhưng vẫn giữ nguyên thay đổi?"
            },
            "options": [
              { "en": "edit (e)", "ja": "edit (e)", "vi": "edit (e)" },
              { "en": "squash (s)", "ja": "squash (s)", "vi": "squash (s)" },
              { "en": "reword (r)", "ja": "reword (r)", "vi": "reword (r)" },
              { "en": "fixup (f)", "ja": "fixup (f)", "vi": "fixup (f)" }
            ],
            "answer": 2,
            "explanation": {
              "en": "`reword` (r) stops the rebase execution to let you edit the commit message without modifying the commit contents. `edit` (e) stops to let you edit files as well. `fixup` combines the commit but discards its message.",
              "ja": "`reword` は、コミット内容はそのままにメッセージのみを書き直すための命令です。`edit` はコードの修正や追加コミットができるように一時停止します。`fixup` はメッセージを破棄してマージします。",
              "vi": "`reword` (r) dừng lại để bạn đổi tin nhắn commit mà không đổi nội dung. `edit` (e) dừng lại cho phép sửa đổi mã nguồn. `fixup` gộp commit và bỏ tin nhắn commit cũ."
            }
          },
          {
            "id": "s4_q3",
            "question": {
              "en": "On a branch shared with other developers, you need to undo the effects of a specific commit `a1b2c3d` that has already been pushed to the remote. What is the safest way to do this?",
              "ja": "共同開発中の共有ブランチで、すでにプッシュ済みのコミット `a1b2c3d` の変更を取り消したいです。履歴の整合性を壊さずに取り消す最も安全な方法はどれ？",
              "vi": "Trên nhánh dùng chung với các lập trình viên khác, bạn cần thu hồi ảnh hưởng của commit `a1b2c3d` đã được push lên remote. Cách làm nào an toàn nhất?"
            },
            "options": [
              { "en": "Run `git revert a1b2c3d` and push the new commit", "ja": "`git revert a1b2c3d` を実行し、生成された新しいコミットをプッシュする", "vi": "Chạy lệnh `git revert a1b2c3d` và push commit mới lên" },
              { "en": "Run `git reset --hard a1b2c3d~1` and force push", "ja": "`git reset --hard a1b2c3d~1` を実行して強制プッシュする", "vi": "Chạy `git reset --hard a1b2c3d~1` và force push" },
              { "en": "Run `git rebase -i` to delete the commit and force push", "ja": "`git rebase -i` で該当コミットの行を消去して強制プッシュする", "vi": "Chạy `git rebase -i` để xóa bỏ dòng commit đó và force push" },
              { "en": "Delete the branch locally, recreate it from remote main, and copy files over", "ja": "ブランチをローカルで一度削除し、リモートのmainから作り直してファイルを上書きコピーする", "vi": "Xóa nhánh local, tạo lại từ remote main, rồi copy tệp đè lên" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git revert` generates a new commit that applies the exact inverse changes of the specified commit. This does not rewrite existing public history, making it completely safe for shared branches.",
              "ja": "`git revert` は、指定したコミットと「真逆の変更を行う」新しいコミットを生成します。既存の歴史を一切書き換えないため、すでにプッシュされ他人が取得しているブランチで安全に変更を打ち消せます。",
              "vi": "`git revert` sinh ra một commit mới chứa thay đổi ngược lại hoàn toàn so với commit chỉ định. Nó không viết lại lịch sử cũ, cực kỳ an toàn cho các nhánh cộng tác chung."
            }
          },
          {
            "id": "s4_q4",
            "question": {
              "en": "What is the function of the command `git cherry-pick e5f6g7h`?",
              "ja": "`git cherry-pick e5f6g7h` コマンドはどのような処理を行うもの？",
              "vi": "Lệnh `git cherry-pick e5f6g7h` có chức năng gì?"
            },
            "options": [
              { "en": "It copies the changes introduced by the commit `e5f6g7h` and applies them as a new commit on the current checked-out branch", "ja": "コミット `e5f6g7h` で導入された変更点のみをコピーし、現在チェックアウトしているブランチの先端に新しいコミットとして適用する", "vi": "Nó sao chép những thay đổi của commit `e5f6g7h` và áp dụng thành một commit mới trên nhánh hiện tại bạn đang đứng" },
              { "en": "It merges all commits from the branch containing commit `e5f6g7h` up to that commit", "ja": "コミット `e5f6g7h` を含むブランチの、そのコミットまでのすべての歴史をマージする", "vi": "Nó merge tất cả commit từ nhánh chứa `e5f6g7h` cho đến đúng commit đó" },
              { "en": "It deletes the commit `e5f6g7h` from the repository history", "ja": "リポジトリの履歴からコミット `e5f6g7h` を削除する", "vi": "Nó xóa bỏ commit `e5f6g7h` khỏi lịch sử repository" },
              { "en": "It compares commit `e5f6g7h` with HEAD and launches a merge tool", "ja": "コミット `e5f6g7h` と HEAD を比較してマージツールを起動する", "vi": "So sánh commit `e5f6g7h` với HEAD và khởi chạy công cụ merge" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git cherry-pick` applies the changes of a single specific commit from another branch onto your current branch, creating a new commit with a new hash.",
              "ja": "`git cherry-pick` は、別のブランチにある特定の「1つのコミット」だけを狙い撃ちして、現在のブランチにコピーして適用するコマンドです。",
              "vi": "`git cherry-pick` sao chép các sửa đổi của đúng một commit cụ thể từ nhánh khác sang nhánh hiện tại, tạo ra commit mới với mã hash mới."
            }
          },
          {
            "id": "s4_q5",
            "question": {
              "en": "How do the three modes of `git reset` (`--soft`, `--mixed`, `--hard`) affect your staged changes (index) and unstaged changes (working directory) when rolling back HEAD?",
              "ja": "`git reset` の3つのモード（`--soft`, `--mixed`, `--hard`）は、ステージングエリア（インデックス）とワークツリー（作業ディレクトリ）のファイル内容にそれぞれどのような影響を与える？",
              "vi": "Ba chế độ của `git reset` (`--soft`, `--mixed`, `--hard`) ảnh hưởng như thế nào đến staging area (index) và working directory khi quay lui HEAD?"
            },
            "options": [
              { "en": "`--soft` keeps all modifications in staging; `--mixed` (default) unstages changes but keeps them in working directory; `--hard` discards all modifications in both staging and working directory", "ja": "`--soft` は変更をステージングに残す。`--mixed`（デフォルト）はステージングは外すがワークツリーに変更を残す。`--hard` はステージングもワークツリーの変更もすべて破棄する", "vi": "`--soft` giữ lại mọi sửa đổi trong vùng staging; `--mixed` (mặc định) hủy stage các sửa đổi nhưng vẫn giữ lại ở working directory; `--hard` loại bỏ toàn bộ sửa đổi ở cả staging và working directory" },
              { "en": "`--soft` discards working directory changes; `--mixed` discards staging; `--hard` preserves everything in staging", "ja": "`--soft` はワークツリーをクリアする。`--mixed` はステージングをクリアする。`--hard` はステージングの内容をすべて維持する", "vi": "`--soft` xóa sạch working directory; `--mixed` xóa sạch staging; `--hard` giữ lại mọi thứ ở staging" },
              { "en": "There is no difference in staging; they only affect the commit message preservation", "ja": "ステージングへの影響に違いはなく、コミットメッセージが保存されるかどうかにのみ影響します", "vi": "Không có sự khác biệt ở staging; chúng chỉ ảnh hưởng đến việc giữ lại tin nhắn commit" },
              { "en": "`--hard` only deletes untracked files, leaving tracked files untouched", "ja": "`--hard` は未追跡ファイルのみを削除し、追跡済みファイルは変更しない", "vi": "`--hard` chỉ xóa tệp untracked, giữ nguyên các tệp đã được track" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`--soft` moves HEAD back but leaves staging and working directory unchanged. `--mixed` moves HEAD back and clears staging, but leaves files in working directory modified. `--hard` resets HEAD, staging, and working directory, wiping out all uncommitted changes.",
              "ja": "`--soft` はコミットのみを取り消します（変更ファイルはステージ中）。`--mixed` はコミットとステージを取り消します（変更ファイルは未ステージ状態で残る）。`--hard` はコミット、ステージ、ワークツリーのすべてを強制的に取り消し、変更を全消去します。",
              "vi": "`--soft` lùi HEAD nhưng giữ nguyên staging và working directory. `--mixed` lùi HEAD và dọn sạch staging, nhưng giữ lại các file bị sửa ở working directory. `--hard` lùi HEAD và xóa sạch mọi sửa đổi ở cả staging lẫn working directory."
            }
          },
          {
            "id": "s4_q6",
            "question": {
              "en": "You accidentally ran `git reset --hard HEAD~1` and lost a local commit that was not pushed. How can you find the hash of the lost commit and recover it?",
              "ja": "誤って `git reset --hard HEAD~1` を実行し、未プッシュのローカルコミットを失ってしまいました。失われたコミットのハッシュ値を見つけ出して復元する正しい手順はどれ？",
              "vi": "Bạn vô tình chạy `git reset --hard HEAD~1` và làm mất một commit local chưa kịp push. Làm cách nào để tìm lại mã hash của commit bị mất và khôi phục nó?"
            },
            "options": [
              { "en": "Run `git reflog` to view HEAD movement history, find the hash before the reset, and run `git reset --hard <hash>`", "ja": "`git reflog` を実行してHEADの移動履歴を確認し、リセット前のコミットハッシュを探して `git reset --hard <hash>` を実行する", "vi": "Chạy `git reflog` để xem lịch sử dịch chuyển của HEAD, tìm mã hash trước thời điểm bị reset, rồi chạy `git reset --hard <hash>`" },
              { "en": "Check the `.git/lost-found` directory for the backup files", "ja": "`.git/lost-found` ディレクトリを開き、バックアップファイルから復元する", "vi": "Kiểm tra thư mục `.git/lost-found` để tìm các tệp sao lưu" },
              { "en": "Once reset --hard is run, the commits are immediately purged and cannot be recovered under any circumstance", "ja": "reset --hard を実行するとコミットは即座に完全消去され、いかなる方法でも復元できません", "vi": "Một khi reset --hard đã chạy, các commit bị xóa vĩnh viễn và không thể khôi phục" },
              { "en": "Run `git undo` in the terminal", "ja": "ターミナルで `git undo` コマンドを実行する", "vi": "Chạy lệnh `git undo` trên terminal" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git reflog` records updates to the tips of branches and other references. Even if a commit is no longer linked to a branch due to a hard reset, the reflog keeps the reference for a few weeks, allowing you to checkout or reset back to it.",
              "ja": "`git reflog` はHEADポインタのあらゆる履歴（コミット、チェックアウト、リセットなど）を克明に記録しています。ブランチから見えなくなった「迷子」のコミットハッシュもここから救出可能です。",
              "vi": "`git reflog` ghi lại mọi thay đổi của đầu các nhánh và HEAD. Dù commit không còn thuộc nhánh nào sau khi reset hard, reflog vẫn giữ tham chiếu đó trong khoảng vài tuần, giúp bạn khôi phục dễ dàng."
            }
          },
          {
            "id": "s4_q7",
            "question": {
              "en": "What is the 'Golden Rule of Rebasing' regarding remote shared branches?",
              "ja": "リモートの共有ブランチに関する「リベースの黄金律（Golden Rule of Rebasing）」はどれ？",
              "vi": "'Nguyên tắc vàng của việc Rebase' (Golden Rule of Rebasing) liên quan đến các nhánh dùng chung trên remote là gì?"
            },
            "options": [
              { "en": "Never rebase branches that have been pushed to a public or shared repository where others are collaborating", "ja": "他人が共同作業をしている公開リポジトリや共有ブランチに、すでにプッシュしたコミットをリベースしてはならない", "vi": "Không bao giờ rebase các nhánh đã được push lên repository công khai hoặc dùng chung nơi người khác đang làm việc" },
              { "en": "Always rebase public branches before staging new changes", "ja": "新しい変更をステージする前に、常に公開ブランチをリベースしなければならない", "vi": "Luôn rebase các nhánh public trước khi stage thay đổi mới" },
              { "en": "Rebasing should only be done on branches with active merge conflicts", "ja": "リベースは、アクティブなマージ競合があるブランチに対してのみ行うべきである", "vi": "Chỉ nên thực hiện rebase trên các nhánh đang có xung đột merge" },
              { "en": "Never rebase your own local branches before pushing them", "ja": "ローカルブランチをプッシュする前に、自分自身のローカル内でリベースしてはならない", "vi": "Không bao giờ rebase nhánh local của bạn trước khi push chúng" }
            ],
            "answer": 0,
            "explanation": {
              "en": "The golden rule is: never rebase commits that exist outside of your local repository. Rebasing rewrites commits, which changes their hashes. If others base their work on the original commits, their history will diverge terribly, causing major merge headaches.",
              "ja": "リベースの黄金律は「共有ブランチをリベースしないこと」です。リベースは既存のコミットハッシュを書き換えるため、他人がすでにそのコミットを起点に作業を開始していた場合、履歴の競合が複雑化し大混乱を引き起こします。",
              "vi": "Nguyên tắc vàng là: không bao giờ rebase các commit đã nằm ngoài phạm vi local repo của bạn. Rebase viết lại lịch sử commit. Nếu người khác kéo code về và làm tiếp trên commit gốc, lịch sử sẽ bị rẽ nhánh rất phức tạp."
            }
          },
          {
            "id": "s4_h8",
            "question": {
              "en": "You are resolving conflicts during `git rebase main`. After editing the files and staging the changes with `git add`, which command do you use to continue the rebase process?",
              "ja": "`git rebase main` の実行中に競合が発生しました。ファイルを編集して `git add` でステージした後、リベース処理を再開するコマンドはどれ？",
              "vi": "Bạn đang giải quyết xung đột khi chạy `git rebase main`. Sau khi sửa tệp và stage thay đổi bằng `git add`, bạn dùng lệnh nào để tiếp tục?"
            },
            "options": [
              { "en": "git rebase --continue", "ja": "git rebase --continue", "vi": "git rebase --continue" },
              { "en": "git commit -m \"Resolved conflicts\"", "ja": "git commit -m \"Resolved conflicts\"", "vi": "git commit -m \"Resolved conflicts\"" },
              { "en": "git merge --continue", "ja": "git merge --continue", "vi": "git merge --continue" },
              { "en": "git rebase --resume", "ja": "git rebase --resume", "vi": "git rebase --resume" }
            ],
            "answer": 0,
            "explanation": {
              "en": "During a rebase, conflict resolution does not end with a commit. Instead, you run `git rebase --continue` to apply the current resolved commit and proceed to apply the next commit in the rebase queue.",
              "ja": "リベース時の競合解決では `git commit` は行いません。`git add` 後に `git rebase --continue` を実行して、リベースシーケンスにおける次のコミットの適用へ進めます。",
              "vi": "Trong quá trình rebase, việc sửa xung đột không kết thúc bằng lệnh commit. Thay vào đó bạn chạy `git rebase --continue` để Git tự động tạo commit tương ứng và chuyển qua áp dụng commit tiếp theo."
            }
          },
          {
            "id": "s4_q9",
            "question": {
              "en": "During an interactive rebase, you want to combine the changes of the last 2 commits into a single commit, and discard the commit message of the second commit, keeping only the first commit's message. Which command should you choose for the second commit?",
              "ja": "対話的リベースにおいて、直近の2つのコミットを1つにまとめたいです。その際、2番目のコミットメッセージは完全に破棄し、1番目のコミットメッセージのみを残すために、2番目のコミット行に指定する命令はどれ？",
              "vi": "Trong rebase tương tác, bạn muốn gộp 2 commit gần nhất làm một, đồng thời bỏ tin nhắn commit của commit thứ hai và chỉ giữ lại tin nhắn của commit thứ nhất. Lệnh nào phù hợp cho commit thứ hai?"
            },
            "options": [
              { "en": "squash (s)", "ja": "squash (s)", "vi": "squash (s)" },
              { "en": "fixup (f)", "ja": "fixup (f)", "vi": "fixup (f)" },
              { "en": "drop (d)", "ja": "drop (d)", "vi": "drop (d)" },
              { "en": "reword (r)", "ja": "reword (r)", "vi": "reword (r)" }
            ],
            "answer": 1,
            "explanation": {
              "en": "`squash` combines the commits and prompts you to edit the combined commit message. `fixup` combines the commits but automatically discards the message of that commit, using the message of the parent commit directly.",
              "ja": "`squash` はコミットを統合して、双方のメッセージを編集する画面を起動します。`fixup` はメッセージ編集画面を開かず、自動的に統合対象のメッセージを破棄してマージします。",
              "vi": "`squash` gộp các commit và yêu cầu bạn sửa lại tin nhắn gộp. `fixup` gộp các commit nhưng tự động bỏ qua tin nhắn của commit đang gộp và dùng luôn tin nhắn của commit cha."
            }
          },
          {
            "id": "s4_q10",
            "question": {
              "en": "What is a 'detached HEAD' state in Git?",
              "ja": "Gitにおける「detached HEAD（分離されたHEAD）」状態とはどのような状態？",
              "vi": "Trạng thái 'detached HEAD' trong Git nghĩa là gì?"
            },
            "options": [
              { "en": "Your local repository has lost connection to the remote repository origin", "ja": "ローカルリポジトリがリモートの origin との接続を失った状態", "vi": "Repository local bị mất kết nối tới remote repository origin" },
              { "en": "HEAD points directly to a specific commit instead of pointing to a local branch reference", "ja": "HEADがローカルブランチの参照名ではなく、特定の特定のコミットハッシュを直接指し示している状態", "vi": "HEAD đang trỏ trực tiếp đến một commit cụ thể thay vì trỏ đến một tham chiếu nhánh local" },
              { "en": "The .git/HEAD file is corrupt and cannot be read by Git", "ja": "`.git/HEAD` ファイルが破損し、Git が読み込めなくなっている状態", "vi": "Tệp `.git/HEAD` bị hỏng khiến Git không thể đọc được thông tin" },
              { "en": "You deleted the active branch while you were working on it", "ja": "作業中に、現在アクティブになっているブランチを削除した状態", "vi": "Bạn đã xóa nhánh đang đứng trong khi vẫn đang làm việc trên đó" }
            ],
            "answer": 1,
            "explanation": {
              "en": "Normally HEAD points to a branch reference, which automatically advances when you make commits. In a 'detached HEAD' state, HEAD points to a specific commit. Commits made here do not belong to any branch and can easily be lost if you switch branches without creating a new branch first.",
              "ja": "通常、HEADはブランチの参照先を指しており、コミットすると連動して進みます。特定のコミット（やタグ）を直接チェックアウトすると、ブランチから切り離された「detached HEAD」となり、ここでの新しいコミットはどのブランチにも紐づかないため、切り替え後に迷子になります。",
              "vi": "Bình thường HEAD trỏ vào tham chiếu nhánh, nhánh trỏ vào commit. Ở trạng thái 'detached HEAD', HEAD trỏ thẳng vào commit. Các commit mới tạo ở đây sẽ không thuộc nhánh nào và có thể bị mất nếu bạn chuyển đi nơi khác."
            }
          }
        ]
      },
      {
        "id": "set-5",
        "title": { "en": "Set 5: Troubleshooting & Recovery", "ja": "セット5：トラブル解決とリカバリー", "vi": "Đề 5: Giải quyết sự cố & Khôi phục" },
        "description": {
          "en": "Stash advanced usage, cleaning untracked objects, debugging with bisect, recovering deleted branches, and blame audits.",
          "ja": "stashの高度な退避操作、cleanによるファイルの掃除、bisectによるバグ特定、削除されたブランチの復元、blameによる履歴調査を学びます。",
          "vi": "Kỹ thuật nâng cao với stash, dọn dẹp tệp với clean, dò lỗi bằng bisect, khôi phục nhánh đã xóa và tra cứu git blame."
        },
        "questions": [
          {
            "id": "s5_q1",
            "question": {
              "en": "You have unstaged changes and need to stash them. What is the difference between `git stash pop` and `git stash apply`?",
              "ja": "一時退避（stash）した作業を書き戻したいです。`git stash pop` と `git stash apply` の違いは何？",
              "vi": "Bạn đang có các thay đổi được lưu tạm thời. Sự khác biệt giữa `git stash pop` và `git stash apply` là gì?"
            },
            "options": [
              { "en": "`pop` applies the changes and deletes the stash entry from the stash list, while `apply` applies the changes but retains the entry in the stash list", "ja": "`pop` は変更を適用した後にスタッシュリストからその退避データを削除するが、`apply` は変更を適用しつつスタッシュリストにも退避データを保持し続ける", "vi": "`pop` áp dụng các thay đổi đồng thời xóa bản stash đó khỏi danh sách stash, còn `apply` áp dụng thay đổi nhưng vẫn giữ lại bản ghi trong danh sách stash" },
              { "en": "`apply` deletes the stash, whereas `pop` keeps it", "ja": "`apply` はスタッシュデータを削除し、`pop` は保持する", "vi": "`apply` xóa stash, còn `pop` giữ lại" },
              { "en": "`pop` can only resolve merge conflicts, while `apply` cannot", "ja": "`pop` はマージ競合を解決できるが、`apply` は解決できない", "vi": "`pop` chỉ xử lý được xung đột merge, còn `apply` thì không" },
              { "en": "There is no difference; they are aliases", "ja": "違いはありません。まったくの同一コマンドです", "vi": "Không có sự khác biệt; chúng là hai tên gọi khác nhau của cùng một lệnh" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git stash pop` applies the stash and immediately deletes it from the stash stack. `git stash apply` applies it but leaves it in the stash stack, allowing you to re-apply it elsewhere or keep a backup.",
              "ja": "`pop` は適用成功時にスタッシュスタックから自動削除します。`apply` はスタックに残したまま適用するため、同じ退避データを別のブランチなどへ繰り返し適用したいときに便利です。",
              "vi": "`git stash pop` áp dụng và xóa bản stash khỏi hàng đợi ngay lập tức. `git stash apply` áp dụng nhưng giữ nguyên bản stash giúp bạn có thể áp dụng lại ở nhánh khác."
            }
          },
          {
            "id": "s5_q2",
            "question": {
              "en": "By default, `git stash` only stashes tracked files. How can you stash your changes and also include new, untracked files in the stash?",
              "ja": "デフォルトの `git stash` は追跡対象ファイルのみを一時退避します。新しく作成した「未追跡（Untracked）」のファイルも含めて一時退避するコマンドはどれ？",
              "vi": "Mặc định `git stash` chỉ lưu trữ các tệp đã được track. Làm thế nào để stash cả các tệp untracked mới được tạo?"
            },
            "options": [
              { "en": "git stash -u (or --include-untracked)", "ja": "git stash -u (または --include-untracked)", "vi": "git stash -u (hoặc --include-untracked)" },
              { "en": "git stash --all", "ja": "git stash --all", "vi": "git stash --all" },
              { "en": "git stash --force", "ja": "git stash --force", "vi": "git stash --force" },
              { "en": "Both git stash -u and git stash --all are correct", "ja": "git stash -u と git stash --all の両方が正しい", "vi": "Cả git stash -u và git stash --all đều đúng" }
            ],
            "answer": 3,
            "explanation": {
              "en": "`-u` (or `--include-untracked`) stashes untracked files. `--all` (or `-a`) stashes both untracked files and ignored files (defined in `.gitignore`) in addition to tracked files. Both will include untracked files.",
              "ja": "`git stash -u`（または `--include-untracked`）は未追跡ファイルを退避に含めます。`git stash --all` は未追跡に加え、gitignoreされている除外ファイルもすべて含めて退避します。したがって両者とも未追跡を含めることが可能です。",
              "vi": "`git stash -u` (hoặc `--include-untracked`) lưu trữ thêm các tệp untracked. `--all` lưu cả tệp untracked lẫn các tệp bị ignored trong `.gitignore`. Do đó cả hai đều lưu tệp untracked."
            }
          },
          {
            "id": "s5_q3",
            "question": {
              "en": "You have a large commit history and a bug was introduced somewhere in the past 100 commits. Which Git tool helps you find the exact commit that introduced the bug using binary search?",
              "ja": "コミット履歴が膨大で、過去100回のコミットの中のどこかでバグが混入しました。二分探索を用いてバグを引き起こした特定のコミットを特定するのを助けるGitのツールはどれ？",
              "vi": "Trong một lịch sử commit dài, một lỗi đã xuất hiện ở đâu đó trong khoảng 100 commit gần đây. Công cụ nào của Git giúp tìm ra chính xác commit gây lỗi bằng thuật toán tìm kiếm nhị phân?"
            },
            "options": [
              { "en": "git bisect", "ja": "git bisect", "vi": "git bisect" },
              { "en": "git blame", "ja": "git blame", "vi": "git blame" },
              { "en": "git search-bug", "ja": "git search-bug", "vi": "git search-bug" },
              { "en": "git log --grep", "ja": "git log --grep", "vi": "git log --grep" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git bisect` uses binary search to find the commit that introduced a bug or regression. You mark a known 'bad' commit and a known 'good' commit, and Git checks out commits in the middle for you to test.",
              "ja": "`git bisect` は二分探索によりバグの原因コミットを特定します。「おかしな状態（bad）」と「正常な状態（good）」の境界値を判定していき、自動でテスト対象コミットを切り替えながら犯人を絞り込みます。",
              "vi": "`git bisect` dùng tìm kiếm nhị phân để dò tìm commit gây lỗi. Bạn đánh dấu một commit lỗi ('bad') và một commit hoạt động tốt ('good'), Git sẽ checkout các commit ở giữa để bạn test."
            }
          },
          {
            "id": "s5_q4",
            "question": {
              "en": "Your working directory has become cluttered with untracked files and folders that you do not need. Which command deletes all untracked files and directories permanently?",
              "ja": "作業ディレクトリに不要な未追跡のファイルやフォルダが散乱しています。これら未追跡ファイルをすべて完全に一括消去するコマンドはどれ？",
              "vi": "Thư mục làm việc của bạn có quá nhiều tệp và thư mục con untracked không dùng đến. Lệnh nào xóa sạch hoàn toàn các đối tượng untracked này?"
            },
            "options": [
              { "en": "git clean -f -d", "ja": "git clean -f -d", "vi": "git clean -f -d" },
              { "en": "git reset --hard", "ja": "git reset --hard", "vi": "git reset --hard" },
              { "en": "git rm --cached -r .", "ja": "git rm --cached -r .", "vi": "git rm --cached -r ." },
              { "en": "git checkout --clean", "ja": "git checkout --clean", "vi": "git checkout --clean" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git clean` removes untracked files. `-f` forces deletion (which is required by default configuration for safety). `-d` instructs it to remove untracked directories as well. `git reset --hard` does NOT touch untracked files.",
              "ja": "`git clean` は未追跡ファイルを削除します。`-f` は強制実行フラグ（誤爆防止のため必須）、`-d` はフォルダ（ディレクトリ）ごと削除する指示です。`git reset --hard` は追跡済みのファイルを戻すだけで未追跡ファイルは削除しません。",
              "vi": "`git clean` dùng để dọn dẹp tệp untracked. `-f` để ép xóa (bắt buộc theo cấu hình mặc định để an toàn). `-d` chỉ định xóa cả thư mục con untracked. `git reset --hard` không xóa tệp untracked."
            }
          },
          {
            "id": "s5_q5",
            "question": {
              "en": "Before running a command that deletes files permanently, you want to preview exactly which untracked files would be deleted. Which command should you run?",
              "ja": "ファイルを完全に削除するコマンドを実行する前に、どの未追跡ファイルが削除されるかを事前にプレビュー（ドライラン）確認するコマンドはどれ？",
              "vi": "Trước khi chạy lệnh xóa tệp vĩnh viễn, bạn muốn chạy thử để xem chính xác những tệp untracked nào sẽ bị xóa. Lệnh nào thực hiện việc này?"
            },
            "options": [
              { "en": "git clean -n", "ja": "git clean -n", "vi": "git clean -n" },
              { "en": "git clean --dry-run", "ja": "git clean --dry-run", "vi": "git clean --dry-run" },
              { "en": "git clean -p", "ja": "git clean -p", "vi": "git clean -p" },
              { "en": "Both git clean -n and git clean --dry-run are correct", "ja": "git clean -n と git clean --dry-run の両方が正しい", "vi": "Cả git clean -n và git clean --dry-run đều đúng" }
            ],
            "answer": 3,
            "explanation": {
              "en": "`git clean -n` or its alias `--dry-run` performs a dry run, displaying a list of files that will be deleted without actually removing them.",
              "ja": "`git clean -n` または `--dry-run` は、削除予定リストを画面表示するだけで実際の削除処理は行わない「ドライラン」コマンドです。事前に必ず実行することが推奨されます。",
              "vi": "`git clean -n` hoặc `--dry-run` thực hiện chạy thử (dry run), hiển thị danh sách các tệp sẽ bị xóa mà không thực sự xóa chúng."
            }
          },
          {
            "id": "s5_q6",
            "question": {
              "en": "You accidentally deleted a local branch `feature-dev` using `git branch -D feature-dev`. You realize you need it back. What is the correct way to recover this branch?",
              "ja": "`git branch -D feature-dev` でローカルブランチを誤って削除してしまいました。このブランチを復活させたい場合、正しい復元方法はどれ？",
              "vi": "Bạn lỡ tay xóa nhánh local `feature-dev` bằng lệnh `git branch -D feature-dev`. Làm cách nào để khôi phục lại nhánh này?"
            },
            "options": [
              { "en": "Run `git reflog` to find the commit hash of the branch tip before it was deleted, then run `git checkout -b feature-dev <hash>`", "ja": "`git reflog` を実行して削除直前のブランチ先端のコミットハッシュを見つけ、`git checkout -b feature-dev <hash>` を実行する", "vi": "Chạy `git reflog` để tìm mã hash của commit cuối cùng của nhánh trước khi bị xóa, rồi chạy `git checkout -b feature-dev <hash>`" },
              { "en": "Run `git branch --undelete feature-dev`", "ja": "`git branch --undelete feature-dev` を実行する", "vi": "Chạy lệnh `git branch --undelete feature-dev`" },
              { "en": "Run `git fsck --lost-found` and locate the file inside `.git/lost-found/commit/` to rename it", "ja": "`git fsck --lost-found` を実行し、`.git/lost-found/commit/` のファイルをリネームする", "vi": "Chạy `git fsck --lost-found` và tìm tệp trong `.git/lost-found/commit/` rồi đổi tên" },
              { "en": "Both branch recreation from reflog hash and git fsck recovery are valid methods", "ja": "reflogのハッシュからの再作成と、git fsckを用いた復元の両方とも有効な方法である", "vi": "Cả cách tạo lại nhánh từ hash của reflog và khôi phục bằng git fsck đều là các phương pháp hợp lệ" }
            ],
            "answer": 3,
            "explanation": {
              "en": "Both methods are valid. Finding the commit hash in `git reflog` and running `git checkout -b <name> <hash>` is the easiest and most common way. `git fsck --lost-found` finds dangling commits and extracts them under `.git/lost-found/commit` as a fallback.",
              "ja": "両方とも有効なアプローチです。もっとも手軽なのは `git reflog` から削除前のコミットハッシュを探し出して `git branch feature-dev <hash>` とすることです。dangling（迷子）になったコミットは `git fsck` でも検出できます。",
              "vi": "Cả hai cách đều đúng. Cách nhanh nhất là tìm mã hash commit cuối của nhánh trong `git reflog` rồi tạo nhánh mới từ đó. Lệnh `git fsck --lost-found` dùng để truy tìm các commit lơ lửng không được tham chiếu."
            }
          },
          {
            "id": "s5_q7",
            "question": {
              "en": "You need to investigate who wrote a specific broken line of code in `app.js` and in which commit it was added. Which Git command should you use?",
              "ja": "`app.js` の特定の一行コードについて、「誰が」「どのコミットで」記述を追加したかを調査したい場合、使用すべきコマンドはどれ？",
              "vi": "Bạn muốn tra cứu xem 'ai' là người viết dòng code lỗi trong tệp `app.js` và nó được thêm vào ở 'commit nào'. Bạn dùng lệnh nào?"
            },
            "options": [
              { "en": "git blame app.js", "ja": "git blame app.js", "vi": "git blame app.js" },
              { "en": "git log --search app.js", "ja": "git log --search app.js", "vi": "git log --search app.js" },
              { "en": "git show-author app.js", "ja": "git show-author app.js", "vi": "git show-author app.js" },
              { "en": "git inspect app.js", "ja": "git inspect app.js", "vi": "git inspect app.js" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git blame app.js` annotates each line in the file with information from the commit which introduced the line (showing author name, date, and commit hash).",
              "ja": "`git blame` コマンドは、ファイルの行ごとに最後に編集した「コミットハッシュ」「作者名」「コミット日時」を行頭にアノテーション表示します。責任の所在や経緯を調査するのに不可欠です。",
              "vi": "`git blame app.js` hiển thị thông tin chi tiết từng dòng code của tệp: mã hash commit, tên tác giả và ngày giờ cập nhật cuối cùng."
            }
          },
          {
            "id": "s5_q8",
            "question": {
              "en": "You applied `git stash pop` and got a merge conflict because your stashed changes overlap with modifications made on the branch in the meantime. What happens to the stash entry in this case?",
              "ja": "`git stash pop` を実行したところ、退避していた変更とブランチ側の最新コードが衝突してマージ競合が発生しました。このとき、退避データ（スタッシュエントリー）はどうなる？",
              "vi": "Bạn chạy `git stash pop` và gặp xung đột merge do thay đổi trong stash đè lên thay đổi mới ở nhánh hiện tại. Bản stash đó sẽ như thế nào trong trường hợp này?"
            },
            "options": [
              { "en": "The stash entry is kept in the stash list so you do not lose your stashed changes, and you must manually resolve conflicts", "ja": "変更を失わないようにスタッシュエントリーはスタック内にそのまま保持され、手動でマージ競合を解消する必要がある", "vi": "Bản stash vẫn được giữ lại trong danh sách stash để tránh mất dữ liệu, và bạn phải giải quyết xung đột bằng tay" },
              { "en": "The stash entry is immediately deleted from the stash list, and conflicts are automatically resolved by discarding stashed changes", "ja": "スタッシュエントリーは即座に削除され、退避変更を破棄することで競合が自動解決される", "vi": "Bản stash lập tức bị xóa khỏi danh sách, và xung đột được giải quyết bằng cách hủy bỏ thay đổi từ stash" },
              { "en": "Git automatically pushes the conflict state to a temporary remote branch", "ja": "Git が自動的に競合状態を一時的なリモートブランチにプッシュする", "vi": "Git tự động push trạng thái xung đột lên một nhánh remote tạm thời" },
              { "en": "The repository enters a locked state until you run git stash abort", "ja": "git stash abort を実行するまでリポジトリがロック状態に入る", "vi": "Repository rơi vào trạng thái khóa cho đến khi bạn chạy git stash abort" }
            ],
            "answer": 0,
            "explanation": {
              "en": "If a merge conflict occurs during `git stash pop`, Git acts defensively. It does NOT remove the stash entry from the list. It behaves like `git stash apply`, leaving the stash entry intact so you can recover if something goes wrong during conflict resolution.",
              "ja": "`pop` 処理中に競合が生じた場合、安全対策としてスタッシュデータは削除されずに残ります。ユーザーが競合解消中にミスをしてもデータを失わないようにするための安全設計です。競合解消後に手動で `git stash drop` を実行します。",
              "vi": "Nếu xảy ra xung đột merge khi chạy `git stash pop`, Git sẽ hành xử an toàn: KHÔNG tự động xóa bản stash đó khỏi danh sách (tương tự `git stash apply`), giúp bạn tránh mất dữ liệu nếu lỡ tay sửa sai xung đột."
            }
          },
          {
            "id": "s5_q9",
            "question": {
              "en": "You have changes in your stash but want to apply them onto a brand new branch instead of the current branch. Which command creates a new branch, checks it out, and pops your latest stash onto it?",
              "ja": "スタッシュに退避した作業を現在のブランチではなく、新しいブランチを作成してそこに展開したいです。新ブランチを作成してチェックアウトし、最新のスタッシュをそこに適用して取り出すコマンドはどれ？",
              "vi": "Bạn muốn áp dụng thay đổi từ stash lên một nhánh hoàn toàn mới thay vì nhánh hiện tại. Lệnh nào tạo nhánh mới, chuyển sang nhánh đó và pop stash ra?"
            },
            "options": [
              { "en": "git stash branch <new-branch-name>", "ja": "git stash branch <new-branch-name>", "vi": "git stash branch <new-branch-name>" },
              { "en": "git branch <new-branch-name> --from-stash", "ja": "git branch <new-branch-name> --from-stash", "vi": "git branch <new-branch-name> --from-stash" },
              { "en": "git checkout -b <new-branch-name> --stash", "ja": "git checkout -b <new-branch-name> --stash", "vi": "git checkout -b <new-branch-name> --stash" },
              { "en": "git stash pop --branch=<new-branch-name>", "ja": "git stash pop --branch=<new-branch-name>", "vi": "git stash pop --branch=<new-branch-name>" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git stash branch <branchname> [<stash>]` creates a new branch starting at the commit where the stash was created, checks out the new branch, and pops the stashed changes onto it. This is very useful if stashed changes conflict with a branch's current state.",
              "ja": "`git stash branch <ブランチ名>` は、スタッシュを作成した元のコミット状態で新ブランチを切り、チェックアウトした上でスタッシュを適用（pop）します。競合を避けて退避作業のみをクリーンに続行したい場合に有効です。",
              "vi": "`git stash branch <branchname>` tạo nhánh mới từ commit lúc bạn tạo stash, checkout nhánh đó và thực hiện pop stash lên đó. Rất hữu dụng khi stash bị xung đột nặng với code hiện tại của nhánh chính."
            }
          },
          {
            "id": "s5_q10",
            "question": {
              "en": "What is the purpose of running `git gc`?",
              "ja": "`git gc` を実行する主な目的は何？",
              "vi": "Mục đích chính của việc chạy lệnh `git gc` là gì?"
            },
            "options": [
              { "en": "To garbage collect unreachable objects, compress file revision history, and optimize local repository performance", "ja": "到達不能（参照されていない）オブジェクトをクリーンアップし、ファイル履歴を圧縮してローカルリポジトリのパフォーマンスを最適化する", "vi": "Dọn dẹp các đối tượng rác không còn tham chiếu, nén lịch sử sửa đổi và tối ưu hóa hiệu năng của local repository" },
              { "en": "To clone a repository from remote and verify database integrity", "ja": "リモートからリポジトリを再取得し、データベースの整合性をチェックする", "vi": "Tải lại repository từ remote và kiểm tra tính toàn vẹn cơ sở dữ liệu" },
              { "en": "To delete all branches except the default production branch", "ja": "デフォルトのリリース用ブランチ以外のすべてのブランチを消去する", "vi": "Xóa toàn bộ các nhánh ngoại trừ nhánh production mặc định" },
              { "en": "To verify the digital signatures of all signed commits in history", "ja": "署名付きコミットのデジタル署名が正しいかどうかを検証する", "vi": "Xác thực chữ ký số của tất cả các commit có chữ ký trong lịch sử" }
            ],
            "answer": 0,
            "explanation": {
              "en": "`git gc` (garbage collection) optimizes the repository by cleaning up loose files, pack files, and dangling objects that are no longer accessible from any branch or tag, reducing disk footprint and boosting performance.",
              "ja": "`git gc`（ガビージコレクション）はリポジトリの内部データベースを整理します。どのブランチやタグからも参照されなくなった不要オブジェクトを削除し、コミットデータをパック圧縮してストレージ領域の節約と応答速度の改善を図ります。",
              "vi": "`git gc` (garbage collection) tối ưu hóa repository bằng cách dọn dẹp các file lỏng lẻo, gom nhóm và nén dữ liệu lịch sử, giảm dung lượng bộ nhớ lưu trữ trên đĩa và tăng tốc độ xử lý."
            }
          }
        ]
      }
    ]
  }
  ```

- [ ] **Step 2: Verify git diff for JSON file and commit**
  Verify that the JSON is valid.
  Run: `git commit -am "content: replace git quiz with 5 sets of 10 scenario-based questions in three languages"`

---

## Verification Plan

### Automated Verification
Run Next.js dev server and check console for TypeScript or build errors:
1. Run: `npm run build` in `sensei-hub-dashboard` to make sure there are no compiler errors in type declarations or pages.

### Manual Verification
Verify UI flow in the web browser:
1. Navigate to `http://localhost:3000/subject/git-and-github/quiz` (or the equivalent local port).
2. Verify that the **Set Selection** screen is shown first, showing 5 sets:
   - "Set 1: Git Basics & Staging"
   - "Set 2: Branching & Merging"
   - "Set 3: Collaboration & GitHub"
   - "Set 4: Advanced & History Rewriting"
   - "Set 5: Troubleshooting & Recovery"
3. Verify that each set card shows "10 questions" and the status "Unattempted" (or "Best: 0/10" / "未挑戦").
4. Click on **Set 1**. Verify it transitions to the **Intro** phase showing details for Set 1.
5. Click **Start**. Verify it starts the quiz and displays 10 questions.
6. Complete all 10 questions of Set 1. Verify that upon completion, it displays the results, and clicking **Back to sets** returns to the selection screen with the score recorded as "Best: X/10".
7. Check backward compatibility: Go to another subject's quiz (e.g. AWS or Database Engineering). Verify it skips Set Selection and goes directly to the single quiz intro screen (since it doesn't have the `sets` field).
