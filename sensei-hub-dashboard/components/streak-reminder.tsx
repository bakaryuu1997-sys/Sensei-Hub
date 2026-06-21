"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Flame, Bell, X } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { getStreak, hasStudiedToday } from "@/lib/activity"
import { getResumeHref } from "@/lib/last-lesson"
import { cn } from "@/lib/utils"

// 連続学習（streak）が途切れそうなときに学習を促す控えめなリマインダー。
// 当日中は閉じたら再表示しない。通知を許可済みなら 1 日 1 回だけローカル通知も出す。
// ※ アプリを閉じている間に届く「定期プッシュ」はサーバー側の web-push 基盤が必要なため対象外。

const DISMISS_KEY = "sensei-streak-dismissed"
const NOTIFIED_KEY = "sensei-streak-notified"

function todayStr(): string {
  return new Date().toLocaleDateString("en-CA")
}

export function StreakReminder() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // 学習ページでは出さない（学習中のため）
    if (pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.includes("/lesson/")) return

    const s = getStreak()
    const atRisk = s >= 1 && !hasStudiedToday()
    if (!atRisk) return

    let dismissed = false
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === todayStr()
    } catch {
      // 無視
    }
    if (dismissed) return

    setStreak(s)
    const id = setTimeout(() => setShow(true), 1800)

    // 通知が許可済みなら 1 日 1 回ローカル通知
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        if (localStorage.getItem(NOTIFIED_KEY) !== todayStr()) {
          localStorage.setItem(NOTIFIED_KEY, todayStr())
          navigator.serviceWorker?.ready
            .then((reg) => reg.showNotification("Sensei Hub", { body: `🔥 ${s} ${t("streak.days")} — ${t("streak.keep")}`, badge: "/images/sensei-mascot.png", icon: "/images/sensei-mascot.png" }))
            .catch(() => {})
        }
      }
    } catch {
      // 無視
    }

    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const dismiss = () => {
    setShow(false)
    try {
      localStorage.setItem(DISMISS_KEY, todayStr())
    } catch {
      // 無視
    }
  }

  const enableNotify = () => {
    if (typeof Notification === "undefined") return
    Notification.requestPermission().catch(() => {})
  }

  if (!show) return null

  return (
    <div
      className={cn(
        "fixed inset-x-3 z-40 lg:inset-x-auto lg:right-5 lg:w-80 rounded-2xl border border-amber-400/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-3 flex items-center gap-3",
        "bottom-[calc(4.75rem+env(safe-area-inset-bottom))] lg:bottom-5",
      )}
      role="status"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
        <Flame className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white leading-tight">
          🔥 {streak} {t("streak.days")}
        </p>
        <p className="text-[11px] text-white/60 leading-snug">{t("streak.keep")}</p>
      </div>
      <button
        onClick={enableNotify}
        aria-label={t("streak.notify")}
        title={t("streak.notify")}
        className="flex-shrink-0 text-white/40 hover:text-amber-300 p-1"
      >
        <Bell className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          dismiss()
          router.push(getResumeHref())
        }}
        className="flex-shrink-0 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-bold text-white"
      >
        {t("streak.study_now")}
      </button>
      <button onClick={dismiss} aria-label={t("pwa.close")} className="flex-shrink-0 text-white/40 hover:text-white p-1">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
