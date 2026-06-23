// Next.js のサーバー起動フック。VAPID が設定されていれば日次リマインド cron を開始する。
// 単一インスタンス前提（水平スケール時は外部スケジューラが必要・spec 参照）。

let scheduled = false

export async function register() {
  // Node ランタイムでのみ（edge では node-cron/prisma を使わない）。
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  if (scheduled) return

  const { isPushConfigured } = await import("@/lib/push")
  if (!isPushConfigured()) {
    console.log("[push] VAPID 未設定のためリマインド cron は無効です")
    return
  }

  const cron = (await import("node-cron")).default
  const hourRaw = Number.parseInt(process.env.REMINDER_HOUR || "20", 10)
  const hour = Number.isFinite(hourRaw) && hourRaw >= 0 && hourRaw <= 23 ? hourRaw : 20
  const expr = `0 ${hour} * * *`

  cron.schedule(expr, async () => {
    try {
      const { runReminderJob } = await import("@/lib/push-cron")
      const res = await runReminderJob()
      console.log(`[push] リマインド送信: ${res.sent}/${res.checked}`)
    } catch (e) {
      console.error("[push] リマインドジョブ失敗:", e)
    }
  })

  scheduled = true
  console.log(`[push] リマインド cron を ${expr}（サーバー TZ）に登録しました`)
}
