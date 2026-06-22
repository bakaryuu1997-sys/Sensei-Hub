// レッスン進捗の last-write-wins マージ（純粋ロジック）。
// UI から切り離してテスト可能にするためここに集約する。

// 各レッスンの「完了状態 c ＋最終変更時刻 ts」。時刻が新しい方を採用する。
export type Entry = { c: boolean; ts: number }

// DB（/api/progress/load）から来るレッスン 1 件分。
export type DbLesson = { lessonId: string; completed: boolean; ts: number }

export type MergeResult = {
  // マージ後の最終状態。
  final: Record<string, Entry>
  // ローカルが新しく、DB へ反映すべき差分。
  toPush: DbLesson[]
}

// 旧フォーマット（真偽値マップ）を時刻付き Entry へ変換（時刻は 0=最古、DB を優先させる）。
export function boolMapToEntries(b: Record<string, boolean> | null): Record<string, Entry> {
  const out: Record<string, Entry> = {}
  if (b) for (const [k, v] of Object.entries(b)) if (v) out[k] = { c: true, ts: 0 }
  return out
}

// ローカル・匿名レガシー・DB を時刻で last-write-wins マージする。
// - local: 時刻付きローカル進捗
// - anonBool: 匿名（未ログイン時）の旧真偽値進捗。local に無いキーだけ埋める。
// - dbLessons: DB から取得したレッスン進捗
// 戻り値の toPush には「ローカルの方が新しい or DB に無い」ものだけを入れる。
export function mergeProgress(
  local: Record<string, Entry>,
  anonBool: Record<string, boolean> | null,
  dbLessons: DbLesson[],
): MergeResult {
  // local をベースに、匿名レガシーで「未登録のキーのみ」補完する。
  const merged: Record<string, Entry> = { ...local }
  if (anonBool) {
    for (const [k, e] of Object.entries(boolMapToEntries(anonBool))) {
      if (!merged[k]) merged[k] = e
    }
  }

  const dbEntries: Record<string, Entry> = {}
  for (const l of dbLessons) dbEntries[l.lessonId] = { c: l.completed, ts: l.ts }

  const final: Record<string, Entry> = {}
  const toPush: DbLesson[] = []
  const allKeys = new Set([...Object.keys(merged), ...Object.keys(dbEntries)])
  allKeys.forEach((k) => {
    const a = merged[k]
    const b = dbEntries[k]
    if (a && b) {
      // 同時刻は DB を採用（a.ts > b.ts が false）。
      if (a.ts > b.ts) {
        final[k] = a
        toPush.push({ lessonId: k, completed: a.c, ts: a.ts })
      } else {
        final[k] = b
      }
    } else if (a) {
      final[k] = a
      toPush.push({ lessonId: k, completed: a.c, ts: a.ts })
    } else if (b) {
      final[k] = b
    }
  })

  return { final, toPush }
}
