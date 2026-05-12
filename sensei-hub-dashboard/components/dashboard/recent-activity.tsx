"use client"

import { motion } from "framer-motion"
import { GlassCard } from "./glass-card"
import { CheckCircle2, Trophy, BookOpen, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    action: "Completed lesson",
    subject: "useReducer vs useState",
    time: "2 hours ago",
    icon: CheckCircle2,
    iconClass: "text-emerald-400 bg-emerald-500/20",
  },
  {
    id: 2,
    action: "Earned achievement",
    subject: "First Week Streak",
    time: "5 hours ago",
    icon: Trophy,
    iconClass: "text-amber-400 bg-amber-500/20",
  },
  {
    id: 3,
    action: "Started course",
    subject: "Advanced React Patterns",
    time: "Yesterday",
    icon: BookOpen,
    iconClass: "text-indigo-400 bg-indigo-500/20",
  },
]

export function RecentActivity() {
  return (
    <GlassCard hover={false} className="h-full">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Recent Activity</h3>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${activity.iconClass}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight">{activity.action}</p>
                <p className="truncate text-xs text-muted-foreground">{activity.subject}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/70">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
