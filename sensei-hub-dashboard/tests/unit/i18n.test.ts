import { describe, it, expect } from "vitest"
import { translations } from "@/lib/i18n"

describe("i18n completeness", () => {
  it("every translation key has non-empty en / ja / vi", () => {
    const missing: string[] = []
    for (const [key, value] of Object.entries(translations)) {
      for (const lang of ["en", "ja", "vi"] as const) {
        const v = (value as Record<string, string>)[lang]
        if (!v || !v.trim()) missing.push(`${key}.${lang}`)
      }
    }
    expect(missing).toEqual([])
  })
})
