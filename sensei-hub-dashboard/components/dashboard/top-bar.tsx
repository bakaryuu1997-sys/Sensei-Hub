"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Bell, Command, Activity, Volume2, VolumeX, Download } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { LanguageSwitcher } from "./language-switcher"
import { computeOverallStats } from "@/lib/subjects"
import { usePwaInstall } from "@/hooks/use-pwa-install"

export function TopBar() {
  const { t } = useLanguage()
  const overall = computeOverallStats()
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("cosmic-audio-muted")
    // Default to unmuted (false) if not set, or read stored
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

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 flex items-center gap-4 px-6 lg:px-8 py-4 backdrop-blur-xl bg-slate-950/40 border-b border-white/5"
    >
      {/* Search */}
      <div className="flex-1 max-w-2xl">
        <div className="group relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder={t("header.search")}
            className="w-full h-11 pl-11 pr-24 rounded-2xl bg-white/5 hover:bg-white/[0.07] focus:bg-white/[0.07] border border-white/10 focus:border-cyan-400/50 outline-none text-sm text-white placeholder:text-white/40 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
            <Command className="w-3 h-3 text-white/50" />
            <span className="text-[10px] font-mono text-white/50">K</span>
          </div>
        </div>
      </div>

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

      {/* Notifications */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
        aria-label={t("aria.notifications")}
      >
        <Bell className="w-4 h-4 text-white/80" />
      </motion.button>

      {/* Audio Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMute}
        className="relative w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors text-white/80"
        aria-label={t("aria.toggle_audio")}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
      </motion.button>

      {/* Profile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            D
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-semibold text-white leading-tight">{t("common.developer")}</div>
          <div className="text-[10px] text-cyan-300/80 font-mono">{overall.completedLessons} {t("subject.lessons")}</div>
        </div>
      </motion.button>
    </motion.header>
  )
}

function PwaInstallButton() {
  const { isInstallable, install } = usePwaInstall()
  const { t } = useLanguage()

  if (!isInstallable) return null

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={install}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 text-xs font-bold text-white transition-all cursor-pointer"
    >
      <Download className="h-3.5 w-3.5 text-cyan-300" />
      {t("pwa.install_topbar")}
    </motion.button>
  )
}
