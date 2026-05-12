"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, BookOpen, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"
import { subjects } from "@/lib/subjects"

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
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function SubjectsGrid() {
  const { t } = useLanguage()

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{t("section.subjects")}</h2>
          <p className="text-xs text-white/50 mt-1">8 paths · {t("nav.subjects")}</p>
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
          return (
            <motion.div key={subject.id} variants={item}>
              <Link href={`/subject/${subject.slug}`} className="group block h-full">
                <div className="relative h-full rounded-2xl overflow-hidden glass-card border border-white/10 p-5 transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl">
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
                          "flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
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
                      <h3 className="text-lg font-bold text-white tracking-tight">{subject.name}</h3>
                      <p className="text-[11px] text-white/40 font-mono uppercase tracking-wider mt-0.5">
                        {subject.level}
                      </p>
                      <p className="text-xs text-white/60 mt-2 leading-relaxed line-clamp-2">{subject.tagline}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-[11px] text-white/50">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{subject.totalLessons}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{subject.hours}h</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Progress</span>
                        <span className="text-xs font-bold text-white">{subject.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.progress}%` }}
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
