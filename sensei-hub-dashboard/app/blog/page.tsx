"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Newspaper, ExternalLink, RefreshCw, Search } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { PullToRefresh } from "@/components/pull-to-refresh"

type NewsItem = {
  title: string
  link: string
  source: string
  pubDate: string
  sourceUrl?: string
  excerpt?: string
}

// ニュースのカテゴリタブ（id は API の category、ラベルは i18n キー）
const CATEGORIES: { id: string; labelKey: string }[] = [
  { id: "ai", labelKey: "blog.cat.ai" },
  { id: "labs", labelKey: "blog.cat.labs" },
  { id: "tech", labelKey: "blog.cat.tech" },
  { id: "dev", labelKey: "blog.cat.dev" },
]

// 最後に見たカテゴリの保存先（次回 /blog を開いたとき復元する）
const STORAGE_KEY = "sensei-blog-category"
// タブ復帰時の自動更新の間隔（これ以上経っていたら再取得）
const AUTO_REFRESH_AFTER_MS = 3 * 60 * 1000

function localeOf(lang: string): string {
  return lang === "ja" ? "ja-JP" : lang === "vi" ? "vi-VN" : "en-US"
}

function formatDate(pubDate: string, lang: string): string {
  const d = new Date(pubDate)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString(localeOf(lang), { year: "numeric", month: "short", day: "numeric" })
}

// 相対時間（「2時間前」など）。30 日より前は絶対日付にフォールバック。
function formatRelative(pubDate: string, lang: string, justNow: string): string {
  const ms = new Date(pubDate).getTime()
  if (Number.isNaN(ms)) return ""
  const sec = Math.round((Date.now() - ms) / 1000)
  if (sec < 60) return justNow
  const rtf = new Intl.RelativeTimeFormat(localeOf(lang), { numeric: "auto" })
  const min = Math.round(sec / 60)
  if (min < 60) return rtf.format(-min, "minute")
  const hr = Math.round(min / 60)
  if (hr < 24) return rtf.format(-hr, "hour")
  const day = Math.round(hr / 24)
  if (day < 30) return rtf.format(-day, "day")
  return formatDate(pubDate, lang)
}

// 媒体サイトの favicon URL（Google の favicon サービス。未知ドメインは既定アイコンを返す）。
function faviconUrl(item: NewsItem): string {
  if (!item.sourceUrl) return ""
  try {
    const host = new URL(item.sourceUrl).hostname
    return `https://www.google.com/s2/favicons?sz=64&domain=${host}`
  } catch {
    return ""
  }
}

export default function BlogPage() {
  const { t, lang } = useLanguage()
  const [category, setCategory] = useState<string>("ai")
  const [hydrated, setHydrated] = useState(false)
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  // 最新リクエストだけを反映するためのガード（タブ連打や更新の競合を防ぐ）
  const reqRef = useRef(0)
  // 最後に取得した時刻（タブ復帰時の自動更新判定に使う）
  const lastLoadRef = useRef(0)

  const load = useCallback(
    (fresh = false) => {
      const id = ++reqRef.current
      setLoading(true)
      // promise を返し、pull-to-refresh が完了を待てるようにする
      return fetch(`/api/news?lang=${lang}&category=${category}${fresh ? "&refresh=1" : ""}`)
        .then((res) => (res.ok ? res.json() : { items: [] }))
        .then((data) => {
          if (reqRef.current !== id) return // 古いレスポンスは無視
          setItems(data.items || [])
          setLoading(false)
          lastLoadRef.current = Date.now()
        })
        .catch(() => {
          if (reqRef.current === id) setLoading(false)
        })
    },
    [lang, category],
  )

  // 初回マウント時に保存済みカテゴリを復元してから読み込みを開始する
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && CATEGORIES.some((c) => c.id === saved)) setCategory(saved)
    } catch {
      // localStorage 不可時は既定（ai）のまま
    }
    setHydrated(true)
  }, [])

  // 復元後・言語/カテゴリ変更時に読み込む（復元前は走らせない）
  useEffect(() => {
    if (hydrated) load()
  }, [hydrated, load])

  // ブラウザのタブに戻ったとき、一定時間以上経っていれば自動で更新する
  useEffect(() => {
    const onVisible = () => {
      if (
        document.visibilityState === "visible" &&
        hydrated &&
        Date.now() - lastLoadRef.current > AUTO_REFRESH_AFTER_MS
      ) {
        load()
      }
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [hydrated, load])

  const selectCategory = (id: string) => {
    if (id === category) return
    setCategory(id)
    setQuery("")
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // 無視
    }
  }

  // キーワード/媒体名でクライアント側フィルタ
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => `${it.title} ${it.source}`.toLowerCase().includes(q))
  }, [items, query])

  const showSkeleton = loading && items.length === 0

  return (
    <PullToRefresh onRefresh={() => load(true)}>
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
      </div>

      <Sidebar />

      <div className="relative z-10 lg:ml-72 min-h-screen flex flex-col">
        <TopBar />

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          {/* 画面が大きいほど横幅を広げて余白を活用する（14/15/16インチ向け） */}
          <div className="mx-auto w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[100rem] space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                <Newspaper className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">{t("blog.title")}</h1>
                <p className="text-sm text-white/50">{t("blog.subtitle")}</p>
              </div>
            </div>

            {/* Category tabs + refresh */}
            <div className="flex items-center gap-2">
              <div className="flex flex-1 flex-wrap gap-2" role="tablist">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={category === c.id}
                    onClick={() => selectCategory(c.id)}
                    className={cn(
                      "rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all",
                      category === c.id
                        ? "border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-100"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white",
                    )}
                  >
                    {t(c.labelKey)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => load(true)}
                disabled={loading}
                title={t("blog.refresh")}
                aria-label={t("blog.refresh")}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white disabled:opacity-50 transition-all"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </button>
            </div>

            {/* Filter box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("blog.filter")}
                className="w-full h-10 rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50"
              />
            </div>

            {/* News list */}
            {showSkeleton ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
                    <div className="mt-2.5 h-3 w-full rounded bg-white/5 animate-pulse" />
                    <div className="mt-1.5 h-3 w-1/3 rounded bg-white/5 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="glass-card border border-white/10 rounded-2xl p-10 text-center space-y-3">
                <RefreshCw className="h-8 w-8 text-white/40 mx-auto" />
                <p className="text-sm text-white/60">{t("blog.empty")}</p>
              </div>
            ) : shown.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-10">{t("blog.no_match")}</p>
            ) : (
              <>
                {/* 2 カラム。新しい順に左→右→次の行…と流し込む（grid の自然な行優先配置） */}
                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3 transition-opacity", loading && "opacity-50")}>
                  {shown.map((item, i) => {
                    const fav = faviconUrl(item)
                    return (
                      <motion.a
                        key={item.link || i}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i, 12) * 0.025 }}
                        className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] hover:border-cyan-400/30 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <h2 className="flex-1 text-sm lg:text-base font-semibold text-white/90 group-hover:text-cyan-200 transition-colors leading-snug">
                            {item.title}
                          </h2>
                          <ExternalLink className="h-4 w-4 flex-shrink-0 text-white/30 group-hover:text-cyan-300 transition-colors mt-0.5" />
                        </div>

                        {/* 要約（あれば表示。Google News には無いので現状は空） */}
                        {item.excerpt && (
                          <p className="mt-1.5 text-xs lg:text-sm text-white/55 leading-relaxed line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}

                        <div className="mt-auto pt-2.5 flex items-center gap-2 text-xs text-white/40 font-mono">
                          {fav && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={fav}
                              alt=""
                              width={14}
                              height={14}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="h-3.5 w-3.5 rounded-sm flex-shrink-0"
                            />
                          )}
                          {item.source && <span className="truncate">{item.source}</span>}
                          {item.pubDate && <span>· {formatRelative(item.pubDate, lang, t("blog.just_now"))}</span>}
                        </div>
                      </motion.a>
                    )
                  })}
                </div>
                <p className="text-[11px] text-white/30 text-center pt-2 font-mono">{t("blog.source_note")}</p>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
    </PullToRefresh>
  )
}
