"use client"

import { useEffect, useState } from "react"
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

function formatDate(pubDate: string, lang: string): string {
  const d = new Date(pubDate)
  if (isNaN(d.getTime())) return ""
  const locale = lang === "ja" ? "ja-JP" : lang === "vi" ? "vi-VN" : "en-US"
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })
}

export default function BlogPage() {
  const { t, lang } = useLanguage()
  const [category, setCategory] = useState<string>("ai")
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetch(`/api/news?lang=${lang}&category=${category}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (active) {
          setItems(data.items || [])
          setLoading(false)
        }
      })
      .catch(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [lang, category])

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

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2" role="tablist">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={category === c.id}
                  onClick={() => setCategory(c.id)}
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

            {/* News list */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400" />
                <p className="text-sm text-white/50 font-mono">{t("common.loading")}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="glass-card border border-white/10 rounded-2xl p-10 text-center space-y-3">
                <RefreshCw className="h-8 w-8 text-white/40 mx-auto" />
                <p className="text-sm text-white/60">{t("blog.empty")}</p>
              </div>
            ) : (
              <div className="space-y-3">
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
                        {item.pubDate && <span>· {formatDate(item.pubDate, lang)}</span>}
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
