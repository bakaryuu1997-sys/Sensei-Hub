// AI チャットのクライアント送信ヘルパー。
// Gemini/OpenAI はサーバープロキシ（/api/chat）へ、Ollama はブラウザから
// ユーザーのローカル（localhost:11434）へ直接送る。

import { getAiConfig, DEFAULT_MODELS, type AiConfig } from "@/lib/ai-config"

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

export type ChatOutcome =
  | { ok: true; reply: string }
  | { ok: false; error: "not_configured" | "failed"; message?: string }

async function callOllama(config: AiConfig, messages: ChatMessage[]): Promise<string> {
  const base = (config.baseUrl || "http://localhost:11434").replace(/\/$/, "")
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.model || DEFAULT_MODELS.ollama,
      messages,
      stream: false,
    }),
  })
  if (!res.ok) {
    throw new Error(`Ollama error ${res.status}`)
  }
  const data = await res.json()
  return data.message?.content ?? ""
}

export async function sendChat(messages: ChatMessage[]): Promise<ChatOutcome> {
  const config = getAiConfig()

  // Ollama はキー不要・ローカル直叩き
  if (config.provider === "ollama") {
    try {
      const reply = await callOllama(config, messages)
      return { ok: true, reply }
    } catch (e: any) {
      return { ok: false, error: "failed", message: e?.message }
    }
  }

  // Gemini / OpenAI はキーが必要
  if (!config.apiKey) {
    return { ok: false, error: "not_configured" }
  }

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: config.provider,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl || undefined,
        model: config.model || DEFAULT_MODELS[config.provider],
        messages,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      return { ok: false, error: "failed", message: data?.error }
    }
    return { ok: true, reply: data.reply ?? "" }
  } catch (e: any) {
    return { ok: false, error: "failed", message: e?.message }
  }
}
