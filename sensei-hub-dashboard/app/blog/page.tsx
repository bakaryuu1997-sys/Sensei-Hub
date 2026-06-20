"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Newspaper, ExternalLink, RefreshCw } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type NewsItem = { title: string; link: string; source: string; pubDate: string }

// ニュースのカテゴリタブ（id は API の category、ラベルは i18n キー）
const CATEGORIES: { id: string; labelKey: string }[] = [
  { id: "ai", labelKey: "blog.cat.ai" },
  { id: "labs", labelKey: "blog.cat.labs" },
  { id: "tech", labelKey: "blog.cat.tech" },
  { id: "dev", labelKey: "blog.cat.dev" },
]

// 最後に見たカテゴリの保存先（次回 /blog を開いたとき復元する）
const STORAGE_KEY = "sensei-blog-category"

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

export default function BlogPage() {
  const { t, lang } = useLanguage()
  const [category, setCategory] = useState<string>("ai")
  const [hydrated, setHydrated] = useState(false)
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  // 最新リクエストだけを反映するためのガード（タブ連打や更新の競合を防ぐ）
  const reqRef = useRef(0)

  const load = useCallback(
    (fresh = false) => {
      const id = ++reqRef.current
      setLoading(true)
      fetch(`/api/news?lang=${lang}&category=${category}${fresh ? "&refresh=1" : ""}`)
        .then((res) => (res.ok ? res.json() : { items: [] }))
        .then((data) => {
          if (reqRef.current !== id) return // 古いレスポンスは無視
          setItems(data.items || [])
          setLoading(false)
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

  const selectCategory = (id: string) => {
    if (id === category) return
    setCategory(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // 無視
    }
  }

  const showSkeleton = loading && items.length === 0

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
      </div>

      <Sidebar />

      <div className="relative z-10 lg:ml-72 min-h-screen flex flex-col">
        <TopBar />

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-3xl space-y-6">
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

            {/* News list */}
            {showSkeleton ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
                    <div className="mt-2.5 h-3 w-1/3 rounded bg-white/5 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="glass-card border border-white/10 rounded-2xl p-10 text-center space-y-3">
                <RefreshCw className="h-8 w-8 text-white/40 mx-auto" />
                <p className="text-sm text-white/60">{t("blog.empty")}</p>
              </div>
            ) : (
              <div className={cn("space-y-3 transition-opacity", loading && "opacity-50")}>
                {items.map((item, i) => (
                  <motion.a
                    key={item.link || i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] hover:border-cyan-400/30 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm lg:text-base font-semibold text-white/90 group-hover:text-cyan-200 transition-colors leading-snug">
                        {item.title}
                      </h2>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-white/40 font-mono">
                        {item.source && <span className="truncate">{item.source}</span>}
                        {item.pubDate && <span>· {formatRelative(item.pubDate, lang, t("blog.just_now"))}</span>}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 text-white/30 group-hover:text-cyan-300 transition-colors mt-0.5" />
                  </motion.a>
                ))}
                <p className="text-[11px] text-white/30 text-center pt-2 font-mono">{t("blog.source_note")}</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
