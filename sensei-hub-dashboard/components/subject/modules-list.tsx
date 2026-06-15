"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Lock, Play, Clock, BookOpen, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Subject, Module } from "@/lib/subjects"
import { useLanguage } from "@/lib/i18n"

export function ModulesList({ subject }: { subject: Subject }) {
  const { t } = useLanguage()

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">{t("subject.modules")}</h2>
          <p className="text-sm text-white/50 mt-1">
            {subject.modules.length} {t("subject.modules_count")}
          </p>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
        }}
        className="space-y-4"
      >
        {subject.modules.map((module, index) => (
          <ModuleRow key={module.id} module={module} index={index} colorFrom={subject.colorFrom} colorTo={subject.colorTo} />
        ))}
      </motion.div>
    </section>
  )
}

function ModuleRow({
  module,
  index,
  colorFrom,
  colorTo,
}: {
  module: Module
  index: number
  colorFrom: string
  colorTo: string
}) {
  const { t } = useLanguage()
  const isComplete = module.progress === 100
  const isLocked = module.locked
  const isInProgress = !isComplete && !isLocked && module.progress > 0
  const completedLessons = Math.round((module.lessons * module.progress) / 100)

  const difficultyColor: Record<Module["difficulty"], string> = {
    Beginner: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    Intermediate: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    Advanced: "text-rose-300 bg-rose-500/10 border-rose-500/20",
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass-card border transition-all",
        isLocked ? "border-white/5 opacity-60" : "border-white/10 hover:border-white/20 hover:-translate-y-0.5",
      )}
    >
      <div className="relative p-5 lg:p-6 flex items-center gap-4 lg:gap-6">
        {/* Index / status badge */}
        <div className="flex-shrink-0">
          <div
            className={cn(
              "flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl text-white shadow-lg",
              isLocked ? "bg-white/10" : cn("bg-gradient-to-br", colorFrom, colorTo),
            )}
          >
            {isComplete ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : isLocked ? (
              <Lock className="h-5 w-5" />
            ) : (
              <span className="text-lg font-bold font-mono">{String(index + 1).padStart(2, "0")}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="text-base lg:text-lg font-bold text-white truncate group-hover:text-cyan-200 transition-colors">{module.title}</h3>
            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border",
                difficultyColor[module.difficulty],
              )}
            >
              {module.difficulty}
            </span>
          </div>
          <p className="text-sm text-slate-300/85 line-clamp-1 mb-3.5">{module.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-cyan-200/60 font-mono font-medium">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {completedLessons}/{module.lessons} {t("subject.lessons")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {module.duration}
            </span>
          </div>

          {/* Progress bar */}
          {!isLocked && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full bg-gradient-to-r", colorFrom, colorTo)}
                  initial={{ width: 0 }}
                  animate={{ width: `${module.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 + index * 0.05 }}
                />
              </div>
              <span className="text-xs font-mono font-semibold text-white/70 w-10 text-right">{module.progress}%</span>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          <button
            disabled={isLocked}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl transition-all",
              isLocked
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-white/10 text-white hover:scale-110 group-hover:bg-white/20",
            )}
            aria-label={isLocked ? "Locked module" : isComplete ? "Review module" : "Start module"}
          >
            {isLocked ? (
              <Lock className="h-4 w-4" />
            ) : isComplete ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
          </button>
        </div>
      </div>

      {/* Status accent line */}
      {isInProgress && (
        <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b", colorFrom, colorTo)} />
      )}
    </motion.div>
  )
}
