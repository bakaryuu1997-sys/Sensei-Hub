"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Play, ChevronRight, Sparkles, Layers, BookOpen, Clock } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { computeOverallStats } from "@/lib/subjects"

export function HeroBanner() {
  const { t } = useLanguage()
  const overall = computeOverallStats()

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="relative overflow-hidden rounded-3xl border border-white/10"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-banner.png"
          alt="Featured learning path background"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1100px"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,211,238,0.15),transparent_60%)]" />
      </div>

      {/* Floating decorative blobs */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-pink-500/30 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-32 w-40 h-40 rounded-full bg-cyan-500/30 blur-3xl" />

      {/* Content */}
      <div className="relative flex flex-col justify-center p-8 lg:p-12 min-h-[340px]">
        <div className="flex flex-col justify-center gap-5 max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-xs font-bold text-cyan-100 tracking-wide uppercase">{t("hero.featured")}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl lg:text-5xl font-bold leading-[1.1] text-balance"
          >
            <span className="text-white">{t("hero.title").split(" ").slice(0, -2).join(" ")} </span>
            <span className="gradient-text-static">{t("hero.title").split(" ").slice(-2).join(" ")}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base text-white/70 leading-relaxed text-pretty max-w-xl"
          >
            {t("hero.description")}
          </motion.p>

          {/* Stats row - real aggregated data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
              <span className="font-bold text-white">{overall.totalSubjects}</span> {t("nav.subjects").toLowerCase()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <BookOpen className="w-3.5 h-3.5 text-pink-300" />
              <span className="font-bold text-white">{overall.totalLessons}</span> {t("subject.lessons")}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-bold text-white">{overall.totalHours}h</span> {t("stats.hours").toLowerCase()}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center gap-3 mt-2"
          >
            <button className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.03] active:scale-[0.97] transition-all overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Play className="relative w-4 h-4 fill-white" />
              <span className="relative">{t("hero.cta")}</span>
              <ChevronRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-white font-semibold text-sm transition-colors">
              {t("hero.explore")}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
