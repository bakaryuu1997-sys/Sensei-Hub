"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  MessageCircle,
  X,
  Sparkles,
  Send,
  Settings as SettingsIcon,
  Square,
  Plus,
  History as HistoryIcon,
  Trash2,
  ChevronLeft,
  Mic,
  BookOpen,
  Star,
  Pencil,
  Download,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n"
import { streamChat, type ChatMessage } from "@/lib/chat-client"
import { ChatMessage as ChatMessageView } from "@/components/chat-message"
import { useSpeechRecognition } from "@/lib/use-speech-recognition"
import {
  subscribeActiveLesson,
  getActiveLesson,
  type ActiveLesson,
} from "@/lib/lesson-context"
import {
  getAiSettings,
  setAiSettings,
  readyProviders,
  effectiveModel,
  PROVIDER_LABELS,
  type AiProvider,
  type AiSettings,
} from "@/lib/ai-config"
import {
  getConversations,
  saveConversation,
  deleteConversation,
  renameConversation,
  toggleFavorite,
  downloadConversationMarkdown,
  newConversationId,
  deriveTitle,
  type Conversation,
} from "@/lib/chat-store"
import { cn } from "@/lib/utils"

export function FloatingChat() {
  const pathname = usePathname()
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<AiSettings | null>(null)
  const [active, setActive] = useState<AiProvider>("gemini")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [view, setView] = useState<"chat" | "history">("chat")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [lesson, setLesson] = useState<ActiveLesson | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  // 空で初期化し、初回オープン時に ID を採番（newConversationId は Date.now/Math.random を
  // 使うため、レンダー中に呼ぶと react-hooks/purity に反する）
  const convIdRef = useRef<string>("")
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { supported: voiceSupported, listening, start: startVoice, stop: stopVoice } =
    useSpeechRecognition(lang, (text) =>
      setInput((prev) => (prev ? `${prev} ${text}` : text)),
    )

  useEffect(() => {
    if (!open) return
    if (!convIdRef.current) convIdRef.current = newConversationId()
    const s = getAiSettings()
    setSettings(s)
    const ready = readyProviders(s)
    setActive(ready.includes(s.active) ? s.active : ready[0] || s.active)
    setConversations(getConversations())
  }, [open])

  // 表示中レッスンの本文を購読（「この内容を説明」用）
  useEffect(() => {
    setLesson(getActiveLesson())
    return subscribeActiveLesson(setLesson)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, streaming])

  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) return null

  const ready = settings ? readyProviders(settings) : []
  const activeConfig = settings?.providers[active]
  const modelName = activeConfig ? effectiveModel(active, activeConfig) : ""

  const persistCurrent = () => {
    if (messages.length > 0) {
      saveConversation({ id: convIdRef.current, title: deriveTitle(messages), messages })
    }
  }

  const switchProvider = (p: AiProvider) => {
    setActive(p)
    if (settings) {
      const next = { ...settings, active: p }
      setSettings(next)
      setAiSettings(next)
    }
  }

  const newChat = () => {
    persistCurrent()
    setMessages([])
    convIdRef.current = newConversationId()
    setView("chat")
  }

  const openHistory = () => {
    persistCurrent()
    setConversations(getConversations())
    setView("history")
  }

  const loadConversation = (c: Conversation) => {
    setMessages(c.messages)
    convIdRef.current = c.id
    setView("chat")
  }

  const removeConversation = (id: string) => {
    deleteConversation(id)
    setConversations(getConversations())
  }

  const startRename = (c: Conversation) => {
    setEditingId(c.id)
    setEditingTitle(c.title)
  }

  const commitRename = () => {
    if (editingId) {
      renameConversation(editingId, editingTitle)
      setConversations(getConversations())
    }
    setEditingId(null)
    setEditingTitle("")
  }

  const onToggleFavorite = (id: string) => {
    toggleFavorite(id)
    setConversations(getConversations())
  }

  const stop = () => {
    abortRef.current?.abort()
    setStreaming(false)
  }

  // レッスン文脈を含めた system プロンプトを組み立てる
  const buildSystemPrompt = (): ChatMessage => {
    let content =
      "You are Sensei, a concise, encouraging tutor inside an IT learning app. " +
      `Answer in the user's language (UI language code: ${lang}). Keep answers short and practical. ` +
      "Use Markdown for formatting and fenced code blocks for code."
    if (lesson) {
      content +=
        `\n\nThe user is currently viewing this lesson titled "${lesson.title}". ` +
        "When relevant, ground your answer in it:\n\n" +
        `"""\n${lesson.text}\n"""`
    }
    return { role: "system", content }
  }

  const send = async (override?: string) => {
    const text = (override ?? input).trim()
    if (!text || streaming || !settings || !activeConfig) return

    const userMsg: ChatMessage = { role: "user", content: text }
    const history = [...messages, userMsg]
    setMessages([...history, { role: "assistant", content: "" }])
    setInput("")
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    let acc = ""
    const outcome = await streamChat({
      provider: active,
      config: activeConfig,
      messages: [buildSystemPrompt(), ...history],
      signal: controller.signal,
      onDelta: (delta) => {
        acc += delta
        // 直前の assistant メッセージに追記（純粋な状態更新のみ）
        setMessages((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last && last.role === "assistant") {
            next[next.length - 1] = { ...last, content: last.content + delta }
          }
          return next
        })
      },
    })

    setStreaming(false)
    abortRef.current = null

    // 最終メッセージを確定（副作用は updater の外で実行）
    const assistantText = outcome.ok
      ? acc || "…"
      : acc
        ? `${acc}\n\n⚠️ ${t("chat.error")}: ${outcome.error}`
        : `⚠️ ${t("chat.error")}: ${outcome.error}`
    const finalMessages: ChatMessage[] = [...history, { role: "assistant", content: assistantText }]
    setMessages(finalMessages)
    saveConversation({
      id: convIdRef.current,
      title: deriveTitle(finalMessages),
      messages: finalMessages,
    })
  }

  const onLesson = pathname?.includes("/lesson/")
  const showLessonChip = onLesson && lesson && messages.length === 0 && view === "chat"

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
      // ノッチ端末のホームインジケーターに重ならないようセーフエリア分ずらす
      style={{
        bottom: "calc(1.25rem + env(safe-area-inset-bottom))",
        right: "calc(1.25rem + env(safe-area-inset-right))",
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex h-[37rem] max-h-[82vh] w-[min(24rem,calc(100vw-2.5rem))] flex-col rounded-2xl glass-card border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-sm font-bold text-white flex-1">{t("chat.title")}</h2>
                <button onClick={newChat} title={t("chat.new")} className="text-white/50 hover:text-white p-1" aria-label={t("chat.new")}>
                  <Plus className="h-4 w-4" />
                </button>
                <button onClick={view === "history" ? () => setView("chat") : openHistory} title={t("chat.history")} className="text-white/50 hover:text-white p-1" aria-label={t("chat.history")}>
                  {view === "history" ? <ChevronLeft className="h-4 w-4" /> : <HistoryIcon className="h-4 w-4" />}
                </button>
                <Link href="/settings" onClick={() => setOpen(false)} className="text-white/50 hover:text-white p-1" aria-label={t("nav.settings")}>
                  <SettingsIcon className="h-4 w-4" />
                </Link>
              </div>

              {/* Provider / model selector */}
              {ready.length > 0 && view === "chat" && (
                <div className="mt-2 flex items-center gap-2">
                  <select
                    value={active}
                    onChange={(e) => switchProvider(e.target.value as AiProvider)}
                    className="h-7 rounded-lg bg-white/5 border border-white/10 px-2 text-xs text-white outline-none focus:border-cyan-400/50"
                  >
                    {ready.map((p) => (
                      <option key={p} value={p} className="bg-slate-900">
                        {PROVIDER_LABELS[p]}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-white/40 font-mono truncate">{modelName}</span>
                </div>
              )}
            </div>

            {/* Body */}
            {ready.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-sm text-white/70">{t("chat.configure_hint")}</p>
                <Link href="/settings" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-xs font-bold text-white">
                  {t("nav.settings")}
                </Link>
              </div>
            ) : view === "history" ? (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {conversations.length === 0 ? (
                  <p className="text-sm text-white/40 text-center mt-6">{t("chat.no_history")}</p>
                ) : (
                  conversations.map((c) => (
                    <div key={c.id} className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 hover:bg-white/[0.06]">
                      <button onClick={() => onToggleFavorite(c.id)} className={cn("p-1", c.favorite ? "text-amber-400" : "text-white/30 hover:text-amber-400")} aria-label={t("chat.favorite")}>
                        <Star className={cn("h-3.5 w-3.5", c.favorite && "fill-current")} />
                      </button>
                      {editingId === c.id ? (
                        <input
                          value={editingTitle}
                          autoFocus
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={commitRename}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename()
                            if (e.key === "Escape") { setEditingId(null); setEditingTitle("") }
                          }}
                          className="flex-1 min-w-0 rounded-md bg-white/10 border border-cyan-400/40 px-2 py-1 text-sm text-white outline-none"
                        />
                      ) : (
                        <button onClick={() => loadConversation(c)} className="flex-1 min-w-0 text-left">
                          <span className="block truncate text-sm text-white/85">{c.title}</span>
                          <span className="text-[10px] text-white/35 font-mono">{c.messages.length} msg</span>
                        </button>
                      )}
                      <button onClick={() => startRename(c)} className="text-white/30 hover:text-cyan-400 p-1 opacity-0 group-hover:opacity-100" aria-label={t("chat.rename")}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => downloadConversationMarkdown(c)} className="text-white/30 hover:text-emerald-400 p-1 opacity-0 group-hover:opacity-100" aria-label={t("chat.export")}>
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => removeConversation(c.id)} className="text-white/30 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100" aria-label={t("chat.delete")}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messages.length === 0 && (
                    <p className="text-sm text-white/45 text-center mt-6">{t("chat.greeting")}</p>
                  )}
                  {messages.map((m, i) =>
                    m.role === "user" ? (
                      <div
                        key={i}
                        className="ml-auto max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap bg-gradient-to-r from-cyan-500/30 to-purple-500/20 text-white"
                      >
                        {m.content}
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="mr-auto max-w-[90%] rounded-2xl px-3.5 py-2 bg-white/5 text-white/85 border border-white/10"
                      >
                        {m.content ? (
                          <ChatMessageView content={m.content} />
                        ) : (
                          <span className="text-sm">{streaming && i === messages.length - 1 ? "…" : ""}</span>
                        )}
                      </div>
                    ),
                  )}
                </div>

                {/* レッスン文脈のクイックアクション */}
                {showLessonChip && (
                  <div className="px-3 pb-1">
                    <button
                      onClick={() => send(t("chat.explain_lesson"))}
                      className="flex w-full items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-left text-xs text-cyan-100 hover:bg-cyan-500/20 transition-colors"
                    >
                      <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{t("chat.explain_lesson")}</span>
                    </button>
                  </div>
                )}

                {/* Input */}
                <div className="flex items-center gap-2 border-t border-white/10 p-3">
                  {voiceSupported && (
                    <button
                      onClick={listening ? stopVoice : startVoice}
                      disabled={streaming}
                      className={cn(
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 transition-colors disabled:opacity-40",
                        listening ? "bg-rose-500/80 text-white animate-pulse" : "bg-white/5 text-white/60 hover:text-white",
                      )}
                      aria-label={t("chat.voice")}
                      title={t("chat.voice")}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  )}
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                    placeholder={t("chat.placeholder")}
                    disabled={streaming}
                    className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50 disabled:opacity-50"
                  />
                  {streaming ? (
                    <button onClick={stop} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500/80 text-white" aria-label={t("chat.stop")}>
                      <Square className="h-4 w-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      onClick={() => send()}
                      disabled={!input.trim()}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white disabled:opacity-40"
                      aria-label={t("chat.send")}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  )}
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
