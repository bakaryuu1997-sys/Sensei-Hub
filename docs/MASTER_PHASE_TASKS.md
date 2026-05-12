# 🗺️ マスタープロジェクトロードマップとタスクマトリックス (Master Project Roadmap & Task Matrix)

Sensei Hubプロジェクト（3名チーム）の全体ロードマップ、詳細なタスク分担、およびGitHubワークフローを定義します。

---

## 📊 1. フェーズ概要 (Phase Breakdown)

| フェーズ | タイトル | 期間 | 主な目標 |
|---|---|---|---|
| **P1** | **基盤構築 (Foundation & Setup)** | 第1週 | AWSインフラ、認証(Auth)、コアなLessonエンジンの構築。 |
| **P2** | **コア機能 (Core Modules - MVP)** | 第2週 | 学習モジュールとIT用語集モジュールの完成。 |
| **P3** | **インタラクティブ機能 (Interactive)** | 第3週 | クイズシステム、学習進捗管理、ブックマーク機能。 |
| **P4** | **最適化とローンチ (Launch)** | 第4週 | SEO、分析、バグ修正、本番環境(Production)へのデプロイ。 |

---

## 🔀 2. チーム開発のための GitHub ワークフロー (GitHub Workflow for 3 Members)

3名で並行して開発を行うため、コンフリクト（競合）を避け、コードの品質を保つためのルールです。

### 2.1. ブランチ戦略 (Branching Strategy)
- `main`: 本番環境（Production）。常にデプロイ可能で安定していること。
- `develop`: 開発環境（Staging）。各機能が統合されるメインの作業ブランチ。
- `feature/xxx`: 新機能開発用。（例: `feature/lesson-api`, `feature/login-ui`）
- `fix/xxx`: バグ修正用。（例: `fix/header-responsive`）

### 2.2. 開発の流れ (Development Flow)
1. **ブランチ作成:** 各メンバーは作業を始める前に `develop` ブランチから最新のコードを取得し、自分の機能ブランチを作成します。
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
2. **コミットとプッシュ:** 作業が完了したらコミットし、リモートリポジトリにプッシュします。
   ```bash
   git add .
   git commit -m "feat: xxxを実装"
   git push origin feature/your-feature-name
   ```
3. **Pull Request (PR) の作成:** GitHub上で `feature/xxx` から `develop` に向けて PR を作成します。
4. **コードレビュー:** **必ず他の1名以上のメンバー**がコードをレビューし、Approve（承認）してからマージします。
5. **マージ:** レビュー完了後、`develop` ブランチにマージします。

### 2.3. 担当領域の競合回避
- **Member A (AWS/Infra):** 主に `amplify.yml`、インフラ設定ファイル、CI/CD周りを触ります。
- **Member B (Backend):** 主に `prisma/schema.prisma`、`app/api/`、`lib/` などのサーバーサイドロジックを触ります。
- **Member C (Frontend):** 主に `app/(pages)/`、`components/` などのUIコンポーネントを触ります。
- *※同じファイルを編集する場合は、事前にコミュニケーションを取るか、共通のUIコンポーネントはMember Cが先に雛形を作ってからBがロジックを組み込むようにします。*

---

## 🛠️ 3. 詳細タスクマトリックス (Detailed Task Matrix)

### 🟢 P1: 基盤構築 (Foundation - 第1週)
| タスクID | 担当 | タスク内容 (Work Description) | 成果物 (Deliverable) |
|:---:|---|---|---|
| **P1-A1** | **A (AWS)** | IAM、Amplify、RDS Postgres、S3 Publicのセットアップ。 | インフラ基盤の完成。 |
| **P1-A2** | **A (AWS)** | Auth.js (V5) を用いたCredentials & Google認証の実装。 | ログイン/登録機能。 |
| **P1-B1** | **B (Back)** | Prisma Schemaの設計（User, LessonProgress等）、DBマイグレーション。 | DBスキーマ定義。 |
| **P1-B2** | **B (Back)** | `lessons/` フォルダのMarkdownパーサーと読み込みロジックの実装。 | Lessonコアエンジン。 |
| **P1-C1** | **C (Front)** | Next.js 15初期化、Tailwind、Shadcn/UIのセットアップ。 | プロジェクト雛形。 |
| **P1-C2** | **C (Front)** | メインレイアウト（Sidebar、Header、レスポンシブ対応）の構築。 | UIシェル（外枠）。 |

### 🔵 P2: コア機能 (Core Modules - 第2週)
| タスクID | 担当 | タスク内容 (Work Description) | 成果物 (Deliverable) |
|:---:|---|---|---|
| **P2-A1** | **A (AWS)** | Amplify CI/CDパイプライン（Staging/Prod環境）の構築。 | 自動デプロイ環境。 |
| **P2-B1** | **B (Back)** | レッスン一覧取得API、レッスン詳細取得（MDX変換含む）APIの実装。 | レッスン用API。 |
| **P2-B2** | **B (Back)** | IT用語集の検索、カテゴリ絞り込み、詳細取得APIの実装。 | 用語集用API。 |
| **P2-C1** | **C (Front)** | レッスン一覧画面 ＆ 詳細画面（Markdown描画）のUI実装。 | レッスンUIモジュール。 |
| **P2-C2** | **C (Front)** | 検索バー付きIT用語集画面（リスト表示）のUI実装。 | 用語集UIモジュール。 |

### 🟡 P3: インタラクティブ機能 (Interactive - 第3週)
| タスクID | 担当 | タスク内容 (Work Description) | 成果物 (Deliverable) |
|:---:|---|---|---|
| **P3-A1** | **A (AWS)** | S3画像配信用のCloudFront（CDN）設定。 | 高速なアセット配信。 |
| **P3-B1** | **B (Back)** | クイズの出題、採点、履歴保存のAPIとロジック実装。 | クイズロジック＆API。 |
| **P3-B2** | **B (Back)** | 用語のお気に入り登録 ＆ 学習進捗（既読）保存APIの実装。 | ユーザーデータAPI。 |
| **P3-C1** | **C (Front)** | クイズ画面（ステップバイステップ進行）と結果表示のUI実装。 | クイズUIモジュール。 |
| **P3-C2** | **C (Front)** | ユーザーダッシュボード（学習進捗、お気に入り用語一覧）のUI実装。 | ダッシュボードUI。 |

### 🔴 P4: 最適化とローンチ (Finalizing - 第4週)
| タスクID | 担当 | タスク内容 (Work Description) | 成果物 (Deliverable) |
|:---:|---|---|---|
| **P4-A1** | **A (AWS)** | CloudWatch監視設定、WAF（セキュリティ）の導入。 | 安全な本番環境。 |
| **P4-B1** | **B (Back)** | SQLクエリ最適化、検索用インデックスの追加。 | 高パフォーマンスAPI。 |
| **P4-C1** | **C (Front)** | SEO最適化、OpenGraph画像設定、Lighthouseスコア改善。 | SEO対応完了。 |
| **P4-ALL** | **Team** | 統合テスト（Integration Testing）、バグ修正、本番リリース！ | **サービス公開 (Launch) 🚀** |

---
*最終更新日: 2026-05-12*
