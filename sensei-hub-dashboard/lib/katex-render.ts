// レッスン本文の数式描画ヘルパー。
// コンテンツの $ の使い方が不統一（散らばった $ や日本語を挟む $ がある）ため、
// 「いかにも数式」な区間だけを安全に描画し、それ以外は元テキストのまま残す。

export type MathSegment =
  | { type: "text"; value: string }
  | { type: "math"; value: string; display: boolean; raw: string }

/**
 * テキストを $...$（インライン）/ $$...$$（ディスプレイ）で分割する純粋関数。
 * - `\$` はエスケープされたドル記号としてリテラル扱い。
 * - 閉じデリミタが無い $ はリテラルとして扱う（誤ペアリングを避ける）。
 */
export function splitMathSegments(text: string): MathSegment[] {
  const segments: MathSegment[] = []
  let buf = ""
  let i = 0
  const flush = () => {
    if (buf) {
      segments.push({ type: "text", value: buf })
      buf = ""
    }
  }

  while (i < text.length) {
    const ch = text[i]
    if (ch === "\\" && text[i + 1] === "$") {
      buf += "$"
      i += 2
      continue
    }
    if (ch === "$") {
      const display = text[i + 1] === "$"
      const delim = display ? "$$" : "$"
      const start = i + delim.length
      // 次の（エスケープされていない）デリミタを探す
      let j = start
      let close = -1
      while (j < text.length) {
        if (text[j] === "\\") {
          j += 2
          continue
        }
        if (display) {
          if (text[j] === "$" && text[j + 1] === "$") {
            close = j
            break
          }
        } else if (text[j] === "$") {
          close = j
          break
        }
        j++
      }
      if (close === -1) {
        // 閉じが無い → リテラルの $
        buf += ch
        i += 1
        continue
      }
      flush()
      const content = text.slice(start, close)
      segments.push({ type: "math", value: content, display, raw: text.slice(i, close + delim.length) })
      i = close + delim.length
      continue
    }
    buf += ch
    i++
  }
  flush()
  return segments
}

/**
 * 「描画すべき数式」かを判定する純粋関数。
 * - `\command` / `^` / `_` / `=` など数式の手がかりが必要（ただの文章を弾く）。
 * - 日本語/全角かな漢字の連続を含むものは文章とみなして弾く。
 */
export function isLikelyMath(content: string): boolean {
  const s = content.trim()
  if (s.length === 0) return false
  if (/[぀-ヿ一-龯＀-￯]{2,}/.test(s)) return false // CJK 連続は文章
  return /[\\^_=]/.test(s) || /\\[a-zA-Z]+/.test(s)
}
