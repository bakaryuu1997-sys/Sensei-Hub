// レッスンの静的インデックスを生成するスクリプト。
//
// lessons/{en,ja,vi}/<subjectFolder> を 1 回だけ走査し、各レッスンの
// { path, title, description, day, category } を JSON にまとめて書き出す。
// アプリ（一覧 API / 進捗計算）はこの 1 ファイルだけを読むため、リクエスト毎の
// 数百ファイル走査・frontmatter 解析が不要になり、CPU/メモリ負荷を大幅に削減する。
//
// 実行: node scripts/build-lessons-index.mjs
//   LESSONS_DIR        … レッスンの場所（既定: ../lessons）
//   LESSONS_INDEX_PATH … 出力先（既定: <LESSONS_DIR>/lessons-index.json）

import fs from "fs"
import path from "path"

const LANGS = ["en", "ja", "vi"]

function decodeEscapedString(str) {
  let d = str
  d = d.replace(/\\U([0-9a-fA-F]{8})/g, (m, p1) => {
    try { return String.fromCodePoint(parseInt(p1, 16)) } catch { return m }
  })
  d = d.replace(/\\u([0-9a-fA-F]{4})/g, (m, p1) => {
    try { return String.fromCharCode(parseInt(p1, 16)) } catch { return m }
  })
  return d.replace(/\\"/g, '"').replace(/\\'/g, "'")
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?([\s\S]*)/)
  if (!match) return { data: {}, body: content }
  const data = {}
  const yaml = match[1]
  const body = match[2] ? match[2].trim() : ""

  const lines = yaml.split(/\r?\n/)
  let currentKey = null
  let blockScalarMode = false
  let blockScalarLines = []
  let blockScalarIndent = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (blockScalarMode && currentKey) {
      const trimmed = line.trim()
      if (line.startsWith(" ") || line.startsWith("\t") || trimmed === "") {
        if (blockScalarIndent === 0 && trimmed !== "") {
          const matchIndent = line.match(/^(\s*)/)
          blockScalarIndent = matchIndent ? matchIndent[0].length : 0
        }
        const contentLine = line.substring(blockScalarIndent)
        blockScalarLines.push(contentLine)
      } else {
        data[currentKey] = blockScalarLines.join("\n")
        currentKey = null
        blockScalarMode = false
        blockScalarLines = []
        blockScalarIndent = 0

        const parts = line.split(":")
        if (parts.length >= 2) {
          const key = parts[0].trim()
          const val = parts.slice(1).join(":").trim()
          if (val === "|") {
            currentKey = key
            blockScalarMode = true
          } else {
            data[key] = decodeEscapedString(val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1"))
          }
        }
      }
    } else {
      const parts = line.split(":")
      if (parts.length >= 2) {
        const key = parts[0].trim()
        const val = parts.slice(1).join(":").trim()
        if (val === "|") {
          currentKey = key
          blockScalarMode = true
        } else {
          data[key] = decodeEscapedString(val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1"))
        }
      }
    }
  }
  if (blockScalarMode && currentKey) {
    data[currentKey] = blockScalarLines.join("\n")
  }

  return { data, body }
}

function extractTitle(data, body) {
  let title = data.title || ""
  if (title && !/^day[- ]?\d+$/i.test(title)) return title
  const lines = body.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].trim().match(/^#{1,3}\s+(.+)$/)
    if (h) {
      let t = h[1].trim()
      if ((t.endsWith(":") || t.endsWith("：")) && i + 1 < lines.length) {
        const n = lines[i + 1].trim()
        if (n && !n.startsWith("#") && !n.startsWith("-")) t = `${t} ${n}`
      }
      return t
    }
  }
  return title
}

function formatDayTitle(title, relPath) {
  const m = relPath.match(/day-(\d+)/i)
  if (!m) return title
  const n = parseInt(m[1], 10)
  const l = title.toLowerCase()
  if (l.startsWith("day ") || l.startsWith("ngày ") || l.startsWith(`day-${n}`) || l.startsWith(`day ${n}`) || l.startsWith(`ngày ${n}`)) {
    return title
  }
  return `Day ${n}: ${title}`
}

function listSubjectLessons(subjectPath) {
  const out = []
  const stack = [subjectPath]
  while (stack.length) {
    const dir = stack.pop()
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        stack.push(full)
      } else if (entry.name.endsWith(".md")) {
        const rel = path.relative(subjectPath, full).replace(/\\/g, "/")
        const { data, body } = parseFrontmatter(fs.readFileSync(full, "utf8"))
        const title = formatDayTitle(extractTitle(data, body) || entry.name.replace(/\.md$/, ""), rel)
        out.push({
          path: rel.replace(/\.md$/, ""),
          title,
          description: data.description || "",
          day: data.day || "",
          category: data.category || "",
        })
      }
    }
  }
  out.sort((a, b) => {
    const num = (p) => { const m = p.match(/day-(\d+)/i); return m ? parseInt(m[1], 10) : 0 }
    return num(a.path) - num(b.path)
  })
  return out
}

function main() {
  const lessonsDir = process.env.LESSONS_DIR || path.resolve(process.cwd(), "../lessons")
  const outPath = process.env.LESSONS_INDEX_PATH || path.join(lessonsDir, "lessons-index.json")

  if (!fs.existsSync(lessonsDir)) {
    console.warn(`[lessons-index] lessons dir not found: ${lessonsDir} — skipping`)
    return
  }

  const subjects = {}
  for (const lang of LANGS) {
    const langDir = path.join(lessonsDir, lang)
    if (!fs.existsSync(langDir)) continue
    subjects[lang] = {}
    for (const entry of fs.readdirSync(langDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      subjects[lang][entry.name] = listSubjectLessons(path.join(langDir, entry.name))
    }
  }

  const index = { generatedAt: new Date().toISOString(), subjects }
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(index))
  const count = Object.values(subjects).reduce(
    (s, byFolder) => s + Object.values(byFolder).reduce((a, l) => a + l.length, 0), 0,
  )
  console.log(`[lessons-index] wrote ${count} lessons to ${outPath}`)
}

main()
