"use client"

import { useEffect, useRef } from "react"
import { useVisible } from "@/hooks/use-visible"

interface ConstellationPlanetProps {
  slug: string
  size?: number
  isActive?: boolean
}

export function ConstellationPlanet({
  slug,
  size = 56,
  isActive = true,
}: ConstellationPlanetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const visibleRef = useVisible(canvasRef)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 教科ごとの色定義（キーは lib/subjects.ts の実際の slug に一致させる）。
    const colorMap: Record<string, { primary: string; secondary: string; ring: string }> = {
      "git-and-github": { primary: "#a78bfa", secondary: "#4f46e5", ring: "#6366f1" }, // violet/indigo
      fe: { primary: "#3b82f6", secondary: "#1d4ed8", ring: "#2563eb" }, // blue/indigo
      aws: { primary: "#fb923c", secondary: "#d97706", ring: "#f59e0b" }, // orange/amber
      "database-engineering": { primary: "#34d399", secondary: "#047857", ring: "#10b981" }, // emerald/teal
      "business-japanese-test": { primary: "#ec4899", secondary: "#be185d", ring: "#f43f5e" }, // pink/rose
      "devops-engineering": { primary: "#22d3ee", secondary: "#0369a1", ring: "#06b6d4" }, // cyan/blue
      "system-design": { primary: "#ef4444", secondary: "#b91c1c", ring: "#dc2626" }, // red/rose
      "data-structures-and-algorithms": { primary: "#a855f7", secondary: "#6d28d9", ring: "#8b5cf6" }, // purple/violet
      "developer-mindset": { primary: "#facc15", secondary: "#b45309", ring: "#d97706" }, // yellow/amber
      "cybersecurity-awareness": { primary: "#ef4444", secondary: "#be123c", ring: "#f43f5e" }, // red
      "blockchain-and-web3-fundamentals": { primary: "#eab308", secondary: "#a16207", ring: "#f59e0b" }, // gold
      "python": { primary: "#3b82f6", secondary: "#eab308", ring: "#06b6d4" },
    }

    const colors = colorMap[slug] || { primary: "#22d3ee", secondary: "#0369a1", ring: "#8b5cf6" }

    let animationId: number
    let angle = Math.random() * Math.PI * 2 // Random starting angle for the moon

    const r = size * 0.26 // Sphere radius
    const cx = size / 2
    const cy = size / 2

    const draw = () => {
      // 画面外・非表示タブのときは描画をスキップ（負荷削減）
      if (!visibleRef.current) {
        animationId = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, size, size)

      // 1. Calculate moon position & Z-depth
      angle += 0.035
      const moonX = cx + Math.cos(angle) * r * 2.1
      const moonY = cy + Math.sin(angle) * r * 0.6
      const isMoonBehind = Math.sin(angle) < 0

      // 2. Draw Back half of the Ring
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-15 * Math.PI / 180)
      ctx.beginPath()
      ctx.ellipse(0, 0, r * 1.6, r * 0.45, 0, Math.PI, 0, false)
      ctx.strokeStyle = colors.ring
      ctx.lineWidth = r * 0.22
      ctx.lineCap = "round"
      ctx.globalAlpha = isActive ? 0.45 : 0.35 // Colored and visible ring
      ctx.stroke()
      ctx.restore()

      // 3. Draw Moon if it is BEHIND the planet
      if (isMoonBehind) {
        ctx.beginPath()
        ctx.arc(moonX, moonY, r * 0.15, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.shadowColor = "#ffffff"
        ctx.shadowBlur = isActive ? 6 : 3
        ctx.globalAlpha = isActive ? 0.9 : 0.7
        ctx.fill()
        ctx.shadowBlur = 0 // Reset shadow
      }

      // 4. Draw Sphere (3D Shaded with actual colors)
      const grad = ctx.createRadialGradient(
        cx - r * 0.35,
        cy - r * 0.35,
        0,
        cx,
        cy,
        r
      )

      grad.addColorStop(0, "#ffffff")
      grad.addColorStop(0.2, colors.primary)
      grad.addColorStop(0.85, colors.secondary)
      grad.addColorStop(1, "#020617") // Shadow edge

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.globalAlpha = isActive ? 1.0 : 0.75 // 75% opacity for inactive, fully colored
      ctx.fill()

      // 5. Draw Front half of the Ring
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-15 * Math.PI / 180)
      ctx.beginPath()
      ctx.ellipse(0, 0, r * 1.6, r * 0.45, 0, 0, Math.PI, false)
      ctx.strokeStyle = colors.ring
      ctx.lineWidth = r * 0.22
      ctx.lineCap = "round"
      ctx.globalAlpha = isActive ? 0.85 : 0.65 // 65% opacity for inactive front ring
      
      // Add neon glow to rings
      ctx.shadowColor = colors.ring
      ctx.shadowBlur = isActive ? 8 : 4
      ctx.stroke()
      ctx.restore()
      ctx.shadowBlur = 0 // Reset

      // 6. Draw Moon if it is in FRONT of the planet
      if (!isMoonBehind) {
        ctx.beginPath()
        ctx.arc(moonX, moonY, r * 0.15, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.shadowColor = "#ffffff"
        ctx.shadowBlur = isActive ? 8 : 4
        ctx.globalAlpha = isActive ? 1.0 : 0.75 // 75% opacity for inactive moon
        ctx.fill()
        ctx.shadowBlur = 0 // Reset
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [slug, size, isActive, visibleRef])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="block pointer-events-none"
    />
  )
}
