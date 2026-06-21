"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, ArrowLeft, Check, Rocket } from "lucide-react"
import { useLanguage, type Language } from "@/lib/i18n"
import { subjects } from "@/lib/subjects"
import { cn } from "@/lib/utils"

// 新規ユーザー向けの 3 ステップオンボーディング: 言語 → 学習コース → 開始。
// 一度完了/スキップしたら再表示しない（localStorage）。

const DONE_KEY = "sensei-onboarded"

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "vi", label: "Tiếng Việt" },
]

export function Onboarding() {
  const { t, lang, setLang } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)
  const [chosen, setChosen] = useState<string>("aws")

  useEffect(() => {
    let done = true
    try {
      done = localStorage.getItem(DONE_KEY) === "1"
    } catch {
      // 無視
    }
    if (!done) setShow(true)
  }, [])

  const finish = (go?: string) => {
    try {
      localStorage.setItem(DONE_KEY, "1")
    } catch {
      // 無視
    }
    setShow(false)
    if (go) router.push(go)
  }

  if (!show) return null
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) return null

  const steps = [t("onboarding.step_language"), t("onboarding.step_path"), t("onboarding.step_start")]

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg rounded-3xl glass-card border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header / stepper */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{t("onboarding.welcome_title")}</p>
          </div>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={cn("h-1.5 rounded-full transition-all", i === step ? "w-6 bg-cyan-300" : "w-1.5 bg-white/20")}
              />
            ))}
          </div>
        </div>

        <div className="p-6 min-h-[18rem]">
          <AnimatePresence mode="wait">
            {/* Step 1: language */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                <h2 className="text-lg font-extrabold text-white">{t("onboarding.choose_language")}</h2>
                <div className="grid gap-2">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                        lang === l.code
                          ? "border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white"
                          : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]",
                      )}
                    >
                      {l.label}
                      {lang === l.code && <Check className="h-4 w-4 text-cyan-300" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: learning path */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white">{t("onboarding.choose_path")}</h2>
                  <p className="text-xs text-white/50 mt-1">{t("onboarding.choose_path_sub")}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {subjects.map((s) => {
                    const Icon = s.icon
                    const active = chosen === s.slug
                    return (
                      <button
                        key={s.slug}
                        onClick={() => setChosen(s.slug)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all",
                          active ? "border-cyan-400/50 bg-white/[0.07]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                        )}
                      >
                        <span className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white", s.colorFrom, s.colorTo)}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-bold text-white/85 truncate">{s.name}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: start */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex flex-col items-center justify-center text-center space-y-4 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-extrabold text-white">{t("onboarding.ready_title")}</h2>
                <p className="text-sm text-white/60 max-w-xs">{t("onboarding.ready_sub")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / actions */}
        <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
          {step > 0 ? (
            <button onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              {t("onboarding.back")}
            </button>
          ) : (
            <button onClick={() => finish()} className="text-sm text-white/40 hover:text-white/70">
              {t("onboarding.skip")}
            </button>
          )}

          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2.5 text-sm font-bold text-white"
            >
              {t("onboarding.next")}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => finish(`/subject/${chosen}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2.5 text-sm font-bold text-white"
            >
              {t("onboarding.start")}
              <Rocket className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
