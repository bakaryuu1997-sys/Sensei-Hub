"use client"

import { motion } from "framer-motion"

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
}

export function ProgressRing({ progress, size = 120, strokeWidth = 8 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg className="absolute" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
      </svg>
      
      {/* Progress ring */}
      <svg className="absolute -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(99 102 241)" />
            <stop offset="100%" stopColor="rgb(139 92 246)" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="progress-glow"
        />
      </svg>
      
      {/* Center text */}
      <div className="relative text-center">
        <motion.span 
          className="text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {progress}%
        </motion.span>
        <p className="text-xs text-muted-foreground">Complete</p>
      </div>
    </div>
  )
}
