"use client"

import { motion } from "framer-motion"
import { Flame } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

// 7 days of mock data, value 0-4 representing intensity
const weekData: { dayKey: string; value: number; date: number }[] = [
  { dayKey: "day.mon", value: 3, date: 5 },
  { dayKey: "day.tue", value: 4, date: 6 },
  { dayKey: "day.wed", value: 2, date: 7 },
  { dayKey: "day.thu", value: 4, date: 8 },
  { dayKey: "day.fri", value: 3, date: 9 },
  { dayKey: "day.sat", value: 1, date: 10 },
  { dayKey: "day.sun", value: 4, date: 11 },
]

function getIntensityClass(value: number, isToday: boolean) {
  if (isToday) return "bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/50"
  switch (value) {
    case 0:
      return "bg-white/5"
    case 1:
      return "bg-emerald-500/30"
    case 2:
      return "bg-emerald-500/50"
    case 3:
      return "bg-emerald-500/70"
    case 4:
      return "bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-md shadow-emerald-500/30"
    default:
      return "bg-white/5"
  }
}

export function StreakHeatmap() {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base font-bold text-white">{t("section.streak")}</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30">
          <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
          <span className="text-xs font-bold text-orange-200">12 days</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekData.map((day, i) => {
          const isToday = i === 6
          return (
            <motion.div
              key={day.dayKey}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05, type: "spring", bounce: 0.4 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className={`w-full aspect-square rounded-lg ${getIntensityClass(day.value, isToday)}`} />
              <span className={`text-[10px] font-medium ${isToday ? "text-cyan-300" : "text-white/40"}`}>
                {t(day.dayKey)}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-white/40">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((v) => (
            <div key={v} className={`w-3 h-3 rounded ${getIntensityClass(v, false)}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </motion.div>
  )
}
