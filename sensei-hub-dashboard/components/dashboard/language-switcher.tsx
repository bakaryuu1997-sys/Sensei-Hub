"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { useLanguage, type Language } from "@/lib/i18n"

const languages: { code: Language; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "EN" },
  { code: "ja", label: "Japanese", native: "日本語", flag: "JA" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt", flag: "VI" },
]

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const current = languages.find((l) => l.code === lang)!

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-colors"
      >
        <Globe className="w-4 h-4 text-cyan-300" />
        <span className="text-xs font-mono font-bold text-white/90 tracking-wider">{current.flag}</span>
        <span className="text-sm text-white/80 hidden md:inline">{current.native}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
            >
              <div className="p-1.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      lang === l.code
                        ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold w-8 px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">
                        {l.flag}
                      </span>
                      <div className="text-left">
                        <div className="text-sm font-medium">{l.native}</div>
                        <div className="text-[10px] text-white/40">{l.label}</div>
                      </div>
                    </div>
                    {lang === l.code && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
