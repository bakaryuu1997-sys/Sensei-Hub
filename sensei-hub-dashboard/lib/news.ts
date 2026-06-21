// ニュース取得のコアロジック（カテゴリ定義・RSS パース・並べ替え/件数制限）。
// API ルートはこのモジュールを使うだけにして薄く保ち、純粋関数を単体テストできるようにする。
//
// 方針: DB に貯めず、毎回 Google News RSS から「最新 20 件」を取得して表示する。
// 常に 20 件で頭打ちになるため蓄積されず、削除処理も不要（端末を重くしない）。

export type NewsCategory = "ai" | "labs" | "tech" | "dev"
export const NEWS_CATEGORIES: NewsCategory[] = ["ai", "labs", "tech", "dev"]

export type NewsItem = {
  title: string
  link: string
  source: string
  pubDate: string
  sourceUrl?: string // 媒体のサイト URL（favicon 取得用）
  excerpt?: string // 短い要約（Google News RSS には無いため将来用に空で持つ）
}

/** 1 カテゴリあたりの表示件数（この値で頭打ち＝蓄積されない）。 */
export const NEWS_LIMIT = 20

/** ニュースのキャッシュ TTL（約 6 時間）。1 日に数回だけ更新する。 */
export const NEWS_TTL_MS = 6 * 60 * 60 * 1000

// カテゴリ × 言語ごとの検索クエリ（Google News は hl で各言語のローカライズ済み見出しを返す）。
// labs（Claude/ChatGPT/Gemini）はブランド名が共通のため全言語同じクエリでよい。
const QUERIES: Record<NewsCategory, Record<string, string>> = {
  ai: {
    en: "artificial intelligence",
    ja: "AI 人工知能",
    vi: "trí tuệ nhân tạo AI",
  },
  labs: {
    en: "Claude OR ChatGPT OR Gemini OR OpenAI OR Anthropic",
    ja: "Claude OR ChatGPT OR Gemini OR OpenAI OR Anthropic",
    vi: "Claude OR ChatGPT OR Gemini OR OpenAI OR Anthropic",
  },
  tech: {
    en: "technology companies trends",
    ja: "テクノロジー 企業 トレンド",
    vi: "công ty công nghệ xu hướng",
  },
  dev: {
    en: "software engineering programming",
    ja: "プログラミング ソフトウェア開発",
    vi: "lập trình phát triển phần mềm",
  },
}

// 言語ごとの Google News ロケールパラメータ。
const LOCALE: Record<string, { hl: string; gl: string; ceid: string }> = {
  en: { hl: "en-US", gl: "US", ceid: "US:en" },
  ja: { hl: "ja", gl: "JP", ceid: "JP:ja" },
  vi: { hl: "vi", gl: "VN", ceid: "VN:vi" },
}

/** 文字列が有効なカテゴリかを判定（不正値は既定 "ai" に丸める用途）。 */
export function normalizeCategory(value: string | null | undefined): NewsCategory {
  return NEWS_CATEGORIES.includes(value as NewsCategory) ? (value as NewsCategory) : "ai"
}

/** カテゴリ×言語の Google News RSS URL を組み立てる。直近 14 日に絞る。 */
export function buildFeedUrl(category: NewsCategory, lang: string): string {
  const loc = LOCALE[lang] || LOCALE.en
  const query = QUERIES[category][lang] || QUERIES[category].en
  const q = encodeURIComponent(`${query} when:14d`)
  return `https://news.google.com/rss/search?q=${q}&hl=${loc.hl}&gl=${loc.gl}&ceid=${loc.ceid}`
}

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

// <source url="https://...">媒体名</source> の url 属性を取り出す（favicon 用）。
function sourceUrl(block: string): string {
  const m = block.match(/<source[^>]*\burl="([^"]+)"/i)
  return m ? m[1] : ""
}

/** RSS（XML）を NewsItem 配列に変換する。maxParse 件まで読む（過剰パースを防ぐ）。 */
export function parseRss(xml: string, maxParse = 60): NewsItem[] {
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
      sourceUrl: sourceUrl(block),
    })
    if (items.length >= maxParse) break
  }
  return items
}

/** pubDate の新しい順に並べ替え、先頭 limit 件に切り詰める（無効日付は末尾）。 */
export function sortAndLimit(items: NewsItem[], limit = NEWS_LIMIT): NewsItem[] {
  const ts = (d: string) => {
    const t = new Date(d).getTime()
    return Number.isNaN(t) ? -Infinity : t
  }
  return [...items].sort((a, b) => ts(b.pubDate) - ts(a.pubDate)).slice(0, limit)
}
