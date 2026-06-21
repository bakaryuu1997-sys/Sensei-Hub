"use client"

import { X } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

// ネイティブの導入プロンプトが使えない場合（iOS Safari、HTTP 配信など）の手動手順モーダル。
export function PwaInstallGuide({
  open,
  onClose,
  isIOS,
}: {
  open: boolean
  onClose: () => void
  isIOS: boolean
}) {
  const { t } = useLanguage()
  if (!open) return null

  const steps = isIOS
    ? [t("pwa.guide_ios_1"), t("pwa.guide_ios_2"), t("pwa.guide_ios_3")]
    : [t("pwa.guide_other_1"), t("pwa.guide_other_2"), t("pwa.guide_other_3")]

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-2xl glass-card border border-white/10 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <h2 className="flex-1 text-base font-bold text-white">{t("pwa.guide_title")}</h2>
          <button onClick={onClose} aria-label={t("pwa.close")} className="text-white/50 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-white/80">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-200 text-xs font-bold">
                {i + 1}
              </span>
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>

        <p className="text-xs text-white/40 leading-relaxed border-t border-white/10 pt-3">{t("pwa.guide_https")}</p>
      </div>
    </div>
  )
}
