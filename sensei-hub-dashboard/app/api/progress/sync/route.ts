import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limiter";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || (request as any).ip || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { lessons } = (await request.json()) as {
      lessons: { lessonId: string; completed: boolean }[];
    };

    if (!lessons || !Array.isArray(lessons)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    // Execute bulk upsert in a transaction
    await prisma.$transaction(
      lessons.map((l) =>
        prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: { userId, lessonId: l.lessonId },
          },
          update: {
            status: l.completed ? "COMPLETED" : "IN_PROGRESS",
            lastViewed: new Date(),
          },
          create: {
            userId,
            lessonId: l.lessonId,
            status: l.completed ? "COMPLETED" : "IN_PROGRESS",
            lastViewed: new Date(),
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error syncing progress:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
