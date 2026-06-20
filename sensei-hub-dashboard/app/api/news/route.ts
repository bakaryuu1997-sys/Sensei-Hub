import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limiter"
import { getCache, setCache } from "@/lib/api-cache"
import {
  buildFeedUrl,
  normalizeCategory,
  parseRss,
  sortAndLimit,
  NEWS_TTL_MS,
  type NewsItem,
} from "@/lib/news"

// ニュースの自動取得（AI 不使用）。カテゴリ（ai / labs / tech / dev）×言語ごとに
// Google News RSS を取得し、新着順に並べて 20 件返す。DB に貯めず毎回最新を取る。
// 約 6 時間キャッシュ（カテゴリ×言語単位）。

export async function GET(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      (request as any).ip ||
      "127.0.0.1"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const params = new URL(request.url).searchParams
    const lang = params.get("lang") || "en"
    const category = normalizeCategory(params.get("category"))
    const cacheKey = `news/${category}/${lang}`

    const cached = getCache<{ items: NewsItem[] }>(cacheKey)
    if (cached) return NextResponse.json(cached)

    const res = await fetch(buildFeedUrl(category, lang), {
      headers: { "User-Agent": "Mozilla/5.0 (SenseiHub news reader)" },
      // Next の fetch キャッシュも併用（約 6 時間）
      next: { revalidate: NEWS_TTL_MS / 1000 },
    })
    if (!res.ok) {
      return NextResponse.json({ items: [] })
    }
    const xml = await res.text()
    // 全件パースしてから新着順に並べ、20 件に切り詰める
    const items = sortAndLimit(parseRss(xml))
    const result = { items }
    setCache(cacheKey, result, NEWS_TTL_MS)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("News error:", error)
    return NextResponse.json({ items: [] })
  }
}
