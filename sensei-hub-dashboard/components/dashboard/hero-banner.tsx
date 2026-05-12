"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Play, ChevronRight, Sparkles, Users, Star } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export function HeroBanner() {
  const { t } = useLanguage()

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-3xl border border-white/10"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-banner.jpg"
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
      <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-6 p-8 lg:p-12 min-h-[340px]">
        <div className="flex flex-col justify-center gap-5 max-w-xl">
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
            className="text-base text-white/70 leading-relaxed text-pretty max-w-md"
          >
            {t("hero.description")}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-5"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["from-pink-400 to-rose-500", "from-cyan-400 to-blue-500", "from-amber-400 to-orange-500"].map(
                  (g, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 border-slate-950`}
                    />
                  ),
                )}
              </div>
              <span className="text-xs text-white/60">
                <span className="font-bold text-white">12.4k</span> learners
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-white/60 ml-1">4.9</span>
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

        {/* Right side - floating mascot card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: "spring", bounce: 0.3 }}
          className="hidden lg:flex items-center justify-center relative"
        >
          <div className="relative w-full max-w-[280px] aspect-square">
            {/* Glow */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 blur-3xl opacity-40" />

            {/* Floating animation */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <div className="absolute inset-0 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-purple-500/40">
                <Image
                  src="/images/sensei-mascot.jpg"
                  alt="Sensei mascot character"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-2 -right-2 px-3 py-2 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-xl shadow-orange-500/50 border-2 border-white/20"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-bold text-white">+250 XP</span>
                </div>
              </motion.div>

              {/* Floating users badge */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                className="absolute -bottom-2 -left-3 px-3 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/15 shadow-xl"
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Live</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
