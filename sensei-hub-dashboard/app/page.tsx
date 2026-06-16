"use client"

import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { HeroBanner } from "@/components/dashboard/hero-banner"
import { StatsRow } from "@/components/dashboard/stats-row"
import { SubjectsGrid } from "@/components/dashboard/subjects-grid"
import { useLanguage } from "@/lib/i18n"
import { Starfield } from "@/components/dashboard/starfield"
import { ConstellationMap } from "@/components/dashboard/constellation-map"
import { DashboardPlanet } from "@/components/dashboard/dashboard-planet"

export default function DashboardPage() {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-screen">
      {/* Decorative floating planets and stars */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
        {/* Planet 1 - Floating top left (placed to the right of the sidebar on desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-[12%] left-[-20px] lg:left-[320px] w-56 h-56 lg:w-[320px] lg:h-[320px] pointer-events-auto"
          style={{
            animation: "float-slow 25s ease-in-out infinite",
          }}
        >
          <DashboardPlanet
            size={320}
            colorPrimary="#22d3ee" // Cyan
            colorSecondary="#8b5cf6" // Purple
            hasRings={false}
            hasMoon={true}
            rotationSpeed={0.0025}
          />
        </motion.div>

        {/* Planet 2 - Floating bottom right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-[-20px] right-[-20px] w-64 h-64 lg:w-[400px] lg:h-[400px] pointer-events-auto"
          style={{
            animation: "float-reverse 30s ease-in-out infinite",
          }}
        >
          <DashboardPlanet
            size={400}
            colorPrimary="#f97316" // Orange
            colorSecondary="#ef4444" // Red
            hasRings={true}
            hasMoon={false}
            rotationSpeed={-0.0015} // Rotate reverse
            planetRadius={1.5}
          />
        </motion.div>

        {/* Twinkling star decorations */}
        <div className="absolute top-[15%] left-[35%] w-1.5 h-1.5 bg-white rounded-full animate-twinkle opacity-70" />
        <div className="absolute top-[60%] left-[80%] w-1 h-1 bg-cyan-300 rounded-full animate-twinkle opacity-90" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[80%] left-[25%] w-2 h-2 bg-purple-400 rounded-full animate-twinkle opacity-60" style={{ animationDelay: "2s", animationDuration: "5s" }} />
        <div className="absolute top-[10%] right-[25%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-twinkle opacity-50" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[45%] left-[50%] w-1 h-1 bg-white rounded-full animate-twinkle opacity-80" style={{ animationDelay: "1.5s", animationDuration: "3s" }} />
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
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
                  {t("header.greeting")}, <span className="gradient-text">{t("common.dev")}</span>
                </h1>
                <p className="mt-1 text-sm text-cyan-200/70 font-medium">{t("header.subtitle")}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-cyan-300">{t("status.online")}</span>
              </div>
            </motion.div>

            {/* Hero Banner */}
            <HeroBanner />

            {/* Stats Row */}
            <StatsRow />

            {/* Constellation Map */}
            <ConstellationMap />

            {/* Subjects grid (all 8 subjects) */}
            <SubjectsGrid />

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pt-8 pb-4 text-center text-[11px] text-white/30 font-mono"
            >
              {t("footer.brand")}
            </motion.footer>
          </div>
        </main>
      </div>
    </div>
  )
}
