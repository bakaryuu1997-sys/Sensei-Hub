// Pure, client-side search filtering over subjects and lessons.

export type SearchItem = {
  id: string
  type: "subject" | "lesson"
  title: string
  subtitle?: string
  href: string
}

/**
 * Filter and rank items by a free-text query (case-insensitive).
 * Empty/whitespace query returns all items unchanged. Ranking:
 *   0 — title starts with query
 *   1 — title contains query
 *   2 — subtitle contains query
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
