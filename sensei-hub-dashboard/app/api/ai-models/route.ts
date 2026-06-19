import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limiter"

// プロバイダーから「そのキーで使えるモデル一覧」を取得する（キーは保存しない）。
// Gemini/OpenAI はサーバー経由（CORS 回避・キー保護）。Ollama はクライアント側で取得。

type Body = { provider: "gemini" | "openai"; apiKey: string; baseUrl?: string }

async function geminiModels(apiKey: string): Promise<string[]> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=200`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  return (data.models || [])
    .filter((m: any) => (m.supportedGenerationMethods || []).includes("generateContent"))
    .map((m: any) => String(m.name).replace(/^models\//, ""))
    .filter((n: string) => !n.includes("embedding") && !n.includes("aqa"))
}

async function openaiModels(apiKey: string, baseUrl?: string): Promise<string[]> {
  const base = baseUrl?.replace(/\/$/, "") || "https://api.openai.com/v1"
  const res = await fetch(`${base}/models`, { headers: { Authorization: `Bearer ${apiKey}` } })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI ${res.status}: ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  return (data.data || [])
    .map((m: any) => String(m.id))
    .filter((id: string) => /^(gpt|o[0-9]|chatgpt)/.test(id))
    .sort()
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      (request as any).ip ||
      "127.0.0.1"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const body = (await request.json()) as Body
    if (!body.provider || !body.apiKey) {
      return NextResponse.json({ error: "Missing provider or apiKey" }, { status: 400 })
    }

    let models: string[] = []
    if (body.provider === "gemini") models = await geminiModels(body.apiKey)
    else if (body.provider === "openai") models = await openaiModels(body.apiKey, body.baseUrl)
    else return NextResponse.json({ error: "Unsupported provider" }, { status: 400 })

    return NextResponse.json({ models })
  } catch (error: any) {
    console.error("ai-models error:", error)
    return NextResponse.json({ error: error.message || "Failed to load models" }, { status: 500 })
  }
}
