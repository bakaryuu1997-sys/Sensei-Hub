import { prisma } from "@/lib/prisma"
import { shouldNotify } from "@/lib/push-policy"
import { sendToSubscription, reminderPayload } from "@/lib/push"

/**
 * 日次リマインドジョブ。未学習かつ本日未通知の購読へ送信し、lastNotifiedAt を更新する。
 * 失効購読は送信側で削除される。テスト/手動実行のため now を注入可能。
 */
export async function runReminderJob(now: Date = new Date()): Promise<{ sent: number; checked: number }> {
  const subs = await prisma.pushSubscription.findMany()
  if (subs.length === 0) return { sent: 0, checked: 0 }

  // ユーザーごとの「最後に学習した時刻」をまとめて取得。
  const userIds = [...new Set(subs.map((s) => s.userId))]
  const progress = await prisma.lessonProgress.groupBy({
    by: ["userId"],
    _max: { lastViewed: true },
    where: { userId: { in: userIds } },
  })
  const maxByUser = new Map<string, Date | null>(progress.map((p) => [p.userId, p._max.lastViewed ?? null]))

  let sent = 0
  for (const sub of subs) {
    const lastViewed = maxByUser.get(sub.userId) ?? null
    if (!shouldNotify(lastViewed, sub.lastNotifiedAt, now)) continue
    const ok = await sendToSubscription(sub, reminderPayload(sub.lang))
    if (ok) {
      sent++
      await prisma.pushSubscription
        .update({ where: { id: sub.id }, data: { lastNotifiedAt: now } })
        .catch(() => {})
    }
  }
  return { sent, checked: subs.length }
}
