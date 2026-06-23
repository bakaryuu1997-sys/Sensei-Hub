import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit } from "@/lib/rate-limiter"

// Push 購読を保存（endpoint 一意で upsert）。要 Clerk 認証。
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const sub = body?.subscription ?? body
    const endpoint: string | undefined = sub?.endpoint
    const p256dh: string | undefined = sub?.keys?.p256dh
    const authKey: string | undefined = sub?.keys?.auth
    const lang: string = typeof body?.lang === "string" ? body.lang : "vi"

    if (!endpoint || !p256dh || !authKey) {
      return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 })
    }

    // ユーザーが存在しなければ作成（同期 API と同様）。
    await prisma.user.upsert({ where: { id: userId }, update: {}, create: { id: userId } }).catch(() => {})

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { userId, p256dh, auth: authKey, lang },
      create: { userId, endpoint, p256dh, auth: authKey, lang },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving push subscription:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}
