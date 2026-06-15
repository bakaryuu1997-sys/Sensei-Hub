"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { subjects as staticSubjects, computeSubjectStats, type Subject, type OverallStats } from "@/lib/subjects"
import { useCosmicAudio } from "@/hooks/use-cosmic-audio"

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

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})
  const { playSuccess } = useCosmicAudio()

  // Load from localStorage on mount
  useEffect(() => {
    const storedProgress = localStorage.getItem("sensei-user-progress")
    const storedLessons = localStorage.getItem("sensei-completed-lessons")
    
    if (storedProgress) {
      try {
        setProgressMap(JSON.parse(storedProgress))
      } catch (e) {
        console.error(e)
      }
    } else {
      const initialMap: Record<string, number> = {}
      staticSubjects.forEach((s) => {
        s.modules.forEach((m) => {
          initialMap[m.id] = m.progress
        })
      })
      setProgressMap(initialMap)
      localStorage.setItem("sensei-user-progress", JSON.stringify(initialMap))
    }

    if (storedLessons) {
      try {
        setCompletedLessons(JSON.parse(storedLessons))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const updateModuleProgress = (moduleId: string, progress: number) => {
    setProgressMap((prev) => {
      const next = { ...prev, [moduleId]: progress }
      localStorage.setItem("sensei-user-progress", JSON.stringify(next))
      return next
    })
  }

  const toggleModuleCompletion = (moduleId: string, lessonKeys?: string[]) => {
    let playedChime = false
    
    setProgressMap((prev) => {
      const current = prev[moduleId] ?? 0
      const nextProgress = current === 100 ? 0 : 100
      const next = { ...prev, [moduleId]: nextProgress }
      localStorage.setItem("sensei-user-progress", JSON.stringify(next))
      
      if (nextProgress === 100) {
        playedChime = true
      }

      // Sync all lessons in the module
      if (lessonKeys && lessonKeys.length > 0) {
        setCompletedLessons((prevLessons) => {
          const nextLessons = { ...prevLessons }
          lessonKeys.forEach((key) => {
            nextLessons[key] = nextProgress === 100
          })
          localStorage.setItem("sensei-completed-lessons", JSON.stringify(nextLessons))
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
    allLessonPathsInModule: string[]
  ) => {
    const lessonKey = `${subjectSlug}/${lessonPath}`
    let playedChime = false

    setCompletedLessons((prev) => {
      const isCompleted = !prev[lessonKey]
      const next = { ...prev, [lessonKey]: isCompleted }
      localStorage.setItem("sensei-completed-lessons", JSON.stringify(next))

      if (isCompleted) {
        playedChime = true
      }

      // Compute module progress
      const completedCount = allLessonPathsInModule.filter(
        (path) => next[`${subjectSlug}/${path}`]
      ).length
      
      const newProgress = allLessonPathsInModule.length > 0 
        ? Math.round((completedCount / allLessonPathsInModule.length) * 100)
        : 0

      // Update the progress map directly in the state
      setProgressMap((prevMap) => {
        const nextMap = { ...prevMap, [moduleId]: newProgress }
        localStorage.setItem("sensei-user-progress", JSON.stringify(nextMap))
        return nextMap
      })

      return next
    })

    if (playedChime) {
      setTimeout(() => {
        playSuccess()
      }, 50)
    }
  }

  // Compute dynamic subjects list based on progressMap
  const dynamicSubjects = staticSubjects.map((subject) => {
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

  // Compute dynamic overall stats
  const allStats = dynamicSubjects.map((s) => computeSubjectStats(s))
  const totalLessons = allStats.reduce((sum, s) => sum + s.totalLessons, 0)
  const completedLessonsCount = allStats.reduce((sum, s) => sum + s.completedLessons, 0)
  const totalMinutes = allStats.reduce((sum, s) => sum + s.totalMinutes, 0)
  const inProgressSubjects = allStats.filter((s) => s.progress > 0 && s.progress < 100).length
  const averageProgress =
    totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0

  const overallStats: OverallStats = {
    totalLessons,
    completedLessons: completedLessonsCount,
    totalSubjects: dynamicSubjects.length,
    inProgressSubjects,
    totalHours: Math.round(totalMinutes / 60),
    averageProgress,
    perSubjectProgress: allStats.map((s) => s.progress),
  }

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
