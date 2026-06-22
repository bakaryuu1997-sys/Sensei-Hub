"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search, Bell, Command, Activity, Volume2, VolumeX, Download, Menu } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { LanguageSwitcher } from "./language-switcher"
import { useUserProgress } from "@/components/user-progress-provider"
import { usePwaInstall } from "@/hooks/use-pwa-install"
import { PwaInstallGuide } from "@/components/pwa-install-guide"
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { SidebarContent } from "@/components/dashboard/sidebar"
import { SearchCommand } from "@/components/search-command"

export function TopBar() {
  const { t } = useLanguage()
  const { overallStats: overall } = useUserProgress()
  const [muted, setMuted] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  // ドロワーを左へスワイプして閉じるためのタッチ開始位置
  const drawerTouchX = useRef<number | null>(null)

  // Open the search palette with Cmd/Ctrl+K.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem("cosmic-audio-muted")
    if (stored !== null) {
      setMuted(stored === "true")
    } else {
      setMuted(false)
      localStorage.setItem("cosmic-audio-muted", "false")
    }
  }, [])

  const toggleMute = () => {
    const nextVal = !muted
    setMuted(nextVal)
    localStorage.setItem("cosmic-audio-muted", String(nextVal))
  }

  const { isSignedIn, user } = useUser()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // ノッチ端末（PWA 全画面）でステータスバーに重ならないよう上部にセーフエリアを足す
      style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
      className="sticky top-0 z-30 flex items-center gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-xl bg-slate-950/40 border-b border-white/5"
    >
      {/* Mobile nav trigger */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetTrigger asChild>
          <button
            className="lg:hidden flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors"
            aria-label={t("nav.menu")}
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 p-0 sidebar-glass border-white/10"
          // ノッチ回避（上部セーフエリア）
          style={{ paddingTop: "env(safe-area-inset-top)" }}
          // 左へスワイプして閉じる
          onTouchStart={(e) => {
            drawerTouchX.current = e.touches[0]?.clientX ?? null
          }}
          onTouchEnd={(e) => {
            if (drawerTouchX.current === null) return
            const dx = (e.changedTouches[0]?.clientX ?? 0) - drawerTouchX.current
            if (dx < -50) setMobileNavOpen(false)
            drawerTouchX.current = null
          }}
        >
          <SheetTitle className="sr-only">{t("nav.menu")}</SheetTitle>
          <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="flex-1 max-w-2xl">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="group relative w-full h-11 flex items-center rounded-2xl bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-cyan-400/40 text-left transition-all"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
          <span className="pl-11 pr-24 text-sm text-white/40 truncate">{t("header.search")}</span>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
            <Command className="w-3 h-3 text-white/50" />
            <span className="text-[10px] font-mono text-white/50">K</span>
          </div>
        </button>
      </div>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Overall progress pill (real data) */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30"
      >
        <Activity className="w-4 h-4 text-cyan-300" />
        <span className="text-sm font-bold text-white">{overall.averageProgress}%</span>
        <span className="text-xs text-cyan-200/80 hidden lg:inline">{t("stats.progress").toLowerCase()}</span>
      </motion.div>

      {/* PWA Install Button */}
      <PwaInstallButton />

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Notifications (モバイルでは省略してスペースを確保) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hidden md:flex items-center justify-center transition-colors"
        aria-label={t("aria.notifications")}
      >
        <Bell className="w-4 h-4 text-white/80" />
      </motion.button>

      {/* Audio Toggle (モバイルでは省略) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMute}
        className="relative w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hidden md:flex items-center justify-center transition-colors text-white/80"
        aria-label={t("aria.toggle_audio")}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
      </motion.button>

      {/* Profile / Auth Controls */}
      {isSignedIn ? (
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-xs font-semibold text-white leading-tight">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Student"}
            </div>
            <div className="text-[10px] text-cyan-300/80 font-mono">
              {overall.completedLessons} {t("subject.lessons")}
            </div>
          </div>
          <UserButton />
        </div>
      ) : (
        <Link
          href="/login"
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-violet-500/20"
        >
          {t("auth.login")}
        </Link>
      )}
    </motion.header>
  )
}

function PwaInstallButton() {
  const { isInstallable, isStandalone, isIOS, install } = usePwaInstall()
  const { t } = useLanguage()
  const [guideOpen, setGuideOpen] = useState(false)

  // すでにインストール済みなら出さない。未導入なら常に出し、ネイティブプロンプトが
  // 使えない端末（iOS など）では手順モーダルを開く。
  if (isStandalone) return null

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => (isInstallable ? install() : setGuideOpen(true))}
        aria-label={t("pwa.install_topbar")}
        className="flex items-center gap-1.5 h-11 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 text-xs font-bold text-white transition-all cursor-pointer"
      >
        <Download className="h-4 w-4 text-cyan-300" />
        <span className="hidden sm:inline">{t("pwa.install_topbar")}</span>
      </motion.button>
      <PwaInstallGuide open={guideOpen} onClose={() => setGuideOpen(false)} isIOS={isIOS} />
    </>
  )
}
