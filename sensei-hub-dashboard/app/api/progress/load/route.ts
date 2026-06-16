import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limiter";
import { subjects } from "@/lib/subjects";
import fs from "fs";
import path from "path";
import { auth } from "@/auth";

const slugToFolder: Record<string, string> = {
  "fe": "fundamental-it-engineer",
  "git-and-github": "git-and-github",
};

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || (request as any).ip || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ completedLessons: {}, progressMap: {} })
    }

    // Ensure the user exists safely (handles concurrency)
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      try {
        await prisma.user.create({
          data: {
            id: userId,
            email: "default@senseihub.local",
            password: "default-password-hash",
            name: "Default Student",
          },
        });
      } catch (e) {
        // Ignore unique constraint error from concurrent requests
        console.log("Default user already created by a concurrent request.");
      }
    }

    // Load completed lessons from DB
    const progressList = await prisma.lessonProgress.findMany({
      where: { userId, status: "COMPLETED" },
    });

    const completedLessons: Record<string, boolean> = {};
    progressList.forEach((p) => {
      completedLessons[p.lessonId] = true;
    });

    // Compute progressMap based on completedLessons and subjects
    const progressMap: Record<string, number> = {};
    const lessonsDir = path.resolve(process.cwd(), "../lessons");

    subjects.forEach((subject) => {
      // Find all lessons for this subject (read from disk, using 'en' as standard source of truth)
      const subjectFolder = slugToFolder[subject.slug] || subject.slug;
      const subjectPath = path.resolve(lessonsDir, "en", subjectFolder);

      const filesList: string[] = [];
      if (fs.existsSync(subjectPath)) {
        function traverse(dir: string) {
          const entries = fs.readdirSync(dir);
          entries.forEach((entry) => {
            const fullPath = path.join(dir, entry);
            const relPath = path.relative(subjectPath, fullPath).replace(/\\/g, "/");
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              traverse(fullPath);
            } else if (entry.endsWith(".md")) {
              filesList.push(relPath.replace(/\.md$/, ""));
            }
          });
        }
        traverse(subjectPath);
        
        // Sort files by day number
        filesList.sort((a, b) => {
          const getNum = (p: string) => {
            const m = p.match(/day-(\d+)/i);
            return m ? parseInt(m[1], 10) : 0;
          };
          return getNum(a) - getNum(b);
        });
      }

      // Group lessons into modules and compute progress
      let currentOffset = 0;
      subject.modules.forEach((mod) => {
        const moduleLessons = filesList.slice(currentOffset, currentOffset + mod.lessons);
        currentOffset += mod.lessons;

        if (moduleLessons.length > 0) {
          const completedCount = moduleLessons.filter(
            (lessonPath) => completedLessons[`${subject.slug}/${lessonPath}`]
          ).length;
          progressMap[mod.id] = Math.round((completedCount / moduleLessons.length) * 100);
        } else {
          progressMap[mod.id] = 0;
        }
      });
    });

    return NextResponse.json({ completedLessons, progressMap });
  } catch (error: any) {
    console.error("Error loading progress:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
