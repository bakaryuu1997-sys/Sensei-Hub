"use client"

import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { HeroBanner } from "@/components/dashboard/hero-banner"
import { StatsRow } from "@/components/dashboard/stats-row"
import { SubjectsGrid } from "@/components/dashboard/subjects-grid"
import { useLanguage } from "@/lib/i18n"

export default function DashboardPage() {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-screen">
      {/* Decorative floating orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div
          className="floating-orb"
          style={{
            top: "10%",
            left: "60%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, #22d3ee, transparent 70%)",
          }}
        />
        <div
          className="floating-orb"
          style={{
            top: "50%",
            left: "5%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, #a855f7, transparent 70%)",
            animationDelay: "-7s",
          }}
        />
        <div
          className="floating-orb"
          style={{
            bottom: "5%",
            right: "10%",
            width: "450px",
            height: "450px",
            background: "radial-gradient(circle, #ec4899, transparent 70%)",
            animationDelay: "-14s",
          }}
        />
      </div>

      <Sidebar />

      {/* Main content */}
      <div className="relative z-10 lg:ml-72 min-h-screen flex flex-col">
        <TopBar />

        <main className="flex-1 px-6 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-end justify-between gap-3"
            >
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                  {t("header.greeting")}, <span className="gradient-text-static">Dev</span>
                </h1>
                <p className="mt-1 text-sm text-white/60">{t("header.subtitle")}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/50">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono">All systems online</span>
              </div>
            </motion.div>

            {/* Hero Banner */}
            <HeroBanner />

            {/* Stats Row */}
            <StatsRow />

            {/* Subjects grid (all 8 subjects) */}
            <SubjectsGrid />

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pt-8 pb-4 text-center text-[11px] text-white/30 font-mono"
            >
              SENSEI HUB · Focus & Flow · 2026
            </motion.footer>
          </div>
        </main>
      </div>
    </div>
  )
}
