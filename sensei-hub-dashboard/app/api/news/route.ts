import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limiter"
import { getCache, setCache } from "@/lib/api-cache"

// AI ニュースの自動取得（AI 不使用）。
// Google ニュース RSS は hl パラメータで各言語のローカライズ済み見出しを返すため、
// こちらで翻訳せずに 3 言語のニュースをそのまま取得できる。30 分キャッシュ。

const FEEDS: Record<string, string> = {
  en: "https://news.google.com/rss/search?q=artificial%20intelligence%20when%3A14d&hl=en-US&gl=US&ceid=US:en",
  ja: "https://news.google.com/rss/search?q=AI%20%E4%BA%BA%E5%B7%A5%E7%9F%A5%E8%83%BD%20when%3A14d&hl=ja&gl=JP&ceid=JP:ja",
  vi: "https://news.google.com/rss/search?q=tr%C3%AD%20tu%E1%BB%87%20nh%C3%A2n%20t%E1%BA%A1o%20AI%20when%3A14d&hl=vi&gl=VN&ceid=VN:vi",
}

const NEWS_TTL_MS = 30 * 60 * 1000

type NewsItem = { title: string; link: string; source: string; pubDate: string }

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"))
  return m ? decodeEntities(m[1]).trim() : ""
}

function parseRss(xml: string, limit: number): NewsItem[] {
  const items: NewsItem[] = []
  const blocks = xml.split(/<item>/i).slice(1)
  for (const raw of blocks) {
    const block = raw.split(/<\/item>/i)[0]
    let title = tag(block, "title")
    const source = tag(block, "source")
    // Google News のタイトルは "見出し - ソース" 形式が多いので末尾のソースを除く
    if (source && title.endsWith(` - ${source}`)) {
      title = title.slice(0, -(` - ${source}`).length)
    }
    items.push({
      title,
      link: tag(block, "link"),
      source,
      pubDate: tag(block, "pubDate"),
    })
    if (items.length >= limit) break
  }
  return items
}

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

    const lang = new URL(request.url).searchParams.get("lang") || "en"
    const feed = FEEDS[lang] || FEEDS.en
    const cacheKey = `news/${lang}`

    const cached = getCache<{ items: NewsItem[] }>(cacheKey)
    if (cached) return NextResponse.json(cached)

    const res = await fetch(feed, {
      headers: { "User-Agent": "Mozilla/5.0 (SenseiHub news reader)" },
      // Next の fetch キャッシュも併用（30 分）
      next: { revalidate: 1800 },
    })
    if (!res.ok) {
      return NextResponse.json({ items: [] })
    }
    const xml = await res.text()
    const items = parseRss(xml, 12)
    const result = { items }
    setCache(cacheKey, result, NEWS_TTL_MS)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("News error:", error)
    return NextResponse.json({ items: [] })
  }
}
