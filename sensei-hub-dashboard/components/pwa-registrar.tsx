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
    // 1. Dispatch event if deferredPrompt was already captured by layout inline script
    if (window.deferredPrompt) {
      window.dispatchEvent(new CustomEvent("pwa-prompt-active"))
    }

    // 2. Conditionally Register Service Worker (Production only, or local debug override)
    if ("serviceWorker" in navigator) {
      const isProd = process.env.NODE_ENV === "production"
      const debugSW = typeof window !== "undefined" && window.localStorage?.getItem("DEBUG_SW") === "true"

      if (isProd || debugSW) {
        const registerSW = () => {
          navigator.serviceWorker.register("/sw.js").then(
            (registration) => {
              if (process.env.NODE_ENV === "development") {
                console.log("ServiceWorker registration successful with scope: ", registration.scope)
              }
            },
            (err) => {
              if (process.env.NODE_ENV === "development") {
                console.log("ServiceWorker registration failed: ", err)
              }
            }
          )
        }

        if (document.readyState === "complete") {
          registerSW()
        } else {
          window.addEventListener("load", registerSW)
          return () => window.removeEventListener("load", registerSW)
        }
      }
    }
  }, [])

  return null
}
