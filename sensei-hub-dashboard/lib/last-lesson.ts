// Tracks the most recently viewed lesson so the dashboard can offer "resume".

const KEY = "sensei-last-lesson"

export type LastLesson = {
  slug: string
  path: string
  title: string
  ts: number
}

export function getLastLesson(): LastLesson | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(KEY)
  if (!raw || raw === "undefined") return null
  try {
    const data = JSON.parse(raw) as LastLesson
    if (data && data.slug && data.path) return data
    return null
  } catch {
    return null
  }
}

export function setLastLesson(lesson: LastLesson): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(KEY, JSON.stringify(lesson))
  } catch {
    // ignore quota / serialization errors
  }
}

/** Href to resume the last lesson, or a sensible default. */
export function getResumeHref(fallback = "/subject/aws"): string {
  const last = getLastLesson()
  return last ? `/subject/${last.slug}/lesson/${last.path}` : fallback
}
