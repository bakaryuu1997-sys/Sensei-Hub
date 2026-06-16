import { useState, useEffect } from "react"

export function usePwaInstall() {
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (window.deferredPrompt) {
      setIsInstallable(true)
    }
    
    const handleActive = () => setIsInstallable(true)
    const handleCleared = () => {
      setIsInstallable(false)
    }
    const handleInstalled = () => {
      setIsInstallable(false)
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

  return { isInstallable, install }
}
