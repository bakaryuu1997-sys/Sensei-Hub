"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "en" | "ja" | "vi"

type Translations = {
  [key: string]: {
    en: string
    ja: string
    vi: string
  }
}

export const translations: Translations = {
  // Navigation
  "nav.dashboard": { en: "Dashboard", ja: "ダッシュボード", vi: "Tổng quan" },
  "nav.subjects": { en: "Subjects", ja: "科目", vi: "Môn học" },
  "nav.community": { en: "Community", ja: "コミュニティ", vi: "Cộng đồng" },
  "nav.settings": { en: "Settings", ja: "設定", vi: "Cài đặt" },
  "nav.profile": { en: "Profile", ja: "プロフィール", vi: "Hồ sơ" },

  // Header
  "header.search": { en: "Search lessons, topics...", ja: "レッスンを検索...", vi: "Tìm bài học, chủ đề..." },
  "header.greeting": { en: "Welcome back", ja: "おかえりなさい", vi: "Chào mừng trở lại" },
  "header.subtitle": {
    en: "Ready to level up your skills today?",
    ja: "今日はスキルアップの準備はできていますか？",
    vi: "Sẵn sàng nâng cao kỹ năng hôm nay?",
  },

  // Hero
  "hero.featured": { en: "Featured Path", ja: "おすすめコース", vi: "Lộ trình nổi bật" },
  "hero.title": { en: "Master the Universe of IT Knowledge", ja: "IT知識の宇宙をマスターする", vi: "Chinh phục Vũ trụ Tri thức IT" },
  "hero.description": {
    en: "Explore 11 constellations of knowledge, mastering a comprehensive learning path from basic tools to advanced system design",
    ja: "11の知識の星座を探索し、基本的なツールから高度なシステム設計までの包括的な学習パスをマスターします",
    vi: "Khám phá 11 chòm sao tri thức, làm chủ lộ trình học tập toàn diện từ công cụ lập trình cơ bản đến thiết kế hệ thống chuyên sâu",
  },
  "hero.cta": { en: "Continue Learning", ja: "学習を続ける", vi: "Tiếp tục học" },
  "hero.explore": { en: "Explore Path", ja: "コースを見る", vi: "Khám phá" },

  // Stats
  "stats.streak": { en: "Day Streak", ja: "連続日数", vi: "Chuỗi ngày" },
  "stats.xp": { en: "Total XP", ja: "総経験値", vi: "Tổng XP" },
  "stats.lessons": { en: "Lessons Done", ja: "完了レッスン", vi: "Bài đã học" },
  "stats.hours": { en: "Content Hours", ja: "コンテンツ時間", vi: "Giờ nội dung" },
  "stats.subjects": { en: "Active Subjects", ja: "進行中の科目", vi: "Môn đang học" },
  "stats.progress": { en: "Avg Progress", ja: "平均進捗", vi: "Tiến độ TB" },

  // Sections
  "section.continue": { en: "Continue Learning", ja: "学習を続ける", vi: "Tiếp tục học" },
  "section.subjects": { en: "Your Subjects", ja: "あなたの科目", vi: "Môn học của bạn" },
  "section.challenge": { en: "Daily Challenge", ja: "デイリーチャレンジ", vi: "Thử thách hôm nay" },
  "section.leaderboard": { en: "Top Learners", ja: "トップ学習者", vi: "Bảng xếp hạng" },
  "section.streak": { en: "Learning Streak", ja: "学習ストリーク", vi: "Chuỗi học tập" },
  "section.achievements": { en: "Recent Achievements", ja: "最近の実績", vi: "Thành tích gần đây" },

  // Subjects
  "subject.aws": { en: "Cloud computing & AWS services", ja: "クラウドとAWSサービス", vi: "Điện toán đám mây & AWS" },
  "subject.bjt": { en: "Behavioral interview prep", ja: "行動面接対策", vi: "Phỏng vấn hành vi" },
  "subject.database": { en: "SQL, NoSQL & data modeling", ja: "SQLとデータモデリング", vi: "SQL, NoSQL & mô hình dữ liệu" },
  "subject.devops": { en: "CI/CD, Docker & Kubernetes", ja: "CI/CD、Docker、K8s", vi: "CI/CD, Docker & K8s" },
  "subject.dsa": { en: "Algorithms & data structures", ja: "アルゴリズムとデータ構造", vi: "Thuật toán & cấu trúc dữ liệu" },
  "subject.fe": { en: "基本情報技術者試験 (FE Exam)", ja: "基本情報技術者試験", vi: "Chứng chỉ Kihon Jouhou (FE)" },
  "subject.mindset": { en: "Growth mindset & soft skills", ja: "成長マインドセット", vi: "Tư duy phát triển & kỹ năng mềm" },
  "subject.system": { en: "Scalable system architecture", ja: "スケーラブルなシステム設計", vi: "Thiết kế hệ thống mở rộng" },

  // Subject detail page
  "subject.modules": { en: "Course Modules", ja: "コースモジュール", vi: "Các chương học" },
  "subject.modules_count": { en: "modules in this path", ja: "個のモジュール", vi: "chương trong lộ trình" },
  "subject.lessons": { en: "lessons", ja: "レッスン", vi: "bài học" },
  "subject.overview": { en: "Overview", ja: "概要", vi: "Tổng quan" },

  // Actions
  "action.start": { en: "Start", ja: "開始", vi: "Bắt đầu" },
  "action.resume": { en: "Resume", ja: "再開", vi: "Tiếp tục" },
  "action.view_all": { en: "View all", ja: "すべて表示", vi: "Xem tất cả" },
  "action.complete": { en: "Complete", ja: "完了", vi: "Hoàn thành" },

  // Challenge
  "challenge.title": { en: "Two Sum Problem", ja: "ツーサム問題", vi: "Bài toán Two Sum" },
  "challenge.difficulty": { en: "Medium", ja: "中級", vi: "Trung bình" },
  "challenge.reward": { en: "Reward", ja: "報酬", vi: "Phần thưởng" },
  "challenge.time": { en: "min left", ja: "分残り", vi: "phút còn lại" },

  // Days
  "day.mon": { en: "Mon", ja: "月", vi: "T2" },
  "day.tue": { en: "Tue", ja: "火", vi: "T3" },
  "day.wed": { en: "Wed", ja: "水", vi: "T4" },
  "day.thu": { en: "Thu", ja: "木", vi: "T5" },
  "day.fri": { en: "Fri", ja: "金", vi: "T6" },
  "day.sat": { en: "Sat", ja: "土", vi: "T7" },
  "day.sun": { en: "Sun", ja: "日", vi: "CN" },
}

type LanguageContextType = {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en")

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("sensei-lang") as Language | null) : null
    if (stored && ["en", "ja", "vi"].includes(stored)) {
      setLangState(stored)
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    if (typeof window !== "undefined") {
      localStorage.setItem("sensei-lang", newLang)
    }
  }

  const t = (key: string): string => {
    const entry = translations[key]
    if (!entry) return key
    return entry[lang] || entry.en
  }

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
