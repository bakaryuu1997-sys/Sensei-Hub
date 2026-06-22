"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Home, BookOpen, Download, Settings, History } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"
import { computeSubjectStats } from "@/lib/subjects"
import { useUserProgress } from "@/components/user-progress-provider"
import { usePwaInstall } from "@/hooks/use-pwa-install"
import { PwaInstallGuide } from "@/components/pwa-install-guide"

const sidebarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

/**
 * サイドバーの中身（ロゴ + ナビ + PWA + フッター）。デスクトップの固定 aside と
 * モバイルの Sheet で共有し、単一の情報源とする。
 */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { subjects } = useUserProgress()

  const isHome = pathname === "/"
  const isSubjects = pathname.startsWith("/subject")
  const isSettings = pathname.startsWith("/settings")
  const isHistory = pathname.startsWith("/history")

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="flex h-full flex-col"
    >
      {/* Logo */}
      <Link href="/" onClick={onNavigate} className="flex items-center gap-3 p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 blur-xl opacity-60" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/40">
            <FuturePortalIcon />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">SENSEI</h1>
          <p className="text-xs text-cyan-300/80 font-mono tracking-widest">HUB.</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {/* Quick Nav */}
        <div className="mb-6 space-y-1">
          <motion.div variants={itemVariants}>
            <Link
              href="/"
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isHome
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-white border border-white/10"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <Home className={cn("h-5 w-5", isHome && "text-cyan-300")} />
              {t("nav.dashboard")}
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              href="/subject/aws"
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isSubjects
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-white border border-white/10"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <BookOpen className={cn("h-5 w-5", isSubjects && "text-cyan-300")} />
              {t("nav.subjects")}
            </Link>
          </motion.div>
        </div>

        {/* Subjects */}
        <div className="space-y-1">
          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{t("nav.subjects")}</p>
          {subjects.map((subject) => {
            const href = `/subject/${subject.slug}`
            const isActive = pathname === href
            const Icon = subject.icon
            const progress = computeSubjectStats(subject).progress
            return (
              <motion.div key={subject.id} variants={itemVariants}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-white/10 to-white/5 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                      subject.gradient,
                    )}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <span className="block truncate">{subject.name}</span>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className={cn("h-full rounded-full bg-gradient-to-r", subject.colorFrom, subject.colorTo)}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-white/50">{progress}%</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* History + Settings */}
        <div className="mt-6 space-y-1 border-t border-white/5 pt-4">
          <motion.div variants={itemVariants}>
            <Link
              href="/history"
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isHistory
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-white border border-white/10"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <History className={cn("h-5 w-5", isHistory && "text-cyan-300")} />
              {t("nav.history")}
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              href="/settings"
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isSettings
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-white border border-white/10"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <Settings className={cn("h-5 w-5", isSettings && "text-cyan-300")} />
              {t("nav.settings")}
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* PWA Install Button */}
      <PwaInstallButton />

      {/* Footer brand */}
      <div className="p-4 border-t border-white/5">
        <div className="text-[10px] text-white/30 font-mono tracking-widest text-center">
          {t("footer.motto")}
        </div>
      </div>
    </motion.div>
  )
}

export function Sidebar() {
  return (
    <aside className="sidebar-glass fixed left-0 top-0 z-40 hidden h-screen w-72 lg:block">
      <SidebarContent />
    </aside>
  )
}

function PwaInstallButton() {
  const { isInstallable, isStandalone, isIOS, install } = usePwaInstall()
  const { t } = useLanguage()
  const [guideOpen, setGuideOpen] = useState(false)

  if (isStandalone) return null

  return (
    <motion.div variants={itemVariants} className="px-4 py-3 border-t border-white/5">
      <button
        onClick={() => (isInstallable ? install() : setGuideOpen(true))}
        className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 px-4 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
      >
        <Download className="h-4 w-4 text-cyan-300 animate-bounce" />
        {t("pwa.install_sidebar")}
      </button>
      <PwaInstallGuide open={guideOpen} onClose={() => setGuideOpen(false)} isIOS={isIOS} />
    </motion.div>
  )
}

const FuturePortalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
    className="h-6 w-6"
  >
    <defs>
      <linearGradient id="sidebar-portal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
      <radialGradient id="sb-cyan-sphere" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#0891b2" />
      </radialGradient>
      <radialGradient id="sb-purple-sphere" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#7e22ce" />
      </radialGradient>
      <radialGradient id="sb-pink-sphere" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#be185d" />
      </radialGradient>
      <radialGradient id="sb-center-sphere" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#e0f2fe" />
        <stop offset="100%" stopColor="#38bdf8" />
      </radialGradient>
      
      <filter id="sidebar-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <style>{`
      @keyframes laser-flow {
        0% { stroke-dashoffset: 100; }
        100% { stroke-dashoffset: 0; }
      }
      @keyframes portal-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .portal-rotate-group {
        transform-origin: 16px 16px;
        animation: portal-spin 35s linear infinite;
      }
      .laser-line {
        stroke-dasharray: 15 85;
        animation: laser-flow 4s linear infinite;
      }
      .laser-line-reverse {
        stroke-dasharray: 20 80;
        animation: laser-flow 3.5s linear infinite reverse;
      }
    `}</style>
    <g className="portal-rotate-group">
      <path
        d="M 16 3 L 27.26 9.5 L 27.26 22.5 L 16 29 L 4.74 22.5 L 4.74 9.5 Z"
        stroke="url(#sidebar-portal-grad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M 16 3 L 16 16 M 4.74 22.5 L 16 16 M 27.26 22.5 L 16 16"
        stroke="url(#sidebar-portal-grad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.3"
      />
      
      <path
        d="M 16 3 L 27.26 9.5 L 27.26 22.5 L 16 29 L 4.74 22.5 L 4.74 9.5 Z"
        stroke="url(#sidebar-portal-grad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#sidebar-glow)"
        className="laser-line"
      />
      <path
        d="M 16 3 L 16 16 M 4.74 22.5 L 16 16 M 27.26 22.5 L 16 16"
        stroke="url(#sidebar-portal-grad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#sidebar-glow)"
        className="laser-line-reverse"
      />
      
      <circle cx="16" cy="3" r="2.2" fill="url(#sb-cyan-sphere)" />
      <circle cx="27.26" cy="9.5" r="2.2" fill="url(#sb-purple-sphere)" />
      <circle cx="27.26" cy="22.5" r="2.2" fill="url(#sb-pink-sphere)" />
      <circle cx="16" cy="29" r="2.2" fill="url(#sb-pink-sphere)" />
      <circle cx="4.74" cy="22.5" r="2.2" fill="url(#sb-cyan-sphere)" />
      <circle cx="4.74" cy="9.5" r="2.2" fill="url(#sb-cyan-sphere)" />
    </g>
    <circle cx="16" cy="16" r="4" fill="url(#sb-center-sphere)" filter="url(#sidebar-glow)" className="animate-pulse" />
  </svg>
);
