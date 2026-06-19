"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useVisible } from "@/hooks/use-visible"

interface DashboardPlanetProps {
  size?: number
  colorPrimary?: string
  colorSecondary?: string
  hasRings?: boolean
  hasMoon?: boolean
  rotationSpeed?: number
  cameraZ?: number
  planetRadius?: number
}

export function DashboardPlanet({
  size = 300,
  colorPrimary = "#fb923c",
  colorSecondary = "#f43f5e",
  hasRings = false,
  hasMoon = false,
  rotationSpeed = 0.003,
  cameraZ = 8,
  planetRadius = 1.8,
}: DashboardPlanetProps) {
  const containerRef = useRef<HTMLCanvasElement>(null)
  const visibleRef = useVisible(containerRef)

  useEffect(() => {
    const canvas = containerRef.current
    if (!canvas) return

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = cameraZ

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(size, size)
    // 装飾用途なので等倍で十分（高 DPR 画面でのフラグメント負荷を抑える）
    renderer.setPixelRatio(1)

    // Main Group
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // Procedural Planet Texture Generator
    const createPlanetTexture = (pColor: string, sColor: string) => {
      const texCanvas = document.createElement("canvas")
      texCanvas.width = 512
      texCanvas.height = 256
      const ctx = texCanvas.getContext("2d")
      if (!ctx) return null

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, texCanvas.height)
      grad.addColorStop(0, pColor)
      grad.addColorStop(0.3, sColor)
      grad.addColorStop(0.5, pColor)
      grad.addColorStop(0.7, sColor)
      grad.addColorStop(1, pColor)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, texCanvas.width, texCanvas.height)

      // Add atmospheric stripes
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.12)"
        const h = Math.random() * 16 + 4
        const y = Math.random() * (texCanvas.height - h)
        ctx.fillRect(0, y, texCanvas.width, h)
      }

      // Add noise spots / craters
      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"
        const x = Math.random() * texCanvas.width
        const y = Math.random() * texCanvas.height
        const r = Math.random() * 1.5 + 0.5
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      const texture = new THREE.CanvasTexture(texCanvas)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      return texture
    }

    const planetTexture = createPlanetTexture(colorPrimary, colorSecondary)

    // 1. Planet Sphere Mesh
    const sphereGeo = new THREE.SphereGeometry(planetRadius, 32, 32)
    const sphereMat = new THREE.MeshStandardMaterial({
      map: planetTexture || undefined,
      color: planetTexture ? 0xffffff : colorPrimary,
      roughness: 0.8,
      metalness: 0.05,
      bumpScale: 0.02,
    })
    const planet = new THREE.Mesh(sphereGeo, sphereMat)
    mainGroup.add(planet)

    // 2. Planet Rings (if enabled)
    let ring: THREE.Mesh | null = null
    let ringGeo: THREE.RingGeometry | null = null
    let ringMat: THREE.MeshStandardMaterial | null = null

    if (hasRings) {
      ringGeo = new THREE.RingGeometry(planetRadius * 1.35, planetRadius * 1.95, 64)
      
      // Map ring UVs horizontally
      const pos = ringGeo.attributes.position
      const v3 = new THREE.Vector3()
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i)
        ringGeo.attributes.uv.setXY(i, v3.length() < planetRadius * 1.65 ? 0 : 1, 1)
      }

      // Procedural Ring Texture
      const createRingTexture = (color: string) => {
        const ringCanvas = document.createElement("canvas")
        ringCanvas.width = 256
        ringCanvas.height = 1
        const ctx = ringCanvas.getContext("2d")
        if (!ctx) return null

        const ringGrad = ctx.createLinearGradient(0, 0, ringCanvas.width, 0)
        ringGrad.addColorStop(0, "rgba(0, 0, 0, 0)")
        ringGrad.addColorStop(0.15, `${color}33`)
        ringGrad.addColorStop(0.35, `${color}aa`)
        ringGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.15)")
        ringGrad.addColorStop(0.65, `${color}cc`)
        ringGrad.addColorStop(0.85, `${color}44`)
        ringGrad.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = ringGrad
        ctx.fillRect(0, 0, ringCanvas.width, ringCanvas.height)
        return new THREE.CanvasTexture(ringCanvas)
      }

      const ringTexture = createRingTexture(colorSecondary)

      ringMat = new THREE.MeshStandardMaterial({
        map: ringTexture || undefined,
        color: ringTexture ? 0xffffff : colorSecondary,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        roughness: 0.6,
      })

      ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2.3
      ring.rotation.y = Math.PI / 16
      mainGroup.add(ring)
    }

    // 3. Orbiting moon (if enabled)
    let moon: THREE.Mesh | null = null
    let moonGeo: THREE.SphereGeometry | null = null
    let moonMat: THREE.MeshStandardMaterial | null = null
    if (hasMoon) {
      moonGeo = new THREE.SphereGeometry(planetRadius * 0.12, 16, 16)
      moonMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.9,
      })
      moon = new THREE.Mesh(moonGeo, moonMat)
      mainGroup.add(moon)
    }

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25)
    scene.add(ambientLight)

    // Direct sun light
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5)
    sunLight.position.set(5, 3, 5)
    scene.add(sunLight)

    // Back light for rim lighting (glowing space look)
    const rimLight = new THREE.DirectionalLight(colorSecondary, 0.8)
    rimLight.position.set(-5, -3, -5)
    scene.add(rimLight)

    // Mouse Interaction (Click & Drag to Rotate)
    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMousePos.x
      const deltaY = e.clientY - prevMousePos.y

      mainGroup.rotation.y += deltaX * 0.008
      mainGroup.rotation.x += deltaY * 0.008

      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    canvas.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    // Animation loop
    let angle = 0
    let animId: number

    const animate = () => {
      // 画面外・非表示タブのときは描画をスキップ（負荷削減）
      if (!visibleRef.current) {
        animId = requestAnimationFrame(animate)
        return
      }

      // Rotation
      if (!isDragging) {
        mainGroup.rotation.y += rotationSpeed
        planet.rotation.y += rotationSpeed * 0.5
      }

      // Orbiting moon path
      if (hasMoon && moon) {
        angle += 0.012
        const dist = planetRadius * 2.1
        moon.position.x = Math.cos(angle) * dist
        moon.position.z = Math.sin(angle) * dist
        moon.position.y = Math.sin(angle) * 0.4
      }

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)

      sphereGeo.dispose()
      sphereMat.dispose()
      if (planetTexture) planetTexture.dispose()

      if (ringGeo) ringGeo.dispose()
      if (ringMat) ringMat.dispose()

      if (moonGeo) moonGeo.dispose()
      if (moonMat) moonMat.dispose()

      renderer.dispose()
    }
  }, [size, colorPrimary, colorSecondary, hasRings, hasMoon, rotationSpeed, cameraZ, planetRadius, visibleRef])

  return (
    <canvas
      ref={containerRef}
      style={{ width: size, height: size }}
      className="block cursor-grab active:cursor-grabbing max-w-full max-h-full"
    />
  )
}
