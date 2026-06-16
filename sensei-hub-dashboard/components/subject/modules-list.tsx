"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Lock, Play, Clock, BookOpen, ChevronRight, ChevronDown, Circle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Subject, Module } from "@/lib/subjects"
import { useLanguage } from "@/lib/i18n"
import { useUserProgress } from "@/components/user-progress-provider"

export function ModulesList({ subject }: { subject: Subject }) {
  const { t, lang } = useLanguage()
  const [lessons, setLessons] = useState<any[]>([])

  useEffect(() => {
    let active = true
    async function fetchLessons() {
      try {
        const res = await fetch(`/api/subject/${subject.slug}/lessons?lang=${lang}`)
        if (res.ok) {
          const data = await res.json()
          if (active && data.lessons) {
            setLessons(data.lessons)
          }
        }
      } catch (err) {
        console.error("Failed to fetch lessons:", err)
      }
    }
    fetchLessons()
    return () => {
      active = false
    }
  }, [subject.slug, lang])

  // Group lessons into modules based on module lesson count dynamically
  let currentOffset = 0
  const moduleLessonsMap: Record<string, any[]> = {}
  subject.modules.forEach((mod) => {
    moduleLessonsMap[mod.id] = lessons.slice(currentOffset, currentOffset + mod.lessons)
    currentOffset += mod.lessons
  })

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
            {t("subject.modules")}
          </h2>
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
          <ModuleRow
            key={module.id}
            module={module}
            index={index}
            colorFrom={subject.colorFrom}
            colorTo={subject.colorTo}
            subjectSlug={subject.slug}
            moduleLessons={moduleLessonsMap[module.id] || []}
          />
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
  subjectSlug,
  moduleLessons,
}: {
  module: Module
  index: number
  colorFrom: string
  colorTo: string
  subjectSlug: string
  moduleLessons: any[]
}) {
  const { t } = useLanguage()
  const { toggleModuleCompletion, toggleLessonCompletion, completedLessons } = useUserProgress()
  const [isExpanded, setIsExpanded] = useState(false)

  const isComplete = module.progress === 100
  const isLocked = module.locked
  const isInProgress = !isComplete && !isLocked && module.progress > 0
  const completedLessonsCount = Math.round((module.lessons * module.progress) / 100)

  const difficultyColor: Record<Module["difficulty"], string> = {
    Beginner: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    Intermediate: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    Advanced: "text-rose-300 bg-rose-500/10 border-rose-500/20",
  }

  const allLessonKeys = moduleLessons.map((l) => `${subjectSlug}/${l.path}`)
  const allLessonPaths = moduleLessons.map((l) => l.path)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass-card border transition-all",
        isLocked ? "border-white/5 opacity-60" : "border-white/10 hover:border-white/20",
      )}
    >
      <div 
        className={cn(
          "relative p-5 lg:p-6 flex items-center gap-4 lg:gap-6 cursor-pointer select-none",
          isLocked ? "pointer-events-none" : ""
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Index / status badge */}
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
            <h3 className="text-base lg:text-lg font-bold text-white truncate group-hover:text-cyan-200 transition-colors flex items-center gap-2">
              {module.title}
              {!isLocked && (
                isExpanded ? <ChevronDown className="h-4 w-4 text-white/40" /> : <ChevronRight className="h-4 w-4 text-white/40" />
              )}
            </h3>
            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border",
                difficultyColor[module.difficulty],
              )}
            >
              {t(`level.${module.difficulty.toLowerCase()}_alt`)}
            </span>
          </div>
          <p className="text-sm text-slate-300/85 line-clamp-1 mb-3.5">{module.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-cyan-200/60 font-mono font-medium">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {completedLessonsCount}/{module.lessons} {t("subject.lessons")}
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
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-mono font-semibold text-white/70 w-10 text-right">{module.progress}%</span>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            disabled={isLocked}
            onClick={() => toggleModuleCompletion(module.id, allLessonKeys)}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl transition-all",
              isLocked
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-white/10 text-white hover:scale-110 group-hover:bg-white/20 active:scale-95",
            )}
            aria-label={isLocked ? "Locked module" : isComplete ? "Mark incomplete" : "Mark complete"}
          >
            {isLocked ? (
              <Lock className="h-4 w-4" />
            ) : isComplete ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Lessons List */}
      <AnimatePresence initial={false}>
        {isExpanded && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-t border-white/5 bg-white/[0.02] overflow-hidden"
          >
            <div className="px-5 py-4 space-y-3">
              {moduleLessons.length === 0 ? (
                <div className="text-xs text-white/40 py-2 font-mono">{t("subject.loading_lessons")}</div>
              ) : (
                moduleLessons.map((lesson) => {
                  const lessonKey = `${subjectSlug}/${lesson.path}`
                  const isLessonCompleted = completedLessons[lessonKey] || false

                  return (
                    <div
                      key={lesson.path}
                      className="flex items-center justify-between p-3 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleLessonCompletion(subjectSlug, module.id, lesson.path, allLessonPaths)}
                          className="flex-shrink-0 text-white/40 hover:text-cyan-400 transition-colors"
                        >
                          {isLessonCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-500/10" />
                          ) : (
                            <Circle className="h-5 w-5 text-white/30" />
                          )}
                        </button>
                        <span className="text-sm font-semibold text-white/80 truncate pr-4">
                          {lesson.title}
                        </span>
                      </div>
                      <Link
                        href={`/subject/${subjectSlug}/lesson/${lesson.path}`}
                        className={cn(
                          "flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all",
                          isLessonCompleted
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-white/10 text-white hover:bg-white/20"
                        )}
                      >
                        {isLessonCompleted ? t("action.review") : t("action.study")}
                      </Link>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status accent line */}
      {isInProgress && (
        <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b", colorFrom, colorTo)} />
      )}
    </motion.div>
  )
}
