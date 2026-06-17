"use client"

import { use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ListChecks } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { useLanguage } from "@/lib/i18n"
import { useUserProgress } from "@/components/user-progress-provider"

export default function SubjectQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t } = useLanguage()
  const { subjects } = useUserProgress()
  const subject = subjects.find((s) => s.slug === slug)

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
      </div>

      <Sidebar />

      <div className="relative z-10 lg:ml-72 min-h-screen flex flex-col">
        <TopBar />

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <Link
              href={`/subject/${slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("lesson.back_to_subject")} {subject?.name ?? ""}
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card border border-white/10 rounded-2xl p-10 text-center space-y-4"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                <ListChecks className="h-8 w-8 text-cyan-300" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                {t("quiz.coming_soon_title")}
              </h1>
              <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                {t("quiz.coming_soon_desc")}
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
