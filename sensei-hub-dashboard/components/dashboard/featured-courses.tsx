"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Play, Clock, BookOpen } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

const courses = [
  {
    id: "aws",
    image: "/images/course-aws.jpg",
    title: "AWS Lambda Mastery",
    category: "AWS",
    duration: "12h",
    lessons: 48,
    progress: 65,
    badge: "from-orange-400 to-amber-500",
  },
  {
    id: "fe",
    image: "/images/course-frontend.jpg",
    title: "Next.js 16 Patterns",
    category: "Frontend",
    duration: "8h",
    lessons: 32,
    progress: 90,
    badge: "from-sky-400 to-blue-500",
  },
  {
    id: "sys",
    image: "/images/course-system.jpg",
    title: "Scalable Architecture",
    category: "System Design",
    duration: "16h",
    lessons: 28,
    progress: 25,
    badge: "from-fuchsia-400 to-pink-500",
  },
]

export function FeaturedCourses() {
  const { t } = useLanguage()

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{t("section.continue")}</h2>
        <button className="text-xs text-white/60 hover:text-white transition-colors">{t("action.view_all")}</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {courses.map((course, i) => (
          <motion.article
            key={course.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={course.image || "/placeholder.svg"}
                alt={`${course.title} course thumbnail`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2.5 py-1 rounded-full bg-gradient-to-r ${course.badge} text-white text-[10px] font-bold uppercase tracking-wider shadow-lg`}
                >
                  {course.category}
                </span>
              </div>

              {/* Play button on hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-2xl">
                  <Play className="w-5 h-5 text-slate-950 fill-slate-950 ml-1" />
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-white line-clamp-1">{course.title}</h3>

              <div className="flex items-center gap-3 text-[11px] text-white/50">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {course.lessons} lessons
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Progress</span>
                  <span className="text-[11px] font-mono font-bold text-white">{course.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${course.badge}`}
                  />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
