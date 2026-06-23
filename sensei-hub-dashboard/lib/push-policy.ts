// Web Push リマインドの送信判定（純粋ロジック）。
// DB/通知から切り離してテスト可能にするためここに集約する。

/** その日の 0:00（ローカル）を返す。 */
export function startOfDay(now: Date): Date {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d
}

/** 当日 0:00 以降に学習痕跡（LessonProgress.lastViewed の最大）があれば true。 */
export function studiedToday(lastViewedMax: Date | null, now: Date): boolean {
  if (!lastViewedMax) return false
  return lastViewedMax.getTime() >= startOfDay(now).getTime()
}

/**
 * リマインドを送るべきか。
 * - 今日すでに学習している → 送らない。
 * - 本日すでに通知済み（lastNotifiedAt が当日 0:00 以降）→ 送らない。
 * - それ以外（未学習・未通知）→ 送る。
 */
export function shouldNotify(
  lastViewedMax: Date | null,
  lastNotifiedAt: Date | null,
  now: Date,
): boolean {
  if (studiedToday(lastViewedMax, now)) return false
  if (lastNotifiedAt && lastNotifiedAt.getTime() >= startOfDay(now).getTime()) return false
  return true
}
