"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Lock, CheckCircle2, Play, type LucideIcon } from "lucide-react"

interface Lesson {
  id: number
  title: string
  duration: string
  difficulty: string
  status: "completed" | "current" | "locked"
  icon: LucideIcon
}

interface LessonCardProps {
  lesson: Lesson
  index: number
}

const statusConfig = {
  completed: {
    badge: "Completed",
    badgeClass: "bg-emerald-500/20 text-emerald-400",
    borderClass: "border-emerald-500/30",
    iconClass: "text-emerald-400",
    StatusIcon: CheckCircle2,
  },
  current: {
    badge: "In Progress",
    badgeClass: "bg-indigo-500/20 text-indigo-400",
    borderClass: "neon-border-active",
    iconClass: "text-indigo-400",
    StatusIcon: Play,
  },
  locked: {
    badge: "Locked",
    badgeClass: "bg-white/10 text-muted-foreground",
    borderClass: "border-white/10",
    iconClass: "text-muted-foreground",
    StatusIcon: Lock,
  },
}

export function LessonCard({ lesson, index }: LessonCardProps) {
  const config = statusConfig[lesson.status]
  const Icon = lesson.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      whileHover={lesson.status !== "locked" ? { scale: 1.03, y: -4 } : undefined}
      className={cn(
        "glass-card rounded-xl border p-5 transition-all duration-300",
        config.borderClass,
        lesson.status === "locked" && "opacity-60 cursor-not-allowed",
        lesson.status !== "locked" && "cursor-pointer hover:shadow-lg hover:shadow-indigo-500/10"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          lesson.status === "current" ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white" : "bg-white/10",
          config.iconClass
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", config.badgeClass)}>
          {config.badge}
        </span>
      </div>
      
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold leading-tight">{lesson.title}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{lesson.duration}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
          <span>{lesson.difficulty}</span>
        </div>
      </div>

      {lesson.status === "current" && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
              initial={{ width: 0 }}
              animate={{ width: "35%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">35% complete</p>
        </motion.div>
      )}
    </motion.div>
  )
}
