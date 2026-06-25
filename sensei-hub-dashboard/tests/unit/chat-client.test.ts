import { describe, it, expect, vi, afterEach } from "vitest"
import { streamChat, type ChatMessage } from "@/lib/chat-client"
import type { ProviderConfig } from "@/lib/ai-config"

const enc = new TextEncoder()

// チャンクを流す Response モック（ReadableStream つき）。
function streamResponse(
  chunks: string[],
  opts: { ok?: boolean; status?: number; json?: unknown } = {},
): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(enc.encode(c))
      controller.close()
    },
  })
  return {
    ok: opts.ok ?? true,
    status: opts.status ?? 200,
    body,
    json: async () => opts.json ?? {},
    text: async () => chunks.join(""),
  } as unknown as Response
}

const cfg = (over: Partial<ProviderConfig> = {}): ProviderConfig => ({
  apiKey: "k",
  baseUrl: "",
  model: "test-model",
  ...over,
})

const msgs: ChatMessage[] = [{ role: "user", content: "hi" }]

afterEach(() => {
  vi.restoreAllMocks()
})

describe("streamChat — Ollama（ブラウザから localhost へ直接）", () => {
  it("NDJSON をパースして onDelta に差分を渡す", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      streamResponse(['{"message":{"content":"Hello"}}\n', '{"message":{"content":" world"}}\n']),
    )
    vi.stubGlobal("fetch", fetchMock)
    const deltas: string[] = []
    const r = await streamChat({
      provider: "ollama",
      config: cfg({ baseUrl: "http://localhost:11434" }),
      messages: msgs,
      onDelta: (t) => deltas.push(t),
    })
    expect(r.ok).toBe(true)
    expect(deltas.join("")).toBe("Hello world")
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:11434/api/chat")
  })

  it("途中で割れた JSON 行は次チャンクで補完される", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      streamResponse(['{"message":{"con', 'tent":"OK"}}\n']),
    )
    vi.stubGlobal("fetch", fetchMock)
    const deltas: string[] = []
    const r = await streamChat({ provider: "ollama", config: cfg(), messages: msgs, onDelta: (t) => deltas.push(t) })
    expect(r.ok).toBe(true)
    expect(deltas.join("")).toBe("OK")
  })

  it("res.ok=false ならエラーを返す", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(streamResponse([], { ok: false, status: 500 })))
    const r = await streamChat({ provider: "ollama", config: cfg(), messages: msgs, onDelta: () => {} })
    expect(r).toEqual({ ok: false, error: "Ollama error 500" })
  })

  it("AbortError は成功扱い（中断＝途中まで表示済み）", async () => {
    const err = Object.assign(new Error("aborted"), { name: "AbortError" })
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(err))
    const r = await streamChat({ provider: "ollama", config: cfg(), messages: msgs, onDelta: () => {} })
    expect(r).toEqual({ ok: true })
  })
})

describe("streamChat — Cloud（OpenAI/Gemini はサーバープロキシ /api/chat 経由）", () => {
  it("サーバーのテキストストリームを onDelta へ逐次流す", async () => {
    const fetchMock = vi.fn().mockResolvedValue(streamResponse(["Hel", "lo!"]))
    vi.stubGlobal("fetch", fetchMock)
    const deltas: string[] = []
    const r = await streamChat({ provider: "openai", config: cfg(), messages: msgs, onDelta: (t) => deltas.push(t) })
    expect(r.ok).toBe(true)
    expect(deltas.join("")).toBe("Hello!")
    expect(fetchMock.mock.calls[0][0]).toBe("/api/chat")
  })

  it("エラー時は JSON の error を返す", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(streamResponse([], { ok: false, status: 401, json: { error: "bad key" } })),
    )
    const r = await streamChat({ provider: "gemini", config: cfg(), messages: msgs, onDelta: () => {} })
    expect(r).toEqual({ ok: false, error: "bad key" })
  })

  it("fetch 自体が失敗したら ok:false", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")))
    const r = await streamChat({ provider: "openai", config: cfg(), messages: msgs, onDelta: () => {} })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toContain("network down")
  })
})
