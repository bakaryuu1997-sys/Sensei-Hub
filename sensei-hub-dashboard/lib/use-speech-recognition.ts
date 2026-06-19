"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Language } from "@/lib/i18n"

// ブラウザの SpeechRecognition（無料）で音声入力する小さなフック。
// 非対応ブラウザでは supported=false を返し、UI 側でボタンを隠す。

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: any) => void) | null
  onerror: ((e: any) => void) | null
  onend: (() => void) | null
}

const LANG_MAP: Record<Language, string> = {
  en: "en-US",
  ja: "ja-JP",
  vi: "vi-VN",
}

function getCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null
}

export function useSpeechRecognition(lang: Language, onText: (text: string) => void) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const recRef = useRef<SpeechRecognitionLike | null>(null)
  // 最新の onText を参照し、コールバック差し替えでの再生成を避ける
  const onTextRef = useRef(onText)
  useEffect(() => {
    onTextRef.current = onText
  }, [onText])

  useEffect(() => {
    setSupported(!!getCtor())
  }, [])

  const stop = useCallback(() => {
    recRef.current?.stop()
  }, [])

  const start = useCallback(() => {
    const Ctor = getCtor()
    if (!Ctor) return
    // 既存セッションを止めてから開始
    recRef.current?.abort()

    const rec = new Ctor()
    rec.lang = LANG_MAP[lang] || "en-US"
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0]?.transcript ?? "")
        .join(" ")
        .trim()
      if (transcript) onTextRef.current(transcript)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recRef.current = rec
    setListening(true)
    try {
      rec.start()
    } catch {
      setListening(false)
    }
  }, [lang])

  useEffect(() => () => recRef.current?.abort(), [])

  return { supported, listening, start, stop }
}
