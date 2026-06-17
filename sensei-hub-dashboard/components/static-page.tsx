"use client"

import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/i18n"

/**
 * 簡易な情報ページ（about・contact・法的事項・blog）の共通シェル。
 * タイトルと本文の i18n キーを渡す。
 */
export function StaticPage({ titleKey, bodyKey }: { titleKey: string; bodyKey: string }) {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
      </div>

      <Sidebar />

      <div className="relative z-10 lg:ml-72 min-h-screen flex flex-col">
        <TopBar />

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-3xl">
            <motion.article
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card border border-white/10 rounded-2xl p-8 lg:p-10 space-y-4"
            >
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                {t(titleKey)}
              </h1>
              <p className="text-sm lg:text-base text-slate-300/85 leading-relaxed">{t(bodyKey)}</p>
            </motion.article>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
