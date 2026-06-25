// 学習日の配列から GitHub 風ヒートマップ（週×曜日）を組み立てる純粋ロジック。
// UI から切り離してテスト可能にする。

export type HeatCell = {
  date: string // "YYYY-MM-DD"
  active: boolean // その日に学習したか
  inRange: boolean // 表示期間内か（先頭週の前埋めセルは false）
}

function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/**
 * 直近 `days` 日分のヒートマップを「週（列）×曜日（日〜土・行）」で返す。
 * - 先頭週は日曜まで前埋めし、その分のセルは inRange=false。
 * - end（既定: 今日）で終わる。
 */
export function buildStreakHeatmap(activeDays: string[], end: Date = new Date(), days = 182): HeatCell[][] {
  const active = new Set(activeDays)
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  const start = new Date(endDay)
  start.setDate(start.getDate() - (days - 1))

  // グリッド開始は start を含む週の日曜日。
  const gridStart = new Date(start)
  gridStart.setDate(gridStart.getDate() - gridStart.getDay()) // 0=日曜

  const weeks: HeatCell[][] = []
  const cur = new Date(gridStart)
  while (cur <= endDay) {
    const week: HeatCell[] = []
    for (let i = 0; i < 7; i++) {
      const key = ymd(cur)
      const inRange = cur >= start && cur <= endDay
      week.push({ date: key, active: inRange && active.has(key), inRange })
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

/** 期間内の学習日数（ヒートマップのアクティブセル数）。 */
export function countActiveInRange(weeks: HeatCell[][]): number {
  let n = 0
  for (const w of weeks) for (const c of w) if (c.active) n++
  return n
}
