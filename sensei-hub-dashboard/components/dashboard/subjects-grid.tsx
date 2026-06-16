"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, BookOpen, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"
import { computeSubjectStats } from "@/lib/subjects"
import { useCosmicAudio } from "@/hooks/use-cosmic-audio"
import { useUserProgress } from "@/components/user-progress-provider"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function SubjectsGrid() {
  const { t } = useLanguage()
  const { playHover } = useCosmicAudio()
  const { subjects } = useUserProgress()

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">{t("section.subjects")}</h2>
          <p className="text-xs text-white/50 mt-1">
            {subjects.length} {t("nav.subjects").toLowerCase()}
          </p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {subjects.map((subject) => {
          const Icon = subject.icon
          const s = computeSubjectStats(subject)
          return (
            <motion.div key={subject.id} variants={item}>
              <Link
                href={`/subject/${subject.slug}`}
                className="group block h-full"
                onMouseEnter={playHover}
                onClick={playHover}
              >
                <div className={cn(
                  "relative h-full rounded-3xl overflow-hidden glass-card border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl",
                  `glow-hover-${subject.slug}`
                )}>
                  {/* Gradient glow on hover */}
                  <div
                    className={cn(
                      "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 bg-gradient-to-br",
                      subject.colorFrom,
                      subject.colorTo,
                    )}
                  />

                  <div className="relative flex flex-col h-full gap-4">
                    {/* Top: icon + arrow */}
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                          subject.gradient,
                        )}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Middle: title + tagline */}
                    <div className="flex-1">
                      <h3 className={cn(
                        "text-lg font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r",
                        subject.colorFrom,
                        subject.colorTo
                      )}>
                        {t(`sub.${subject.slug}.name`)}
                      </h3>
                      <p className="text-[10px] text-cyan-300/80 font-mono uppercase tracking-wider mt-1.5">
                        {t(`level.${subject.level.toLowerCase().replace(" ", "")}`)}
                      </p>
                      <p className="text-xs text-slate-300/90 mt-2.5 leading-relaxed line-clamp-2">{t(`sub.${subject.slug}.tagline`)}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-[11px] text-white/70 font-medium">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{s.totalLessons} {t("subject.lessons")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-pink-400" />
                        <span>{s.hours}h</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">{t("common.progress")}</span>
                        <span className="text-xs font-extrabold text-cyan-200">{s.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.progress}%` }}
                          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full bg-gradient-to-r",
                            subject.colorFrom,
                            subject.colorTo,
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.section>
  )
}
