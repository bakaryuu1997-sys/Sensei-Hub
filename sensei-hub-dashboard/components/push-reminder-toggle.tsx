"use client"

import { useEffect, useState } from "react"
import { Bell, BellOff, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import {
  isPushSupported,
  isPushConfiguredClient,
  getPushSubscription,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push-client"

// 設定画面の「バックグラウンド学習リマインド」トグル。
export function PushReminderToggle() {
  const { t, lang } = useLanguage()
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)
  const [supported, setSupported] = useState(true)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    if (!isPushSupported() || !isPushConfiguredClient()) {
      setSupported(false)
      return
    }
    getPushSubscription()
      .then((s) => setEnabled(!!s))
      .catch(() => {})
  }, [])

  const toggle = async () => {
    setBusy(true)
    setMsg("")
    try {
      if (enabled) {
        await unsubscribeFromPush()
        setEnabled(false)
      } else {
        const r = await subscribeToPush(lang)
        if (r.ok) setEnabled(true)
        else setMsg(r.error === "denied" ? t("reminder.denied") : t("reminder.error"))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="glass-card border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="h-4 w-4 text-cyan-300" />
        <h2 className="text-sm font-bold text-white">{t("reminder.title")}</h2>
      </div>
      <p className="text-xs text-white/50 mb-4">{t("reminder.desc")}</p>

      {!supported ? (
        <p className="text-xs text-amber-300/70">{t("reminder.unsupported")}</p>
      ) : (
        <button
          onClick={toggle}
          disabled={busy}
          className={
            "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border transition-all disabled:opacity-50 " +
            (enabled
              ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/20 text-white border-cyan-400/40"
              : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10")
          }
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : enabled ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
          {enabled ? t("reminder.on") : t("reminder.off")}
        </button>
      )}
      {msg && <p className="text-xs text-amber-300/70 mt-2">{msg}</p>}
    </section>
  )
}
