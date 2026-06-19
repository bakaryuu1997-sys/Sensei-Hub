// 表示中レッスンの本文をチャットへ渡すための軽量ストア（軽量 RAG）。
// レッスンページが現在の本文をセットし、FloatingChat が購読して「この内容を説明」
// ボタンを出す。React Context だとレイアウト構成上プロバイダー配置が面倒なため、
// モジュールレベルの簡易 pub/sub で疎結合に共有する。

export type ActiveLesson = {
  title: string
  text: string // プレーンテキスト化した本文（先頭を切り詰め済み）
}

const MAX_CHARS = 6000

let current: ActiveLesson | null = null
const listeners = new Set<(l: ActiveLesson | null) => void>()

function emit() {
  for (const fn of listeners) fn(current)
}

/** レッスン本文をセットする。HTML を渡すとプレーンテキスト化して保持する。 */
export function setActiveLesson(title: string, html: string): void {
  const text = htmlToText(html).slice(0, MAX_CHARS)
  current = { title, text }
  emit()
}

/** レッスン離脱時にクリアする。 */
export function clearActiveLesson(): void {
  current = null
  emit()
}

export function getActiveLesson(): ActiveLesson | null {
  return current
}

/** 変更購読。返り値で解除する。 */
export function subscribeActiveLesson(fn: (l: ActiveLesson | null) => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** HTML からタグを除いた本文テキストを取り出す（ブラウザ専用）。 */
function htmlToText(html: string): string {
  if (typeof document === "undefined") return html
  const el = document.createElement("div")
  el.innerHTML = html
  return (el.textContent || "").replace(/\n{3,}/g, "\n\n").trim()
}
