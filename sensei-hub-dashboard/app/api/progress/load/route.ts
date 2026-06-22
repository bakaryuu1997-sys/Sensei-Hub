import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getCache, setCache } from "@/lib/api-cache";
import { getIndexedLessons } from "@/lib/lessons-index";
import { subjects, type Subject } from "@/lib/subjects";
import fs from "fs";
import path from "path";
import { auth } from "@clerk/nextjs/server";

const slugToFolder: Record<string, string> = {
  "fe": "fundamental-it-engineer",
  "git-and-github": "git-and-github",
  "python": "python",
};

/**
 * 教科のレッスンパス一覧（day番号順）を返す。
 *
 * 以前はリクエストごとに全教科を再帰走査していたため、レッスンが数千ファイル
 * ある環境ではメモリ／CPU を大量に消費し Heap out of memory の原因になっていた。
 * ディスク走査は教科・言語ごとに決まる（ユーザーに依存しない）ので、結果を
 * 1時間キャッシュして走査回数を実質1回に抑える。
 */
function getSubjectLessonPaths(subject: Subject, lessonsDir: string): string[] {
  const subjectFolder = slugToFolder[subject.slug] || subject.slug;

  // 静的インデックスがあればそれを使う（ファイル走査を完全に回避）。
  const indexed = getIndexedLessons("en", subjectFolder);
  if (indexed) return indexed.map((l) => l.path);

  const cacheKey = `progress-files/${subject.slug}/en`;
  const cached = getCache<string[]>(cacheKey);
  if (cached) return cached;

  const subjectPath = path.resolve(lessonsDir, "en", subjectFolder);
  const filesList: string[] = [];

  if (fs.existsSync(subjectPath)) {
    const stack: string[] = [subjectPath];
    // 再帰呼び出しではなくスタックで走査（深いネストでもスタックを積み増さない）
    while (stack.length > 0) {
      const dir = stack.pop() as string;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          stack.push(fullPath);
        } else if (entry.name.endsWith(".md")) {
          const relPath = path.relative(subjectPath, fullPath).replace(/\\/g, "/");
          filesList.push(relPath.replace(/\.md$/, ""));
        }
      }
    }

    // day番号で並べ替え
    filesList.sort((a, b) => {
      const getNum = (p: string) => {
        const m = p.match(/day-(\d+)/i);
        return m ? parseInt(m[1], 10) : 0;
      };
      return getNum(a) - getNum(b);
    });
  }

  setCache(cacheKey, filesList);
  return filesList;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || (request as any).ip || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ completedLessons: {}, progressMap: {} })
    }

    // ユーザーを安全に用意する（同時リクエストにも対応）
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      try {
        await prisma.user.create({
          data: { id: userId },
        });
      } catch (e) {
        // 同時リクエストによる一意制約エラーは無視
        console.log("Default user already created by a concurrent request.");
      }
    }

    // 全レッスンの進捗を DB から読み込む（last-write-wins 用に未完了も時刻付きで返す）
    const progressList = await prisma.lessonProgress.findMany({
      where: { userId },
    });

    const completedLessons: Record<string, boolean> = {};
    // クライアントの LWW マージ用: { lessonId, completed, ts }
    const lessons = progressList.map((p) => {
      const completed = p.status === "COMPLETED";
      if (completed) completedLessons[p.lessonId] = true;
      return { lessonId: p.lessonId, completed, ts: p.lastViewed.getTime() };
    });

    // completedLessons と subjects から progressMap を計算する
    const progressMap: Record<string, number> = {};
    const lessonsDir = process.env.LESSONS_DIR || path.resolve(process.cwd(), "../lessons");

    subjects.forEach((subject) => {
      // 教科のレッスン一覧（キャッシュ済み。'en' を基準とする）
      const filesList = getSubjectLessonPaths(subject, lessonsDir);

      // モジュール単位に分割して進捗を計算
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

    return NextResponse.json({ completedLessons, progressMap, lessons });
  } catch (error: any) {
    console.error("Error loading progress:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
