# 🎓 Sensei Hub (Sensei Hub)

> **"Master IT, AWS & Kihon Jouhou in Your Native Language"**

Sensei Hubは、日本で働くITエンジニア向けの、実践的でモダンな学習プラットフォームです。FE (Kihon Jouhou), AWS, System Design, DSA, Database, DevOps, BJT và Mindset を効率的に習得できるよう設計されています。

---

## 🌟 プロジェクトの目的

- **言語の壁をなくす:** ITの専門用語を日本語、ベトナム語、英語で並行して学べる環境を提供します。
- **実践的なスキルの習得:** 理論だけでなく、AWS, System Design, DevOps や実務に役立つ Mindset のレッスンを提供します.
- **チーム開発の基盤構築:** 3名体制でのアジャイル開発を前提とした、最新技術スタック（Next.js 15, Prisma, AWS）による強固なアーキテクチャ。

---

## 🛠 テックスタック (Tech Stack)

このプロジェクトは、高いパフォーマンスと開発スピードを両立するために以下の技術を使用しています：

- **Frontend & Backend:** Next.js 15 (App Router, Server Actions)
- **Database:** PostgreSQL (AWS RDS) + Prisma ORM
- **Styling:** Tailwind CSS + Shadcn/UI
- **Infrastructure:** AWS Amplify, AWS S3
- **Content:** MDX (Markdown)
- **Authentication:** Auth.js v5

詳細については、[Tech Stack](./docs/TECH_STACK.md) を参照してください。

---

## 📚 ドキュメント一覧

開発チーム向けの全ドキュメントは `docs/` フォルダにまとめられています。まずは以下の順序で確認してください。

1. 🧭 **[マスターインデックス (INDEX.md)](./docs/INDEX.md)** — プロジェクト全体の羅針盤
2. 🗺️ **[フェーズ別タスクマトリックス (MASTER_PHASE_TASKS.md)](./docs/MASTER_PHASE_TASKS.md)** — 誰がいつ何をするか
3. 👥 **[チームの役割 (TEAM_ROLES.md)](./docs/TEAM_ROLES.md)** — 3名の分担詳細
4. 🗄️ **[データベース設計 (DATABASE_DESIGN.md)](./docs/DATABASE_DESIGN.md)** — Prisma Schema
5. 🖼️ **[UIモックアップ (MOCKUPS.md)](./docs/MOCKUPS.md)** — デザイン仕様

---

## 🚀 開発の始め方 (Getting Started)


### 1. リポジトリのクローンとインストール
```bash
git clone https://github.com/bakaryuu1997-sys/Sensei-Hub.git
cd SenseiHub
pnpm install
```

### 2. 環境変数の設定
`.env.example` をコピーして `.env.local` を作成し、AWSの認証情報やDatabase URLを設定します。

### 3. データベースのセットアップ
```bash
npx prisma generate
npx prisma db push
```

### 4. 開発サーバーの起動
```bash
pnpm dev
```
ブラウザで `http://localhost:3000` にアクセスしてください。

---

## 🤝 GitHub ワークフロー & チーム分担

プロジェクトを円滑に進めるため、以下のブランチ戦略と役割分担を徹底してください。
... (I will use the actual content from the file)
