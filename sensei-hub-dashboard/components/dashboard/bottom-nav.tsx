"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, BookOpen, Newspaper, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// モバイル専用のボトムナビ（lg 未満で表示）。主要画面へ 1 タップで移動。
// チャットは FloatingChat をイベントで開く（"sensei-open-chat"）。
// 選択中タブには layoutId 付きインジケーターを表示し、タブ間を滑らかに移動させる。

const INDICATOR_ID = "bottom-nav-indicator"

function Indicator() {
  return (
    <motion.span
      layoutId={INDICATOR_ID}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="absolute top-0 h-0.5 w-8 rounded-full bg-cyan-300"
    />
  )
}

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  // ログイン/登録ページでは出さない
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) return null

  const isHome = pathname === "/"
  const isLearn = !!pathname?.startsWith("/subject")
  const isNews = !!pathname?.startsWith("/blog")

  const itemClass = (active: boolean) =>
    cn(
      "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
      active ? "text-cyan-300" : "text-white/55 hover:text-white",
    )

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex lg:hidden border-t border-white/10 bg-slate-950/80 backdrop-blur-xl pb-safe"
      aria-label={t("nav.menu")}
    >
      <Link href="/" className={itemClass(isHome)} aria-current={isHome ? "page" : undefined}>
        {isHome && <Indicator />}
        <Home className="h-5 w-5" />
        {t("nav.tab_home")}
      </Link>
      <Link href="/subject/aws" className={itemClass(isLearn)} aria-current={isLearn ? "page" : undefined}>
        {isLearn && <Indicator />}
        <BookOpen className="h-5 w-5" />
        {t("nav.tab_learn")}
      </Link>
      <Link href="/blog" className={itemClass(isNews)} aria-current={isNews ? "page" : undefined}>
        {isNews && <Indicator />}
        <Newspaper className="h-5 w-5" />
        {t("nav.tab_news")}
      </Link>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("sensei-open-chat"))}
        className={itemClass(false)}
      >
        <MessageCircle className="h-5 w-5" />
        {t("nav.tab_chat")}
      </button>
    </nav>
  )
}
