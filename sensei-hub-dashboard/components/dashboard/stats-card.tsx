"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface Stat {
  label: string
  value: string
  icon: LucideIcon
  color: string
}

interface StatsCardProps {
  stat: Stat
  index: number
}

export function StatsCard({ stat, index }: StatsCardProps) {
  const Icon = stat.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="glass-card rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg bg-white/10",
          stat.color
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      </div>
    </motion.div>
  )
}
