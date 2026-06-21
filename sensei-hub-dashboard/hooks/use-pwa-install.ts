import { useState, useEffect } from "react"

// PWA インストールの状態を提供するフック。
// - isInstallable: Chromium 系で beforeinstallprompt が捕捉済み（ネイティブの導入プロンプトを出せる）
// - isStandalone : すでにインストール済み（ホーム画面から起動している）
// - isIOS        : iOS（Safari は beforeinstallprompt 非対応 → 手動手順を案内する）
export function usePwaInstall() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true
    setIsStandalone(!!standalone)

    const ua = navigator.userAgent || ""
    const ios =
      /iphone|ipad|ipod/i.test(ua) ||
      // iPadOS は Mac を名乗るためタッチ有無で判定
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    setIsIOS(ios)

    if (window.deferredPrompt) setIsInstallable(true)

    const handleActive = () => setIsInstallable(true)
    const handleCleared = () => setIsInstallable(false)
    const handleInstalled = () => {
      setIsInstallable(false)
      setIsStandalone(true)
      window.deferredPrompt = null
      window.dispatchEvent(new CustomEvent("pwa-prompt-cleared"))
    }

    window.addEventListener("pwa-prompt-active", handleActive)
    window.addEventListener("pwa-prompt-cleared", handleCleared)
    window.addEventListener("appinstalled", handleInstalled)

    return () => {
      window.removeEventListener("pwa-prompt-active", handleActive)
      window.removeEventListener("pwa-prompt-cleared", handleCleared)
      window.removeEventListener("appinstalled", handleInstalled)
    }
  }, [])

  const install = async () => {
    const promptEvent = window.deferredPrompt
    if (!promptEvent) return

    try {
      await promptEvent.prompt()
      await promptEvent.userChoice
    } catch (err) {
      console.error("PWA install prompting failed:", err)
    } finally {
      window.deferredPrompt = null
      setIsInstallable(false)
      window.dispatchEvent(new CustomEvent("pwa-prompt-cleared"))
    }
  }

  return { isInstallable, isStandalone, isIOS, install }
}
