"use client"

import { motion } from "framer-motion"
import { Command, Plus, Search } from "lucide-react"

export function QuickActions() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex items-center gap-3"
    >
      <button className="glass-card flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-muted-foreground transition-all hover:text-foreground hover:border-indigo-500/50">
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-2 hidden rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono sm:inline-flex items-center gap-0.5">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>
      <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25">
        <Plus className="h-5 w-5" />
      </button>
    </motion.div>
  )
}
