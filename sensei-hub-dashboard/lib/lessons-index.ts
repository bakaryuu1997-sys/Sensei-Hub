// 静的レッスンインデックス（scripts/build-lessons-index.mjs が生成）の読み込み。
// 数百ファイルの走査を避け、1 ファイルだけを読む。dev の HMR でも消えないよう
// globalThis にキャッシュする。インデックスが無い場合は null を返し、呼び出し側は
// 従来のファイル走査にフォールバックする。

import fs from "fs"
import path from "path"

export type IndexedLesson = {
  path: string
  title: string
  description: string
  day?: string
  category?: string
}

type LessonsIndex = {
  generatedAt: string
  subjects: Record<string, Record<string, IndexedLesson[]>>
}

const globalForIndex = global as unknown as { lessonsIndex?: LessonsIndex | null }

function getLessonsDir(): string {
  return process.env.LESSONS_DIR || path.resolve(process.cwd(), "../lessons")
}

function getIndexPath(): string {
  return process.env.LESSONS_INDEX_PATH || path.join(getLessonsDir(), "lessons-index.json")
}

/** インデックス全体を読み込む（1 回だけ。失敗時は null）。 */
function loadIndex(): LessonsIndex | null {
  if (globalForIndex.lessonsIndex !== undefined) return globalForIndex.lessonsIndex
  try {
    const raw = fs.readFileSync(getIndexPath(), "utf8")
    globalForIndex.lessonsIndex = JSON.parse(raw) as LessonsIndex
  } catch {
    globalForIndex.lessonsIndex = null
  }
  return globalForIndex.lessonsIndex
}

/**
 * 指定言語・教科フォルダのレッスン一覧をインデックスから取得する。
 * 指定言語に無ければ英語へフォールバック。インデックス自体が無ければ null。
 */
export function getIndexedLessons(lang: string, subjectFolder: string): IndexedLesson[] | null {
  const index = loadIndex()
  if (!index) return null
  const byLang = index.subjects[lang]?.[subjectFolder]
  if (byLang && byLang.length > 0) return byLang
  const en = index.subjects["en"]?.[subjectFolder]
  return en ?? null
}
