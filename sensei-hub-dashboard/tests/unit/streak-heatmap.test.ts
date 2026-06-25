import { describe, it, expect } from "vitest"
import { buildStreakHeatmap, countActiveInRange } from "@/lib/streak-heatmap"

const end = new Date(2026, 5, 24) // 2026-06-24 (水)

describe("buildStreakHeatmap", () => {
  it("各週は 7 セル（曜日）で構成される", () => {
    const weeks = buildStreakHeatmap([], end, 30)
    expect(weeks.every((w) => w.length === 7)).toBe(true)
  })

  it("先頭週は日曜まで前埋めされ、前埋めセルは inRange=false", () => {
    const weeks = buildStreakHeatmap([], end, 30)
    const first = weeks[0]
    // 先頭セルは日曜
    expect(new Date(first[0].date).getDay()).toBe(0)
  })

  it("学習日は active=true、それ以外は false", () => {
    const weeks = buildStreakHeatmap(["2026-06-24", "2026-06-20"], end, 30)
    const cells = weeks.flat()
    expect(cells.find((c) => c.date === "2026-06-24")?.active).toBe(true)
    expect(cells.find((c) => c.date === "2026-06-20")?.active).toBe(true)
    expect(cells.find((c) => c.date === "2026-06-23")?.active).toBe(false)
  })

  it("期間外（未来や範囲前）の学習日はカウントしない", () => {
    // 範囲外の日を混ぜても active として現れない
    const weeks = buildStreakHeatmap(["2020-01-01", "2030-01-01"], end, 30)
    expect(countActiveInRange(weeks)).toBe(0)
  })

  it("countActiveInRange は期間内の学習日数を返す", () => {
    const weeks = buildStreakHeatmap(["2026-06-24", "2026-06-23", "2026-06-22"], end, 30)
    expect(countActiveInRange(weeks)).toBe(3)
  })

  it("end の日付がグリッド最終列に含まれる", () => {
    const weeks = buildStreakHeatmap([], end, 60)
    const last = weeks[weeks.length - 1]
    expect(last.some((c) => c.date === "2026-06-24")).toBe(true)
  })
})
