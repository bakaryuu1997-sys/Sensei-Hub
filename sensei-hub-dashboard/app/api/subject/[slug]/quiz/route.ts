import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { checkRateLimit } from "@/lib/rate-limiter"
import { getCache, setCache } from "@/lib/api-cache"

function isPathSafe(baseDir: string, targetPath: string): boolean {
  const relative = path.relative(baseDir, targetPath)
  return !!(relative && !relative.startsWith("..") && !path.isAbsolute(relative))
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      (request as any).ip ||
      "127.0.0.1"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { slug } = await params

    const cacheKey = `quiz/${slug}`
    const cached = getCache(cacheKey)
    if (cached) return NextResponse.json(cached)

    const lessonsDir = process.env.LESSONS_DIR || path.resolve(process.cwd(), "../lessons")
    const quizDir = path.resolve(lessonsDir, "quizzes")
    const filePath = path.resolve(quizDir, `${slug}.json`)

    // パストラバーサル対策
    if (!isPathSafe(quizDir, filePath)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const quiz = JSON.parse(fs.readFileSync(filePath, "utf8"))
    setCache(cacheKey, quiz)
    return NextResponse.json(quiz)
  } catch (error: any) {
    console.error("Error reading quiz:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
