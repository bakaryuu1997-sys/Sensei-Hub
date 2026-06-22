import { describe, it, expect } from "vitest"
import {
  decodeEscapedString,
  parseFrontmatter,
  extractTitle,
  formatDayTitle,
} from "@/lib/markdown"

describe("decodeEscapedString", () => {
  it("decodes large unicode codepoints (emoji)", () => {
    expect(decodeEscapedString("\\U0001FA9D hook")).toContain("🪝")
  })

  it("decodes utf-16 escapes", () => {
    expect(decodeEscapedString("\\u3053\\u3093\\u306b\\u3061\\u306f")).toBe("こんにちは")
  })

  it("strips escaped quotes", () => {
    expect(decodeEscapedString('a \\"b\\" c')).toBe('a "b" c')
  })
})

describe("parseFrontmatter", () => {
  it("splits frontmatter data from body", () => {
    const { data, body } = parseFrontmatter('---\ntitle: Hello\ndescription: Hi\n---\n# Body\ntext')
    expect(data.title).toBe("Hello")
    expect(data.description).toBe("Hi")
    expect(body).toBe("# Body\ntext")
  })

  it("returns whole content as body when no frontmatter", () => {
    const { data, body } = parseFrontmatter("# Just content")
    expect(data).toEqual({})
    expect(body).toBe("# Just content")
  })

  it("parses block scalars (|) correctly", () => {
    const content = `---
title: "Day 1"
initialCode: |
  def solve(a, b):
      return a + b
testCode: |
  assert solve(1, 2) == 3
---
# Day 1`
    const { data, body } = parseFrontmatter(content)
    expect(data.title).toBe("Day 1")
    expect(data.initialCode).toBe("def solve(a, b):\n    return a + b")
    expect(data.testCode).toBe("assert solve(1, 2) == 3")
    expect(body).toBe("# Day 1")
  })
})

describe("extractTitle", () => {
  it("prefers a meaningful frontmatter title", () => {
    expect(extractTitle({ title: "Real Title" }, "# Heading")).toBe("Real Title")
  })

  it("falls back to first heading when title is a bare day marker", () => {
    expect(extractTitle({ title: "day-01" }, "## Introduction to Git\nbody")).toBe(
      "Introduction to Git",
    )
  })
})

describe("formatDayTitle", () => {
  it("prepends Day N when the title lacks a day prefix", () => {
    expect(formatDayTitle("Branching", "day-03")).toBe("Day 3: Branching")
  })

  it("does not double-prefix an existing day title", () => {
    expect(formatDayTitle("Day 3 Branching", "day-03")).toBe("Day 3 Branching")
  })

  it("leaves titles unchanged when path has no day number", () => {
    expect(formatDayTitle("Overview", "intro")).toBe("Overview")
  })
})
