"use client"

import { useEffect, useMemo, useRef } from "react"
import { marked } from "marked"
import DOMPurify from "isomorphic-dompurify"
import { Check, Copy } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

// チャット回答（assistant）のレンダラー。
// Markdown を HTML にして整形表示し、コードブロックにコピーボタンを付ける。
// ユーザー発言はプレーン表示のままにするため、このコンポーネントは assistant 用。

marked.setOptions({ breaks: true, gfm: true })

export function ChatMessage({ content }: { content: string }) {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)

  const html = useMemo(() => {
    const raw = marked.parse(content, { async: false }) as string
    return DOMPurify.sanitize(raw)
  }, [content])

  // 描画後に各コードブロックへコピーボタンを差し込む（HTML 直挿しのため手動配線）。
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const copyLabel = t("chat.copy")
    const copiedLabel = t("chat.copied")

    const blocks = Array.from(root.querySelectorAll("pre")) as HTMLPreElement[]
    const cleanups: Array<() => void> = []

    for (const pre of blocks) {
      if (pre.dataset.copyReady) continue
      pre.dataset.copyReady = "1"
      pre.style.position = "relative"

      const btn = document.createElement("button")
      btn.type = "button"
      btn.className =
        "chat-copy-btn absolute top-2 right-2 flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium text-white/70 hover:bg-white/20 hover:text-white transition-colors"
      btn.textContent = copyLabel
      btn.setAttribute("aria-label", copyLabel)

      const onClick = async () => {
        const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? ""
        try {
          await navigator.clipboard.writeText(code)
          btn.textContent = copiedLabel
          window.setTimeout(() => {
            btn.textContent = copyLabel
          }, 1500)
        } catch {
          // クリップボード非対応・権限拒否時は何もしない
        }
      }
      btn.addEventListener("click", onClick)
      pre.appendChild(btn)
      cleanups.push(() => {
        btn.removeEventListener("click", onClick)
        btn.remove()
        delete pre.dataset.copyReady
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [html, t])

  return <div ref={ref} className="chat-prose" dangerouslySetInnerHTML={{ __html: html }} />
}
