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
  // モバイルのボトムナビ用の短いラベル
  "nav.tab_home": { en: "Home", ja: "ホーム", vi: "Trang chủ" },
  "nav.tab_learn": { en: "Learn", ja: "学習", vi: "Học" },
  "nav.tab_news": { en: "News", ja: "ニュース", vi: "Tin tức" },
  "nav.tab_chat": { en: "Chat", ja: "チャット", vi: "Chat" },
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
  "subject.python": { en: "Python, Machine Learning & Deep Learning", ja: "Python・機械学習・深層学習", vi: "Lập trình Python & Học sâu" },

  // Subject detail page
  "subject.modules": { en: "Course Modules", ja: "コースモジュール", vi: "Các chương học" },
  "subject.modules_count": { en: "modules in this path", ja: "個のモジュール", vi: "chương trong lộ trình" },
  "subject.lessons": { en: "lessons", ja: "レッスン", vi: "bài học" },
  "subject.show_more": { en: "Show more", ja: "もっと見る", vi: "Xem thêm" },
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
  "pwa.close": { en: "Close", ja: "閉じる", vi: "Đóng" },
  "pwa.install_action": { en: "Install", ja: "インストール", vi: "Cài đặt" },
  "pwa.hint": {
    en: "Add Sensei Hub to your home screen for a full-screen, app-like experience.",
    ja: "ホーム画面に追加すると全画面でアプリのように使えます。",
    vi: "Thêm Sensei Hub vào màn hình chính để dùng toàn màn hình như một app.",
  },
  // オンボーディング（初回 3 ステップ）
  "onboarding.welcome_title": { en: "Welcome to Sensei Hub", ja: "Sensei Hub へようこそ", vi: "Chào mừng đến Sensei Hub" },
  "onboarding.step_language": { en: "Language", ja: "言語", vi: "Ngôn ngữ" },
  "onboarding.step_path": { en: "Path", ja: "コース", vi: "Lộ trình" },
  "onboarding.step_start": { en: "Start", ja: "開始", vi: "Bắt đầu" },
  "onboarding.choose_language": { en: "Choose your language", ja: "言語を選んでください", vi: "Chọn ngôn ngữ của bạn" },
  "onboarding.choose_path": { en: "Pick a learning path", ja: "学習コースを選ぶ", vi: "Chọn một lộ trình học" },
  "onboarding.choose_path_sub": {
    en: "You can switch or explore others anytime.",
    ja: "あとからいつでも切り替え・追加できます。",
    vi: "Bạn có thể đổi hoặc khám phá lộ trình khác bất cứ lúc nào.",
  },
  "onboarding.ready_title": { en: "You're all set!", ja: "準備完了！", vi: "Sẵn sàng rồi!" },
  "onboarding.ready_sub": {
    en: "Let's start learning. Your progress is saved and synced across devices.",
    ja: "さっそく学習を始めましょう。進捗は保存され、端末間で同期されます。",
    vi: "Bắt đầu học thôi. Tiến độ được lưu và đồng bộ giữa các thiết bị.",
  },
  "onboarding.back": { en: "Back", ja: "戻る", vi: "Quay lại" },
  "onboarding.skip": { en: "Skip", ja: "スキップ", vi: "Bỏ qua" },
  "onboarding.next": { en: "Next", ja: "次へ", vi: "Tiếp" },
  "onboarding.start": { en: "Start learning", ja: "学習を始める", vi: "Bắt đầu học" },
  // 連続学習リマインダー
  "streak.days": { en: "day streak", ja: "日連続", vi: "ngày liên tục" },
  "streak.keep": { en: "Study today to keep it going!", ja: "今日も学習して継続しよう！", vi: "Học hôm nay để giữ chuỗi!" },
  "streak.study_now": { en: "Study", ja: "学習", vi: "Học ngay" },
  "streak.notify": { en: "Remind me", ja: "通知を許可", vi: "Nhắc tôi" },
  "pwa.guide_title": { en: "Install Sensei Hub", ja: "Sensei Hub をインストール", vi: "Cài đặt Sensei Hub" },
  "pwa.guide_ios_1": { en: "Open this site in Safari.", ja: "Safari でこのサイトを開きます。", vi: "Mở trang này bằng Safari." },
  "pwa.guide_ios_2": { en: "Tap the Share button (the square with an up arrow).", ja: "共有ボタン（上矢印の付いた四角）をタップします。", vi: "Chạm nút Chia sẻ (ô vuông có mũi tên hướng lên)." },
  "pwa.guide_ios_3": { en: "Choose “Add to Home Screen”.", ja: "「ホーム画面に追加」を選びます。", vi: "Chọn “Thêm vào Màn hình chính”." },
  "pwa.guide_other_1": { en: "Open this site in Chrome.", ja: "Chrome でこのサイトを開きます。", vi: "Mở trang này bằng Chrome." },
  "pwa.guide_other_2": { en: "Open the browser menu (⋮ at the top-right).", ja: "ブラウザのメニュー（右上の ⋮）を開きます。", vi: "Mở menu trình duyệt (⋮ ở góc trên bên phải)." },
  "pwa.guide_other_3": { en: "Tap “Install app” or “Add to Home screen”.", ja: "「アプリをインストール」または「ホーム画面に追加」をタップします。", vi: "Chạm “Cài đặt ứng dụng” hoặc “Thêm vào màn hình chính”." },
  "pwa.guide_https": {
    en: "Tip: install works best on an HTTPS site. If you don't see the option, open the site in Chrome (Android) or Safari (iPhone).",
    ja: "ヒント: インストールは HTTPS のサイトで最も確実に動作します。表示されない場合は Chrome（Android）または Safari（iPhone）で開いてください。",
    vi: "Mẹo: cài đặt hoạt động tốt nhất khi trang chạy HTTPS. Nếu không thấy tuỳ chọn, hãy mở bằng Chrome (Android) hoặc Safari (iPhone).",
  },

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
  "level.alllevels": { en: "All Levels", ja: "全レベル", vi: "Mọi cấp độ" },
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
  
  "sub.python.name": { en: "Python", ja: "Python", vi: "Python" },
  "sub.python.tagline": { en: "From syntax to neural networks, client-side Wasm runtime", ja: "基礎文法からニューラルネットワークまで、Wasmによる実行環境", vi: "Từ cú pháp cơ bản đến mạng nơ-ron, chạy trực tiếp trên Wasm" },
  "sub.python.description": { en: "Master Python programming from scratch. Transition to advanced machine learning and deep learning using interactive browser-based exercises.", ja: "Pythonプログラミングを基礎から学びます。ブラウザ上で動く演習を通して、機械学習やディープラーニングをマスターします。", vi: "Làm chủ Python từ con số 0. Thực hành các bài tập tương tác trên trình duyệt để tiến tới học máy và học sâu chuyên sâu." },
  
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

  // Navigation & auth
  "nav.menu": { en: "Menu", ja: "メニュー", vi: "Menu" },
  "nav.history": { en: "History", ja: "学習履歴", vi: "Lịch sử" },
  "history.title": { en: "Learning history", ja: "学習履歴", vi: "Lịch sử học tập" },
  "history.subtitle": { en: "Your recent lessons and quiz results", ja: "最近のレッスンとクイズ結果", vi: "Bài học gần đây và kết quả quiz" },
  "history.recent_lessons": { en: "Recent lessons", ja: "最近のレッスン", vi: "Bài học gần đây" },
  "history.quiz_results": { en: "Quiz results", ja: "クイズ結果", vi: "Kết quả quiz" },
  "history.empty": { en: "No activity yet — start a lesson!", ja: "まだ履歴がありません。レッスンを始めましょう！", vi: "Chưa có hoạt động — hãy bắt đầu một bài học!" },
  "auth.login": { en: "Sign in", ja: "ログイン", vi: "Đăng nhập" },

  // Lesson page (previously hardcoded)
  "lesson.subject_not_found": { en: "Subject not found", ja: "科目が見つかりません", vi: "Không tìm thấy môn học" },
  "lesson.back_to_dashboard": { en: "Back to Dashboard", ja: "ダッシュボードに戻る", vi: "Về trang chủ" },

  // Quiz (subject-level)
  "action.quiz": { en: "Quiz", ja: "クイズ", vi: "Quiz" },
  "quiz.coming_soon_title": { en: "Quiz — coming soon", ja: "クイズ — 近日公開", vi: "Quiz — Sắp ra mắt" },
  "quiz.coming_soon_desc": {
    en: "Practice questions for this subject are being prepared. Check back soon!",
    ja: "この科目の練習問題を準備中です。近日公開予定です。",
    vi: "Câu hỏi luyện tập cho môn này đang được chuẩn bị. Hãy quay lại sau nhé!",
  },
  "quiz.intro": {
    en: "Test what you've learned with a short set of questions.",
    ja: "学んだ内容を短い問題セットで確認しましょう。",
    vi: "Kiểm tra kiến thức đã học qua một bộ câu hỏi ngắn.",
  },
  "quiz.start": { en: "Start quiz", ja: "クイズを始める", vi: "Bắt đầu quiz" },
  "quiz.questions": { en: "questions", ja: "問", vi: "câu hỏi" },
  "quiz.question": { en: "Question", ja: "問題", vi: "Câu hỏi" },
  "quiz.submit": { en: "Submit answer", ja: "回答する", vi: "Trả lời" },
  "quiz.next": { en: "Next", ja: "次へ", vi: "Tiếp theo" },
  "quiz.finish": { en: "See result", ja: "結果を見る", vi: "Xem kết quả" },
  "quiz.retry": { en: "Try again", ja: "もう一度", vi: "Làm lại" },
  "quiz.correct": { en: "Correct", ja: "正解", vi: "Chính xác" },
  "quiz.incorrect": { en: "Incorrect", ja: "不正解", vi: "Chưa đúng" },
  "quiz.explanation": { en: "Explanation", ja: "解説", vi: "Giải thích" },
  "quiz.your_score": { en: "Your score", ja: "あなたのスコア", vi: "Điểm của bạn" },
  "quiz.best_score": { en: "Best", ja: "ベスト", vi: "Tốt nhất" },
  "quiz.select_set": { en: "Select a Quiz Set", ja: "クイズセットを選択してください", vi: "Chọn một đề thi" },
  "quiz.unattempted": { en: "Unattempted", ja: "未挑戦", vi: "Chưa thử sức" },
  "quiz.questions_count": { en: "10 questions", ja: "10問", vi: "10 câu hỏi" },
  "quiz.back_to_sets": { en: "Back to sets", ja: "セット選択に戻る", vi: "Quay lại chọn đề" },
  "quiz.part_a": { en: "Part A", ja: "科目A", vi: "Phần A" },
  "quiz.part_b": { en: "Part B", ja: "科目B", vi: "Phần B" },
  "quiz.result_great": { en: "Excellent work!", ja: "素晴らしい！", vi: "Xuất sắc!" },
  "quiz.result_good": { en: "Good job — keep practicing.", ja: "良い調子です。練習を続けましょう。", vi: "Tốt lắm — hãy luyện tập thêm." },
  "quiz.result_retry": { en: "Review the lessons and try again.", ja: "レッスンを復習してもう一度挑戦しましょう。", vi: "Hãy ôn lại bài học và thử lại." },

  // Floating AI chat
  "chat.title": { en: "AI Assistant", ja: "AIアシスタント", vi: "Trợ lý AI" },
  "chat.open": { en: "Open AI assistant", ja: "AIアシスタントを開く", vi: "Mở trợ lý AI" },
  "chat.coming_soon": { en: "AI chat is coming soon.", ja: "AIチャットは近日公開予定です。", vi: "Chat AI sắp ra mắt." },
  "chat.configure_hint": {
    en: "Connect Gemini, OpenAI, or a local Ollama model in Settings to start chatting.",
    ja: "設定で Gemini、OpenAI、またはローカルの Ollama モデルを接続するとチャットを開始できます。",
    vi: "Kết nối Gemini, OpenAI hoặc model Ollama cục bộ trong Cài đặt để bắt đầu trò chuyện.",
  },
  "chat.greeting": {
    en: "Ask me anything about your lessons.",
    ja: "学習内容について何でも聞いてください。",
    vi: "Hỏi mình bất cứ điều gì về bài học của bạn.",
  },
  "chat.placeholder": { en: "Type a message…", ja: "メッセージを入力…", vi: "Nhập tin nhắn…" },
  "chat.send": { en: "Send", ja: "送信", vi: "Gửi" },
  "chat.error": { en: "Something went wrong", ja: "エラーが発生しました", vi: "Đã xảy ra lỗi" },
  "chat.stop": { en: "Stop", ja: "停止", vi: "Dừng" },
  "chat.new": { en: "New chat", ja: "新しいチャット", vi: "Trò chuyện mới" },
  "chat.history": { en: "History", ja: "履歴", vi: "Lịch sử" },
  "chat.no_history": { en: "No saved chats yet.", ja: "保存されたチャットはまだありません。", vi: "Chưa có cuộc trò chuyện nào." },
  "chat.copy": { en: "Copy", ja: "コピー", vi: "Sao chép" },
  "chat.copied": { en: "Copied", ja: "コピーしました", vi: "Đã sao chép" },
  "chat.favorite": { en: "Favorite", ja: "お気に入り", vi: "Yêu thích" },
  "chat.rename": { en: "Rename", ja: "名前を変更", vi: "Đổi tên" },
  "chat.export": { en: "Export as Markdown", ja: "Markdown でエクスポート", vi: "Xuất Markdown" },
  "chat.delete": { en: "Delete", ja: "削除", vi: "Xoá" },
  "chat.voice": { en: "Voice input", ja: "音声入力", vi: "Nhập bằng giọng nói" },
  "chat.explain_lesson": {
    en: "Explain this lesson",
    ja: "このレッスンを説明して",
    vi: "Giải thích bài học này",
  },

  // Settings page
  "reminder.title": { en: "Study reminders", ja: "学習リマインド", vi: "Nhắc học" },
  "reminder.desc": {
    en: "Get a daily push notification when you haven't studied yet — even when the app is closed.",
    ja: "その日まだ学習していないとき、アプリを閉じていても 1 日 1 回プッシュ通知でお知らせします。",
    vi: "Nhận thông báo đẩy 1 lần/ngày khi bạn chưa học — kể cả khi đã đóng ứng dụng.",
  },
  "reminder.on": { en: "Reminders on", ja: "リマインド ON", vi: "Đang bật nhắc" },
  "reminder.off": { en: "Enable reminders", ja: "リマインドを有効化", vi: "Bật nhắc học" },
  "reminder.unsupported": {
    en: "Push notifications are not available on this device/browser.",
    ja: "この端末／ブラウザではプッシュ通知を利用できません。",
    vi: "Thiết bị/trình duyệt này không hỗ trợ thông báo đẩy.",
  },
  "reminder.denied": {
    en: "Notification permission was denied. Enable it in your browser settings.",
    ja: "通知が拒否されました。ブラウザの設定で許可してください。",
    vi: "Bạn đã từ chối quyền thông báo. Hãy bật lại trong cài đặt trình duyệt.",
  },
  "reminder.error": {
    en: "Could not enable reminders. Please try again.",
    ja: "リマインドを有効化できませんでした。もう一度お試しください。",
    vi: "Không bật được nhắc học. Vui lòng thử lại.",
  },
  "settings.title": { en: "Settings", ja: "設定", vi: "Cài đặt" },
  "settings.subtitle": { en: "Manage your learning preferences", ja: "学習設定を管理する", vi: "Quản lý tuỳ chọn học tập của bạn" },
  "settings.progress_title": { en: "Your progress", ja: "あなたの進捗", vi: "Tiến độ của bạn" },
  "settings.language_title": { en: "Default language", ja: "デフォルト言語", vi: "Ngôn ngữ mặc định" },
  "settings.language_desc": { en: "Language used for the interface and lessons.", ja: "インターフェースとレッスンで使用する言語。", vi: "Ngôn ngữ dùng cho giao diện và bài học." },
  "settings.ai_title": { en: "AI provider", ja: "AIプロバイダー", vi: "Nhà cung cấp AI" },
  "settings.ai_desc": {
    en: "Set up each provider separately — you can configure several and switch between them in the chat. Keys are stored only in your browser.",
    ja: "プロバイダーごとに設定できます。複数登録して、チャット側で切り替えられます。キーはブラウザにのみ保存されます。",
    vi: "Cấu hình từng nhà cung cấp riêng — bạn có thể thêm nhiều và chuyển đổi ngay trong khung chat. Khoá chỉ lưu trong trình duyệt.",
  },
  "settings.provider": { en: "Provider", ja: "プロバイダー", vi: "Nhà cung cấp" },
  "settings.api_key": { en: "API key", ja: "APIキー", vi: "Khoá API" },
  "settings.base_url": { en: "Base URL", ja: "ベースURL", vi: "Base URL" },
  "settings.model": { en: "Model (optional)", ja: "モデル（任意）", vi: "Model (tùy chọn)" },
  "settings.load_models": { en: "Load models", ja: "モデル取得", vi: "Tải model" },
  "settings.model_hint": {
    en: "Click the field to pick a model, or type one. Use “Load models” to fetch the ones your key supports.",
    ja: "欄をクリックして候補から選ぶか、手入力できます。「モデル取得」でキーが使えるモデルを取得できます。",
    vi: "Nhấp vào ô để chọn model, hoặc tự nhập. Dùng “Tải model” để lấy danh sách model mà khóa của bạn hỗ trợ.",
  },
  "settings.save": { en: "Save", ja: "保存", vi: "Lưu" },
  "settings.saved": { en: "Saved", ja: "保存しました", vi: "Đã lưu" },
  "settings.ollama_hint": {
    en: "Ollama runs as a local service on your own PC. Install from ollama.com and set Base URL to http://localhost:11434. ⚠️ Only works when accessing via http://localhost:3000 — browsers block http:// requests from HTTPS pages (Mixed Content). On a low-spec machine, prefer a small model: `llama3.2:3b`, `qwen2.5:3b`, `gemma2:2b` or `phi3:mini` are far faster than 12B+ models.",
    ja: "Ollama はあなたの PC 上でのみ動作するローカルサービスです。ollama.com からインストールし、Base URL を http://localhost:11434 に設定してください。⚠️ http://localhost:3000 でアクセスした場合のみ動作します。HTTPS のページ（senseihub.baryuu.com 等）からは Mixed Content 制限によりブラウザがブロックします。Gemini や OpenAI を代わりにお使いください。",
    vi: "Ollama chạy cục bộ trên máy tính của bạn. Cài từ ollama.com và đặt Base URL là http://localhost:11434. ⚠️ Chỉ hoạt động khi truy cập qua http://localhost:3000 — trình duyệt chặn kết nối http:// từ trang HTTPS (Mixed Content). Khi dùng senseihub.baryuu.com hãy dùng Gemini hoặc OpenAI.",
  },
  "settings.ollama_https_warning": {
    en: "⚠️ Ollama is not available on HTTPS. Use Gemini or OpenAI, or run the app locally at http://localhost:3000.",
    ja: "⚠️ HTTPS 環境では Ollama を使用できません。Gemini か OpenAI をお使いください（または http://localhost:3000 でローカル起動）。",
    vi: "⚠️ Ollama không khả dụng trên HTTPS. Hãy dùng Gemini hoặc OpenAI, hoặc chạy app tại http://localhost:3000.",
  },
  "settings.get_gemini_key": {
    en: "Get a Gemini API Key from Google AI Studio",
    ja: "Google AI Studio から Gemini API キーを取得する",
    vi: "Lấy khóa Gemini API Key từ Google AI Studio",
  },
  "settings.get_openai_key": {
    en: "Get an OpenAI API Key from OpenAI Platform",
    ja: "OpenAI Platform から OpenAI API キーを取得する",
    vi: "Lấy khóa OpenAI API Key từ OpenAI Platform",
  },
  "settings.use_default_ollama": {
    en: "Use http://localhost:11434",
    ja: "http://localhost:11434 を使用する",
    vi: "Sử dụng http://localhost:11434",
  },


  // Footer
  "footer.links_title": { en: "Useful links", ja: "便利なリンク", vi: "Liên kết hữu ích" },
  "footer.legal_title": { en: "Legal", ja: "法的事項", vi: "Pháp lý" },
  "footer.connect_title": { en: "Connect", ja: "つながる", vi: "Kết nối" },
  "footer.home": { en: "Home", ja: "ホーム", vi: "Trang chủ" },
  "footer.blog": { en: "Blog & News", ja: "ブログ・ニュース", vi: "Blog & Tin tức" },
  "footer.login": { en: "Sign in", ja: "ログイン", vi: "Đăng nhập" },
  "footer.privacy": { en: "Privacy Policy", ja: "プライバシーポリシー", vi: "Chính sách bảo mật" },
  "footer.terms": { en: "Terms of Service", ja: "利用規約", vi: "Điều khoản dịch vụ" },
  "footer.about": { en: "About us", ja: "私たちについて", vi: "Về chúng tôi" },
  "footer.contact": { en: "Contact", ja: "お問い合わせ", vi: "Liên hệ" },
  "footer.rights": { en: "All rights reserved.", ja: "全著作権所有。", vi: "Bảo lưu mọi quyền." },

  // Static pages
  "page.about.title": { en: "About Sensei Hub", ja: "Sensei Hub について", vi: "Về Sensei Hub" },
  "page.about.body": {
    en: "Sensei Hub is a trilingual (English, Japanese, Vietnamese) learning platform for IT engineers, with hands-on courses from Git and AWS to System Design.",
    ja: "Sensei Hub は、Git や AWS からシステム設計まで実践的なコースを備えた、ITエンジニア向けの3言語（英語・日本語・ベトナム語）学習プラットフォームです。",
    vi: "Sensei Hub là nền tảng học tập 3 ngôn ngữ (Anh, Nhật, Việt) cho kỹ sư IT, với các khoá thực hành từ Git, AWS đến Thiết kế hệ thống.",
  },
  "page.contact.title": { en: "Contact", ja: "お問い合わせ", vi: "Liên hệ" },
  "page.contact.body": {
    en: "Questions or feedback? Reach us via the project repository on GitHub.",
    ja: "ご質問やご意見は、GitHub のプロジェクトリポジトリからお寄せください。",
    vi: "Có câu hỏi hay góp ý? Liên hệ với chúng tôi qua kho mã nguồn dự án trên GitHub.",
  },
  "page.privacy.title": { en: "Privacy Policy", ja: "プライバシーポリシー", vi: "Chính sách bảo mật" },
  "page.privacy.body": {
    en: "We store only your learning progress, linked to your account. Lesson content is served as static files. We do not sell your data.",
    ja: "当サービスは、アカウントに紐づく学習進捗のみを保存します。レッスンコンテンツは静的ファイルとして提供されます。データを販売することはありません。",
    vi: "Chúng tôi chỉ lưu tiến độ học tập gắn với tài khoản của bạn. Nội dung bài học được phục vụ dưới dạng tệp tĩnh. Chúng tôi không bán dữ liệu của bạn.",
  },
  "page.terms.title": { en: "Terms of Service", ja: "利用規約", vi: "Điều khoản dịch vụ" },
  "page.terms.body": {
    en: "Sensei Hub is provided for educational use under the MIT License, without warranty. Use it responsibly.",
    ja: "Sensei Hub は MIT ライセンスのもと、教育目的で無保証で提供されます。責任を持ってご利用ください。",
    vi: "Sensei Hub được cung cấp cho mục đích học tập theo Giấy phép MIT, không có bảo hành. Hãy sử dụng có trách nhiệm.",
  },
  "page.blog.title": { en: "Blog & News", ja: "ブログ・ニュース", vi: "Blog & Tin tức" },
  "page.blog.body": {
    en: "Articles and product updates are coming soon.",
    ja: "記事や製品アップデートは近日公開予定です。",
    vi: "Các bài viết và cập nhật sản phẩm sẽ sớm ra mắt.",
  },

  // Blog / AI news
  "blog.title": { en: "Blog & News", ja: "ブログ・ニュース", vi: "Blog & Tin tức" },
  "blog.subtitle": {
    en: "Latest AI, tech and dev news — auto-updated in your language",
    ja: "AI・テック・開発の最新ニュースをあなたの言語で自動更新",
    vi: "Tin AI, công nghệ & lập trình mới nhất, tự động cập nhật theo ngôn ngữ của bạn",
  },
  "blog.empty": {
    en: "Couldn't load news right now. Please try again later.",
    ja: "現在ニュースを読み込めませんでした。しばらくしてからお試しください。",
    vi: "Hiện chưa tải được tin tức. Vui lòng thử lại sau.",
  },
  "blog.source_note": {
    en: "Headlines via Google News · refreshed every few hours",
    ja: "見出しは Google ニュース提供・数時間ごとに更新",
    vi: "Tiêu đề từ Google News · cập nhật vài giờ một lần",
  },
  // ニュースのカテゴリタブ
  "blog.cat.ai": { en: "AI", ja: "AI", vi: "AI" },
  "blog.cat.labs": { en: "AI Labs", ja: "AIラボ", vi: "Hãng AI" },
  "blog.cat.tech": { en: "Tech & Trends", ja: "テック・トレンド", vi: "Công nghệ & Xu hướng" },
  "blog.cat.dev": { en: "Dev", ja: "開発", vi: "Lập trình" },
  "dashboard.news_all": { en: "See all", ja: "すべて見る", vi: "Xem tất cả" },
  "blog.refresh": { en: "Refresh", ja: "更新", vi: "Làm mới" },
  "blog.just_now": { en: "just now", ja: "たった今", vi: "vừa xong" },
  "blog.filter": { en: "Filter by keyword or source…", ja: "キーワード・媒体で絞り込み…", vi: "Lọc theo từ khoá hoặc nguồn…" },
  "blog.no_match": { en: "No items match your filter.", ja: "条件に一致する記事がありません。", vi: "Không có tin khớp bộ lọc." },

  // Search command palette
  "search.placeholder": { en: "Search subjects and lessons...", ja: "科目やレッスンを検索...", vi: "Tìm môn học và bài học..." },
  "search.no_results": { en: "No results found.", ja: "結果が見つかりません。", vi: "Không tìm thấy kết quả." },
  "search.subjects": { en: "Subjects", ja: "科目", vi: "Môn học" },
  "search.lessons": { en: "Lessons", ja: "レッスン", vi: "Bài học" },

  // Continue learning
  "continue.none": { en: "Start with the first lesson", ja: "最初のレッスンから始める", vi: "Bắt đầu từ bài đầu tiên" },
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

  // Keep the document language in sync for accessibility / SEO.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang
    }
  }, [lang])

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
