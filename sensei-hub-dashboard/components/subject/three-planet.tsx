"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useVisible } from "@/hooks/use-visible"

interface ThreePlanetProps {
  slug: string
  size?: number
}

export function ThreePlanet({ slug, size = 180 }: ThreePlanetProps) {
  const containerRef = useRef<HTMLCanvasElement>(null)
  const visibleRef = useVisible(containerRef)

  useEffect(() => {
    const canvas = containerRef.current
    if (!canvas) return

    // Setup color mapping based on subject slug
    const colorMap: Record<string, { primary: number; secondary: number }> = {
      aws: { primary: 0xfb923c, secondary: 0xf59e0b },        // Orange/Amber
      bjt: { primary: 0xec4899, secondary: 0xf43f5e },        // Pink/Rose
      database: { primary: 0x34d399, secondary: 0x10b981 },   // Emerald/Green
      devops: { primary: 0x22d3ee, secondary: 0x06b6d4 },     // Cyan/Teal
      dsa: { primary: 0xa855f7, secondary: 0x8b5cf6 },        // Purple/Violet
      fe: { primary: 0x3b82f6, secondary: 0x2563eb },        // Blue
      mindset: { primary: 0xfacc15, secondary: 0xd97706 },   // Yellow/Orange
      sysdesign: { primary: 0xef4444, secondary: 0xdc2626 }, // Red
      "blockchain-and-web3-fundamentals": { primary: 0xeab308, secondary: 0xf59e0b }, // Gold/Amber
      "cybersecurity-awareness": { primary: 0xef4444, secondary: 0xf43f5e },          // Red/Pink
      "git-and-github": { primary: 0xa78bfa, secondary: 0x6366f1 },                   // Lavender/Indigo
    }

    const theme = colorMap[slug] || { primary: 0x22d3ee, secondary: 0x8b5cf6 }

    // Scene setup
    const scene = new THREE.Scene()
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 8

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    // Group to hold planet and its rings
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // 1. Planet Sphere
    const sphereGeo = new THREE.SphereGeometry(1.8, 36, 36)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: theme.primary,
      roughness: 0.3,
      metalness: 0.1,
      bumpScale: 0.05,
    })
    const planet = new THREE.Mesh(sphereGeo, sphereMat)
    mainGroup.add(planet)

    // 2. Planet Rings (Saturn style)
    const ringGeo = new THREE.RingGeometry(2.3, 2.9, 64)
    // Adjust UVs for double-sided mapping
    const pos = ringGeo.attributes.position
    const v3 = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i)
      ringGeo.attributes.uv.setXY(i, v3.length() < 2.6 ? 0 : 1, 1)
    }

    const ringMat = new THREE.MeshStandardMaterial({
      color: theme.secondary,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      roughness: 0.5,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.5
    mainGroup.add(ring)

    // 3. Orbiting small moon (little glowing dot)
    const moonGeo = new THREE.SphereGeometry(0.15, 16, 16)
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const moon = new THREE.Mesh(moonGeo, moonMat)
    mainGroup.add(moon)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight1.position.set(5, 3, 5)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(theme.secondary, 0.8)
    dirLight2.position.set(-5, -3, -5)
    scene.add(dirLight2)

    // Mouse Interaction / Rotation Control
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      }

      mainGroup.rotation.y += deltaMove.x * 0.015
      mainGroup.rotation.x += deltaMove.y * 0.015
      
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    canvas.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    // Animation Loop
    let angle = 0
    let animationId: number

    const animate = () => {
      // 画面外・非表示タブのときは描画をスキップ（負荷削減）
      if (!visibleRef.current) {
        animationId = requestAnimationFrame(animate)
        return
      }

      // Auto-rotation when not dragging
      if (!isDragging) {
        mainGroup.rotation.y += 0.006
        planet.rotation.y += 0.003
      }

      // Moon orbit animation
      angle += 0.02
      moon.position.x = Math.cos(angle) * 3.5
      moon.position.z = Math.sin(angle) * 3.5
      moon.position.y = Math.sin(angle) * 0.8

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Clean up
    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      
      // Dispose geometry and materials
      sphereGeo.dispose()
      sphereMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      moonGeo.dispose()
      moonMat.dispose()
      renderer.dispose()
    }
  }, [slug, size, visibleRef])

  return (
    <canvas
      ref={containerRef}
      style={{ width: size, height: size }}
      className="block cursor-grab active:cursor-grabbing z-10"
    />
  )
}
