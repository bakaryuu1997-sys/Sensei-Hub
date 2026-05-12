# 📂 プロジェクト構造と規約 (Project Structure & Conventions)

Sensei Hub (Next.js 15) におけるディレクトリ構成および命名規則を定義します。

## 1. ディレクトリ構造 (Directory Structure)

本プロジェクトはフラットなレッスン構造を持つMonorepo構成です。

```bash
├── apps/
│   └── web/                # Next.js メインアプリケーション
│       ├── src/
│       │   ├── app/        # App Router (Pages & Layouts)
│       │   ├── components/ # UI Components (shadcn/ui等)
│       │   ├── lib/        # 共通ユーティリティ (Prisma client等)
│       │   ├── services/   # ビジネスロジック/APIラッパー
│       │   └── messages/   # 多言語対応用JSON (ja.json, vi.json, en.json)
│       ├── public/         # 静的アセット (画像など)
│       └── next.config.js
├── prisma/
│   └── schema.prisma       # データベーススキーマ定義
├── lessons/                # 学習コンテンツ (Markdownファイル)
│   ├── ja/                 # 日本語ファイル
│   │   ├── java-basic-01.md
│   │   └── aws-cloud-01.md
│   ├── vi/                 # ベトナム語ファイル
│   └── en/                 # 英語ファイル
├── docs/                   # プロジェクトドキュメント
└── package.json
```

## 2. 命名規則 (Naming Conventions)

- **Components（コンポーネント）:** PascalCase (例: `LessonCard.tsx`).
- **Pages/Routes（ページ/ルーティング）:** kebab-case (例: `lessons/java-basic-01/page.tsx`).
- **Functions/Variables（関数/変数）:** camelCase (例: `getLessonById`).
- **Database Tables（DBテーブル）:** PascalCase (Prismaの規約に従う).
- **Lesson Files（レッスンファイル）:** kebab-caseのフラット構造 (例: `java-basic-01.md`).

## 3. Git ワークフロー (Git Workflow)

- **メインブランチ:** `main` (本番環境 / Production), `develop` (開発環境 / Staging).
- **機能開発ブランチ:** `feature/[機能名]` (例: `feature/i18n-setup`).
- **バグ修正ブランチ:** `fix/[バグ名]` (例: `fix/mobile-navbar`).

詳細は [MASTER_PHASE_TASKS.md](./MASTER_PHASE_TASKS.md) の「2. チーム開発のための GitHub ワークフロー」を参照してください。

## 4. コーディング標準 (Coding Standards)

- **TypeScript** を 100% 使用し、`any` 型の乱用を避ける。
- スタイリングには **Tailwind CSS** を使用する。
- **ESLint** および **Prettier** を用いてコードフォーマットを自動化し、品質を保つ。
