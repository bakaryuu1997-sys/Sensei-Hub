"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "glass-card rounded-xl transition-all duration-300",
        hover && "glass-card-hover cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
