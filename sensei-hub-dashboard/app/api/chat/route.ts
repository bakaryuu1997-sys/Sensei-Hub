import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limiter"

// AI チャットのサーバープロキシ。
// Gemini / OpenAI のキーをクライアントから受け取り、サーバーからプロバイダーへ
// 転送する（キーをバンドルに埋め込まず、CORS も回避）。Ollama はユーザーの
// ローカルで動くため、クライアントから直接呼ぶ（このルートは使わない）。
//
// 応答はプレーンテキストのストリームで返す。プロバイダー（OpenAI/Gemini）の
// SSE をパースし、生成された差分テキストだけを逐次クライアントへ流す。
// クライアント側は Ollama と同様に reader でチャンクを読み、画面へ追記する。

type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

type ChatBody = {
  provider: "gemini" | "openai"
  apiKey: string
  baseUrl?: string
  model?: string
  messages: ChatMessage[]
}

const encoder = new TextEncoder()

/** SSE のバイトストリームを 1 行ずつに割って `data:` 行の JSON を取り出す。 */
async function* parseSse(body: ReadableStream<Uint8Array>): AsyncGenerator<any> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith("data:")) continue
      const data = trimmed.slice(5).trim()
      if (!data || data === "[DONE]") continue
      try {
        yield JSON.parse(data)
      } catch {
        // 行が途中なら無視（次のチャンクで補完される）
      }
    }
  }
}

/** OpenAI を SSE ストリーミングで呼び、差分テキストを yield する。 */
async function* streamOpenAI(body: ChatBody): AsyncGenerator<string> {
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
      stream: true,
    }),
  })
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "")
    throw new Error(`OpenAI error ${res.status}: ${text.slice(0, 300)}`)
  }
  for await (const obj of parseSse(res.body)) {
    const piece = obj.choices?.[0]?.delta?.content
    if (piece) yield piece
  }
}

/** Gemini を SSE ストリーミングで呼び、差分テキストを yield する。 */
async function* streamGemini(body: ChatBody): AsyncGenerator<string> {
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

  const res = await fetch(`${base}/models/${model}:streamGenerateContent?alt=sse&key=${body.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      ...(systemText ? { systemInstruction: { parts: [{ text: systemText }] } } : {}),
    }),
  })
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "")
    throw new Error(`Gemini error ${res.status}: ${text.slice(0, 300)}`)
  }
  for await (const obj of parseSse(res.body)) {
    const parts = obj.candidates?.[0]?.content?.parts
    if (Array.isArray(parts)) {
      for (const p of parts) {
        if (p?.text) yield p.text
      }
    }
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    (request as any).ip ||
    "127.0.0.1"
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const body = (await request.json().catch(() => null)) as ChatBody | null
  if (!body || !body.provider || !body.apiKey || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "Missing provider, apiKey or messages" }, { status: 400 })
  }
  if (body.provider !== "openai" && body.provider !== "gemini") {
    return NextResponse.json({ error: "Unsupported provider for server proxy" }, { status: 400 })
  }

  const source = body.provider === "openai" ? streamOpenAI(body) : streamGemini(body)

  // 最初のチャンクを取り出してプロバイダーのエラー（401 等）をここで検知する。
  // ストリーム開始後はステータスを変えられないため、初回失敗は 502 で返す。
  let first: IteratorResult<string>
  try {
    first = await source.next()
  } catch (error: any) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: error.message || "Chat failed" }, { status: 502 })
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!first.done && first.value) controller.enqueue(encoder.encode(first.value))
        for await (const piece of source) {
          controller.enqueue(encoder.encode(piece))
        }
      } catch (error: any) {
        // 途中で切れた場合はエラー文をテキストとして流す（クライアントは表示済みに追記）
        console.error("Chat stream error:", error)
        controller.enqueue(encoder.encode(`\n\n⚠️ ${error.message || "stream error"}`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  })
}
