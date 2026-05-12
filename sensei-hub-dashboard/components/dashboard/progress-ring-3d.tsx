"use client"

import { motion } from "framer-motion"

interface ProgressRing3DProps {
  progress: number
  size?: number
}

export function ProgressRing3D({ progress, size = 140 }: ProgressRing3DProps) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <motion.div 
      className="relative flex-shrink-0"
      whileHover={{ scale: 1.05, rotateY: 10 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-50"
        style={{
          background: `conic-gradient(from 0deg, oklch(0.65 0.25 250 / 0.5), oklch(0.75 0.18 195 / 0.5), oklch(0.65 0.25 250 / 0.5))`,
        }}
      />
      
      <svg width={size} height={size} className="relative -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgba(255,255,255,0.1)"
          fill="none"
        />
        
        {/* Progress arc with gradient */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.25 250)" />
            <stop offset="50%" stopColor="oklch(0.75 0.18 195)" />
            <stop offset="100%" stopColor="oklch(0.78 0.2 145)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="url(#progressGradient)"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
        >
          {progress}%
        </motion.span>
        <span className="text-xs text-muted-foreground">Complete</span>
      </div>
    </motion.div>
  )
}
