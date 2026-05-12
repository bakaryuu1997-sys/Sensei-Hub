# 📝 ソフトウェア要件定義書 (SRS): Sensei Hub

> **バージョン:** 1.0.1
> **ステータス:** 草案 (設計フェーズ)
> **プロジェクト:** Sensei Hub - 日越IT学習プラットフォーム

---

## 1. エグゼクティブサマリー (Executive Summary)

Sensei Hubは、日本で働く外国人エンジニア（特にベトナム人）を対象としたIT学習プラットフォームです。
このシステムは、多言語（日本語・ベトナム語）の学習教材、IT用語辞典、および以下の分野の知識テストを提供します：
FE (基本情報技術者試験レベル)、AWS、システム設計、DSA（データ構造とアルゴリズム）、データベース、DevOps、ビジネス日本語 (BJT)、およびプログラミングマインドセット。

---

## 2. ターゲット層 (Target Audience)

- 日本で働いている、または働く予定のベトナム人ソフトウェアエンジニア。
- 基本情報技術者試験 (FE) の合格を目指す学生・エンジニア。
- システム設計、DSA、DevOpsのスキルを向上させ、日本企業の環境 (BJT) に適応したい開発者。

---

## 3. 技術スタック (Tech Stack)

- **Frontend/Backend:** Next.js 15 (App Router, Server Actions).
- **Styling:** Tailwind CSS + Shadcn/UI (Modern Dark Mode).
- **Database:** PostgreSQL (AWS RDS) + Prisma ORM.
- **Content:** MDX (Markdown with AI integration).
- **Authentication:** Auth.js v5 (NextAuth).
- **Infrastructure:** AWS Amplify, S3.
- **AI Integration (2026):** MCP (Model Context Protocol) via AI Tutor.

---

## 4. 機能要件 (Functional Requirements)

### 4.1. レッスンエンジン (Lesson Engine)
- `/lessons` ディレクトリから教材リストを表示。
- MDXレンダリングとシンタックスハイライト。
- 各レッスンの自動目次 (TOC) 生成。
- 「読了」ステータスの管理。

### 4.2. 多言語IT用語辞典 (Dictionary)
- 日本語、ベトナム語、英語による用語検索。
- ITコンテキストに沿った定義と例文の表示。
- 重要用語の「ブックマーク」機能。

### 4.3. インタラクティブクイズ (Interactive Quiz)
- 4択形式のクイズバンク。
- リアルタイム採点と詳細な解説表示。
- スコア履歴のダッシュボード保存。

### 4.4. 学習ダッシュボード (Learning Dashboard)
- 学習進捗率 (Progress bar) の表示。
- **Streak** 機能 (連続学習日数のカウント)。
- 最近のクイズ結果の統計表示。

### 4.5. AIチューター (AI Tutor) - 2026 New Feature
- 各レッスンにおけるAIへの即時質問機能。
- ユーザーの学習スタイルに合わせた解説のパーソナライズ。

---

## 5. 非機能要件 (Non-Functional Requirements)

- **パフォーマンス:** MDXレッスンの読み込みを1秒以内に完了。
- **UX:** ダークモードを基調とした、集中力を高めるクリーンなUI。
- **i18n:** インターフェースの多言語切り替え（日・越）。
- **可用性:** AWS Amplifyによる高可用なデプロイメント。

---

## 6. 実装フェーズ (AWF Roadmap)

### フェーズ 1: 基盤構築 & レッスンエンジン
- Next.js 15 プロジェクトのセットアップ。
- Prisma & データベース設定。
- MDXファイル読み込みエンジンの構築。

### フェーズ 2: ユーザーシステム & 辞書機能
- Auth.js v5 の統合。
- 多言語IT用語辞典モジュールの開発。

### フェーズ 3: クイズ & 進捗管理
- インタラクティブクイズシステムの構築。
- 採点ロジックと履歴保存機能の実装。

### フェーズ 4: ダッシュボード & ブラッシュアップ
- ユーザーダッシュボードのUI完成。
- UI/UXの最適化 & AWS Amplifyへのデプロイ。

---
*作成者: Antigravity Strategy Lead (Hà)*
*最終更新日: 2026年5月12日*
