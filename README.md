# 🎓 Sensei Hub（センセイハブ）

> **母国語で IT を学ぶ** — IT エンジニア向けの 3 言語（English / 日本語 / Tiếng Việt）学習プラットフォーム。

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)](https://clerk.com/)
[![Prisma](https://img.shields.io/badge/Prisma-libSQL/SQLite-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## 概要

Sensei Hub は自習用ダッシュボードです。レッスンはディスク上の Markdown ファイル
として執筆され、ブラウザで表示されます。学習者はレッスン・モジュールごとの進捗を
3 言語のいずれかで記録できます。認証は **Clerk** に委譲し、進捗は Clerk のユーザー
ID を主キーとして **SQLite**（Prisma の libSQL アダプター）に保存します。さらに
localStorage にキャッシュするため、オフラインファーストで動作します。

### コース一覧（11 コース）

| コース | 日数 | レベル |
|--------|------|--------|
| Git & GitHub | 10 | 入門 |
| 基本情報技術者試験（FE） | 100 | 上級 |
| AWS | 60 | 中級 |
| Database Engineering | 30 | 上級 |
| Business Japanese Test（BJT） | 約120 | 中級 |
| DevOps Engineering | 60 | 中級 |
| System Design | 60 | 上級 |
| Data Structures & Algorithms | 60 | 中級 |
| Developer Mindset | 30 | 全レベル |
| Cybersecurity Awareness | 15 | 入門 |
| Blockchain & Web3 | 20 | 入門 |

各コースは `lessons/en`・`lessons/ja`・`lessons/vi` に存在します。

---

## 技術スタック

| 分野 | 技術 |
|------|------|
| フレームワーク | Next.js 16（App Router）、React 19 |
| 言語 | TypeScript 5.7 |
| スタイリング | Tailwind CSS v4、shadcn/ui（ダークテーマ） |
| 認証 | Clerk（`@clerk/nextjs`） |
| データベース | SQLite（Prisma 7 + `@prisma/adapter-libsql`） |
| コンテンツ | ディスク上の Markdown、`marked` で HTML 化、DOMPurify でサニタイズ、Mermaid 図 |
| UX | Framer Motion、three.js（装飾）、canvas-confetti、sonner、cmdk |
| PWA | Service Worker + manifest（インストール可能） |
| パッケージ管理 | pnpm |
| デプロイ | 単一の AWS EC2 インスタンス上の Docker |

詳細は [docs/TECH_STACK.md](./docs/TECH_STACK.md) を参照。

---

## リポジトリ構成

```
Sensei-Hub/
├── lessons/                  # Markdown コンテンツ: en/ ja/ vi/、コースごとに 1 フォルダ
├── sensei-hub-dashboard/     # Next.js アプリ
│   ├── app/                  # App Router のページ + API ルート
│   ├── components/           # UI コンポーネント（components/ui に shadcn/ui）
│   ├── lib/                  # i18n、教科データ、markdown/検索ヘルパー、prisma
│   ├── prisma/               # schema.prisma（SQLite）
│   ├── Dockerfile            # 本番イメージ
│   └── docker-entrypoint.sh  # prisma db push + next start
├── docker-compose.yml        # 単一 EC2 向けデプロイ
├── docs/                     # プロジェクトドキュメント
└── LICENSE                   # MIT
```

> `sensei-hub-android/`（別のネイティブシェル）は Web デプロイには含まれません。

---

## ローカル開発

前提: **Node.js 20 以上** と **pnpm**。

```bash
git clone https://github.com/bakaryuu1997-sys/Sensei-Hub.git
cd Sensei-Hub/sensei-hub-dashboard

pnpm install
cp .env.example .env          # Clerk のキーを記入
pnpm prisma db push           # SQLite スキーマを作成
pnpm dev                      # http://localhost:3000
```

必要な環境変数（[.env.example](./sensei-hub-dashboard/.env.example) 参照）:
`DATABASE_URL`、`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`、`CLERK_SECRET_KEY`、
`NEXT_PUBLIC_CLERK_SIGN_IN_URL`、`NEXT_PUBLIC_CLERK_SIGN_UP_URL`。

主なスクリプト: `pnpm build`、`pnpm start`、`pnpm lint`、`pnpm test:unit`、`pnpm test:e2e`。

---

## AWS EC2 へのデプロイ（Docker）

詳細な手順は [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) にあります。概要:

```bash
# EC2 ホスト上（Docker と compose プラグイン導入済み）
git clone https://github.com/bakaryuu1997-sys/Sensei-Hub.git
cd Sensei-Hub

# docker-compose.yml の隣に .env を作成し、Clerk のキーを記入:
#   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
#   CLERK_SECRET_KEY=sk_live_...
nano .env

docker compose up -d --build
```

アプリはポート 3000 で待ち受けます（80/443 は Nginx/ALB を前段に置く）。SQLite の
データベースは `web_data` ボリュームに保存され再デプロイでも残ります。レッスンは
`./lessons` から読み取り専用でマウントされます。`NEXT_PUBLIC_*` はビルド時に埋め
込まれるため、Clerk の publishable key を変更したら `docker compose up -d --build`
で再ビルドが必要です。

---

## ドキュメント

| ドキュメント | 目的 |
|-----|---------|
| [goal.md](./docs/goal.md) | ロードマップと残タスク一覧 |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | システム構成とデータフロー |
| [TECH_STACK.md](./docs/TECH_STACK.md) | 技術選定 |
| [DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md) | Prisma スキーマ |
| [LESSON_ENGINE.md](./docs/LESSON_ENGINE.md) | Markdown レッスンの配信方式 |
| [I18N_STRATEGY.md](./docs/I18N_STRATEGY.md) | 多言語対応 |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | EC2 + Docker デプロイ |

---

## ライセンス

[MIT License](./LICENSE) のもとで公開されています。

<div align="center">

**🎓 Sensei Hub** — IT エンジニアのために。

</div>
