import { describe, it, expect } from "vitest"
import { splitMathSegments, isLikelyMath } from "@/lib/katex-render"

describe("splitMathSegments", () => {
  it("数式が無ければ全体が text", () => {
    expect(splitMathSegments("hello world")).toEqual([{ type: "text", value: "hello world" }])
  })

  it("インライン $...$ を取り出す", () => {
    const r = splitMathSegments("値は $1101_2$ です")
    expect(r[0]).toEqual({ type: "text", value: "値は " })
    expect(r[1]).toMatchObject({ type: "math", value: "1101_2", display: false, raw: "$1101_2$" })
    expect(r[2]).toEqual({ type: "text", value: " です" })
  })

  it("ディスプレイ $$...$$ を表示モードで取り出す", () => {
    const r = splitMathSegments("$$a^2+b^2$$")
    expect(r).toEqual([{ type: "math", value: "a^2+b^2", display: true, raw: "$$a^2+b^2$$" }])
  })

  it("複数のインライン数式", () => {
    const r = splitMathSegments("$a$ と $b$")
    expect(r.filter((s) => s.type === "math")).toHaveLength(2)
  })

  it("閉じの無い $ はリテラル扱い（誤ペアリングしない）", () => {
    const r = splitMathSegments("価格は $5 です")
    expect(r).toEqual([{ type: "text", value: "価格は $5 です" }])
  })

  it("エスケープ \\$ はリテラルのドル", () => {
    const r = splitMathSegments("コスト \\$5")
    expect(r).toEqual([{ type: "text", value: "コスト $5" }])
  })

  it("散らばった $ に挟まれた文章も 1 区間にまとめる（後段で弾く前提）", () => {
    const r = splitMathSegments("$ times, we guarantee $")
    expect(r[0]).toMatchObject({ type: "math", value: " times, we guarantee " })
  })
})

describe("isLikelyMath", () => {
  it("\\times や ^ _ = を含むものは数式", () => {
    expect(isLikelyMath("1 \\times 2^3 + 1 \\times 2^2 = 13_{10}")).toBe(true)
    expect(isLikelyMath("1101_2")).toBe(true)
    expect(isLikelyMath("a^2 + b^2")).toBe(true)
  })

  it("ただの英文は数式でない", () => {
    expect(isLikelyMath(" times, we guarantee that the shortest path")).toBe(false)
    expect(isLikelyMath("or not?")).toBe(false)
  })

  it("日本語の連続を含むものは文章として弾く", () => {
    expect(isLikelyMath("グラフにおいて閉路を含まない")).toBe(false)
    expect(isLikelyMath("\\text{ノード} = 5 の場合")).toBe(false)
  })

  it("空は false", () => {
    expect(isLikelyMath("   ")).toBe(false)
  })
})
