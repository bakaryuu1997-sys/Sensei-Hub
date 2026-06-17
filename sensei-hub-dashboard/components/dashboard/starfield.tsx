"use client"

import { useEffect, useRef } from "react"
import { useVisible } from "@/hooks/use-visible"

interface Star {
  x: number
  y: number
  z: number
  color: string
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const visibleRef = useVisible(canvasRef)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const numStars = 140
    const maxDepth = 1000
    const fov = 150 // Field of view
    const stars: Star[] = []

    // Cosmic star color palettes (white, cyan-blue, soft purple, pink)
    const starColors = [
      "rgba(255, 255, 255, ",
      "rgba(34, 211, 238, ", // Cyan
      "rgba(168, 85, 247, ", // Purple
      "rgba(236, 72, 153, ", // Pink
      "rgba(59, 130, 246, ", // Blue
    ]

    // Initialize stars randomly in 3D space
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * maxDepth,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      })
    }

    // Track mouse coordinates to warp the warp path
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.15
      targetMouseY = (e.clientY - height / 2) * 0.15
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    // Main render loop
    const render = () => {
      // 非表示タブのときは描画をスキップ（負荷削減）
      if (!visibleRef.current) {
        animationId = requestAnimationFrame(render)
        return
      }

      // Clear with very slight alpha to create trailing/motion blur effect
      ctx.fillStyle = "rgba(8, 2, 20, 0.2)"
      ctx.fillRect(0, 0, width, height)

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      stars.forEach((star) => {
        // Move star closer on Z axis
        star.z -= 0.3 // Extremely slow, subtle ambient drift

        // Warp center offset based on mouse
        const ox = star.x - mouseX
        const oy = star.y - mouseY

        // Projection
        const px = (ox / star.z) * fov + width / 2
        const py = (oy / star.z) * fov + height / 2

        // Reset star if it moves past screen or goes past camera
        if (star.z <= 0 || px < 0 || px > width || py < 0 || py > height) {
          star.x = Math.random() * width - width / 2
          star.y = Math.random() * height - height / 2
          star.z = maxDepth
        } else {
          // Size based on depth - smaller and less distracting
          const size = (1 - star.z / maxDepth) * 1.5 + 0.3

          // Opacity based on depth - softer glow
          const opacity = (1 - star.z / maxDepth) * 0.45

          ctx.fillStyle = star.color + opacity + ")"
          ctx.beginPath()
          ctx.arc(px, py, size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 w-full h-full block"
      style={{ mixBlendMode: "screen" }}
    />
  )
}
