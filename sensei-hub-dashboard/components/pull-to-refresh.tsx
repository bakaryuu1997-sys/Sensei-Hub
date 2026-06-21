"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

// モバイルの「引っ張って更新」（pull-to-refresh）。ページ最上部で下に引くと onRefresh を呼ぶ。
// タッチ端末でのみ作動（デスクトップではタッチイベントが無く無効）。

const THRESHOLD = 70 // これ以上引いたら更新
const MAX = 110 // 引っ張りの最大表示量

export function PullToRefresh({
  onRefresh,
  children,
}: {
  onRefresh: () => void | Promise<void>
  children: ReactNode
}) {
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [dragging, setDragging] = useState(false)

  const pullRef = useRef(0)
  const startY = useRef<number | null>(null)
  const refreshingRef = useRef(false)
  const draggingRef = useRef(false)
  const onRefreshRef = useRef(onRefresh)

  // 最新の onRefresh をレンダー外で参照する
  useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  useEffect(() => {
    const apply = (v: number) => {
      pullRef.current = v
      setPull(v)
    }

    const onStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || refreshingRef.current) {
        startY.current = null
        return
      }
      startY.current = e.touches[0]?.clientY ?? null
      draggingRef.current = false
    }

    const onMove = (e: TouchEvent) => {
      if (startY.current === null || refreshingRef.current) return
      const dy = (e.touches[0]?.clientY ?? 0) - startY.current
      // 上スクロール（dy<0）や、途中でスクロールが発生したら無効化
      if (dy <= 0 || window.scrollY > 0) {
        if (draggingRef.current) {
          draggingRef.current = false
          setDragging(false)
          apply(0)
        }
        return
      }
      if (!draggingRef.current) {
        draggingRef.current = true
        setDragging(true)
      }
      // 抵抗をつけて引っ張り量を計算
      apply(Math.min(MAX, dy * 0.5))
      // ブラウザ標準のスクロール／PTR を抑止
      if (e.cancelable) e.preventDefault()
    }

    const onEnd = async () => {
      if (startY.current === null) return
      startY.current = null
      if (!draggingRef.current) return
      draggingRef.current = false
      setDragging(false)

      if (pullRef.current >= THRESHOLD) {
        refreshingRef.current = true
        setRefreshing(true)
        apply(THRESHOLD)
        try {
          await onRefreshRef.current()
        } finally {
          refreshingRef.current = false
          setRefreshing(false)
          apply(0)
        }
      } else {
        apply(0)
      }
    }

    document.addEventListener("touchstart", onStart, { passive: true })
    document.addEventListener("touchmove", onMove, { passive: false })
    document.addEventListener("touchend", onEnd)
    document.addEventListener("touchcancel", onEnd)
    return () => {
      document.removeEventListener("touchstart", onStart)
      document.removeEventListener("touchmove", onMove)
      document.removeEventListener("touchend", onEnd)
      document.removeEventListener("touchcancel", onEnd)
    }
  }, [])

  const active = pull > 4 || refreshing
  const ready = pull >= THRESHOLD

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
        style={{
          transform: `translateY(${Math.max(pull, refreshing ? THRESHOLD : 0) - 34}px)`,
          opacity: active ? 1 : 0,
          transition: dragging ? "opacity 0.1s" : "transform 0.2s, opacity 0.2s",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <div className="mt-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 border border-white/15 shadow-lg backdrop-blur">
          <RefreshCw
            className={cn(
              "h-4 w-4 transition-colors",
              ready || refreshing ? "text-cyan-300" : "text-white/50",
              refreshing && "animate-spin",
            )}
            style={refreshing ? undefined : { transform: `rotate(${pull * 2.5}deg)` }}
          />
        </div>
      </div>
      {children}
    </>
  )
}
