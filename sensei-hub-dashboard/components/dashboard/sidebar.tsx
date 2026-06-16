"use client"

import { motion } from "framer-motion"
import { Home, BookOpen, Sparkles, Download } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"
import { computeSubjectStats } from "@/lib/subjects"
import { useUserProgress } from "@/components/user-progress-provider"
import { usePwaInstall } from "@/hooks/use-pwa-install"

const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
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

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { subjects } = useUserProgress()

  const isHome = pathname === "/"
  const isSubjects = pathname.startsWith("/subject")

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="sidebar-glass fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col lg:flex"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 blur-xl opacity-60" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/40">
            <Sparkles className="h-5 w-5 text-white" />
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
      </nav>

      {/* PWA Install Button */}
      <PwaInstallButton />

      {/* Footer brand */}
      <div className="p-4 border-t border-white/5">
        <div className="text-[10px] text-white/30 font-mono tracking-widest text-center">
          {t("footer.motto")}
        </div>
      </div>
    </motion.aside>
  )
}

function PwaInstallButton() {
  const { isInstallable, install } = usePwaInstall()
  const { t } = useLanguage()

  if (!isInstallable) return null

  return (
    <motion.div variants={itemVariants} className="px-4 py-3 border-t border-white/5">
      <button
        onClick={install}
        className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 px-4 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
      >
        <Download className="h-4 w-4 text-cyan-300 animate-bounce" />
        {t("pwa.install_sidebar")}
      </button>
    </motion.div>
  )
}
