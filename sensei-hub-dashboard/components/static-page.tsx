"use client"

import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/i18n"
import type { LegalDoc } from "@/lib/legal-content"

/**
 * 情報ページ（about・contact・法的事項）の共通シェル。
 * 3 言語の構造化コンテンツ（LegalDoc）を見出し＋段落として描画する。
 */
export function StaticPage({ doc }: { doc: LegalDoc }) {
  const { lang } = useLanguage()

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
              className="glass-card border border-white/10 rounded-2xl p-8 lg:p-10 space-y-6"
            >
              <header className="space-y-1 pb-4 border-b border-white/5">
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                  {doc.title[lang] || doc.title.en}
                </h1>
                {doc.updated && (
                  <p className="text-xs text-white/40 font-mono">Last updated: {doc.updated}</p>
                )}
              </header>

              <div className="space-y-6">
                {doc.sections.map((section, i) => (
                  <section key={i} className="space-y-2">
                    {section.heading && (
                      <h2 className="text-lg font-bold text-cyan-200">
                        {section.heading[lang] || section.heading.en}
                      </h2>
                    )}
                    {section.body.map((p, j) => (
                      <p key={j} className="text-sm lg:text-base text-slate-300/85 leading-relaxed">
                        {p[lang] || p.en}
                      </p>
                    ))}
                  </section>
                ))}
              </div>
            </motion.article>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
