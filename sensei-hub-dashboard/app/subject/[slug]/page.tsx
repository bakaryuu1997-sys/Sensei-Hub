"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { SubjectHeader } from "@/components/subject/subject-header"
import { SubjectStats } from "@/components/subject/subject-stats"
import { ModulesList } from "@/components/subject/modules-list"
import { getSubjectBySlug } from "@/lib/subjects"

export default function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const subject = getSubjectBySlug(slug)

  if (!subject) {
    notFound()
  }

  return (
    <div className="relative min-h-screen">
      {/* Decorative floating orbs - tinted to subject color */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div
          className="floating-orb"
          style={{
            top: "5%",
            right: "10%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, #22d3ee, transparent 70%)",
          }}
        />
        <div
          className="floating-orb"
          style={{
            top: "40%",
            left: "10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, #a855f7, transparent 70%)",
            animationDelay: "-7s",
          }}
        />
        <div
          className="floating-orb"
          style={{
            bottom: "10%",
            right: "30%",
            width: "450px",
            height: "450px",
            background: "radial-gradient(circle, #ec4899, transparent 70%)",
            animationDelay: "-14s",
          }}
        />
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
