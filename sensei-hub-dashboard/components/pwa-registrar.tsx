"use client"

import { useEffect } from "react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null
  }
}

export function PwaRegistrar() {
  useEffect(() => {
    let registeredSW = false
    const registerSW = () => {
      if (registeredSW) return
      registeredSW = true
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log("ServiceWorker registration successful with scope: ", registration.scope)
        },
        (err) => {
          console.log("ServiceWorker registration failed: ", err)
        }
      )
    }

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      if (document.readyState === "complete") {
        registerSW()
      } else {
        window.addEventListener("load", registerSW)
      }
    }

    // Handle beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      window.deferredPrompt = e as BeforeInstallPromptEvent
      // Dispatch custom event to notify buttons
      window.dispatchEvent(new CustomEvent("pwa-prompt-active"))
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      if ("serviceWorker" in navigator) {
        window.removeEventListener("load", registerSW)
      }
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  return null
}
