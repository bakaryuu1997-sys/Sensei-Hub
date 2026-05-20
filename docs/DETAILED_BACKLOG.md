# ✅ Sensei Hub — 詳細バックログ

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20

---

## 完了済みタスク ✅

### インフラストラクチャ
- [x] Git リポジトリ作成・ブランチ戦略構築
- [x] Next.js 16 プロジェクト初期化（`sensei-hub-dashboard/`）
- [x] Tailwind CSS v4 + PostCSS 設定
- [x] shadcn/ui セットアップ（57コンポーネント、new-yorkスタイル）
- [x] TypeScript 厳格モード設定
- [x] Docker Compose 設定（PostgreSQL）
- [x] Prisma ORM セットアップ
- [x] 全ブランチの同期（feat/infra-setup基準）

### ダッシュボードUI（19コンポーネント）
- [x] Sidebar（サイドバーナビゲーション）
- [x] TopBar（検索・ストリーク・言語・通知）
- [x] HeroBanner（マスコット画像・CTA）
- [x] StatsRow（4つの統計カード・スパークライン）
- [x] SubjectsGrid（4列の科目カード）
- [x] SubjectCard（グラデーション背景）
- [x] DailyChallenge（デイリーチャレンジ）
- [x] Leaderboard（XPランキング）
- [x] StreakHeatmap（GitHubスタイル熱マップ）
- [x] FeaturedCourses（おすすめコース）
- [x] QuickActions（クイックアクション）
- [x] RecentActivity（最近のアクティビティ）
- [x] ProgressRing / ProgressRing3D（進捗リング）
- [x] GlassCard / Card3D（特殊カード）
- [x] LanguageSwitcher（言語切替）
- [x] LessonCard（レッスンカード）
- [x] StatsCard（統計カード）

### 科目詳細ページUI（3コンポーネント）
- [x] SubjectHeader（パンくず・ヒーローカード・進捗リング）
- [x] SubjectStats（4つの指標カード）
- [x] ModulesList（モジュール一覧・ロック状態・難易度バッジ）

### 多言語対応（i18n）
- [x] LanguageProvider（React Context）
- [x] useLanguage() Hook
- [x] 翻訳キー定義（~80キー × 3言語）
- [x] localStorage 永続化
- [x] フォールバック処理

### データベース設計
- [x] User モデル（認証・プロフィール・権限）
- [x] LessonProgress モデル（進捗トラッキング）
- [x] Vocabulary モデル（トリリンガル語彙）
- [x] FavoriteVocab モデル（お気に入り）
- [x] Question / Option モデル（クイズ問題）
- [x] QuizResult / QuizAnswer モデル（クイズ結果）

### レッスンコンテンツ（11コース × 3言語）
- [x] AWS Cloud Engineering（60日 × 3言語）
- [x] Blockchain & Web3 Fundamentals（20日 × 3言語）
- [x] Business Japanese Test（120日 × 3言語）
- [x] Cybersecurity Awareness（15日 × 3言語）
- [x] Data Structures & Algorithms（60日 × 3言語）
- [x] Database Engineering（30日 × 3言語）
- [x] Developer Mindset（30日 × 3言語）
- [x] DevOps Engineering（60日 × 3言語）
- [x] Fundamental IT Engineer（100日 × 3言語）
- [x] Git & GitHub（10日 × 3言語）
- [x] System Design（60日 × 3言語）

### デザイン・UX
- [x] Premium Dark テーマ決定
- [x] グラスモーフィズムカードデザイン
- [x] メッシュグラデーション背景
- [x] フローティングオーブアニメーション
- [x] Framer Motion インタラクション
- [x] レスポンシブ対応（モバイル/デスクトップ）

### ドキュメント
- [x] 全ドキュメント日本語化・詳細化（23ファイル）

---

## 進行中タスク 🔧

### 認証システム
- [ ] Auth.js v5 Credentials Provider 統合
- [ ] ログイン画面UI
- [ ] 登録画面UI
- [ ] セッション管理ミドルウェア
- [ ] 保護ルート設定

---

## 予定タスク ⏳

### バックエンド
- [ ] Prisma マイグレーション実行
- [ ] Server Actions 実装（進捗更新・お気に入り切替）
- [ ] API Routes 実装（語彙・クイズ・統計）
- [ ] シードデータ作成（語彙・クイズ問題）

### フロントエンド
- [ ] レッスンビューアコンポーネント
- [ ] Markdown レンダリング（シンタックスハイライト・Mermaid）
- [ ] 語彙辞典UI（一覧・検索・詳細・お気に入り）
- [ ] クイズUI（問題表示・回答・タイマー・結果）
- [ ] 設定画面UI（プロフィール・言語・テーマ）
- [ ] 管理画面UI（コンテンツ・ユーザー管理）

### インフラ
- [ ] AWS RDS PostgreSQL 構築
- [ ] AWS S3 + CloudFront 設定
- [ ] AWS Amplify デプロイ設定
- [ ] CI/CD パイプライン構築
- [ ] 環境変数管理（本番/ステージング）

### テスト・品質
- [ ] E2Eテスト（Playwright）
- [ ] パフォーマンス最適化（Core Web Vitals）
- [ ] SEO対応（メタタグ・OGP・構造化データ）
- [ ] セキュリティ監査

---

## 📎 関連ドキュメント

- [ROADMAP.md](./ROADMAP.md) — ロードマップ
- [MASTER_PHASE_TASKS.md](./MASTER_PHASE_TASKS.md) — タスクマトリックス
