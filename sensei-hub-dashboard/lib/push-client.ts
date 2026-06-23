"use client"

// Push 購読のクライアントヘルパー（設定トグルから使用）。
const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  )
}

export function isPushConfiguredClient(): boolean {
  return !!PUBLIC_KEY
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = atob(b64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null
  const reg = await navigator.serviceWorker.ready
  return reg.pushManager.getSubscription()
}

export type PushResult = { ok: boolean; error?: "unsupported" | "no-vapid-key" | "denied" | "server" }

export async function subscribeToPush(lang: string): Promise<PushResult> {
  if (!isPushSupported()) return { ok: false, error: "unsupported" }
  if (!PUBLIC_KEY) return { ok: false, error: "no-vapid-key" }
  const perm = await Notification.requestPermission()
  if (perm !== "granted") return { ok: false, error: "denied" }
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
  })
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription: sub.toJSON(), lang }),
  })
  if (!res.ok) return { ok: false, error: "server" }
  return { ok: true }
}

export async function unsubscribeFromPush(): Promise<{ ok: boolean }> {
  const sub = await getPushSubscription()
  if (!sub) return { ok: true }
  const endpoint = sub.endpoint
  await sub.unsubscribe().catch(() => {})
  await fetch("/api/push/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  }).catch(() => {})
  return { ok: true }
}
