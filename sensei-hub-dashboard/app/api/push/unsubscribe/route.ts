import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit } from "@/lib/rate-limiter"

// Push 購読を解除（endpoint で削除）。要 Clerk 認証。
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
    const endpoint: string | undefined = body?.endpoint
    if (!endpoint) return NextResponse.json({ error: "endpoint is required" }, { status: 400 })

    await prisma.pushSubscription.deleteMany({ where: { endpoint, userId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing push subscription:", error)
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
  }
}
