# 👥 Sensei Hub — チーム役割分担

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20  
> **チーム規模**: 3名

---

## 1. 役割一覧

### ☁️ Member A — クラウドアーキテクト

| 項目 | 詳細 |
|------|------|
| **メイン担当** | AWS インフラ構築・運用 |
| **技術スタック** | AWS (RDS, S3, CloudFront, Amplify), Docker, CI/CD |
| **ブランチ** | `feat/infra-setup` |

#### 責任範囲

- **AWS インフラ設計・構築**
  - RDS PostgreSQL の構築・設定・バックアップ
  - S3 バケット作成・CORS設定・アクセスポリシー
  - CloudFront ディストリビューション設定
  - Amplify ホスティング・自動デプロイ設定
  - IAM ユーザー・ロール・ポリシー管理
- **ローカル開発環境**
  - Docker Compose 設定（PostgreSQL コンテナ）
  - 環境変数管理（`.env`, `.env.example`）
- **CI/CD パイプライン**
  - GitHub Actions ワークフロー設計
  - 自動テスト・自動デプロイ設定
- **セキュリティ**
  - Security Group 設定
  - SSL/TLS 証明書管理
  - 本番環境のセキュリティ監査

---

### ⚙️ Member B — バックエンドエンジニア

| 項目 | 詳細 |
|------|------|
| **メイン担当** | データベース・API・認証 |
| **技術スタック** | Prisma, PostgreSQL, Auth.js v5, Next.js Server Actions |
| **ブランチ** | `feat/backend-core` |

#### 責任範囲

- **データベース設計・管理**
  - Prisma スキーマ設計・更新（7モデル）
  - マイグレーション管理
  - シードデータ作成（語彙・クイズ問題）
  - インデックス最適化
- **認証システム**
  - Auth.js v5 統合（Credentials Provider）
  - セッション管理（JWT）
  - 権限管理（USER/ADMIN ロール）
  - パスワードハッシュ化（bcrypt）
- **API 開発**
  - Server Actions 実装（進捗更新、お気に入り切替）
  - API Routes 実装（語彙CRUD、クイズ出題・採点）
  - レスポンス形式の標準化
  - エラーハンドリング
- **コンテンツエンジン**
  - Markdown パーサー（frontmatter 解析）
  - レッスンファイルの動的読込

---

### 🎨 Member C — フロントエンドエンジニア

| 項目 | 詳細 |
|------|------|
| **メイン担当** | UI/UXデザイン・フロントエンド実装 |
| **技術スタック** | Next.js 16, React 19, Tailwind CSS v4, Framer Motion, shadcn/ui |
| **ブランチ** | `feat/frontend-ui` |

#### 責任範囲

- **UIコンポーネント開発**
  - ダッシュボードコンポーネント（19個） — ✅ 完了
  - 科目詳細コンポーネント（3個） — ✅ 完了
  - レッスンビューアコンポーネント — ⏳ 予定
  - 語彙辞典UI — ⏳ 予定
  - クイズUI — ⏳ 予定
  - 管理画面UI — ⏳ 予定
- **デザインシステム**
  - グラスモーフィズムテーマ設計
  - カラーパレット（OKLCHベース）
  - アニメーション設計（Framer Motion）
  - レスポンシブ対応
- **多言語対応**
  - i18nシステム実装（React Context） — ✅ 完了
  - 翻訳キー管理（~80キー × 3言語） — ✅ 完了
- **パフォーマンス最適化**
  - バンドルサイズ最適化
  - 画像最適化
  - Core Web Vitals 改善

---

## 2. コラボレーションガイドライン

### 2.1 ブランチルール

| ルール | 詳細 |
|-------|------|
| ブランチ命名 | `feat/<feature-name>`, `fix/<bug-name>`, `docs/<doc-name>` |
| コミットメッセージ | Conventional Commits 形式 |
| マージ方法 | Pull Request（最低1名のレビュー） |
| ベースブランチ | `develop`（機能ブランチのマージ先） |

### 2.2 コードレビュー

| 項目 | ルール |
|------|-------|
| レビュー担当 | 自分以外の最低1名 |
| レビュー期限 | 24時間以内 |
| 確認ポイント | 機能動作、コードスタイル、型安全性、テスト有無 |

### 2.3 コミュニケーション

| ツール | 用途 |
|-------|------|
| GitHub Issues | タスク管理・バグ報告 |
| GitHub Pull Requests | コードレビュー |
| Slack / Discord | 日常コミュニケーション |
| Weekly Meeting | 進捗確認・課題共有 |

---

## 📎 関連ドキュメント

- [MASTER_PHASE_TASKS.md](./MASTER_PHASE_TASKS.md) — タスクマトリックス
- [ROADMAP.md](./ROADMAP.md) — ロードマップ
