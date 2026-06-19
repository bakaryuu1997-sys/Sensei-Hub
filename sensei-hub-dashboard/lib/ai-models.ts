// 「そのプロバイダー/キーで実際に使えるモデル一覧」を取得するクライアントヘルパー。
// Gemini/OpenAI はサーバー経由（/api/ai-models）、Ollama はローカル直叩き。

import type { AiProvider, ProviderConfig } from "@/lib/ai-config"

export type ModelsOutcome = { ok: true; models: string[] } | { ok: false; error: string }

async function ollamaModels(config: ProviderConfig): Promise<string[]> {
  const base = (config.baseUrl || "http://localhost:11434").replace(/\/$/, "")
  const res = await fetch(`${base}/api/tags`)
  if (!res.ok) throw new Error(`Ollama ${res.status}`)
  const data = await res.json()
  return (data.models || []).map((m: any) => String(m.name)).sort()
}

export async function fetchModels(provider: AiProvider, config: ProviderConfig): Promise<ModelsOutcome> {
  try {
    if (provider === "ollama") {
      return { ok: true, models: await ollamaModels(config) }
    }
    const res = await fetch("/api/ai-models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, apiKey: config.apiKey, baseUrl: config.baseUrl || undefined }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: data?.error || `Error ${res.status}` }
    return { ok: true, models: data.models || [] }
  } catch (e: any) {
    return { ok: false, error: e?.message || "fetch failed" }
  }
}
