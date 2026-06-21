"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Download, X } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { usePwaInstall } from "@/hooks/use-pwa-install"
import { PwaInstallGuide } from "@/components/pwa-install-guide"

// 初回訪問時に「ホーム画面に追加」を促す控えめなヒント（モバイルのみ・一度閉じたら出さない）。

const DISMISS_KEY = "sensei-install-hint-dismissed"

export function InstallHint() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const { isInstallable, isStandalone, isIOS, install } = usePwaInstall()
  const [show, setShow] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)

  useEffect(() => {
    if (isStandalone) return
    let dismissed = false
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1"
    } catch {
      // 無視
    }
    if (dismissed) return
    // 初回描画直後は出さず、少し待ってから表示する
    const id = setTimeout(() => setShow(true), 2500)
    return () => clearTimeout(id)
  }, [isStandalone])

  const dismiss = () => {
    setShow(false)
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      // 無視
    }
  }

  if (!show || isStandalone) return null
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) return null

  return (
    <>
      <div
        className="fixed inset-x-3 z-40 lg:hidden rounded-2xl border border-cyan-400/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-3 flex items-center gap-3"
        // ボトムナビの上に重ねて表示する
        style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom))" }}
        role="status"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600">
          <Download className="h-4 w-4 text-white" />
        </div>
        <p className="flex-1 text-xs leading-snug text-white/80">{t("pwa.hint")}</p>
        <button
          onClick={() => (isInstallable ? install() : setGuideOpen(true))}
          className="flex-shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1.5 text-xs font-bold text-white"
        >
          {t("pwa.install_action")}
        </button>
        <button onClick={dismiss} aria-label={t("pwa.close")} className="flex-shrink-0 text-white/40 hover:text-white p-1">
          <X className="h-4 w-4" />
        </button>
      </div>
      <PwaInstallGuide open={guideOpen} onClose={() => setGuideOpen(false)} isIOS={isIOS} />
    </>
  )
}
