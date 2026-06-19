import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limiter"

// AI チャットのサーバープロキシ。
// Gemini / OpenAI のキーをクライアントから受け取り、サーバーからプロバイダーへ
// 転送する（キーをバンドルに埋め込まず、CORS も回避）。Ollama はユーザーの
// ローカルで動くため、クライアントから直接呼ぶ（このルートは使わない）。

type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

type ChatBody = {
  provider: "gemini" | "openai"
  apiKey: string
  baseUrl?: string
  model?: string
  messages: ChatMessage[]
}

async function callOpenAI(body: ChatBody): Promise<string> {
  const base = body.baseUrl?.replace(/\/$/, "") || "https://api.openai.com/v1"
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${body.apiKey}`,
    },
    body: JSON.stringify({
      model: body.model || "gpt-4o-mini",
      messages: body.messages,
      temperature: 0.5,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI error ${res.status}: ${text.slice(0, 300)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ""
}

async function callGemini(body: ChatBody): Promise<string> {
  const model = body.model || "gemini-1.5-flash"
  const base = body.baseUrl?.replace(/\/$/, "") || "https://generativelanguage.googleapis.com/v1beta"
  // Gemini は role が user/model。system はプロンプト先頭にまとめる。
  const systemText = body.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n")
  const contents = body.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }))

  const res = await fetch(`${base}/models/${model}:generateContent?key=${body.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      ...(systemText ? { systemInstruction: { parts: [{ text: systemText }] } } : {}),
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini error ${res.status}: ${text.slice(0, 300)}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
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

    const body = (await request.json()) as ChatBody
    if (!body.provider || !body.apiKey || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: "Missing provider, apiKey or messages" }, { status: 400 })
    }

    let reply = ""
    if (body.provider === "openai") {
      reply = await callOpenAI(body)
    } else if (body.provider === "gemini") {
      reply = await callGemini(body)
    } else {
      return NextResponse.json({ error: "Unsupported provider for server proxy" }, { status: 400 })
    }

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: error.message || "Chat failed" }, { status: 500 })
  }
}
