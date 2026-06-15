"use client"

import { useCallback } from "react"

// Simple Web Audio API Synthesizer for zero-latency, zero-asset sci-fi sounds
export function useCosmicAudio() {
  const getAudioContext = (): AudioContext | null => {
    if (typeof window === "undefined") return null
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return null
    return new AudioContextClass()
  }

  const isMuted = (): boolean => {
    if (typeof window === "undefined") return true
    return localStorage.getItem("cosmic-audio-muted") === "true"
  }

  const playHover = useCallback(() => {
    if (isMuted()) return

    const ctx = getAudioContext()
    if (!ctx) return

    // Create oscillator and gain node
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    // Warm triangle wave for organic synth click
    osc.type = "triangle"
    
    // Frequency sweep from 500Hz to 150Hz
    osc.frequency.setValueAtTime(500, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08)

    // Volume envelope
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08)

    // Start and stop
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  }, [])

  const playSuccess = useCallback(() => {
    if (isMuted()) return

    const ctx = getAudioContext()
    if (!ctx) return

    // Play a beautiful, futuristic major-9th chord arpeggio
    const playNote = (freq: number, delay: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
      
      // Pitch float up slightly
      osc.frequency.linearRampToValueAtTime(freq * 1.005, ctx.currentTime + delay + duration)

      gain.gain.setValueAtTime(0, ctx.currentTime + delay)
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration)

      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + duration)
    }

    // Arpeggio notes (C5, E5, G5, B5, D6)
    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66]
    notes.forEach((freq, idx) => {
      playNote(freq, idx * 0.06, 0.6, 0.03)
    })
  }, [])

  return { playHover, playSuccess }
}
