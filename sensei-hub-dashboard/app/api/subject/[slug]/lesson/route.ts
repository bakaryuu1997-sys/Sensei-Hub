import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"
import { checkRateLimit } from "@/lib/rate-limiter"
import { getCache, setCache } from "@/lib/api-cache"
import { parseFrontmatter, extractTitle, formatDayTitle } from "@/lib/markdown"

// コードフェンスを highlight.js でサーバー側ハイライト（VSCode 風の配色）。
// mermaid は不明言語として plaintext 扱い＝エスケープのみ。class に language-mermaid が
// 残るので、レッスン画面側がそれを検出して図に描画する。
const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext"
      return hljs.highlight(code, { language }).value
    },
  }),
)
marked.setOptions({
  gfm: true,
  breaks: true,
})

const slugToFolder: Record<string, string> = {
  "fe": "fundamental-it-engineer",
  "git-and-github": "git-and-github",
  "python": "python",
};

function isPathSafe(baseDir: string, targetPath: string): boolean {
  const relative = path.relative(baseDir, targetPath);
  return !!(relative && !relative.startsWith("..") && !path.isAbsolute(relative));
}

function parseFrontmatterAndContent(fileContent: string, lessonPath: string) {
  const { data, body } = parseFrontmatter(fileContent)
  const title = formatDayTitle(extractTitle(data, body), lessonPath)
  return {
    title,
    description: data.description || "",
    content: body,
    codingExercise: data.codingExercise === "true",
    initialCode: data.initialCode || "",
    testCode: data.testCode || "",
    solutionCode: data.solutionCode || "",
  }
}

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
    const lessonPath = searchParams.get("path")
    const lang = searchParams.get("lang") || "en"

    if (!lessonPath) {
      return NextResponse.json({ error: "Lesson path is required" }, { status: 400 })
    }

    const cacheKey = `lesson/${slug}/${lang}/${lessonPath}`
    const cachedData = getCache(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    const subjectFolder = slugToFolder[slug] || slug
    const lessonsDir = process.env.LESSONS_DIR || path.resolve(process.cwd(), "../lessons")

    // Try selected language, fallback to English
    let langToUse = lang
    let fullFilePath = path.resolve(lessonsDir, langToUse, subjectFolder, `${lessonPath}.md`)

    // Security check: Prevent Path Traversal
    if (!isPathSafe(lessonsDir, fullFilePath)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    if (!fs.existsSync(fullFilePath)) {
      langToUse = "en"
      fullFilePath = path.resolve(lessonsDir, "en", subjectFolder, `${lessonPath}.md`)
      // Security check: Prevent Path Traversal for fallback file
      if (!isPathSafe(lessonsDir, fullFilePath)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    if (!fs.existsSync(fullFilePath)) {
      return NextResponse.json({ error: `Lesson file not found at ${lessonPath}.md` }, { status: 404 })
    }

    const fileContent = fs.readFileSync(fullFilePath, "utf8")
    const parsedResult = parseFrontmatterAndContent(fileContent, lessonPath)

    // Compile Markdown to HTML on the server
    const htmlContent = marked.parse(parsedResult.content) as string
    const result = {
      title: parsedResult.title,
      description: parsedResult.description,
      htmlContent,
      codingExercise: parsedResult.codingExercise,
      initialCode: parsedResult.initialCode,
      testCode: parsedResult.testCode,
      solutionCode: parsedResult.solutionCode,
    }

    setCache(cacheKey, result)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error reading lesson:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
