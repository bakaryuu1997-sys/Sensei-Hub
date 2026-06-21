"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useUser } from "@clerk/nextjs"
import { subjects as staticSubjects, computeSubjectStats, type Subject, type OverallStats } from "@/lib/subjects"
import { useCosmicAudio } from "@/hooks/use-cosmic-audio"
import { recordActivity } from "@/lib/activity"

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

// localStorage の基底キー。ログイン時はユーザー ID で名前空間を分け、別ユーザーの
// 進捗が混ざらないようにする（匿名はサフィックス無しのレガシーキーを使う）。
const LESSONS_BASE = "sensei-completed-lessons"
const PROGRESS_BASE = "sensei-user-progress"

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
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})
  const { playSuccess } = useCosmicAudio()
  const { isSignedIn, user } = useUser()
  const userId = isSignedIn && user ? user.id : null

  // ユーザーごとの保存キー（匿名はレガシーキー）
  const lessonsKey = userId ? `${LESSONS_BASE}:${userId}` : LESSONS_BASE
  const progressKey = userId ? `${PROGRESS_BASE}:${userId}` : PROGRESS_BASE

  // ユーザー（ログイン状態）が変わるたびに、そのユーザーのローカル＋DB を読み込む。
  // これにより別端末でログインすると DB の進捗が反映され、別ユーザーの混入も防ぐ。
  useEffect(() => {
    const localLessons = readJson<Record<string, boolean>>(lessonsKey) || {}
    const localProgress = readJson<Record<string, number>>(progressKey) || defaultProgressMap()

    setCompletedLessons(localLessons)
    setProgressMap(localProgress)
    // 初期既定をローカルへ保存（未保存の匿名ユーザー向け）
    if (!readJson(progressKey)) localStorage.setItem(progressKey, JSON.stringify(localProgress))

    if (!userId) return // 匿名: ローカルのみ

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/progress/load")
        if (!res.ok) return
        if (!(res.headers.get("content-type") || "").includes("application/json")) return
        const data = await res.json()
        if (cancelled || !data.completedLessons || !data.progressMap) return

        // 初回ログイン時は匿名(レガシー)キーの進捗も取り込む
        const anon = userId ? readJson<Record<string, boolean>>(LESSONS_BASE) || {} : {}
        const mergedLocal = { ...anon, ...localLessons }

        // DB と統合（DB を基準に、ローカルで完了済みだが DB に無い分は後で同期）
        const localOnly = Object.keys(mergedLocal).filter((k) => mergedLocal[k] && !data.completedLessons[k])
        const finalLessons = { ...mergedLocal, ...data.completedLessons }
        const finalProgress = { ...localProgress, ...data.progressMap }

        setCompletedLessons(finalLessons)
        setProgressMap(finalProgress)
        localStorage.setItem(lessonsKey, JSON.stringify(finalLessons))
        localStorage.setItem(progressKey, JSON.stringify(finalProgress))

        if (localOnly.length > 0) {
          await fetch("/api/progress/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessons: localOnly.map((k) => ({ lessonId: k, completed: true })) }),
          }).catch(() => {})
        }
        // 取り込み済みの匿名キーは消して二重取り込みを防ぐ
        if (Object.keys(anon).length > 0) localStorage.removeItem(LESSONS_BASE)
      } catch (e) {
        console.error("Failed to load progress from DB:", e)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const updateModuleProgress = (moduleId: string, progress: number) => {
    setProgressMap((prev) => {
      const next = { ...prev, [moduleId]: progress }
      localStorage.setItem(progressKey, JSON.stringify(next))
      return next
    })
  }

  const toggleModuleCompletion = (moduleId: string, lessonKeys?: string[]) => {
    let playedChime = false

    setProgressMap((prev) => {
      const current = prev[moduleId] ?? 0
      const nextProgress = current === 100 ? 0 : 100
      const next = { ...prev, [moduleId]: nextProgress }
      localStorage.setItem(progressKey, JSON.stringify(next))

      if (nextProgress === 100) {
        playedChime = true
        recordActivity()
      }

      // Sync all lessons in the module
      if (lessonKeys && lessonKeys.length > 0) {
        setCompletedLessons((prevLessons) => {
          const nextLessons = { ...prevLessons }
          lessonKeys.forEach((key) => {
            nextLessons[key] = nextProgress === 100
          })
          localStorage.setItem(lessonsKey, JSON.stringify(nextLessons))

          // ログイン中のみ DB へ同期
          if (userId) {
            const syncLessons = lessonKeys.map((key) => ({
              lessonId: key,
              completed: nextProgress === 100,
            }))
            fetch("/api/progress/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lessons: syncLessons }),
            }).catch((e) => console.error("Failed to sync module progress:", e))
          }

          return nextLessons
        })
      }

      return next
    })

    if (playedChime) {
      setTimeout(() => {
        playSuccess()
      }, 50)
    }
  }

  const toggleLessonCompletion = (
    subjectSlug: string,
    moduleId: string,
    lessonPath: string,
    allLessonPathsInModule: string[],
  ) => {
    const lessonKey = `${subjectSlug}/${lessonPath}`
    let playedChime = false

    setCompletedLessons((prev) => {
      const isCompleted = !prev[lessonKey]
      const next = { ...prev, [lessonKey]: isCompleted }
      localStorage.setItem(lessonsKey, JSON.stringify(next))

      if (isCompleted) {
        playedChime = true
        recordActivity()
      }

      // Compute module progress
      const completedCount = allLessonPathsInModule.filter((path) => next[`${subjectSlug}/${path}`]).length

      const newProgress =
        allLessonPathsInModule.length > 0 ? Math.round((completedCount / allLessonPathsInModule.length) * 100) : 0

      // Update the progress map directly in the state
      setProgressMap((prevMap) => {
        const nextMap = { ...prevMap, [moduleId]: newProgress }
        localStorage.setItem(progressKey, JSON.stringify(nextMap))
        return nextMap
      })

      // ログイン中のみ DB へ同期
      if (userId) {
        fetch("/api/progress/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessons: [{ lessonId: lessonKey, completed: isCompleted }],
          }),
        }).catch((e) => console.error("Failed to sync lesson progress:", e))
      }

      return next
    })

    if (playedChime) {
      setTimeout(() => {
        playSuccess()
      }, 50)
    }
  }

  // Compute dynamic subjects list based on progressMap
  const dynamicSubjects = useMemo(() => {
    return staticSubjects.map((subject) => {
      const updatedModules = subject.modules.map((mod) => {
        const userProgress = progressMap[mod.id] !== undefined ? progressMap[mod.id] : mod.progress
        return {
          ...mod,
          progress: userProgress,
        }
      })

      const tempSubject = {
        ...subject,
        modules: updatedModules,
      }

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
