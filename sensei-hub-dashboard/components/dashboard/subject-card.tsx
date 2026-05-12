"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface Subject {
  id: string
  name: string
  icon: LucideIcon
  gradient: string
  color: string
  progress: number
}

interface SubjectCardProps {
  subject: Subject
  index: number
  isActive: boolean
  onClick: () => void
}

export function SubjectCard({ subject, index, isActive, onClick }: SubjectCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl text-left transition-all duration-300",
        "glass-card",
        isActive && "ring-2 ring-blue-500/50 shadow-[0_0_30px_-5px_rgba(96,165,250,0.4)]"
      )}
    >
      {/* Gradient overlay on hover */}
      <div className={cn(
        "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        "bg-gradient-to-br",
        subject.color.replace("from-", "from-").replace("to-", "to-"),
      )} style={{ opacity: 0.1 }} />
      
      <div className="relative p-5">
        {/* Icon */}
        <div className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          subject.gradient
        )}>
          <subject.icon className="h-6 w-6 text-white" />
        </div>
        
        {/* Title */}
        <h3 className="mb-2 font-semibold">{subject.name}</h3>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{subject.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${subject.progress}%` }}
              transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
              className={cn("h-full rounded-full bg-gradient-to-r", subject.color)}
            />
          </div>
        </div>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="subjectActive"
            className="absolute right-4 top-4 h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>
    </motion.button>
  )
}
