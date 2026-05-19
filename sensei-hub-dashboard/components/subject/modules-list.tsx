"use client"

import { CheckCircle2, Lock, PlayCircle, Clock, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import type { Subject, Module } from "@/lib/subjects"

interface ModulesListProps {
  subject: Subject
}

export function ModulesList({ subject }: ModulesListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Course Modules</h2>
        <span className="text-sm text-slate-400">{subject.modules.length} Modules</span>
      </div>

      <div className="grid gap-4">
        {subject.modules.map((module, index) => (
          <ModuleCard key={module.id} module={module} index={index} />
        ))}
      </div>
    </div>
  )
}

function ModuleCard({ module, index }: { module: Module; index: number }) {
  const isCompleted = module.progress === 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        module.locked
          ? "border-white/5 bg-white/5 opacity-75"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {module.locked ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-500">
              <Lock className="h-6 w-6" />
            </div>
          ) : isCompleted ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <PlayCircle className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white truncate">{module.title}</h3>
            {module.locked && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
                Locked
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 line-clamp-1">{module.description}</p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 sm:border-l border-white/10 sm:pl-6">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs">{module.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">{module.difficulty}</span>
          </div>
          <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                isCompleted ? "bg-emerald-500" : "bg-cyan-500"
              }`}
              style={{ width: `${module.progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
