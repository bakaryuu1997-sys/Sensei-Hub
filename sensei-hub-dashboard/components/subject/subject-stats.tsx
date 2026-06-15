"use client"

import { motion } from "framer-motion"
import { BookOpen, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { computeSubjectStats, type Subject } from "@/lib/subjects"

export function SubjectStats({ subject }: { subject: Subject }) {
  const s = computeSubjectStats(subject)
  const stats = [
    {
      label: "Total Lessons",
      value: s.totalLessons,
      icon: BookOpen,
      color: "from-cyan-400 to-blue-500",
    },
    {
      label: "Completed",
      value: s.completedLessons,
      icon: CheckCircle2,
      color: "from-emerald-400 to-green-500",
    },
    {
      label: "Content Time",
      value: s.minutes > 0 ? `${s.hours}h ${s.minutes}m` : `${s.hours}h`,
      icon: Clock,
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "Modules",
      value: `${s.completedModules}/${s.moduleCount}`,
      icon: TrendingUp,
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
      }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="relative overflow-hidden rounded-2xl glass-card border border-white/10 p-5 hover:border-white/20 transition-colors"
          >
            <div
              className={cn(
                "absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 bg-gradient-to-br",
                stat.color,
              )}
            />
            <div className="relative">
              <div
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-lg mb-3 bg-gradient-to-br",
                  stat.color,
                )}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{stat.value}</div>
              <p className="text-[11px] text-white/50 font-mono uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
