"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface Card3DProps {
  children: ReactNode
  className?: string
  index?: number
}

export function Card3D({ children, className, index = 0 }: Card3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      whileHover={{ 
        y: -8, 
        rotateX: 5, 
        rotateY: -2,
        transition: { duration: 0.3 }
      }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={cn(
        "glass-card rounded-2xl overflow-hidden",
        "transition-shadow duration-300",
        "hover:shadow-[0_20px_50px_-15px_rgba(96,165,250,0.3)]",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
