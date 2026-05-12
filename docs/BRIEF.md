# 📝 プロジェクト概要 (Project Brief): Sensei Hub

> **ステータス:** Planning (設計完了)  
> **対象読者:** 開発チーム全体

---

## 1. 解決すべき課題 (Problem Statement)
*   **基本情報技術者試験 (FE)** は学習範囲が広く、効率的な検索や反復練習ができるツールが不足している。
*   **FE (Kihon Jouhou)**, **AWS**, **System Design**, **DSA**, **Database**, **DevOps**, **BJT** và **Mindset** là những mảng kiến thức quan trọng cần được hệ thống hóa.
*   **言語の壁:** 専門的なIT用語を日本語とベトナム語の両方で正しく理解するためのサポート環境が整っていない。

## 2. 提案する解決策 (Proposed Solution)
多言語対応（日・越・英）のIT学習Webプラットフォーム **「Sensei Hub」** の開発。
*    Markdownベースのレッスンにより、記事を読む感覚で技術を習得。
*   「IT用語集」と「クイズ機能」を統合し、インプットとアウトプットを一つのアプリで完結させる。
*   ダークモードを基調とした、開発者が集中しやすいモダンなUI/UX。

## 3. ターゲットユーザー (Target Audience)
*   日本のIT企業で働く、または就職を目指す外国人（主にベトナム人）エンジニア。
*   基本情報技術者試験（FE）の合格を目指す学習者。
*   Học viên muốn thi FE (Kihon Jouhou) hoặc nâng cao trình độ System Design, AWS, DevOps.
*   Kỹ sư muốn cải thiện tư duy lập trình (Mindset) và tiếng Nhật chuyên ngành (BJT).

## 4. 主な機能 (Key Features)
1.  **Markdownレッスンエンジン:** `lessons/` ディレクトリ内の `.md` ファイルを動的にパースし、美しく表示。
2.  **多言語対応 IT用語集:** 日/越/英の3言語で検索・学習可能な辞書。
3.  **インタラクティブ・クイズ:** 学習内容の定着度を測るテスト機能。
4.  **学習進捗管理:** 各ユーザーのレッスンの進行状況やスコアを可視化するダッシュボード。

## 5. 技術的な制約と方針 (Constraints & Approach)
*   **開発スピード重視:** チーム3名での開発を最速化するため、Next.js (App Router) によるFullstack構成を採用。
*   **データベース:** PostgreSQL + Prisma。レッスン本文はDBに入れず、ファイルシステム（Markdown）で管理。
*   **インフラ:** 複雑なコンテナ構築を避け、AWS Amplify を用いたサーバーレスデプロイメントを採用。

## 6. インフラ・関連ドキュメント
*   [プロジェクト構造と規約](./PROJECT_STRUCTURE.md)
*   [詳細なデータベース設計](./DATABASE_DESIGN.md)
*   [Markdown 処理システム](./LESSON_ENGINE.md)
*   [タスクマトリックスとGitHubフロー](./MASTER_PHASE_TASKS.md)

---
*承認者: Team Bakaryuu*
