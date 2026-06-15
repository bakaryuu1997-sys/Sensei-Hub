"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { marked } from "marked"
import confetti from "canvas-confetti"
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft, BookOpen } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { useLanguage } from "@/lib/i18n"
import { useUserProgress } from "@/components/user-progress-provider"
import { cn } from "@/lib/utils"

// Set marked options for security and format
marked.setOptions({
  gfm: true,
  breaks: true,
})

// Map Tailwind class names to high-contrast theme hex/oklch values for CSS variables
const colorMapFrom: Record<string, string> = {
  "from-violet-400": "oklch(0.85 0.15 290)", // Light bright violet
  "from-blue-500": "oklch(0.82 0.18 250)",   // Light bright blue
  "from-orange-400": "oklch(0.85 0.16 65)",   // Light bright orange
  "from-emerald-400": "oklch(0.86 0.15 145)",  // Light bright emerald
  "from-pink-400": "oklch(0.84 0.18 340)",    // Light bright pink
  "from-cyan-400": "oklch(0.86 0.14 195)",   // Light bright cyan
  "from-red-400": "oklch(0.82 0.18 25)",      // Light bright red
  "from-purple-400": "oklch(0.83 0.18 290)",  // Light bright purple
  "from-yellow-400": "oklch(0.88 0.15 85)",   // Light bright yellow
  "from-red-500": "oklch(0.80 0.2 25)",      // Bright red
  "from-yellow-500": "oklch(0.85 0.18 85)",   // Bright yellow
}

const colorMapTo: Record<string, string> = {
  "to-indigo-500": "oklch(0.72 0.18 260)",
  "to-indigo-600": "oklch(0.68 0.18 260)",
  "to-amber-500": "oklch(0.78 0.15 75)",
  "to-teal-500": "oklch(0.76 0.15 175)",
  "to-rose-500": "oklch(0.72 0.18 350)",
  "to-blue-500": "oklch(0.70 0.18 250)",
  "to-violet-500": "oklch(0.73 0.18 290)",
  "to-orange-500": "oklch(0.75 0.16 65)",
  "to-red-700": "oklch(0.68 0.20 25)",
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; path: string[] }>
}) {
  const { slug, path: pathSegments } = use(params)
  const lessonPath = pathSegments.join("/")

  const { t, lang } = useLanguage()
  const router = useRouter()
  const { subjects, completedLessons, toggleLessonCompletion } = useUserProgress()

  const [lessonData, setLessonData] = useState<{
    title: string
    description: string
    content: string
  } | null>(null)
  const [lessonsList, setLessonsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const subject = subjects.find((s) => s.slug === slug)

  // Fetch individual lesson content and subject lessons list
  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError(null)

    async function loadData() {
      try {
        // Fetch lesson content
        const contentRes = await fetch(
          `/api/subject/${slug}/lesson?path=${encodeURIComponent(lessonPath)}&lang=${lang}`
        )
        // Fetch full lessons list for navigation
        const listRes = await fetch(`/api/subject/${slug}/lessons?lang=${lang}`)

        if (!contentRes.ok) {
          throw new Error("Failed to load lesson content")
        }
        if (!listRes.ok) {
          throw new Error("Failed to load lessons list")
        }

        const contentData = await contentRes.json()
        const listData = await listRes.json()

        if (active) {
          setLessonData(contentData)
          setLessonsList(listData.lessons || [])
          setIsLoading(false)
        }
      } catch (err: any) {
        console.error("Error loading lesson:", err)
        if (active) {
          setError(err.message || "An error occurred while loading this lesson.")
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [slug, lessonPath, lang])

  if (!subject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Subject not found</h1>
          <Link href="/" className="mt-4 inline-block text-cyan-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Find index of current lesson in the sorted list
  const currentIndex = lessonsList.findIndex((l) => l.path === lessonPath)
  const prevLesson = currentIndex > 0 ? lessonsList[currentIndex - 1] : null
  const nextLesson = currentIndex < lessonsList.length - 1 ? lessonsList[currentIndex + 1] : null

  // Find module details for progress updates
  let currentModuleId = ""
  let allLessonPathsInModule: string[] = []
  if (lessonsList.length > 0) {
    let accumulated = 0
    for (const mod of subject.modules) {
      const moduleLessons = lessonsList.slice(accumulated, accumulated + mod.lessons)
      accumulated += mod.lessons
      if (moduleLessons.some((l) => l.path === lessonPath)) {
        currentModuleId = mod.id
        allLessonPathsInModule = moduleLessons.map((l) => l.path)
        break
      }
    }
  }

  const lessonKey = `${slug}/${lessonPath}`
  const isCompleted = completedLessons[lessonKey] || false

  const handleToggleComplete = () => {
    if (currentModuleId && allLessonPathsInModule.length > 0) {
      const wasCompleted = isCompleted
      toggleLessonCompletion(slug, currentModuleId, lessonPath, allLessonPathsInModule)
      
      // Fire confetti if completing
      if (!wasCompleted) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.75 },
          colors: ["#22d3ee", "#8b5cf6", "#f43f5e", "#10b981"],
        })
      }
    }
  }

  // Parse HTML markdown
  const htmlContent = lessonData ? marked.parse(lessonData.content) : ""

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
      </div>

      <Sidebar />

      <div className="relative z-10 lg:ml-72 min-h-screen flex flex-col">
        <TopBar />

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between">
              <Link
                href={`/subject/${slug}`}
                className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại {subject.name}
              </Link>
              {lessonsList.length > 0 && currentIndex !== -1 && (
                <span className="text-xs font-mono font-medium text-white/40">
                  Bài học {currentIndex + 1} / {lessonsList.length}
                </span>
              )}
            </div>

            {/* Error or Loading */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400" />
                <p className="text-sm text-white/50 font-mono">Đang tải nội dung bài học...</p>
              </div>
            ) : error ? (
              <div className="glass-card border border-rose-500/20 rounded-2xl p-8 text-center space-y-4">
                <h2 className="text-lg font-bold text-rose-400">Không tìm thấy bài học</h2>
                <p className="text-sm text-white/60">{error}</p>
                <Link
                  href={`/subject/${slug}`}
                  className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20 transition-all inline-block"
                >
                  Quay lại danh sách
                </Link>
              </div>
            ) : (
              <motion.article
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Lesson Card */}
                <div className="glass-card border border-white/10 rounded-2xl p-6 lg:p-10 space-y-6 shadow-2xl relative overflow-hidden">
                  {/* Decorative glow overlay */}
                  <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${subject.colorFrom} ${subject.colorTo} opacity-[0.03] blur-3xl pointer-events-none`} />

                  <header className="space-y-3 pb-6 border-b border-white/5">
                    <h1 
                      className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text"
                      style={{
                        background: `linear-gradient(to right, ${colorMapFrom[subject.colorFrom] || "oklch(0.85 0.15 195)"}, ${colorMapTo[subject.colorTo] || "oklch(0.72 0.18 290)"})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      {lessonData?.title}
                    </h1>
                    {lessonData?.description && (
                      <p className="text-sm lg:text-base text-slate-300/80 italic leading-relaxed">
                        {lessonData.description}
                      </p>
                    )}
                  </header>

                  {/* HTML Content Container */}
                  <div
                    className="markdown-content text-slate-200/90 leading-relaxed font-sans"
                    style={{
                      "--subject-from": colorMapFrom[subject.colorFrom] || "oklch(0.75 0.18 195)",
                      "--subject-to": colorMapTo[subject.colorTo] || "oklch(0.7 0.25 290)",
                    } as React.CSSProperties}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>

                {/* Bottom Bar: Action & Navigations */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl glass-card">
                  {/* Prev Button */}
                  {prevLesson ? (
                    <Link
                      href={`/subject/${slug}/lesson/${prevLesson.path}`}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Bài trước
                    </Link>
                  ) : (
                    <div className="hidden sm:block w-24" />
                  )}

                  {/* Completion Toggle */}
                  <button
                    onClick={handleToggleComplete}
                    className={cn(
                      "w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold font-mono transition-all duration-300 shadow-lg active:scale-95",
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                        : cn("text-white bg-gradient-to-r hover:opacity-90 shadow-cyan-500/10", subject.colorFrom, subject.colorTo)
                    )}
                  >
                    <CheckCircle2 className={cn("h-4 w-4", isCompleted ? "text-emerald-400" : "text-white/60")} />
                    {isCompleted ? "Đã hoàn thành" : "Hoàn thành bài học"}
                  </button>

                  {/* Next Button */}
                  {nextLesson ? (
                    <Link
                      href={`/subject/${slug}/lesson/${nextLesson.path}`}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                    >
                      Bài tiếp theo
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/subject/${slug}`}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                    >
                      Quay lại môn học
                      <BookOpen className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </motion.article>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
