import webpush from "web-push"
import { prisma } from "@/lib/prisma"

// VAPID 初期化（1 回だけ）。鍵はサーバー専用 env。
let configured = false
export function isPushConfigured(): boolean {
  return !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)
}
function configure() {
  if (configured) return
  const pub = process.env.VAPID_PUBLIC_KEY
  const priv = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@senseihub.baryuu.com"
  if (!pub || !priv) throw new Error("VAPID keys are not configured")
  webpush.setVapidDetails(subject, pub, priv)
  configured = true
}

export type PushPayload = { title: string; body: string; url?: string }

// 通知文面（購読時の言語で出し分け）。
const REMINDER: Record<string, PushPayload> = {
  ja: { title: "Sensei Hub", body: "今日の学習はまだです。少しだけ進めましょう 🔥", url: "/" },
  vi: { title: "Sensei Hub", body: "Hôm nay bạn chưa học. Học một chút thôi nhé 🔥", url: "/" },
  en: { title: "Sensei Hub", body: "You haven't studied today. Keep your streak alive 🔥", url: "/" },
}
export function reminderPayload(lang: string): PushPayload {
  return REMINDER[lang] || REMINDER.vi
}

export type StoredSubscription = {
  id: string
  endpoint: string
  p256dh: string
  auth: string
}

// 1 購読へ送信。失効(404/410)なら DB から削除して肥大化を防ぐ。
export async function sendToSubscription(sub: StoredSubscription, payload: PushPayload): Promise<boolean> {
  configure()
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
    )
    return true
  } catch (e: unknown) {
    const status = (e as { statusCode?: number })?.statusCode
    if (status === 404 || status === 410) {
      await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
    } else {
      console.error("web-push send failed:", (e as Error)?.message)
    }
    return false
  }
}
