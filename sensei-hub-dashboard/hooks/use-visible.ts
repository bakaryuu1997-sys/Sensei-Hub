"use client"

import { useEffect, useRef, type RefObject } from "react"

/**
 * 要素が画面内にあり、かつタブが表示中かどうかを ref で追跡する。
 *
 * アニメーション（three.js / canvas の RAF ループ）から `visibleRef.current` を
 * 読み、画面外や非表示タブのときは重い描画をスキップするために使う。ref を返すため
 * 値の変化で effect が再実行されず、描画ループを張り替えずに済む。
 */
export function useVisible<T extends HTMLElement>(ref: RefObject<T | null>) {
  const visibleRef = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (typeof window === "undefined") return

    let inViewport = true
    let tabVisible = !document.hidden

    const update = () => {
      visibleRef.current = inViewport && tabVisible
    }

    const onVisibility = () => {
      tabVisible = !document.hidden
      update()
    }
    document.addEventListener("visibilitychange", onVisibility)

    let observer: IntersectionObserver | undefined
    if (el && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          inViewport = entries[0]?.isIntersecting ?? true
          update()
        },
        { rootMargin: "100px" },
      )
      observer.observe(el)
    }

    update()

    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      observer?.disconnect()
    }
  }, [ref])

  return visibleRef
}
