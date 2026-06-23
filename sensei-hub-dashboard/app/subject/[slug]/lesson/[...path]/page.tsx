"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import DOMPurify from "isomorphic-dompurify"
import confetti from "canvas-confetti"
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft, BookOpen } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { CodeSandbox } from "@/components/dashboard/code-sandbox"
import { TopBar } from "@/components/dashboard/top-bar"
import { Starfield } from "@/components/dashboard/starfield"
import { useLanguage } from "@/lib/i18n"
import { useUserProgress } from "@/components/user-progress-provider"
import { setLastLesson } from "@/lib/last-lesson"
import { setActiveLesson, clearActiveLesson } from "@/lib/lesson-context"
import { recordActivity, recordLessonView } from "@/lib/activity"
import { vibrate } from "@/lib/haptics"
import { cn } from "@/lib/utils"

interface LessonItem {
  path: string
  title: string
  description?: string
}

// Setup DOMPurify to allow target="_blank" on links if needed, or other options
// marked setup is removed since parsing is shifted to the server.

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
  const { subjects, completedLessons, toggleLessonCompletion } = useUserProgress()

  const [lessonData, setLessonData] = useState<{
    title: string
    description: string
    htmlContent: string
    codingExercise?: boolean
    initialCode?: string
    testCode?: string
    solutionCode?: string
  } | null>(null)
  const [lessonsList, setLessonsList] = useState<LessonItem[]>([])
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
          const viewedAt = Date.now()
          const lessonTitle = contentData?.title || lessonPath
          setLastLesson({ slug, path: lessonPath, title: lessonTitle, ts: viewedAt })
          recordLessonView({ slug, path: lessonPath, title: lessonTitle, ts: viewedAt })
          recordActivity()
          // チャットの「この内容を説明」用に本文を共有する
          setActiveLesson(lessonTitle, contentData?.htmlContent || "")
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
      clearActiveLesson()
    }
  }, [slug, lessonPath, lang])

  // Mermaid 図をクライアントで描画する。図ごとに render し、失敗しても
  // 生テキストを晒さず読みやすいフォールバックを出す（dev オーバーレイも汚さない）。
  useEffect(() => {
    const codeElements = Array.from(
      document.querySelectorAll<HTMLElement>("pre code.language-mermaid"),
    );
    if (codeElements.length === 0) return;

    let cancelled = false;
    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis", padding: 16 },
        themeVariables: {
          // 高コントラストで読みやすい配色（暗背景＋明るい文字・線）。
          fontSize: "15px",
          fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
          primaryColor: "#241b4d",
          primaryTextColor: "#eef2ff",
          primaryBorderColor: "#8b5cf6",
          lineColor: "#a5b4fc",
          secondaryColor: "#0f172a",
          tertiaryColor: "#0b1220",
          clusterBkg: "#0b0820",
          clusterBorder: "#334155",
        },
      });

      codeElements.forEach(async (codeEl, i) => {
        const preEl = codeEl.parentElement;
        if (!preEl || preEl.tagName !== "PRE") return;
        const source = codeEl.textContent || "";
        const wrap = document.createElement("div");

        try {
          const { svg } = await mermaid.render(`mermaid-${Date.now()}-${i}`, source);
          if (cancelled) return;
          wrap.className =
            "my-6 flex justify-center overflow-x-auto rounded-2xl border border-white/10 bg-[#0b0820]/70 p-4 [&_svg]:max-w-full [&_svg]:h-auto";
          wrap.innerHTML = svg;
        } catch {
          if (cancelled) return;
          // 構文エラー時は警告＋元コードを整形表示（生テキストの垂れ流しを防ぐ）。
          wrap.className =
            "my-6 overflow-x-auto rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4";
          const note = document.createElement("div");
          note.className = "mb-2 text-xs font-semibold text-amber-300/80";
          note.textContent = "⚠ 図を描画できませんでした（Mermaid 構文を確認）";
          const pre = document.createElement("pre");
          pre.className = "whitespace-pre-wrap text-xs text-white/55";
          pre.textContent = source;
          wrap.append(note, pre);
        }
        preEl.replaceWith(wrap);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [lessonData?.htmlContent]);

  if (!subject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("lesson.subject_not_found")}</h1>
          <Link href="/" className="mt-4 inline-block text-cyan-400 hover:underline">
            {t("lesson.back_to_dashboard")}
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
        vibrate(40)
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.75 },
          colors: ["#22d3ee", "#8b5cf6", "#f43f5e", "#10b981"],
        })
      }
    }
  }

  // Sanitize HTML compiled from the server to prevent XSS
  const htmlContent = lessonData ? DOMPurify.sanitize(lessonData.htmlContent) : ""

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
      </div>

      <Sidebar />

      <div className={cn(
        "relative z-10 lg:ml-72 flex flex-col",
        // 演習レッスンはビューポート高にぴったり収め、コードパネルを常に表示（下の余白を作らない）。
        lessonData?.codingExercise ? "h-[100dvh] overflow-hidden" : "min-h-screen",
      )}>
        <TopBar />

        <main className={cn("flex-1", lessonData?.codingExercise ? "min-h-0 px-4 md:px-6 py-4 md:py-6 overflow-hidden" : "py-6 lg:py-8 px-4 lg:px-8")}>
          {lessonData?.codingExercise ? (
            <div className="flex flex-col md:flex-row h-full w-full gap-4 md:gap-6 overflow-y-auto md:overflow-hidden">
              {/* Left Panel: Instruction（md 以上は内部スクロール＝右のコードは固定表示） */}
              <div className="w-full md:w-1/2 md:h-full min-h-[320px] overflow-y-auto pr-2 scrollbar-thin glass-card border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between">
                <div>
                  <header className="space-y-3 pb-6 border-b border-white/5 mb-6">
                    <Link
                      href={`/subject/${slug}`}
                      className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-cyan-400 transition-colors mb-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t("lesson.back_to_subject")} {subject.name}
                    </Link>
                    <h1 
                      className="text-2xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text"
                      style={{
                        background: `linear-gradient(to right, ${colorMapFrom[subject.colorFrom] || "oklch(0.85 0.15 195)"}, ${colorMapTo[subject.colorTo] || "oklch(0.72 0.18 290)"})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      {lessonData?.title}
                    </h1>
                  </header>
                  <div
                    className="markdown-content text-slate-200/90 leading-relaxed font-sans pb-10"
                    style={{
                      "--subject-from": colorMapFrom[subject.colorFrom] || "oklch(0.75 0.18 195)",
                      "--subject-to": colorMapTo[subject.colorTo] || "oklch(0.7 0.25 290)",
                    } as React.CSSProperties}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
                
                {/* Navigation */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6 bg-slate-950/20">
                  {prevLesson ? (
                    <Link
                      href={`/subject/${slug}/lesson/${prevLesson.path}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/80 hover:bg-white/10 transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t("lesson.prev")}
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextLesson ? (
                    <Link
                      href={`/subject/${slug}/lesson/${nextLesson.path}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/80 hover:bg-white/10 transition-all"
                    >
                      {t("lesson.next")}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/subject/${slug}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/80 hover:bg-white/10 transition-all"
                    >
                      {t("lesson.back")}
                      <BookOpen className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Panel: Code Sandbox（md 以上は full-height で常時表示、モバイルは十分な高さ） */}
              <div className="w-full md:w-1/2 md:h-full min-h-[460px] flex-shrink-0">
                <CodeSandbox
                  initialCode={lessonData.initialCode || ""}
                  testCode={lessonData.testCode || ""}
                  solutionCode={lessonData.solutionCode || ""}
                  onComplete={handleToggleComplete}
                />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center justify-between">
                <Link
                  href={`/subject/${slug}`}
                  className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-cyan-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("lesson.back_to_subject")} {subject.name}
                </Link>
                {lessonsList.length > 0 && currentIndex !== -1 && (
                  <span className="text-xs font-mono font-medium text-white/40">
                    {t("lesson.count_label")} {currentIndex + 1} / {lessonsList.length}
                  </span>
                )}
              </div>

              {/* Error or Loading */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400" />
                  <p className="text-sm text-white/50 font-mono">{t("lesson.loading_content")}</p>
                </div>
              ) : error ? (
                <div className="glass-card border border-rose-500/20 rounded-2xl p-8 text-center space-y-4">
                  <h2 className="text-lg font-bold text-rose-400">{t("lesson.not_found_title")}</h2>
                  <p className="text-sm text-white/60">{error}</p>
                  <Link
                    href={`/subject/${slug}`}
                    className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20 transition-all inline-block"
                  >
                    {t("lesson.back_to_list")}
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
                        {t("lesson.prev")}
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
                      {isCompleted ? t("lesson.completed") : t("lesson.complete")}
                    </button>

                    {/* Next Button */}
                    {nextLesson ? (
                      <Link
                        href={`/subject/${slug}/lesson/${nextLesson.path}`}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                      >
                        {t("lesson.next")}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link
                        href={`/subject/${slug}`}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                      >
                        {t("lesson.back")}
                        <BookOpen className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </motion.article>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
