// 触覚フィードバック（Vibration API）。対応端末（主に Android）でのみ振動する。
// iOS Safari は未対応だが no-op になるため安全に呼べる。
export function vibrate(pattern: number | number[] = 20): void {
  if (typeof navigator === "undefined") return
  const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean }
  if (typeof nav.vibrate !== "function") return
  try {
    nav.vibrate(pattern)
  } catch {
    // 一部環境での例外は無視
  }
}
