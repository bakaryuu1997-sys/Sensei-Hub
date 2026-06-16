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
  "lesson.prev": { en: "Previous Lesson", ja: "前のレッスン", vi: "Bài trước" },
  "lesson.next": { en: "Next Lesson", ja: "次のレッスン", vi: "Bài tiếp theo" },
  "lesson.back": { en: "Back to Subject", ja: "科目に戻る", vi: "Quay lại môn học" },
  "lesson.complete": { en: "Complete Lesson", ja: "レッスンを完了する", vi: "Hoàn thành bài học" },
  "lesson.completed": { en: "Completed", ja: "完了済み", vi: "Đã hoàn thành" },

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
  "pwa.install_sidebar": { en: "Download Sensei Hub", ja: "Sensei Hubをダウンロード", vi: "Tải App Sensei Hub" },
  "pwa.install_topbar": { en: "Download App", ja: "アプリをダウンロード", vi: "Tải App" },

  // System Status & Common
  "status.online": { en: "All systems online", ja: "システム正常", vi: "Hệ thống sẵn sàng" },
  "common.progress": { en: "Progress", ja: "進捗", vi: "Tiến độ" },
  "common.loading": { en: "Loading...", ja: "読み込み中...", vi: "Đang tải..." },
  "common.not_found": { en: "Not found", ja: "見つかりません", vi: "Không tìm thấy" },
  "common.dev": { en: "Dev", ja: "開発者", vi: "Dev" },
  "common.developer": { en: "Developer", ja: "開発者", vi: "Nhà phát triển" },

  // Footer & Branding
  "footer.brand": { en: "SENSEI HUB · Focus & Flow · 2026", ja: "SENSEI HUB · 集中とフロー · 2026", vi: "SENSEI HUB · Tập trung & Trải nghiệm · 2026" },
  "footer.motto": { en: "FOCUS · FLOW · MASTERY", ja: "集中 · フロー · 習得", vi: "TẬP TRUNG · TRẢI NGHIỆM · TINH THÔNG" },
  
  // Constellation
  "constellation.title": { en: "Learning Constellations", ja: "学習の星座", vi: "Chòm sao học tập" },

  // Lesson Page
  "lesson.loading_content": { en: "Loading lesson content...", ja: "レッスン内容を読み込み中...", vi: "Đang tải nội dung bài học..." },
  "lesson.not_found_title": { en: "Lesson not found", ja: "レッスンが見つかりません", vi: "Không tìm thấy bài học" },
  "lesson.back_to_list": { en: "Back to list", ja: "リストに戻る", vi: "Quay lại danh sách" },
  "lesson.back_to_subject": { en: "Back to", ja: "に戻る", vi: "Quay lại" },
  "lesson.count_label": { en: "Lesson", ja: "レッスン", vi: "Bài học" },

  // Levels
  "level.beginner": { en: "Beginner", ja: "初級", vi: "Cơ bản" },
  "level.intermediate": { en: "Intermediate", ja: "中級", vi: "Trung cấp" },
  "level.advanced": { en: "Advanced", ja: "上級", vi: "Nâng cao" },
  "level.alllevels": { en: "All Levels", ja: "Mọi cấp độ", vi: "Mọi cấp độ" },
  "level.beginner_alt": { en: "Beginner", ja: "初級", vi: "Cơ bản" },
  "level.intermediate_alt": { en: "Intermediate", ja: "中級", vi: "Trung cấp" },
  "level.advanced_alt": { en: "Advanced", ja: "上級", vi: "Nâng cao" },

  // Module actions
  "action.study": { en: "Study", ja: "学習する", vi: "Học tập" },
  "action.review": { en: "Review", ja: "復習する", vi: "Ôn tập" },
  "action.keep_going": { en: "Keep going", ja: "その調子で！", vi: "Tiếp tục cố gắng" },
  "subject.loading_lessons": { en: "Loading lessons...", ja: "レッスンを読み込み中...", vi: "Đang tải bài học..." },

  // Accessibility & SEO
  "aria.notifications": { en: "Notifications", ja: "通知", vi: "Thông báo" },
  "aria.toggle_audio": { en: "Toggle Cosmic Audio", ja: "オーディオを切り替える", vi: "Bật/Tắt âm thanh" },
  "alt.hero_banner": { en: "Featured learning path background", ja: "おすすめコースの背景", vi: "Hình nền lộ trình học tập nổi bật" },
  "seo.title": { en: "SENSEI HUB - Focus & Flow Learning", ja: "SENSEI HUB - 集中とフローの学習", vi: "SENSEI HUB - Học tập Tập trung & Hiệu quả" },
  "seo.description": { en: "Elevate your coding skills with focused learning experiences", ja: "集中した学習体験でコーディングスキルを向上させる", vi: "Nâng tầm kỹ năng lập trình với trải nghiệm học tập tập trung" },

  // Subject Details (Metadata)
  "sub.git-and-github.name": { en: "Git & GitHub", ja: "Git & GitHub", vi: "Git & GitHub" },
  "sub.git-and-github.tagline": { en: "Version control and collaborative coding", ja: "バージョン管理と共同開発", vi: "Quản lý mã nguồn & làm việc nhóm" },
  "sub.git-and-github.description": { en: "Go from Git novice to pro. Master commits, branching strategies, pull requests, collaborative workflows, and conflict resolution.", ja: "Gitの初心者からプロへ。コミット、ブランチ戦略、プルリクエスト、共同ワークフロー、競合解決をマスターします。", vi: "Từ người mới bắt đầu đến chuyên gia Git. Làm chủ commit, chiến lược nhánh, pull request, quy trình cộng tác và xử lý xung đột." },
  
  "sub.fe.name": { en: "FE Exam", ja: "基本情報", vi: "Kỳ thi FE" },
  "sub.fe.tagline": { en: "Master the Japanese IT Exam", ja: "日本のIT資格をマスターする", vi: "Chinh phục kỳ thi IT Nhật Bản" },
  "sub.fe.description": { en: "Master the Japanese Fundamental Information Technology Engineer Examination. Covers algorithms, hardware, networks, databases, and project management.", ja: "日本の基本情報技術者試験をマスターします。アルゴリズム、ハードウェア、ネットワーク、データベース、プロジェクト管理を網羅。", vi: "Chinh phục kỳ thi Kỹ sư Công nghệ thông tin Cơ bản Nhật Bản. Bao gồm thuật toán, phần cứng, mạng, cơ sở dữ liệu và quản lý dự án." },

  "sub.aws.name": { en: "AWS", ja: "AWS", vi: "AWS" },
  "sub.aws.tagline": { en: "Master the cloud, scale infinitely", ja: "クラウドをマスターし、無限に拡張する", vi: "Làm chủ đám mây, mở rộng vô hạn" },
  "sub.aws.description": { en: "Build, deploy, and scale production applications on the world's leading cloud platform. From EC2 to Lambda, master 200+ AWS services.", ja: "世界をリードするクラウドプラットフォームで本番アプリケーションを構築、デプロイ、拡張します。EC2からLambdaまで、200以上のAWSサービスをマスター。", vi: "Xây dựng, triển khai và mở rộng ứng dụng thực tế trên nền tảng đám mây hàng đầu thế giới. Từ EC2 đến Lambda, làm chủ hơn 200 dịch vụ AWS." },

  "sub.database-engineering.name": { en: "Database", ja: "データベース", vi: "Cơ sở dữ liệu" },
  "sub.database-engineering.tagline": { en: "Design, query, and optimize relational databases", ja: "データベースの設計、クエリ、最適化", vi: "Thiết kế & tối ưu hóa cơ sở dữ liệu" },
  "sub.database-engineering.description": { en: "Learn schema design, advanced SQL querying, indexing strategies, transaction isolation levels, and performance tuning for production databases.", ja: "本番データベースのスキーマ設計、高度なSQLクエリ、インデックス戦略、トランザクション分離レベル、パフォーマンス調整を学びます。", vi: "Học thiết kế lược đồ, truy vấn SQL nâng cao, chiến lược đánh chỉ mục, các mức cô lập giao dịch và tối ưu hóa hiệu năng cho cơ sở dữ liệu thực tế." },

  "sub.business-japanese-test.name": { en: "BJT", ja: "BJT ビジネス日本語", vi: "Tiếng Nhật thương mại" },
  "sub.business-japanese-test.tagline": { en: "Master professional Japanese for career success", ja: "キャリア成功のためのビジネス日本語", vi: "Tiếng Nhật chuyên nghiệp cho sự nghiệp" },
  "sub.business-japanese-test.description": { en: "Unlock high-level corporate Japanese. Practice honorifics (keigo), email etiquette, meetings protocols, and business customs for Japanese workplaces.", ja: "高度な企業日本語を習得します。敬語、メールのマナー、会議のプロトコル、日本の職場のビジネス習慣を練習します。", vi: "Mở khóa tiếng Nhật doanh nghiệp cấp độ cao. Thực hành kính ngữ (keigo), quy tắc viết email, giao thức họp hành và văn hóa kinh doanh Nhật Bản." },

  "sub.devops-engineering.name": { en: "DevOps", ja: "DevOps", vi: "DevOps" },
  "sub.devops-engineering.tagline": { en: "Automate, deploy, and monitor like a pro", ja: "プロのように自動化、デプロイ、監視する", vi: "Tự động hóa & triển khai hệ thống" },
  "sub.devops-engineering.description": { en: "Bridge the gap between dev and ops. Learn Docker containers, Kubernetes orchestration, CI/CD pipelines, Infrastructure as Code, and monitoring.", ja: "開発と運用のギャップを埋めます。Dockerコンテナ、Kubernetesオーケストレーション、CI/CDパイプライン、Infrastructure as Code、監視を学びます。", vi: "Xóa bỏ khoảng cách giữa phát triển và vận hành. Học Docker, Kubernetes, CI/CD, hạ tầng dưới dạng mã (IaC) và giám sát hệ thống." },

  "sub.system-design.name": { en: "System Design", ja: "システム設計", vi: "Thiết kế hệ thống" },
  "sub.system-design.tagline": { en: "Build highly scalable, reliable systems", ja: "スケーラブルで信頼性の高いシステムを構築する", vi: "Xây dựng hệ thống quy mô lớn" },
  "sub.system-design.description": { en: "Learn to design large-scale systems. Covers load balancing, caching, databases replication, microservices, message queues, and real-world case studies.", ja: "大規模なシステムの設計方法を学びます。ロードバランシング、キャッシュ、データベースのレプリケーション、マイクロサービス、メッセージキュー、実例を網羅。", vi: "Học cách thiết kế hệ thống quy mô lớn. Bao gồm cân bằng tải, bộ nhớ đệm, nhân bản cơ sở dữ liệu, microservices, hàng đợi thông điệp và các tình huống thực tế." },

  "sub.data-structures-and-algorithms.name": { en: "DSA", ja: "データ構造とアルゴリズム", vi: "Thuật toán & Cấu trúc dữ liệu" },
  "sub.data-structures-and-algorithms.tagline": { en: "Crack the coding interview and optimize code", ja: "コーディング面接に合格し、コードを最適化する", vi: "Vượt qua phỏng vấn & tối ưu mã nguồn" },
  "sub.data-structures-and-algorithms.description": { en: "Master essential data structures and algorithms. From arrays and lists to trees, graphs, dynamic programming, and space-time complexity analysis.", ja: "必須のデータ構造とアルゴリズムをマスターします。配列やリストから、木、グラフ、動的計画法、時空間計算量分析まで。", vi: "Làm chủ các cấu trúc dữ liệu và thuật toán thiết yếu. Từ mảng, danh sách đến cây, đồ thị, quy hoạch động và phân tích độ phức tạp." },

  "sub.developer-mindset.name": { en: "Mindset", ja: "マインドセット", vi: "Tư duy" },
  "sub.developer-mindset.tagline": { en: "Be more than just a coder", ja: "単なるプログラマー以上の存在になる", vi: "Phát triển tư duy kỹ sư thực thụ" },
  "sub.developer-mindset.description": { en: "Grow your soft skills, engineering culture, agile practices, project management methodologies, technical communication, and leadership skills.", ja: "ソフトスキル、エンジニアリング文化、アジャイル、プロジェクト管理手法、テクニカルコミュニケーション、リーダーシップスキルを高めます。", vi: "Phát triển kỹ năng mềm, văn hóa kỹ thuật, thực hành agile, phương pháp quản lý dự án, giao tiếp kỹ thuật và kỹ năng lãnh đạo." },

  "sub.cybersecurity-awareness.name": { en: "Security", ja: "セキュリティ", vi: "Bảo mật" },
  "sub.cybersecurity-awareness.tagline": { en: "Secure systems, analyze threats, defend networks", ja: "システムを保護し、脅威を分析し、ネットワークを守る", vi: "Bảo mật hệ thống & phòng chống tấn công" },
  "sub.cybersecurity-awareness.description": { en: "Understand the security landscape. Learn about common vulnerabilities (OWASP Top 10), penetration testing basics, cryptography, and network defense.", ja: "セキュリティ情勢を理解します。一般的な脆弱性（OWASP Top 10）、ペネトレーションテストの基礎、暗号化、ネットワーク防御について学びます。", vi: "Hiểu về bối cảnh an ninh mạng. Học về các lỗ hổng phổ biến (OWASP Top 10), cơ bản về kiểm thử xâm nhập, mật mã học và phòng thủ mạng." },

  "sub.blockchain-and-web3-fundamentals.name": { en: "Blockchain", ja: "ブロックチェーン", vi: "Blockchain" },
  "sub.blockchain-and-web3-fundamentals.tagline": { en: "Decentralize the future", ja: "未来を分散化する", vi: "Công nghệ tương lai phi tập trung" },
  "sub.blockchain-and-web3-fundamentals.description": { en: "Understand blockchain mechanics, cryptography, smart contracts, Ethereum Virtual Machine, decentralized finance (DeFi), and consensus protocols.", ja: "ブロックチェーンの仕組み、暗号化、スマートコントラクト、EVM、DeFi、コンセンサスプロトコルを理解します。", vi: "Tìm hiểu cơ chế blockchain, mật mã học, hợp đồng thông minh, EVM, tài chính phi tập trung (DeFi) và các giao thức đồng thuận." },
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
