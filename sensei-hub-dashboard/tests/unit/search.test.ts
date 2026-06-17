import { describe, it, expect } from "vitest"
import { filterSearchItems, type SearchItem } from "@/lib/search"

const items: SearchItem[] = [
  { id: "s-aws", type: "subject", title: "AWS", subtitle: "Cloud", href: "/subject/aws" },
  { id: "s-git", type: "subject", title: "Git & GitHub", subtitle: "Version control", href: "/subject/git-and-github" },
  { id: "l-1", type: "lesson", title: "Day 1: Intro to AWS", subtitle: "AWS", href: "/subject/aws/lesson/day-01" },
  { id: "l-2", type: "lesson", title: "Branching basics", subtitle: "Git & GitHub", href: "/subject/git-and-github/lesson/day-02" },
]

describe("filterSearchItems", () => {
  it("returns all items for an empty query", () => {
    expect(filterSearchItems(items, "")).toHaveLength(items.length)
    expect(filterSearchItems(items, "   ")).toHaveLength(items.length)
  })

  it("matches titles case-insensitively", () => {
    const r = filterSearchItems(items, "aws")
    expect(r.map((i) => i.id)).toContain("s-aws")
    expect(r.map((i) => i.id)).toContain("l-1")
  })

  it("matches the subtitle", () => {
    const r = filterSearchItems(items, "version control")
    expect(r.map((i) => i.id)).toContain("s-git")
  })

  it("ranks a title prefix match above a substring match", () => {
    const r = filterSearchItems(items, "br")
    expect(r[0].id).toBe("l-2") // "Branching basics" starts with "Br"
  })

  it("returns nothing when there is no match", () => {
    expect(filterSearchItems(items, "kubernetes")).toHaveLength(0)
  })
})
