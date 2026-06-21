"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Newspaper, ArrowRight, ExternalLink } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

// ダッシュボード用の「最新ニュース」ウィジェット。/api/news（AI カテゴリ）から
// 上位 3 件だけ表示し、ブログへ誘導する。失敗時は何も出さない（控えめに）。

type NewsItem = { title: string; link: string; source: string; pubDate: string }

function shortRelative(pubDate: string, lang: string): string {
  const ms = new Date(pubDate).getTime()
  if (Number.isNaN(ms)) return ""
  const min = Math.round((Date.now() - ms) / 60000)
  const locale = lang === "ja" ? "ja-JP" : lang === "vi" ? "vi-VN" : "en-US"
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  if (min < 60) return rtf.format(-Math.max(min, 1), "minute")
  const hr = Math.round(min / 60)
  if (hr < 24) return rtf.format(-hr, "hour")
  return rtf.format(-Math.round(hr / 24), "day")
}

export function NewsWidget() {
  const { t, lang } = useLanguage()
  const [items, setItems] = useState<NewsItem[]>([])

  useEffect(() => {
    let active = true
    const fetchNews = (fresh = false) => {
      fetch(`/api/news?lang=${lang}${fresh ? "&refresh=1" : ""}`)
        .then((res) => (res.ok ? res.json() : { items: [] }))
        .then((data) => active && setItems((data.items || []).slice(0, 3)))
        .catch(() => {})
    }
    fetchNews()
    // pull-to-refresh から最新を取り直す
    const onRefresh = () => fetchNews(true)
    window.addEventListener("sensei-refresh-news", onRefresh)
    return () => {
      active = false
      window.removeEventListener("sensei-refresh-news", onRefresh)
    }
  }, [lang])

  if (items.length === 0) return null

  return (
    <div className="glass-card border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Newspaper className="h-4 w-4 text-cyan-300" />
        <h3 className="text-sm font-bold text-white flex-1">{t("blog.title")}</h3>
        <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors">
          {t("dashboard.news_all")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={item.link || i}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 rounded-lg px-2 py-2 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/85 group-hover:text-cyan-200 transition-colors leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] text-white/40 font-mono truncate">
                  {item.source}
                  {item.pubDate && ` · ${shortRelative(item.pubDate, lang)}`}
                </p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-white/25 group-hover:text-cyan-300 transition-colors mt-0.5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
