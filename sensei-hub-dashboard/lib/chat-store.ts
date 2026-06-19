// チャット履歴（会話）の localStorage 保存。直近 20 会話を保持。

import type { ChatMessage } from "@/lib/chat-client"

export type Conversation = {
  id: string
  title: string
  messages: ChatMessage[]
  ts: number
  favorite?: boolean
  renamed?: boolean // 手動で改名済みなら自動タイトルで上書きしない
}

const KEY = "sensei-chat-conversations"
const MAX = 20

export function getConversations(): Conversation[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    if (!Array.isArray(arr)) return []
    // お気に入りを上に、その中で新しい順に並べる
    return (arr as Conversation[]).sort((a, b) => {
      const fav = Number(!!b.favorite) - Number(!!a.favorite)
      return fav !== 0 ? fav : b.ts - a.ts
    })
  } catch {
    return []
  }
}

export function saveConversation(conv: Omit<Conversation, "ts"> & { ts?: number }): void {
  if (typeof window === "undefined") return
  if (conv.messages.length === 0) return
  try {
    const existing = getConversations().find((c) => c.id === conv.id)
    const all = getConversations().filter((c) => c.id !== conv.id)
    // 改名済みならユーザーのタイトルを維持する
    const title = existing?.renamed ? existing.title : conv.title
    // 既存のお気に入り・上限超過時の保護: お気に入りは件数制限の対象外にする
    all.unshift({
      favorite: existing?.favorite,
      renamed: existing?.renamed,
      ...conv,
      title,
      ts: conv.ts ?? Date.now(),
    })
    const favorites = all.filter((c) => c.favorite)
    const rest = all.filter((c) => !c.favorite).slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify([...favorites, ...rest]))
  } catch {
    // 無視
  }
}

/** 会話のタイトルを変更する。 */
export function renameConversation(id: string, title: string): void {
  if (typeof window === "undefined") return
  const trimmed = title.trim()
  if (!trimmed) return
  try {
    const all = getConversations().map((c) => (c.id === id ? { ...c, title: trimmed, renamed: true } : c))
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    // 無視
  }
}

/** お気に入りを切り替える。 */
export function toggleFavorite(id: string): void {
  if (typeof window === "undefined") return
  try {
    const all = getConversations().map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    // 無視
  }
}

/** 会話を Markdown 文字列へ整形する。 */
export function conversationToMarkdown(conv: Conversation): string {
  const date = new Date(conv.ts).toISOString().slice(0, 10)
  const lines = [`# ${conv.title}`, "", `> ${date}`, ""]
  for (const m of conv.messages) {
    if (m.role === "system") continue
    lines.push(m.role === "user" ? "**🙋 You**" : "**🤖 Sensei**", "", m.content, "")
  }
  return lines.join("\n")
}

/** 会話を .md としてダウンロードさせる。 */
export function downloadConversationMarkdown(conv: Conversation): void {
  if (typeof window === "undefined") return
  const md = conversationToMarkdown(conv)
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const safe = conv.title.replace(/[^\p{L}\p{N}\-_ ]/gu, "").trim().slice(0, 40) || "chat"
  const a = document.createElement("a")
  a.href = url
  a.download = `${safe}.md`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function deleteConversation(id: string): void {
  if (typeof window === "undefined") return
  try {
    const all = getConversations().filter((c) => c.id !== id)
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    // 無視
  }
}

export function newConversationId(): string {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/** 最初のユーザー発言からタイトルを作る。 */
export function deriveTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user")
  const text = firstUser?.content?.trim() || "Chat"
  return text.length > 40 ? `${text.slice(0, 40)}…` : text
}
