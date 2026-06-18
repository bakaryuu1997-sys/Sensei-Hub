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
