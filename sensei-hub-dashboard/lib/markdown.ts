// Shared helpers for parsing lesson Markdown files.
// Used by both /api/subject/[slug]/lesson and /api/subject/[slug]/lessons.

/**
 * Decode escape sequences that occasionally appear in authored frontmatter:
 * \UXXXXXXXX (codepoint), \uXXXX (utf-16), and escaped quotes.
 */
export function decodeEscapedString(str: string): string {
  let decoded = str
  decoded = decoded.replace(/\\U([0-9a-fA-F]{8})/g, (match, p1) => {
    try {
      return String.fromCodePoint(parseInt(p1, 16))
    } catch {
      return match
    }
  })
  decoded = decoded.replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) => {
    try {
      return String.fromCharCode(parseInt(p1, 16))
    } catch {
      return match
    }
  })
  decoded = decoded.replace(/\\"/g, '"').replace(/\\'/g, "'")
  return decoded
}

export type Frontmatter = {
  data: Record<string, string>
  body: string
}

/**
 * Split a Markdown file into its YAML-ish frontmatter map and the body.
 * Returns an empty data map and the whole input as body when no frontmatter.
 */
export function parseFrontmatter(fileContent: string): Frontmatter {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?([\s\S]*)/)
  if (!match) {
    return { data: {}, body: fileContent }
  }

  const yaml = match[1]
  const body = match[2] ? match[2].trim() : ""
  const data: Record<string, string> = {}

  yaml.split("\n").forEach((line) => {
    const parts = line.split(":")
    if (parts.length >= 2) {
      const key = parts[0].trim()
      const val = decodeEscapedString(
        parts
          .slice(1)
          .join(":")
          .trim()
          .replace(/^"(.*)"$/, "$1")
          .replace(/^'(.*)'$/, "$1"),
      )
      data[key] = val
    }
  })

  return { data, body }
}

const BARE_DAY = /^day[- ]?\d+$/i

/**
 * Choose the lesson title: the frontmatter title unless it is missing or a bare
 * day marker (e.g. "day-01"), in which case fall back to the first heading.
 */
export function extractTitle(data: Record<string, string>, body: string): string {
  let title = data.title || ""
  if (title && !BARE_DAY.test(title)) {
    return title
  }

  const lines = body.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/)
    if (headingMatch) {
      let hText = headingMatch[1].trim()
      if ((hText.endsWith(":") || hText.endsWith("：")) && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim()
        if (nextLine && !nextLine.startsWith("#") && !nextLine.startsWith("-")) {
          hText = `${hText} ${nextLine}`
        }
      }
      title = hText
      break
    }
  }
  return title
}

/**
 * Prepend "Day N: " to a title when the lesson path carries a day number and
 * the title does not already start with a day marker (EN or VI).
 */
export function formatDayTitle(title: string, lessonPath: string): string {
  const dayMatch = lessonPath.match(/day-(\d+)/i)
  if (!dayMatch) return title

  const dayNum = parseInt(dayMatch[1], 10)
  const lower = title.toLowerCase()
  if (
    lower.startsWith("day ") ||
    lower.startsWith("ngày ") ||
    lower.startsWith(`day-${dayNum}`) ||
    lower.startsWith(`day ${dayNum}`) ||
    lower.startsWith(`ngày ${dayNum}`)
  ) {
    return title
  }
  return `Day ${dayNum}: ${title}`
}
