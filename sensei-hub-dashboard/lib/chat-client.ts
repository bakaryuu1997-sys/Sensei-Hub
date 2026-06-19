// AI チャットのクライアント送信ヘルパー。
// Ollama はブラウザからローカル（localhost:11434）へ直接・ストリーミング受信。
// Gemini/OpenAI はサーバープロキシ（/api/chat）経由（キー保護）。

import { effectiveModel, type AiProvider, type ProviderConfig } from "@/lib/ai-config"

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

export type StreamOptions = {
  provider: AiProvider
  config: ProviderConfig
  messages: ChatMessage[]
  onDelta: (text: string) => void
  signal?: AbortSignal
}

export type ChatOutcome = { ok: true } | { ok: false; error: string }

async function streamOllama(opts: StreamOptions): Promise<ChatOutcome> {
  const base = (opts.config.baseUrl || "http://localhost:11434").replace(/\/$/, "")
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: effectiveModel("ollama", opts.config),
      messages: opts.messages,
      stream: true,
    }),
    signal: opts.signal,
  })
  if (!res.ok || !res.body) {
    return { ok: false, error: `Ollama error ${res.status}` }
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    // Ollama は NDJSON（1 行 1 JSON）でストリーミングする
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      try {
        const obj = JSON.parse(trimmed)
        const piece = obj.message?.content
        if (piece) opts.onDelta(piece)
      } catch {
        // 行が途中なら無視（次のチャンクで補完）
      }
    }
  }
  return { ok: true }
}

async function sendCloud(opts: StreamOptions): Promise<ChatOutcome> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: opts.provider,
      apiKey: opts.config.apiKey,
      baseUrl: opts.config.baseUrl || undefined,
      model: effectiveModel(opts.provider, opts.config),
      messages: opts.messages,
    }),
    signal: opts.signal,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: data?.error || `Error ${res.status}` }
  }
  // クラウドは現状非ストリーミング。全文を 1 回で渡す。
  opts.onDelta(data.reply ?? "")
  return { ok: true }
}

/** メッセージを送り、応答を onDelta で逐次（または一括）受け取る。signal で中断可能。 */
export async function streamChat(opts: StreamOptions): Promise<ChatOutcome> {
  try {
    if (opts.provider === "ollama") return await streamOllama(opts)
    return await sendCloud(opts)
  } catch (e: any) {
    if (e?.name === "AbortError") return { ok: true } // 中断は成功扱い（途中まで表示済み）
    return { ok: false, error: e?.message || "fetch failed" }
  }
}
