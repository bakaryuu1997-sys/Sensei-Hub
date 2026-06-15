"use client"

import { motion } from "framer-motion"
import { Sparkles, CheckCircle2 } from "lucide-react"
import { subjects, computeSubjectStats } from "@/lib/subjects"
import { useLanguage } from "@/lib/i18n"
import { useCosmicAudio } from "@/hooks/use-cosmic-audio"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Define positions for our 8 chòm sao (nodes) in the viewport (1000x200)
const positions = [
  { x: 70, y: 100 },   // FE
  { x: 190, y: 50 },   // AWS
  { x: 310, y: 130 },  // SysDesign
  { x: 430, y: 60 },   // Database
  { x: 550, y: 140 },  // DevOps
  { x: 670, y: 60 },   // DSA
  { x: 790, y: 130 },  // BJT
  { x: 910, y: 95 },   // Mindset
]

export function ConstellationMap() {
  const { t } = useLanguage()
  const { playHover } = useCosmicAudio()

  const nodeStats = subjects.map((subject, idx) => {
    const stats = computeSubjectStats(subject)
    return {
      ...subject,
      ...stats,
      pos: positions[idx] || { x: 100, y: 100 },
    }
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative rounded-3xl overflow-hidden glass-card border border-white/10 p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
        <h3 className="text-sm font-extrabold font-mono tracking-wider uppercase text-cyan-200">
          {t("nav.dashboard")} · Chòm Sao Học Tập (Constellations)
        </h3>
      </div>

      <div className="relative w-full overflow-x-auto scrollbar-none">
        {/* Constellation Canvas Viewport */}
        <div className="min-w-[1000px] h-[200px] relative">
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {/* Draw Constellation Connecting Lines */}
            {nodeStats.map((node, idx) => {
              if (idx === nodeStats.length - 1) return null
              const nextNode = nodeStats[idx + 1]

              const isLineCompleted = node.progress === 100 && nextNode.progress > 0
              const isLineActive = node.progress > 0

              return (
                <g key={`line-${node.id}`}>
                  {/* Glowing background line */}
                  <line
                    x1={node.pos.x}
                    y1={node.pos.y}
                    x2={nextNode.pos.x}
                    y2={nextNode.pos.y}
                    stroke={isLineCompleted ? "#eab308" : isLineActive ? "#22d3ee" : "#ffffff"}
                    strokeOpacity={isLineCompleted ? 0.3 : isLineActive ? 0.2 : 0.05}
                    strokeWidth={isLineActive ? 6 : 2}
                    className={cn(isLineActive && !isLineCompleted && "animate-pulse")}
                  />
                  {/* Core sharp line */}
                  <line
                    x1={node.pos.x}
                    y1={node.pos.y}
                    x2={nextNode.pos.x}
                    y2={nextNode.pos.y}
                    stroke={isLineCompleted ? "url(#goldGrad)" : isLineActive ? "url(#cyanGrad)" : "#ffffff"}
                    strokeOpacity={isLineCompleted ? 0.9 : isLineActive ? 0.6 : 0.15}
                    strokeWidth={isLineActive ? 2.5 : 1}
                    strokeDasharray={isLineCompleted ? "none" : isLineActive ? "6, 6" : "3, 6"}
                  />
                </g>
              )
            })}

            {/* SVG Gradients for beautiful glow lines */}
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
              <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Render Subject Stars (Interactive Nodes) */}
          {nodeStats.map((node) => {
            const isCompleted = node.progress === 100
            const isActive = node.progress > 0

            return (
              <div
                key={`node-${node.id}`}
                className="absolute"
                style={{
                  left: `${node.pos.x}px`,
                  top: `${node.pos.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Link
                  href={`/subject/${node.slug}`}
                  onMouseEnter={playHover}
                  onClick={playHover}
                  className="group relative flex flex-col items-center"
                >
                  {/* Outer glowing pulsing aura */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full absolute -inset-0 flex items-center justify-center transition-all duration-300 group-hover:scale-125",
                      isCompleted
                        ? "bg-yellow-500/10 border border-yellow-400/30 shadow-lg shadow-yellow-500/30"
                        : isActive
                        ? "bg-cyan-500/10 border border-cyan-400/30 shadow-lg shadow-cyan-500/30 animate-pulse"
                        : "bg-white/5 border border-white/5",
                    )}
                  />

                  {/* Core Star Circle */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center border transition-all z-10",
                      isCompleted
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 text-white shadow-md"
                        : isActive
                        ? "bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-300 text-white"
                        : "bg-slate-900 border-white/20 text-white/30",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-[10px] font-extrabold font-mono">
                        {node.progress}%
                      </span>
                    )}
                  </div>

                  {/* Label / Tooltip */}
                  <div className="absolute top-10 pointer-events-none select-none text-center whitespace-nowrap z-20 transition-all duration-300 group-hover:translate-y-1">
                    <span
                      className={cn(
                        "block text-[11px] font-bold tracking-wide transition-colors",
                        isCompleted
                          ? "text-yellow-300 group-hover:text-yellow-200"
                          : isActive
                          ? "text-cyan-300 group-hover:text-cyan-200"
                          : "text-white/40 group-hover:text-white/60",
                      )}
                    >
                      {node.name}
                    </span>
                    <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mt-0.5">
                      {node.level}
                    </span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
