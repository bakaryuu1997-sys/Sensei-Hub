import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { marked } from "marked"
import { checkRateLimit } from "@/lib/rate-limiter"
import { getCache, setCache } from "@/lib/api-cache"

marked.setOptions({
  gfm: true,
  breaks: true,
})

const slugToFolder: Record<string, string> = {
  "fe": "fundamental-it-engineer",
  "git-and-github": "git-and-github",
};

function isPathSafe(baseDir: string, targetPath: string): boolean {
  const relative = path.relative(baseDir, targetPath);
  return !!(relative && !relative.startsWith("..") && !path.isAbsolute(relative));
}

function decodeEscapedString(str: string): string {
  let decoded = str;
  // Decode \UXXXXXXXX (8 hex chars)
  decoded = decoded.replace(/\\U([0-9a-fA-F]{8})/g, (match, p1) => {
    try {
      return String.fromCodePoint(parseInt(p1, 16));
    } catch (e) {
      return match;
    }
  });
  // Decode \uXXXX (4 hex chars)
  decoded = decoded.replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) => {
    try {
      return String.fromCharCode(parseInt(p1, 16));
    } catch (e) {
      return match;
    }
  });
  // Decode backslash escapes like \" and \'
  decoded = decoded.replace(/\\"/g, '"').replace(/\\'/g, "'");
  return decoded;
}

function parseFrontmatterAndContent(fileContent: string, lessonPath: string) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?([\s\S]*)/);
  if (!match) {
    return { title: "", description: "", content: fileContent };
  }
  const yaml = match[1];
  const content = match[2] ? match[2].trim() : "";
  const obj: Record<string, string> = {};
  yaml.split("\n").forEach((line) => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = decodeEscapedString(
        parts
          .slice(1)
          .join(":")
          .trim()
          .replace(/^"(.*)"$/, "$1")
          .replace(/^'(.*)'$/, "$1")
      );
      obj[key] = val;
    }
  });

  let parsedTitle = obj.title || "";
  if (!parsedTitle || /^day[- ]?\d+$/i.test(parsedTitle)) {
    // Extract first heading from content
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
      if (headingMatch) {
        let hText = headingMatch[1].trim();
        if ((hText.endsWith(":") || hText.endsWith("：")) && i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine && !nextLine.startsWith("#") && !nextLine.startsWith("-")) {
            hText = `${hText} ${nextLine}`;
          }
        }
        parsedTitle = hText;
        break;
      }
    }
  }

  let formattedTitle = parsedTitle

  // Find day number from path
  const dayMatch = lessonPath.match(/day-(\d+)/i)
  if (dayMatch) {
    const dayNum = parseInt(dayMatch[1], 10)
    const dayPrefix = `Day ${dayNum}: `
    if (
      !parsedTitle.toLowerCase().startsWith("day ") &&
      !parsedTitle.toLowerCase().startsWith("ngày ") &&
      !parsedTitle.toLowerCase().startsWith(`day-${dayNum}`) &&
      !parsedTitle.toLowerCase().startsWith(`day ${dayNum}`) &&
      !parsedTitle.toLowerCase().startsWith(`ngày ${dayNum}`)
    ) {
      formattedTitle = `${dayPrefix}${parsedTitle}`
    }
  }

  return {
    title: formattedTitle,
    description: obj.description || "",
    content,
  };
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
    const lessonsDir = path.resolve(process.cwd(), "../lessons")

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
    }

    setCache(cacheKey, result)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error reading lesson:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
