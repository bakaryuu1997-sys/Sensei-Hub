"use client"

import { motion } from "framer-motion"
import { Sparkles, CheckCircle2 } from "lucide-react"
import { computeSubjectStats } from "@/lib/subjects"
import { useLanguage } from "@/lib/i18n"
import { useCosmicAudio } from "@/hooks/use-cosmic-audio"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useUserProgress } from "@/components/user-progress-provider"
import { ConstellationPlanet } from "./constellation-planet"

// ビューポート（1150x200）。ノードは教科数に応じて等間隔で配置し、ジグザグの y で星座風にする。
// 教科が増減しても重ならない（固定配列だと数がずれて被るバグの再発を防ぐ）。
const VIEW_W = 1150

export function ConstellationMap() {
  const { t } = useLanguage()
  const { playHover } = useCosmicAudio()
  const { subjects } = useUserProgress()

  const nodeStats = subjects.map((subject, idx) => {
    const stats = computeSubjectStats(subject)
    const n = subjects.length
    const x = n > 1 ? 55 + (idx * (VIEW_W - 110)) / (n - 1) : VIEW_W / 2
    const y = idx % 2 === 0 ? 115 : 55
    return {
      ...subject,
      ...stats,
      pos: { x, y },
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
          {t("nav.dashboard")} · {t("constellation.title")}
        </h3>
      </div>

      <div className="relative w-full overflow-x-auto scrollbar-none">
        {/* Constellation Canvas Viewport */}
        <div className="min-w-[1150px] h-[200px] relative">
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
                  {/* Core Planet Node (2D Canvas high-performance rendering) */}
                  <div className="relative w-16 h-16 flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110">
                    <ConstellationPlanet slug={node.slug} size={56} isActive={isActive} />
                    
                    {/* Inner Content Badge (Check or Percentage) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {isCompleted ? (
                        <div className="bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-lg shadow-amber-500/30 border border-white/20">
                          <CheckCircle2 className="w-3 h-3 font-extrabold" />
                        </div>
                      ) : (
                        <div className="bg-slate-950/80 border border-cyan-400/30 text-cyan-300 rounded-full px-1.5 py-0.5 text-[8px] font-black font-mono leading-none shadow-md">
                          {node.progress}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Label / Tooltip */}
                  <div className="absolute top-11 pointer-events-none select-none text-center whitespace-nowrap z-20 transition-all duration-300 group-hover:translate-y-1">
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
                      {t(`sub.${node.slug}.name`)}
                    </span>
                    <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mt-0.5">
                      {t(`level.${node.level.toLowerCase().replace(" ", "")}`)}
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
