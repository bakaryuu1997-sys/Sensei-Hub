"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircle, X, Sparkles, Send, Settings as SettingsIcon } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n"
import { sendChat, type ChatMessage } from "@/lib/chat-client"
import { getAiConfig } from "@/lib/ai-config"
import { cn } from "@/lib/utils"

/**
 * フローティングの AI アシスタント（右下）。設定済みのプロバイダーで実際に会話する。
 * Gemini/OpenAI はサーバープロキシ経由、Ollama はローカル直叩き。
 */
export function FloatingChat() {
  const pathname = usePathname()
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [configured, setConfigured] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const cfg = getAiConfig()
    setConfigured(cfg.provider === "ollama" || !!cfg.apiKey)
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
    return null
  }

  const systemPrompt: ChatMessage = {
    role: "system",
    content:
      "You are Sensei, a concise, encouraging tutor inside an IT learning app. " +
      `Answer in the user's language (current UI language code: ${lang}). Keep answers short and practical.`,
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg: ChatMessage = { role: "user", content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput("")
    setLoading(true)
    const outcome = await sendChat([systemPrompt, ...history])
    setLoading(false)
    if (outcome.ok) {
      setMessages((m) => [...m, { role: "assistant", content: outcome.reply || "…" }])
    } else if (outcome.error === "not_configured") {
      setConfigured(false)
    } else {
      setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${t("chat.error")}${outcome.message ? `: ${outcome.message}` : ""}` }])
    }
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
            className="flex h-[28rem] max-h-[70vh] w-[min(22rem,calc(100vw-2.5rem))] flex-col rounded-2xl glass-card border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-sm font-bold text-white flex-1">{t("chat.title")}</h2>
              <Link href="/settings" onClick={() => setOpen(false)} className="text-white/50 hover:text-white" aria-label={t("nav.settings")}>
                <SettingsIcon className="h-4 w-4" />
              </Link>
            </div>

            {/* Body */}
            {!configured ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-sm text-white/70">{t("chat.configure_hint")}</p>
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-xs font-bold text-white"
                >
                  {t("nav.settings")}
                </Link>
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messages.length === 0 && (
                    <p className="text-sm text-white/45 text-center mt-6">{t("chat.greeting")}</p>
                  )}
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                        m.role === "user"
                          ? "ml-auto bg-gradient-to-r from-cyan-500/30 to-purple-500/20 text-white"
                          : "mr-auto bg-white/5 text-white/85 border border-white/10",
                      )}
                    >
                      {m.content}
                    </div>
                  ))}
                  {loading && (
                    <div className="mr-auto flex gap-1 rounded-2xl bg-white/5 px-3.5 py-3 border border-white/10">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300" style={{ animationDelay: "0.15s" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300" style={{ animationDelay: "0.3s" }} />
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 border-t border-white/10 p-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                    placeholder={t("chat.placeholder")}
                    className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50"
                  />
                  <button
                    onClick={send}
                    disabled={loading || !input.trim()}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white disabled:opacity-40"
                    aria-label={t("chat.send")}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
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
