"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useUser } from "@clerk/nextjs"
import { subjects as staticSubjects, computeSubjectStats, type Subject, type OverallStats } from "@/lib/subjects"
import { useCosmicAudio } from "@/hooks/use-cosmic-audio"
import { recordActivity } from "@/lib/activity"
import { type Entry, boolMapToEntries, mergeProgress } from "@/lib/progress-merge"

type UserProgressContextType = {
  progressMap: Record<string, number>
  completedLessons: Record<string, boolean>
  updateModuleProgress: (moduleId: string, progress: number) => void
  toggleModuleCompletion: (moduleId: string, lessonKeys?: string[]) => void
  toggleLessonCompletion: (subjectSlug: string, moduleId: string, lessonPath: string, allLessonPathsInModule: string[]) => void
  subjects: Subject[]
  overallStats: OverallStats
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined)

// 各レッスンの「完了状態＋最終変更時刻」型 Entry と LWW マージは @/lib/progress-merge に集約。

// localStorage の基底キー。ログイン時はユーザー ID で名前空間を分ける。
const ENTRIES_BASE = "sensei-progress-entries" // 時刻付き進捗（v2）
const PROGRESS_BASE = "sensei-user-progress" // モジュール進捗 %
const LESSONS_BASE = "sensei-completed-lessons" // 旧: 真偽値のみ（移行元）

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key)
    return raw && raw !== "undefined" ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function defaultProgressMap(): Record<string, number> {
  const map: Record<string, number> = {}
  staticSubjects.forEach((s) => s.modules.forEach((m) => (map[m.id] = m.progress)))
  return map
}

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Record<string, Entry>>({})
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const { playSuccess } = useCosmicAudio()
  const { isSignedIn, user } = useUser()
  const userId = isSignedIn && user ? user.id : null

  const entriesKey = userId ? `${ENTRIES_BASE}:${userId}` : ENTRIES_BASE
  const progressKey = userId ? `${PROGRESS_BASE}:${userId}` : PROGRESS_BASE

  // 公開用の真偽値マップ（完了済みのみ true）。消費側 API は従来どおり。
  const completedLessons = useMemo(() => {
    const m: Record<string, boolean> = {}
    for (const [k, v] of Object.entries(entries)) if (v.c) m[k] = true
    return m
  }, [entries])

  const persistEntries = (next: Record<string, Entry>) => {
    localStorage.setItem(entriesKey, JSON.stringify(next))
  }

  // ユーザー（ログイン状態）が変わるたびにローカル＋DB を読み、時刻で LWW マージする。
  useEffect(() => {
    let localEntries = readJson<Record<string, Entry>>(entriesKey)
    if (!localEntries) {
      // 旧 真偽値キーから移行（ユーザー別→匿名の順で拾う）
      localEntries = boolMapToEntries(readJson<Record<string, boolean>>(userId ? `${LESSONS_BASE}:${userId}` : LESSONS_BASE))
    }
    const localProgress = readJson<Record<string, number>>(progressKey) || defaultProgressMap()

    setEntries(localEntries)
    setProgressMap(localProgress)
    if (!readJson(progressKey)) localStorage.setItem(progressKey, JSON.stringify(localProgress))

    if (!userId) return // 匿名: ローカルのみ

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/progress/load")
        if (!res.ok) return
        if (!(res.headers.get("content-type") || "").includes("application/json")) return
        const data = await res.json()
        if (cancelled || !data.progressMap) return

        // 初回ログイン時は匿名(レガシー)キーの完了も取り込み、時刻で LWW マージする。
        const anonBool = readJson<Record<string, boolean>>(LESSONS_BASE)
        const { final, toPush } = mergeProgress(
          localEntries,
          anonBool,
          (data.lessons || []) as { lessonId: string; completed: boolean; ts: number }[],
        )

        if (cancelled) return
        setEntries(final)
        setProgressMap((prev) => ({ ...prev, ...data.progressMap }))
        persistEntries(final)
        localStorage.setItem(progressKey, JSON.stringify({ ...localProgress, ...data.progressMap }))

        if (toPush.length > 0) {
          await fetch("/api/progress/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessons: toPush }),
          }).catch(() => {})
        }
        if (anonBool && Object.keys(anonBool).length > 0) localStorage.removeItem(LESSONS_BASE)
      } catch (e) {
        console.error("Failed to load progress from DB:", e)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const syncToDb = (lessons: { lessonId: string; completed: boolean; ts: number }[]) => {
    if (!userId) return
    fetch("/api/progress/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessons }),
    }).catch((e) => console.error("Failed to sync progress:", e))
  }

  const updateModuleProgress = (moduleId: string, progress: number) => {
    setProgressMap((prev) => {
      const next = { ...prev, [moduleId]: progress }
      localStorage.setItem(progressKey, JSON.stringify(next))
      return next
    })
  }

  const toggleModuleCompletion = (moduleId: string, lessonKeys?: string[]) => {
    const ts = Date.now()
    const current = progressMap[moduleId] ?? 0
    const nextProgress = current === 100 ? 0 : 100
    const completed = nextProgress === 100

    setProgressMap((prev) => {
      const next = { ...prev, [moduleId]: nextProgress }
      localStorage.setItem(progressKey, JSON.stringify(next))
      return next
    })

    if (lessonKeys && lessonKeys.length > 0) {
      setEntries((prev) => {
        const next = { ...prev }
        lessonKeys.forEach((key) => (next[key] = { c: completed, ts }))
        persistEntries(next)
        return next
      })
      syncToDb(lessonKeys.map((key) => ({ lessonId: key, completed, ts })))
    }

    if (completed) {
      recordActivity()
      setTimeout(() => playSuccess(), 50)
    }
  }

  const toggleLessonCompletion = (
    subjectSlug: string,
    moduleId: string,
    lessonPath: string,
    allLessonPathsInModule: string[],
  ) => {
    const lessonKey = `${subjectSlug}/${lessonPath}`
    const ts = Date.now()
    const isCompleted = !entries[lessonKey]?.c

    setEntries((prev) => {
      const next = { ...prev, [lessonKey]: { c: isCompleted, ts } }
      persistEntries(next)

      // モジュール進捗 % を再計算
      const completedCount = allLessonPathsInModule.filter((p) => next[`${subjectSlug}/${p}`]?.c).length
      const newProgress =
        allLessonPathsInModule.length > 0 ? Math.round((completedCount / allLessonPathsInModule.length) * 100) : 0
      setProgressMap((prevMap) => {
        const nextMap = { ...prevMap, [moduleId]: newProgress }
        localStorage.setItem(progressKey, JSON.stringify(nextMap))
        return nextMap
      })

      return next
    })

    syncToDb([{ lessonId: lessonKey, completed: isCompleted, ts }])

    if (isCompleted) {
      recordActivity()
      setTimeout(() => playSuccess(), 50)
    }
  }

  // Compute dynamic subjects list based on progressMap
  const dynamicSubjects = useMemo(() => {
    return staticSubjects.map((subject) => {
      const updatedModules = subject.modules.map((mod) => {
        const userProgress = progressMap[mod.id] !== undefined ? progressMap[mod.id] : mod.progress
        return { ...mod, progress: userProgress }
      })

      const tempSubject = { ...subject, modules: updatedModules }
      const stats = computeSubjectStats(tempSubject)

      return {
        ...tempSubject,
        progress: stats.progress,
        completedLessons: stats.completedLessons,
        totalLessons: stats.totalLessons,
        hours: stats.hours,
      }
    })
  }, [progressMap])

  // Compute dynamic overall stats
  const overallStats = useMemo(() => {
    const allStats = dynamicSubjects.map((s) => computeSubjectStats(s))
    const totalLessons = allStats.reduce((sum, s) => sum + s.totalLessons, 0)
    const completedLessonsCount = allStats.reduce((sum, s) => sum + s.completedLessons, 0)
    const totalMinutes = allStats.reduce((sum, s) => sum + s.totalMinutes, 0)
    const inProgressSubjects = allStats.filter((s) => s.progress > 0 && s.progress < 100).length
    const averageProgress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0

    return {
      totalLessons,
      completedLessons: completedLessonsCount,
      totalSubjects: dynamicSubjects.length,
      inProgressSubjects,
      totalHours: Math.round(totalMinutes / 60),
      averageProgress,
      perSubjectProgress: allStats.map((s) => s.progress),
    }
  }, [dynamicSubjects])

  return (
    <UserProgressContext.Provider
      value={{
        progressMap,
        completedLessons,
        updateModuleProgress,
        toggleModuleCompletion,
        toggleLessonCompletion,
        subjects: dynamicSubjects,
        overallStats,
      }}
    >
      {children}
    </UserProgressContext.Provider>
  )
}

export function useUserProgress() {
  const context = useContext(UserProgressContext)
  if (!context) {
    throw new Error("useUserProgress must be used within a UserProgressProvider")
  }
  return context
}
