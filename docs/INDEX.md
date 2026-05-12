# 📚 Sensei Hub — プロジェクト総まとめ (Master Index)

> **Version:** 1.0.0-planning  
> **最終更新:** 2026-05-12  
> **チーム体制:** 3名 (Cloud Architect, Backend Engineer, Frontend Engineer)  
> **目標:** 多言語対応（日・越・英）のIT学習Webアプリ。レッスン、用語集、クイズ機能を搭載。

---

## 📋 ドキュメント目次

| ファイル名 | 内容 | 必読対象 |
|------|----------|-----------|
| `BRIEF.md` | プロジェクトの背景、課題、解決策 | 全員 |
| `TECH_STACK.md` | 使用する技術スタック | 全員 |
| `TEAM_ROLES.md` | チームの役割と責任分担 | 全員 |
| `MASTER_PHASE_TASKS.md` | **全4フェーズのタスクマトリックス ＆ GitHub ワークフロー** | 全員 |
| `ROADMAP.md` | 4週間のタイムライン | 全員 |
| `ARCHITECTURE.md` | AWS + Next.js アーキテクチャ図 | Member A, B |
| `DATABASE_DESIGN.md` | Prisma Schema 詳細 | Member B |
| `API_SPECS.md` | API エンドポイント仕様書 | Member B, C |
| `LESSON_ENGINE.md` | Markdownファイルの読み込み・描画の仕組み | Member B |
| `I18N_STRATEGY.md` | 多言語化（i18n）戦略 | Member B, C |
| `PROJECT_STRUCTURE.md` | ディレクトリ構造 ＆ 命名規則 | 全員 |
| `FEATURES_DETAIL.md` | 各機能の詳細要件 | 全員 |
| `UI_UX_SPEC.md` | デザインシステム ＆ UXフロー | Member C |
| `DEPLOYMENT.md` | AWS デプロイ手順書 | Member A |
| `DETAILED_BACKLOG.md` | 日別（Day 1~20）の詳細タスク | 全員 |
| `MOCKUPS.md` | UIモックアップ画像集 | Member C |

---

## 🎯 プロジェクトのビジョン

**Sensei Hub**は、日本で働く、または学習するITエンジニア（特にベトナム人）向けの**シンプルかつ実践的**な学習プラットフォームです。複雑な仕組みを省き、基本情報技術者試験（FE）対策、Java、AWSの実用的な知識をMarkdownベースのレッスンを通じて効率的に学べる「強力な武器」を提供します。

---

## 🏗️ 全体アーキテクチャ概要

```
User (Browser)
    │ HTTPS
    ▼
AWS Amplify (CDN + SSR Hosting)
    │
    ├── Next.js 15 App
    │       ├── App Router (SSR Pages)
    │       ├── API Routes / Server Actions
    │       ├── next-intl (i18n: ja/vi/en)
    │       └── Prisma ORM
    │               │
    │               ▼
    │       AWS RDS (PostgreSQL 16)
    │
    └── AWS S3 (Static Assets / Lesson Images)
```

---

## 👥 チーム体制 (Roles)

| メンバー | 役割 | メインドメイン |
|-----------|---------|-------------|
| **Member A** | Cloud Architect / DevOps | AWS, CI/CD, Auth, Security |
| **Member B** | Backend Engineer | API, Database, Content Engine |
| **Member C** | Frontend Engineer | UI, UX, Responsive, SEO |

---

## 🗺️ 4週間のスプリント概要 (Sprint Overview)

```
第1週 (P1 - Foundation):
  A: AWS セットアップ, RDS, Auth.js
  B: Prisma Schema, Lesson Engine 基盤
  C: Next.js 雛形構築, レイアウト

第2週 (P2 - Core Modules):
  A: CI/CD パイプライン構築
  B: レッスンAPI, 用語集API
  C: レッスンUI, 用語集UI

第3週 (P3 - Interactive):
  A: CloudFront CDN 設定
  B: クイズロジック, 進捗管理API
  C: クイズUI, ダッシュボードUI

第4週 (P4 - Launch):
  A: 監視(Monitoring), WAF, 本番デプロイ
  B: クエリ最適化, DBインデックス
  C: SEO対策, Lighthouseスコア改善
  Team: 総合テスト → LAUNCH 🚀
```

---

## ✅ 完了の定義 (Definition of Done - DoD)

各機能は以下の条件を満たした時点で「完了」とみなします。
1. 最低1名の他のメンバーによってコードレビュー（PR承認）が完了していること。
2. ローカルだけでなく、Staging環境（Amplify）で正常に動作すること。
3. モバイルとPCの両方でレイアウトが崩れないこと（Responsive）。
4. TypeScriptのエラーや致命的なESLintの警告がないこと。
5. 多言語対応（日/越/英）が適用されていること。

---

## 🔗 クイックリンク (Quick Links)

- **GitHub リポジトリ:** [bakaryuu1997-sys/Sensei-Hub](https://github.com/bakaryuu1997-sys/Sensei-Hub)
- **Staging URL:** *(デプロイ後に更新)*
- **Production URL:** *(ローンチ後に更新)*
