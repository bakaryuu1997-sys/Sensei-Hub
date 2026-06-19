"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, Cpu, Globe, Settings as SettingsIcon } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { useLanguage, type Language } from "@/lib/i18n"
import { useUserProgress } from "@/components/user-progress-provider"
import {
  getAiSettings,
  setAiSettings,
  isProviderReady,
  DEFAULT_MODELS,
  DEFAULT_SETTINGS,
  PROVIDERS,
  PROVIDER_LABELS,
  type AiProvider,
  type AiSettings,
  type ProviderConfig,
} from "@/lib/ai-config"
import { cn } from "@/lib/utils"

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "vi", label: "Tiếng Việt" },
]

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage()
  const { overallStats: overall } = useUserProgress()

  // プロバイダーごとに設定を保持（複数キーを同時に持てる）
  const [settings, setSettings] = useState<AiSettings>(DEFAULT_SETTINGS)
  const [editing, setEditing] = useState<AiProvider>("gemini")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSettings(getAiSettings())
  }, [])

  const cfg = settings.providers[editing]
  const updateCfg = (patch: Partial<ProviderConfig>) =>
    setSettings((s) => ({
      ...s,
      providers: { ...s.providers, [editing]: { ...s.providers[editing], ...patch } },
    }))

  const handleSave = () => {
    setAiSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
      </div>

      <Sidebar />

      <div className="relative z-10 lg:ml-72 min-h-screen flex flex-col">
        <TopBar />

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                <SettingsIcon className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">{t("settings.title")}</h1>
                <p className="text-sm text-white/50">{t("settings.subtitle")}</p>
              </div>
            </div>

            {/* Progress summary */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4">
                {t("settings.progress_title")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Stat value={`${overall.averageProgress}%`} label={t("stats.progress")} />
                <Stat value={`${overall.completedLessons}`} label={t("stats.lessons")} />
                <Stat value={`${overall.totalSubjects}`} label={t("nav.subjects")} />
                <Stat value={`${overall.totalHours}h`} label={t("stats.hours")} />
              </div>
            </motion.section>

            {/* Language */}
            <section className="glass-card border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4 text-cyan-300" />
                <h2 className="text-sm font-bold text-white">{t("settings.language_title")}</h2>
              </div>
              <p className="text-xs text-white/50 mb-4">{t("settings.language_desc")}</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm font-semibold border transition-all",
                      lang === l.code
                        ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/20 text-white border-cyan-400/40"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10",
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </section>

            {/* AI provider */}
            <section className="glass-card border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-4 w-4 text-cyan-300" />
                <h2 className="text-sm font-bold text-white">{t("settings.ai_title")}</h2>
              </div>
              <p className="text-xs text-white/50 mb-4">{t("settings.ai_desc")}</p>

              <label className="block text-xs font-semibold text-white/60 mb-1.5">{t("settings.provider")}</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {PROVIDERS.map((p) => {
                  const ready = isProviderReady(p, settings.providers[p])
                  return (
                    <button
                      key={p}
                      onClick={() => setEditing(p)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border transition-all",
                        editing === p
                          ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/20 text-white border-cyan-400/40"
                          : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10",
                      )}
                    >
                      {PROVIDER_LABELS[p]}
                      {ready && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="configured" />}
                    </button>
                  )
                })}
              </div>

              {editing !== "ollama" && (
                <div className="mb-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-white/60">{t("settings.api_key")}</label>
                    <a
                      href={editing === "gemini" ? "https://aistudio.google.com/app/apikey" : "https://platform.openai.com/api-keys"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline transition-colors font-semibold"
                    >
                      {editing === "gemini" ? t("settings.get_gemini_key") : t("settings.get_openai_key")}
                    </a>
                  </div>
                  <input
                    type="password"
                    value={cfg.apiKey}
                    onChange={(e) => updateCfg({ apiKey: e.target.value })}
                    placeholder="sk-..."
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 outline-none text-sm text-white placeholder:text-white/30"
                  />
                </div>
              )}

              <div className="mb-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-white/60">{t("settings.base_url")}</label>
                  {editing === "ollama" && (
                    <button
                      type="button"
                      onClick={() => updateCfg({ baseUrl: "http://localhost:11434" })}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline transition-colors font-semibold bg-transparent border-none cursor-pointer p-0"
                    >
                      {t("settings.use_default_ollama")}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={cfg.baseUrl}
                  onChange={(e) => updateCfg({ baseUrl: e.target.value })}
                  placeholder={editing === "ollama" ? "http://localhost:11434" : ""}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 outline-none text-sm text-white placeholder:text-white/30"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-white/60 mb-1.5">{t("settings.model")}</label>
                <input
                  type="text"
                  value={cfg.model}
                  onChange={(e) => updateCfg({ model: e.target.value })}
                  placeholder={DEFAULT_MODELS[editing]}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 outline-none text-sm text-white placeholder:text-white/30"
                />
              </div>

              {editing === "ollama" && (
                <p className="text-xs text-amber-200/70 bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 mb-4 leading-relaxed">
                  {t("settings.ollama_hint")}
                </p>
              )}

              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-opacity"
              >
                {saved ? <Check className="h-4 w-4" /> : null}
                {saved ? t("settings.saved") : t("settings.save")}
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-[11px] text-white/50 uppercase tracking-wider">{label}</div>
    </div>
  )
}
