import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { checkRateLimit } from "@/lib/rate-limiter"
import { getCache, setCache } from "@/lib/api-cache"
import { parseFrontmatter, extractTitle, formatDayTitle } from "@/lib/markdown"
import { getIndexedLessons } from "@/lib/lessons-index"

const slugToFolder: Record<string, string> = {
  "fe": "fundamental-it-engineer",
  "git-and-github": "git-and-github",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || (request as any).ip || "127.0.0.1"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang") || "en"

    const cacheKey = `lessons/${slug}/${lang}`
    const cachedData = getCache(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    const subjectFolder = slugToFolder[slug] || slug

    // まず静的インデックスを使う（数百ファイルの走査を回避）。無ければ従来の走査へ。
    const indexed = getIndexedLessons(lang, subjectFolder)
    if (indexed) {
      const result = { lessons: indexed }
      setCache(cacheKey, result)
      return NextResponse.json(result)
    }

    const lessonsDir = process.env.LESSONS_DIR || path.resolve(process.cwd(), "../lessons")

    let langToUse = lang
    let subjectPath = path.resolve(lessonsDir, langToUse, subjectFolder)

    // Security check: Prevent Path Traversal
    if (!subjectPath.startsWith(lessonsDir)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Fallback to English if directory doesn't exist
    if (!fs.existsSync(subjectPath)) {
      langToUse = "en"
      subjectPath = path.resolve(lessonsDir, "en", subjectFolder)
      // Security check: Prevent Path Traversal for fallback path
      if (!subjectPath.startsWith(lessonsDir)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    if (!fs.existsSync(subjectPath)) {
      return NextResponse.json({ error: "Subject directory not found" }, { status: 404 })
    }

    const filesList: Array<{
      path: string
      title: string
      description: string
      day?: string
      category?: string
    }> = []

    function traverse(dir: string) {
      const entries = fs.readdirSync(dir)
      entries.forEach((entry) => {
        const fullPath = path.join(dir, entry)
        const relPath = path.relative(subjectPath, fullPath).replace(/\\/g, "/")
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          traverse(fullPath)
        } else if (entry.endsWith(".md")) {
          const content = fs.readFileSync(fullPath, "utf8")
          const { data, body } = parseFrontmatter(content)

          const parsedTitle = extractTitle(data, body) || entry.replace(/\.md$/, "")
          const formattedTitle = formatDayTitle(parsedTitle, relPath)

          filesList.push({
            path: relPath.replace(/\.md$/, ""),
            title: formattedTitle,
            description: data.description || "",
            day: data.day || "",
            category: data.category || "",
          })
        }
      })
    }

    traverse(subjectPath)

    // Sort files logically
    filesList.sort((a, b) => {
      const getNum = (p: string) => {
        const m = p.match(/day-(\d+)/i)
        return m ? parseInt(m[1], 10) : 0
      }
      return getNum(a.path) - getNum(b.path)
    })

    const result = { lessons: filesList }
    setCache(cacheKey, result)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
