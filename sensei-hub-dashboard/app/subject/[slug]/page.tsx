"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { SubjectHeader } from "@/components/subject/subject-header"
import { SubjectStats } from "@/components/subject/subject-stats"
import { ModulesList } from "@/components/subject/modules-list"
import { getSubjectBySlug } from "@/lib/subjects"
import { Starfield } from "@/components/dashboard/starfield"

export default function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const subject = getSubjectBySlug(slug)

  if (!subject) {
    notFound()
  }

  return (
    <div className="relative min-h-screen">
      {/* Decorative floating planets and stars */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Starfield />
        {/* Planet 1 - Floating top left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-16 -left-16 w-64 h-64 lg:w-96 lg:h-96"
          style={{
            animation: "float-slow 25s ease-in-out infinite",
          }}
        >
          <Image
            src="/images/planet-1.png"
            alt="Cosmic planet 1"
            fill
            className="object-contain"
          />
        </motion.div>

        {/* Planet 2 - Floating bottom right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-24 -right-24 w-80 h-80 lg:w-[480px] lg:h-[480px]"
          style={{
            animation: "float-reverse 30s ease-in-out infinite",
          }}
        >
          <Image
            src="/images/planet-2.png"
            alt="Cosmic planet 2"
            fill
            className="object-contain"
          />
        </motion.div>

        {/* Twinkling star decorations */}
        <div className="absolute top-[15%] left-[35%] w-1.5 h-1.5 bg-white rounded-full animate-twinkle opacity-70" />
        <div className="absolute top-[60%] left-[80%] w-1 h-1 bg-cyan-300 rounded-full animate-twinkle opacity-90" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[80%] left-[25%] w-2 h-2 bg-purple-400 rounded-full animate-twinkle opacity-60" style={{ animationDelay: "2s", animationDuration: "5s" }} />
        <div className="absolute top-[10%] right-[25%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-twinkle opacity-50" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[45%] left-[50%] w-1 h-1 bg-white rounded-full animate-twinkle opacity-80" style={{ animationDelay: "1.5s", animationDuration: "3s" }} />
      </div>

      <Sidebar />

      <div className="relative z-10 lg:ml-72 min-h-screen flex flex-col">
        <TopBar />
        <main className="flex-1 px-6 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
            <SubjectHeader subject={subject} />
            <SubjectStats subject={subject} />
            <ModulesList subject={subject} />
          </div>
        </main>
      </div>
    </div>
  )
}
