# 🎓 Sensei Hub（センセイハブ）

> **「母国語でIT・AWS・基本情報をマスターする」**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## 🌟 プロジェクト概要

**Sensei Hub** は、日本で働くITエンジニア（特にベトナム人・外国人エンジニア）向けの、実践的でモダンなトリリンガル学習プラットフォームです。

- 🌐 **3言語対応**: 英語（EN）・日本語（JA）・ベトナム語（VI）で並行して学習可能
- 📚 **11の専門コース**: AWS、基本情報、System Design、DSA、Database、DevOps、BJT、Blockchain、サイバーセキュリティ、Git & GitHub、Developer Mindset
- 🎮 **ゲーミフィケーション**: XP、ストリーク、レベルシステム、リーダーボード、デイリーチャレンジ
- 🎨 **プレミアムUI**: ダークテーマ、グラスモーフィズム、メッシュグラデーション、Framer Motionアニメーション

---

## 📚 コースカリキュラム一覧

| # | コース名 | 日数 | レベル | 構造 |
|---|---------|------|--------|------|
| 1 | ☁️ AWS Cloud Engineering | 60日 | 中級 | フラットフォルダ |
| 2 | ⛓️ Blockchain & Web3 Fundamentals | 20日 | 入門 | フラットファイル |
| 3 | 🗣️ Business Japanese Test（BJT） | 120日 | 中級 | フラットフォルダ（3桁） |
| 4 | 🛡️ Cybersecurity Awareness | 15日 | 入門 | フラットファイル |
| 5 | 🧮 Data Structures & Algorithms | 60日 | 中級 | フラットフォルダ |
| 6 | 🗄️ Database Engineering | 30日 | 上級 | フラットフォルダ |
| 7 | 🧠 Developer Mindset | 30日 | 全レベル | フェーズ制（3フェーズ） |
| 8 | 🔧 DevOps Engineering | 60日 | 中級 | フラットフォルダ |
| 9 | 📋 基本情報技術者試験（FE） | 100日 | 上級 | フェーズ制（13フェーズ） |
| 10 | 🐙 Git & GitHub | 10日 | 入門 | フラットファイル |
| 11 | 🏗️ System Design & Architecture | 60日 | 上級 | フェーズ制（4フェーズ） |

> **合計: 11コース × 3言語 = 約1,560以上のレッスンファイル**

---

## 🛠 テックスタック

| カテゴリ | テクノロジー | バージョン |
|---------|------------|-----------|
| フレームワーク | Next.js (App Router) | 16.2.6 |
| UIライブラリ | React | 19 |
| 言語 | TypeScript | 5.7.3 |
| スタイリング | Tailwind CSS | 4.2.0 |
| UIコンポーネント | shadcn/ui (new-york) | 57コンポーネント |
| アニメーション | Framer Motion | 12.38.0 |
| アイコン | Lucide React | 0.564.0 |
| チャート | Recharts | 2.15.0 |
| フォーム | React Hook Form + Zod | 7.54.1 / 3.24.1 |
| データベース | PostgreSQL + Prisma ORM | — |
| テーマ | next-themes | 0.4.6 |
| アナリティクス | @vercel/analytics | 1.6.1 |
| パッケージマネージャ | pnpm | — |
| フォント | Inter + JetBrains Mono | Google Fonts |

---

## 📁 プロジェクト構成

```
Sensei-Hub/
├── 📚 lessons/                     # レッスンコンテンツ（Markdown）
│   ├── en/                         # 英語（11コース）
│   ├── ja/                         # 日本語（11コース）
│   └── vi/                         # ベトナム語（11コース）
├── 🖥️ sensei-hub-dashboard/        # Next.js 16 ダッシュボードアプリ
│   ├── app/                        # App Router（ページ・レイアウト）
│   ├── components/                 # UIコンポーネント（79個）
│   ├── lib/                        # ユーティリティ・i18n・データ
│   ├── prisma/                     # データベーススキーマ
│   └── public/                     # 静的アセット
├── 📖 docs/                        # プロジェクトドキュメント
│   ├── design/                     # デザイン仕様
│   ├── specs/                      # ソフトウェア要件仕様書
│   └── assets/                     # モックアップ画像
├── 🐳 docker-compose.yml           # ローカル開発用Docker設定
└── 📄 README.md                    # このファイル
```

---

## 🚀 開発の始め方

### 前提条件

- **Node.js** 20以上
- **pnpm** パッケージマネージャ
- **Docker**（PostgreSQL用）

### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone https://github.com/bakaryuu1997-sys/Sensei-Hub.git
cd Sensei-Hub

# 2. PostgreSQL起動（Docker Compose）
docker-compose up -d

# 3. ダッシュボードアプリのセットアップ
cd sensei-hub-dashboard
pnpm install

# 4. 環境変数の設定
cp .env.example .env
# .envファイルを編集してDATABASE_URLを設定

# 5. データベースマイグレーション
pnpm prisma migrate dev

# 6. 開発サーバー起動
pnpm dev
```

ブラウザで `http://localhost:3000` を開いてダッシュボードにアクセスできます。

---

## 📖 ドキュメント一覧

### コアドキュメント

| ドキュメント | 説明 |
|------------|------|
| [INDEX.md](./docs/INDEX.md) | 📋 マスターインデックス — ドキュメント全体の目次 |
| [BRIEF.md](./docs/BRIEF.md) | 📝 プロジェクト概要書 |
| [TECH_STACK.md](./docs/TECH_STACK.md) | 🛠 テックスタック詳細 |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 🏛 システムアーキテクチャ |
| [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) | 📁 プロジェクト構成詳細 |

### 技術ドキュメント

| ドキュメント | 説明 |
|------------|------|
| [DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md) | 🗄 データベース設計（Prismaスキーマ） |
| [API_SPECS.md](./docs/API_SPECS.md) | 🔌 API仕様書 |
| [LESSON_ENGINE.md](./docs/LESSON_ENGINE.md) | 📝 レッスンエンジン設計 |
| [I18N_STRATEGY.md](./docs/I18N_STRATEGY.md) | 🌐 国際化戦略 |

### デザインドキュメント

| ドキュメント | 説明 |
|------------|------|
| [UI_UX_SPEC.md](./docs/UI_UX_SPEC.md) | 🎨 UI/UX仕様書 |
| [MOCKUPS.md](./docs/MOCKUPS.md) | 🖼 モックアップ集 |
| [design/UI_KIT_JA.md](./docs/design/UI_KIT_JA.md) | 🎨 UIキット |
| [design/SCREEN_FLOW.md](./docs/design/SCREEN_FLOW.md) | 🔄 画面フロー |
| [design/DATABASE_SCHEMA.md](./docs/design/DATABASE_SCHEMA.md) | 📊 ERD図 |

### プロジェクト管理

| ドキュメント | 説明 |
|------------|------|
| [ROADMAP.md](./docs/ROADMAP.md) | 🗺 ロードマップ |
| [MASTER_PHASE_TASKS.md](./docs/MASTER_PHASE_TASKS.md) | 📊 フェーズ別タスクマトリックス |
| [DETAILED_BACKLOG.md](./docs/DETAILED_BACKLOG.md) | ✅ 詳細バックログ |
| [FEATURES_DETAIL.md](./docs/FEATURES_DETAIL.md) | ⚙️ 機能要件詳細 |
| [TEAM_ROLES.md](./docs/TEAM_ROLES.md) | 👥 チーム役割分担 |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | 🚀 デプロイメントガイド |
| [BRSE_INPUT_CHECKLIST.md](./docs/BRSE_INPUT_CHECKLIST.md) | ✅ BrSEインプットチェックリスト |
| [specs/SRS_SENSEI_HUB.md](./docs/specs/SRS_SENSEI_HUB.md) | 📋 ソフトウェア要件仕様書 |

---

## 🤝 コントリビューション

1. フィーチャーブランチを作成: `git checkout -b feat/your-feature`
2. 変更をコミット: `git commit -m 'feat: add new feature'`
3. ブランチをプッシュ: `git push origin feat/your-feature`
4. プルリクエストを作成

### ブランチ戦略

| ブランチ | 用途 |
|---------|------|
| `main` | 本番環境 |
| `develop` | 開発統合 |
| `feat/infra-setup` | インフラ構築 |
| `feat/backend-core` | バックエンド開発 |
| `feat/frontend-ui` | フロントエンド開発 |

### コミット規約

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイルの変更
refactor: リファクタリング
test: テストの追加・修正
chore: ビルド・設定の変更
```

---

## 📄 ライセンス

このプロジェクトは [MIT License](./LICENSE) の下で公開されています。

---

<div align="center">

**🎓 Sensei Hub** — *Master IT in Your Native Language*

Built with ❤️ for IT Engineers in Japan

</div>
