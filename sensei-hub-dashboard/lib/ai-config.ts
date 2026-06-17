// （将来の）AI チャットのプロバイダー設定をクライアント側に保存する。
// ブラウザ内のみに保存し、現状キーが端末外に出ることはない。

const KEY = "sensei-ai-config"

export type AiProvider = "gemini" | "openai" | "ollama"

export type AiConfig = {
  provider: AiProvider
  apiKey: string
  baseUrl: string
}

export const DEFAULT_AI_CONFIG: AiConfig = {
  provider: "gemini",
  apiKey: "",
  baseUrl: "",
}

export function getAiConfig(): AiConfig {
  if (typeof window === "undefined") return DEFAULT_AI_CONFIG
  const raw = localStorage.getItem(KEY)
  if (!raw || raw === "undefined") return DEFAULT_AI_CONFIG
  try {
    const data = JSON.parse(raw) as Partial<AiConfig>
    return { ...DEFAULT_AI_CONFIG, ...data }
  } catch {
    return DEFAULT_AI_CONFIG
  }
}

// 設定を localStorage に保存する

export function setAiConfig(config: AiConfig): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(KEY, JSON.stringify(config))
  } catch {
    // エラーは無視
  }
}
