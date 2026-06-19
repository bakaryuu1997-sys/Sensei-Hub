// 学習アクティビティの記録（localStorage）。
// - 連続学習日数（streak）の計算
// - 最近見たレッスンの履歴
// - XP（完了レッスン数から算出）

const DAYS_KEY = "sensei-activity-days"
const HISTORY_KEY = "sensei-lesson-history"
const XP_PER_LESSON = 10
const MAX_HISTORY = 40

function dayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function getActivityDays(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(DAYS_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

/** 今日を学習日として記録する（重複なし、直近 400 日を保持）。 */
export function recordActivity(): void {
  if (typeof window === "undefined") return
  try {
    const days = new Set(getActivityDays())
    days.add(dayKey(new Date()))
    const sorted = [...days].sort().slice(-400)
    localStorage.setItem(DAYS_KEY, JSON.stringify(sorted))
  } catch {
    // 無視
  }
}

/** 今日（または昨日）で終わる連続学習日数。途切れていれば 0。 */
export function getStreak(): number {
  const set = new Set(getActivityDays())
  if (set.size === 0) return 0

  const cur = new Date()
  if (!set.has(dayKey(cur))) {
    // 今日まだなら昨日から数える（その日のうちは streak 継続とみなす）
    cur.setDate(cur.getDate() - 1)
    if (!set.has(dayKey(cur))) return 0
  }

  let streak = 0
  while (set.has(dayKey(cur))) {
    streak++
    cur.setDate(cur.getDate() - 1)
  }
  return streak
}

export function getXp(completedLessons: number): number {
  return Math.max(0, completedLessons) * XP_PER_LESSON
}

// ---- レッスン閲覧履歴 ----

export type LessonHistoryItem = {
  slug: string
  path: string
  title: string
  ts: number
}

export function getLessonHistory(): LessonHistoryItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

/** レッスン閲覧を履歴の先頭に記録する（同じ slug/path は重複排除、直近 40 件）。 */
export function recordLessonView(item: LessonHistoryItem): void {
  if (typeof window === "undefined") return
  try {
    const list = getLessonHistory().filter((h) => !(h.slug === item.slug && h.path === item.path))
    list.unshift(item)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)))
  } catch {
    // 無視
  }
}
