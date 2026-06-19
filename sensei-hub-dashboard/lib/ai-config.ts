// AI チャットのプロバイダー設定（クライアント側 localStorage）。
// プロバイダーごとに apiKey/baseUrl/model を個別保持し、複数キーを同時に持てる。
// アクティブなプロバイダーをチャット側で切り替えられる。

const KEY = "sensei-ai-settings"
const OLD_KEY = "sensei-ai-config" // 旧フォーマット（単一設定）からの移行用

export type AiProvider = "gemini" | "openai" | "ollama"

export type ProviderConfig = { apiKey: string; baseUrl: string; model: string }

export type AiSettings = {
  active: AiProvider
  providers: Record<AiProvider, ProviderConfig>
}

export const PROVIDERS: AiProvider[] = ["gemini", "openai", "ollama"]

export const PROVIDER_LABELS: Record<AiProvider, string> = {
  gemini: "Gemini",
  openai: "OpenAI",
  ollama: "Ollama",
}

/** プロバイダーごとの既定モデル（ユーザー未指定時）。 */
export const DEFAULT_MODELS: Record<AiProvider, string> = {
  gemini: "gemini-1.5-flash",
  openai: "gpt-4o-mini",
  ollama: "llama3.2",
}

const emptyProvider = (): ProviderConfig => ({ apiKey: "", baseUrl: "", model: "" })

export const DEFAULT_SETTINGS: AiSettings = {
  active: "gemini",
  providers: { gemini: emptyProvider(), openai: emptyProvider(), ollama: emptyProvider() },
}

function withDefaults(partial: Partial<AiSettings> | null): AiSettings {
  const providers = { ...DEFAULT_SETTINGS.providers }
  if (partial?.providers) {
    for (const p of PROVIDERS) {
      providers[p] = { ...emptyProvider(), ...partial.providers[p] }
    }
  }
  const active = partial?.active && PROVIDERS.includes(partial.active) ? partial.active : "gemini"
  return { active, providers }
}

// 旧単一設定（{provider, apiKey, baseUrl, model}）を新フォーマットへ移行する。
function migrateOld(): AiSettings | null {
  try {
    const raw = localStorage.getItem(OLD_KEY)
    if (!raw || raw === "undefined") return null
    const old = JSON.parse(raw) as { provider?: AiProvider; apiKey?: string; baseUrl?: string; model?: string }
    const provider = old.provider && PROVIDERS.includes(old.provider) ? old.provider : "gemini"
    const settings = withDefaults({ active: provider })
    settings.providers[provider] = {
      apiKey: old.apiKey || "",
      baseUrl: old.baseUrl || "",
      model: old.model || "",
    }
    return settings
  } catch {
    return null
  }
}

export function getAiSettings(): AiSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  const raw = localStorage.getItem(KEY)
  if (raw && raw !== "undefined") {
    try {
      return withDefaults(JSON.parse(raw))
    } catch {
      return DEFAULT_SETTINGS
    }
  }
  // 旧フォーマットがあれば移行して保存
  const migrated = migrateOld()
  if (migrated) {
    setAiSettings(migrated)
    return migrated
  }
  return DEFAULT_SETTINGS
}

export function setAiSettings(settings: AiSettings): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    // 無視
  }
}

/** そのプロバイダーが利用可能か（Ollama はキー不要、クラウドはキー必須）。 */
export function isProviderReady(provider: AiProvider, config: ProviderConfig): boolean {
  return provider === "ollama" ? true : !!config.apiKey
}

/** 利用可能なプロバイダー一覧。 */
export function readyProviders(settings: AiSettings): AiProvider[] {
  return PROVIDERS.filter((p) => isProviderReady(p, settings.providers[p]))
}

/** プロバイダーの実効モデル名（未指定なら既定）。 */
export function effectiveModel(provider: AiProvider, config: ProviderConfig): string {
  return config.model || DEFAULT_MODELS[provider]
}
