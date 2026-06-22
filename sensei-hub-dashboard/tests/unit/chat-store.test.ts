import { describe, it, expect, beforeEach } from "vitest"
import type { ChatMessage } from "@/lib/chat-client"
import {
  getConversations,
  saveConversation,
  renameConversation,
  toggleFavorite,
  deleteConversation,
  conversationToMarkdown,
  deriveTitle,
  newConversationId,
  type Conversation,
} from "@/lib/chat-store"

// node 環境向けの最小 localStorage / window スタブ。
class MemoryStorage {
  private store = new Map<string, string>()
  getItem(k: string) {
    return this.store.has(k) ? this.store.get(k)! : null
  }
  setItem(k: string, v: string) {
    this.store.set(k, String(v))
  }
  removeItem(k: string) {
    this.store.delete(k)
  }
  clear() {
    this.store.clear()
  }
}

beforeEach(() => {
  ;(globalThis as any).window = globalThis
  ;(globalThis as any).localStorage = new MemoryStorage()
})

const msgs = (text: string): ChatMessage[] => [
  { role: "user", content: text },
  { role: "assistant", content: "ok" },
]

describe("saveConversation / getConversations", () => {
  it("会話を保存して取得できる", () => {
    saveConversation({ id: "a", title: "Hello", messages: msgs("hi") })
    const all = getConversations()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe("a")
    expect(all[0].ts).toBeTypeOf("number")
  })

  it("メッセージ 0 件は保存しない", () => {
    saveConversation({ id: "empty", title: "x", messages: [] })
    expect(getConversations()).toHaveLength(0)
  })

  it("お気に入りを先頭に、その中で新しい順に並べる", () => {
    saveConversation({ id: "old", title: "old", messages: msgs("a"), ts: 100 })
    saveConversation({ id: "new", title: "new", messages: msgs("b"), ts: 200 })
    saveConversation({ id: "fav", title: "fav", messages: msgs("c"), ts: 50 })
    toggleFavorite("fav")
    const order = getConversations().map((c) => c.id)
    expect(order[0]).toBe("fav") // お気に入りが最上位
    expect(order.slice(1)).toEqual(["new", "old"]) // 残りは新しい順
  })

  it("同じ id の保存は重複させず更新する", () => {
    saveConversation({ id: "a", title: "first", messages: msgs("x"), ts: 1 })
    saveConversation({ id: "a", title: "second", messages: msgs("y"), ts: 2 })
    const all = getConversations()
    expect(all).toHaveLength(1)
    expect(all[0].title).toBe("second")
  })

  it("非お気に入りは 20 件に制限、お気に入りは制限対象外", () => {
    // 先頭を保存してすぐお気に入りにする（押し出される前に保護）。
    saveConversation({ id: "c0", title: "t0", messages: msgs("m"), ts: 0 })
    toggleFavorite("c0")
    // その後に非お気に入りを 24 件追加（20 件を超える）。
    for (let i = 1; i <= 24; i++) {
      saveConversation({ id: `c${i}`, title: `t${i}`, messages: msgs("m"), ts: i })
    }
    // お気に入りは件数制限の対象外なので残る。
    expect(getConversations().some((c) => c.id === "c0")).toBe(true)
    // 非お気に入りは 20 件以内に保たれる。
    const nonFav = getConversations().filter((c) => !c.favorite)
    expect(nonFav.length).toBeLessThanOrEqual(20)
  })
})

describe("renameConversation", () => {
  it("タイトルを変更し renamed フラグを立てる", () => {
    saveConversation({ id: "a", title: "auto", messages: msgs("x") })
    renameConversation("a", "  My Title  ")
    const c = getConversations()[0]
    expect(c.title).toBe("My Title") // trim 済み
    expect(c.renamed).toBe(true)
  })

  it("空文字へのリネームは無視する", () => {
    saveConversation({ id: "a", title: "keep", messages: msgs("x") })
    renameConversation("a", "   ")
    expect(getConversations()[0].title).toBe("keep")
  })

  it("renamed 後は saveConversation の自動タイトルで上書きしない", () => {
    saveConversation({ id: "a", title: "auto", messages: msgs("x") })
    renameConversation("a", "Manual")
    saveConversation({ id: "a", title: "auto2", messages: msgs("y") })
    expect(getConversations()[0].title).toBe("Manual")
  })
})

describe("toggleFavorite / deleteConversation", () => {
  it("お気に入りを切り替える", () => {
    saveConversation({ id: "a", title: "x", messages: msgs("x") })
    toggleFavorite("a")
    expect(getConversations()[0].favorite).toBe(true)
    toggleFavorite("a")
    expect(getConversations()[0].favorite).toBe(false)
  })

  it("会話を削除する", () => {
    saveConversation({ id: "a", title: "x", messages: msgs("x") })
    saveConversation({ id: "b", title: "y", messages: msgs("y") })
    deleteConversation("a")
    const ids = getConversations().map((c) => c.id)
    expect(ids).toEqual(["b"])
  })
})

describe("deriveTitle（純粋）", () => {
  it("最初のユーザー発言をタイトルにする", () => {
    expect(deriveTitle([{ role: "assistant", content: "hi" }, { role: "user", content: "Question?" }])).toBe(
      "Question?",
    )
  })

  it("ユーザー発言が無ければ Chat", () => {
    expect(deriveTitle([{ role: "assistant", content: "hi" }])).toBe("Chat")
  })

  it("40 文字超は省略記号を付ける", () => {
    const long = "a".repeat(60)
    const t = deriveTitle([{ role: "user", content: long }])
    expect(t).toBe(`${"a".repeat(40)}…`)
  })
})

describe("conversationToMarkdown（純粋）", () => {
  it("system を除外し user/assistant を整形する", () => {
    const conv: Conversation = {
      id: "a",
      title: "Talk",
      ts: Date.UTC(2026, 5, 23),
      messages: [
        { role: "system", content: "secret" },
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there" },
      ],
    }
    const md = conversationToMarkdown(conv)
    expect(md).toContain("# Talk")
    expect(md).toContain("> 2026-06-23")
    expect(md).not.toContain("secret")
    expect(md).toContain("**🙋 You**")
    expect(md).toContain("Hello")
    expect(md).toContain("**🤖 Sensei**")
    expect(md).toContain("Hi there")
  })
})

describe("newConversationId", () => {
  it("c- で始まる一意な ID を返す", () => {
    const a = newConversationId()
    const b = newConversationId()
    expect(a).toMatch(/^c-\d+-[a-z0-9]+$/)
    expect(a).not.toBe(b)
  })
})
