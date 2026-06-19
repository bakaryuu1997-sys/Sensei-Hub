// チャット履歴（会話）の localStorage 保存。直近 20 会話を保持。

import type { ChatMessage } from "@/lib/chat-client"

export type Conversation = {
  id: string
  title: string
  messages: ChatMessage[]
  ts: number
}

const KEY = "sensei-chat-conversations"
const MAX = 20

export function getConversations(): Conversation[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? (arr as Conversation[]).sort((a, b) => b.ts - a.ts) : []
  } catch {
    return []
  }
}

export function saveConversation(conv: Omit<Conversation, "ts"> & { ts?: number }): void {
  if (typeof window === "undefined") return
  if (conv.messages.length === 0) return
  try {
    const all = getConversations().filter((c) => c.id !== conv.id)
    all.unshift({ ...conv, ts: conv.ts ?? Date.now() })
    localStorage.setItem(KEY, JSON.stringify(all.slice(0, MAX)))
  } catch {
    // 無視
  }
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
