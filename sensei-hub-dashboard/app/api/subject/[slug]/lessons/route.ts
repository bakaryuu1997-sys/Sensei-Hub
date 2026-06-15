import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const slugToFolder: Record<string, string> = {
  "fe": "fundamental-it-engineer",
  "git-and-github": "git-and-github",
};

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

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?([\s\S]*)/);
  const yaml = match ? match[1] : "";
  const body = match ? match[2] : content;

  const obj: Record<string, string> = {};
  if (yaml) {
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
  }

  let title = obj.title || "";
  if (!title || /^day[- ]?\d+$/i.test(title)) {
    // Extract first heading from body
    const lines = body.split(/\r?\n/);
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
        title = hText;
        break;
      }
    }
  }

  return {
    ...obj,
    title,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang") || "en"

    const subjectFolder = slugToFolder[slug] || slug
    const lessonsDir = path.resolve(process.cwd(), "../lessons")

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
          const fm = parseFrontmatter(content)

          const parsedTitle = fm.title || entry.replace(/\.md$/, "")
          let formattedTitle = parsedTitle

          // Find day number from path
          const dayMatch = relPath.match(/day-(\d+)/i)
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

          filesList.push({
            path: relPath.replace(/\.md$/, ""),
            title: formattedTitle,
            description: fm.description || "",
            day: fm.day || "",
            category: fm.category || "",
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

    return NextResponse.json({ lessons: filesList })
  } catch (error: any) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
