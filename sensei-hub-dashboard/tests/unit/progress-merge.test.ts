import { describe, it, expect } from "vitest"
import { boolMapToEntries, mergeProgress, type Entry } from "@/lib/progress-merge"

describe("boolMapToEntries", () => {
  it("true のキーだけを ts=0 の Entry に変換する", () => {
    expect(boolMapToEntries({ a: true, b: false, c: true })).toEqual({
      a: { c: true, ts: 0 },
      c: { c: true, ts: 0 },
    })
  })

  it("null は空オブジェクトを返す", () => {
    expect(boolMapToEntries(null)).toEqual({})
  })
})

describe("mergeProgress（last-write-wins）", () => {
  it("ローカルが新しければローカルを採用し、DB へ push する", () => {
    const local: Record<string, Entry> = { x: { c: true, ts: 200 } }
    const { final, toPush } = mergeProgress(local, null, [{ lessonId: "x", completed: false, ts: 100 }])
    expect(final.x).toEqual({ c: true, ts: 200 })
    expect(toPush).toEqual([{ lessonId: "x", completed: true, ts: 200 }])
  })

  it("DB が新しければ DB を採用し、push しない", () => {
    const local: Record<string, Entry> = { x: { c: true, ts: 100 } }
    const { final, toPush } = mergeProgress(local, null, [{ lessonId: "x", completed: false, ts: 300 }])
    expect(final.x).toEqual({ c: false, ts: 300 })
    expect(toPush).toEqual([])
  })

  it("同時刻は DB を優先し、push しない", () => {
    const local: Record<string, Entry> = { x: { c: true, ts: 100 } }
    const { final, toPush } = mergeProgress(local, null, [{ lessonId: "x", completed: false, ts: 100 }])
    expect(final.x).toEqual({ c: false, ts: 100 })
    expect(toPush).toEqual([])
  })

  it("ローカルにしか無いキーは採用し push する", () => {
    const { final, toPush } = mergeProgress({ only: { c: true, ts: 50 } }, null, [])
    expect(final.only).toEqual({ c: true, ts: 50 })
    expect(toPush).toEqual([{ lessonId: "only", completed: true, ts: 50 }])
  })

  it("DB にしか無いキーは採用し push しない", () => {
    const { final, toPush } = mergeProgress({}, null, [{ lessonId: "db", completed: true, ts: 70 }])
    expect(final.db).toEqual({ c: true, ts: 70 })
    expect(toPush).toEqual([])
  })

  it("未完了(false)のローカル更新が新しければ、false で上書きし push する", () => {
    const local: Record<string, Entry> = { x: { c: false, ts: 500 } }
    const { final, toPush } = mergeProgress(local, null, [{ lessonId: "x", completed: true, ts: 400 }])
    expect(final.x).toEqual({ c: false, ts: 500 })
    expect(toPush).toEqual([{ lessonId: "x", completed: false, ts: 500 }])
  })

  it("匿名レガシーはローカルに無いキーだけ補完し、既存は上書きしない", () => {
    const local: Record<string, Entry> = { kept: { c: true, ts: 900 } }
    const anon = { kept: true, added: true }
    const { final, toPush } = mergeProgress(local, anon, [])
    // 既存 kept はローカルの ts を維持
    expect(final.kept).toEqual({ c: true, ts: 900 })
    // 補完された added は ts=0
    expect(final.added).toEqual({ c: true, ts: 0 })
    // 両方ローカル由来なので push される
    expect(toPush).toContainEqual({ lessonId: "kept", completed: true, ts: 900 })
    expect(toPush).toContainEqual({ lessonId: "added", completed: true, ts: 0 })
  })

  it("匿名で補完したキーが DB に存在し DB が新しければ DB を採用する", () => {
    const anon = { shared: true } // ts=0
    const { final, toPush } = mergeProgress({}, anon, [{ lessonId: "shared", completed: false, ts: 10 }])
    expect(final.shared).toEqual({ c: false, ts: 10 })
    expect(toPush).toEqual([])
  })
})
