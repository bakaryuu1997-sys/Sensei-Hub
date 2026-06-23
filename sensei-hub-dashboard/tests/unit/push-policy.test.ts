import { describe, it, expect } from "vitest"
import { startOfDay, studiedToday, shouldNotify } from "@/lib/push-policy"

const now = new Date("2026-06-23T20:00:00") // ある日の 20:00（ローカル）
const todayMorning = new Date("2026-06-23T08:00:00")
const yesterday = new Date("2026-06-22T22:00:00")

describe("startOfDay", () => {
  it("当日 0:00 を返す", () => {
    const s = startOfDay(now)
    expect(s.getFullYear()).toBe(2026)
    expect(s.getHours()).toBe(0)
    expect(s.getMinutes()).toBe(0)
    expect(s.getDate()).toBe(23)
  })
})

describe("studiedToday", () => {
  it("当日に学習があれば true", () => {
    expect(studiedToday(todayMorning, now)).toBe(true)
  })
  it("昨日が最後なら false", () => {
    expect(studiedToday(yesterday, now)).toBe(false)
  })
  it("学習痕跡が無ければ false", () => {
    expect(studiedToday(null, now)).toBe(false)
  })
  it("ちょうど 0:00 は当日扱い（true）", () => {
    expect(studiedToday(startOfDay(now), now)).toBe(true)
  })
})

describe("shouldNotify", () => {
  it("未学習・未通知 → 送る", () => {
    expect(shouldNotify(yesterday, null, now)).toBe(true)
  })
  it("今日学習済み → 送らない", () => {
    expect(shouldNotify(todayMorning, null, now)).toBe(false)
  })
  it("本日すでに通知済み → 送らない", () => {
    expect(shouldNotify(yesterday, todayMorning, now)).toBe(false)
  })
  it("通知は昨日まで・今日未学習 → 送る", () => {
    expect(shouldNotify(yesterday, yesterday, now)).toBe(true)
  })
  it("学習痕跡なし・未通知 → 送る", () => {
    expect(shouldNotify(null, null, now)).toBe(true)
  })
})
