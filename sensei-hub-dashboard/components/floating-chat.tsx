"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircle, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n"

/**
 * Floating AI-assistant launcher (bottom-right). Scaffold only — the actual
 * chat + provider integration is configured later in Settings.
 */
export function FloatingChat() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  // Hide on the auth screens.
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
    return null
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl glass-card border border-white/10 p-5 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-sm font-bold text-white">{t("chat.title")}</h2>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{t("chat.coming_soon")}</p>
            <p className="mt-2 text-xs text-white/45 leading-relaxed">{t("chat.configure_hint")}</p>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              {t("nav.settings")}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={t("chat.open")}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 transition-shadow hover:shadow-purple-500/50"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  )
}
