// 教科とレッスンに対する、純粋なクライアント側の検索フィルタ。

export type SearchItem = {
  id: string
  type: "subject" | "lesson"
  title: string
  subtitle?: string
  href: string
}

/**
 * フリーテキストのクエリで項目を絞り込み、順位付けする（大文字小文字を無視）。
 * 空白のみ／空クエリは全項目をそのまま返す。順位:
 *   0 — タイトルがクエリで始まる
 *   1 — タイトルがクエリを含む
 *   2 — サブタイトルがクエリを含む
 */
export function filterSearchItems(items: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items

  const ranked: { item: SearchItem; rank: number }[] = []
  for (const item of items) {
    const title = item.title.toLowerCase()
    const subtitle = (item.subtitle || "").toLowerCase()
    let rank = -1
    if (title.startsWith(q)) rank = 0
    else if (title.includes(q)) rank = 1
    else if (subtitle.includes(q)) rank = 2
    if (rank >= 0) ranked.push({ item, rank })
  }

  ranked.sort((a, b) => a.rank - b.rank)
  return ranked.map((r) => r.item)
}
