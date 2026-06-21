import { describe, it, expect } from "vitest"
import {
  parseRss,
  sortAndLimit,
  normalizeCategory,
  buildFeedUrl,
  NEWS_LIMIT,
  type NewsItem,
} from "@/lib/news"

// Google News RSS を模した最小の XML を組み立てるヘルパー
function rss(items: { title: string; link: string; source?: string; pubDate: string }[]): string {
  const body = items
    .map(
      (i) => `
    <item>
      <title>${i.title}</title>
      <link>${i.link}</link>
      ${i.source ? `<source url="x">${i.source}</source>` : ""}
      <pubDate>${i.pubDate}</pubDate>
    </item>`,
    )
    .join("")
  return `<?xml version="1.0"?><rss><channel>${body}</channel></rss>`
}

describe("news lib", () => {
  it("parseRss が item を抽出し、末尾のソース名をタイトルから除く", () => {
    const xml = rss([
      { title: "Big AI news - TechCrunch", link: "https://a.example", source: "TechCrunch", pubDate: "Mon, 01 Jun 2026 10:00:00 GMT" },
    ])
    const items = parseRss(xml)
    expect(items).toHaveLength(1)
    expect(items[0].title).toBe("Big AI news")
    expect(items[0].source).toBe("TechCrunch")
    expect(items[0].link).toBe("https://a.example")
    expect(items[0].sourceUrl).toBe("x")
  })

  it("sortAndLimit が新着順に並べる", () => {
    const items: NewsItem[] = [
      { title: "old", link: "1", source: "", pubDate: "Mon, 01 Jun 2026 10:00:00 GMT" },
      { title: "new", link: "2", source: "", pubDate: "Wed, 03 Jun 2026 10:00:00 GMT" },
      { title: "mid", link: "3", source: "", pubDate: "Tue, 02 Jun 2026 10:00:00 GMT" },
    ]
    const sorted = sortAndLimit(items)
    expect(sorted.map((i) => i.title)).toEqual(["new", "mid", "old"])
  })

  it("sortAndLimit が 20 件に切り詰める", () => {
    const many: NewsItem[] = Array.from({ length: 30 }, (_, n) => ({
      title: `t${n}`,
      link: `${n}`,
      source: "",
      // n が大きいほど新しい日付
      pubDate: new Date(2026, 0, 1, 0, n).toUTCString(),
    }))
    const limited = sortAndLimit(many)
    expect(limited).toHaveLength(NEWS_LIMIT)
    // 最新（n=29）が先頭
    expect(limited[0].title).toBe("t29")
  })

  it("無効な日付の item は末尾に回す", () => {
    const items: NewsItem[] = [
      { title: "invalid", link: "1", source: "", pubDate: "not-a-date" },
      { title: "valid", link: "2", source: "", pubDate: "Wed, 03 Jun 2026 10:00:00 GMT" },
    ]
    const sorted = sortAndLimit(items)
    expect(sorted[0].title).toBe("valid")
    expect(sorted[1].title).toBe("invalid")
  })

  it("normalizeCategory が不正値を ai に丸める", () => {
    expect(normalizeCategory("labs")).toBe("labs")
    expect(normalizeCategory("dev")).toBe("dev")
    expect(normalizeCategory("xxx")).toBe("ai")
    expect(normalizeCategory(null)).toBe("ai")
  })

  it("buildFeedUrl が言語ロケールとクエリを含む", () => {
    const url = buildFeedUrl("labs", "ja")
    expect(url).toContain("hl=ja")
    expect(url).toContain("ceid=JP:ja")
    expect(url).toContain(encodeURIComponent("Claude OR ChatGPT OR Gemini"))
  })
})
