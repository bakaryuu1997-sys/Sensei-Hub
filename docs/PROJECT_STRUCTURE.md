# 📁 Sensei Hub — プロジェクト構成詳細

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20

---

## 1. ルートディレクトリ構成

```
Sensei-Hub/
├── 📚 lessons/                          # レッスンコンテンツ（Markdown）
│   ├── en/                              # 英語版（11コース）
│   ├── ja/                              # 日本語版（11コース）
│   └── vi/                              # ベトナム語版（11コース）
│
├── 🖥️ sensei-hub-dashboard/             # Next.js 16 ダッシュボードアプリ
│   ├── app/                             # App Router（ページ・レイアウト）
│   │   ├── globals.css                  # グローバルCSS（テーマ・アニメーション）
│   │   ├── layout.tsx                   # ルートレイアウト（Provider・フォント）
│   │   ├── page.tsx                     # / — メインダッシュボード
│   │   └── subject/
│   │       └── [slug]/
│   │           └── page.tsx             # /subject/:slug — 科目詳細
│   │
│   ├── components/                      # UIコンポーネント（合計79個）
│   │   ├── dashboard/                   # ダッシュボード専用（19個）
│   │   │   ├── card-3d.tsx              # 3Dパースペクティブカード
│   │   │   ├── daily-challenge.tsx      # デイリーチャレンジ
│   │   │   ├── featured-courses.tsx     # おすすめコース
│   │   │   ├── glass-card.tsx           # グラスモーフィズムカード
│   │   │   ├── hero-banner.tsx          # ヒーローバナー
│   │   │   ├── language-switcher.tsx    # 言語切替（EN/JA/VI）
│   │   │   ├── leaderboard.tsx          # リーダーボード
│   │   │   ├── lesson-card.tsx          # レッスンカード
│   │   │   ├── progress-ring-3d.tsx     # 3Dプログレスリング
│   │   │   ├── progress-ring.tsx        # プログレスリング
│   │   │   ├── quick-actions.tsx        # クイックアクション
│   │   │   ├── recent-activity.tsx      # 最近のアクティビティ
│   │   │   ├── sidebar.tsx              # サイドバー
│   │   │   ├── stats-card.tsx           # 統計カード
│   │   │   ├── stats-row.tsx            # 統計行
│   │   │   ├── streak-heatmap.tsx       # ストリーク熱マップ
│   │   │   ├── subject-card.tsx         # 科目カード
│   │   │   ├── subjects-grid.tsx        # 科目グリッド
│   │   │   └── top-bar.tsx              # トップバー
│   │   │
│   │   ├── subject/                     # 科目詳細ページ専用（3個）
│   │   │   ├── modules-list.tsx         # モジュール一覧
│   │   │   ├── subject-header.tsx       # 科目ヘッダー
│   │   │   └── subject-stats.tsx        # 科目統計
│   │   │
│   │   ├── theme-provider.tsx           # next-themes テーマプロバイダー
│   │   │
│   │   └── ui/                          # shadcn/ui コンポーネント（57個）
│   │       ├── accordion.tsx
│   │       ├── alert.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── ... (57個のUIコンポーネント)
│   │       └── tooltip.tsx
│   │
│   ├── hooks/                           # カスタムHooks
│   │   ├── use-mobile.ts                # モバイル判定Hook
│   │   └── use-toast.ts                 # トースト通知Hook
│   │
│   ├── lib/                             # ユーティリティ・データ
│   │   ├── i18n.tsx                     # 多言語システム（Context + 翻訳）
│   │   ├── prisma.ts                    # Prismaクライアントシングルトン
│   │   ├── subjects.ts                  # 科目データ定義（8科目）
│   │   └── utils.ts                     # cn() ユーティリティ
│   │
│   ├── prisma/                          # データベーススキーマ
│   │   └── schema.prisma                # Prismaスキーマ定義（7モデル）
│   │
│   ├── public/                          # 静的アセット
│   │   ├── images/                      # コース画像
│   │   │   ├── course-aws.jpg
│   │   │   ├── course-frontend.jpg
│   │   │   ├── course-system.jpg
│   │   │   ├── hero-banner.jpg
│   │   │   └── sensei-mascot.jpg
│   │   ├── apple-icon.png               # Appleアイコン
│   │   ├── icon-dark-32x32.png          # ダークモードアイコン
│   │   ├── icon-light-32x32.png         # ライトモードアイコン
│   │   └── icon.svg                     # SVGアイコン
│   │
│   ├── styles/                          # 追加スタイル
│   │   └── globals.css                  # グローバルスタイル拡張
│   │
│   ├── .env                             # 環境変数（ローカル用）
│   ├── .gitignore                       # Git除外設定
│   ├── components.json                  # shadcn/ui設定
│   ├── next.config.mjs                  # Next.js設定
│   ├── package.json                     # 依存関係
│   ├── pnpm-lock.yaml                   # pnpmロックファイル
│   ├── postcss.config.mjs               # PostCSS設定
│   └── tsconfig.json                    # TypeScript設定
│
├── 📖 docs/                             # プロジェクトドキュメント
│   ├── INDEX.md                         # マスターインデックス
│   ├── BRIEF.md                         # プロジェクト概要
│   ├── TECH_STACK.md                    # テックスタック
│   ├── ARCHITECTURE.md                  # システムアーキテクチャ
│   ├── PROJECT_STRUCTURE.md             # プロジェクト構成（本ファイル）
│   ├── DATABASE_DESIGN.md               # データベース設計
│   ├── API_SPECS.md                     # API仕様書
│   ├── LESSON_ENGINE.md                 # レッスンエンジン
│   ├── I18N_STRATEGY.md                 # 国際化戦略
│   ├── UI_UX_SPEC.md                    # UI/UX仕様
│   ├── MOCKUPS.md                       # モックアップ
│   ├── FEATURES_DETAIL.md               # 機能要件
│   ├── ROADMAP.md                       # ロードマップ
│   ├── MASTER_PHASE_TASKS.md            # タスクマトリックス
│   ├── DETAILED_BACKLOG.md              # 詳細バックログ
│   ├── TEAM_ROLES.md                    # チーム役割
│   ├── DEPLOYMENT.md                    # デプロイガイド
│   ├── BRSE_INPUT_CHECKLIST.md          # BrSEチェックリスト
│   ├── design/                          # デザイン仕様
│   │   ├── DATABASE_SCHEMA.md           # ERD図
│   │   ├── SCREEN_FLOW.md               # 画面遷移図
│   │   ├── SCREEN_FLOW_JA.md            # 画面遷移図（詳細）
│   │   └── UI_KIT_JA.md                 # UIキット
│   ├── specs/                           # 仕様書
│   │   └── SRS_SENSEI_HUB.md            # SRS
│   └── assets/                          # モックアップ画像
│       ├── *.png                        # 各種モックアップ
│       └── mockups/                     # 追加モックアップ
│
├── 🐳 docker-compose.yml               # Docker Compose設定
└── 📄 README.md                         # プロジェクトREADME
```

---

## 2. レッスンコンテンツ構成

```
lessons/
├── en/                                  # 英語版
│   ├── aws/                             # 60日間（day-01〜day-60/content.md）
│   ├── blockchain-and-web3-fundamentals/ # 20日間（day-01.md〜day-20.md）
│   ├── business-japanese-test/          # 120日間（day-001〜day-120/lesson.md）
│   ├── cybersecurity-awareness/         # 15日間（day-01.md〜day-15.md）
│   ├── data-structures-and-algorithms/  # 60日間（day-01〜day-60/content.md）
│   ├── database-engineering/            # 30日間（day-01〜day-30/content.md）
│   ├── developer-mindset/               # 30日間（phase-01〜03/day-XX/lesson.md）
│   ├── devops-engineering/              # 60日間（day-01〜day-60/content.md）
│   ├── fundamental-it-engineer/         # 100日間（phase-01〜13/day-XX/lesson.md）
│   ├── git-and-github/                  # 10日間（day-01.md〜day-10.md）
│   └── system-design/                   # 60日間（phase-01〜04/day-XX/lesson.md）
├── ja/                                  # 日本語版（同一構成）
└── vi/                                  # ベトナム語版（同一構成）
```

---

## 3. 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネントファイル | kebab-case | `subject-card.tsx`, `hero-banner.tsx` |
| コンポーネント名 | PascalCase | `SubjectCard`, `HeroBanner` |
| フォルダ名 | kebab-case | `dashboard/`, `subject/` |
| ルート（App Router） | kebab-case | `/subject/[slug]` |
| 関数名 | camelCase | `getSubjectBySlug()`, `useLanguage()` |
| 定数 | SCREAMING_SNAKE_CASE | `DATABASE_URL` |
| 型/インターフェース | PascalCase | `Subject`, `Module`, `Translation` |
| CSSクラス | Tailwind CSS ユーティリティ | `bg-white/5 backdrop-blur-xl` |
| レッスンフォルダ | kebab-case | `aws/`, `system-design/` |
| レッスンデイフォルダ | `day-XX` | `day-01/`, `day-15/` |
| フェーズフォルダ | `phase-XX-name` | `phase-01-foundations/` |

---

## 4. コーディング規約

### 4.1 TypeScript

```typescript
// ✅ 厳格モード有効 (strict: true)
// ✅ パスエイリアス: @/* → ./*
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

// ✅ 型定義の明示
interface Subject {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  // ...
}
```

### 4.2 コンポーネントパターン

```typescript
// ✅ クライアントコンポーネントには "use client" を明示
"use client";

// ✅ i18n Hook の使用
const { t, language } = useLanguage();

// ✅ cn() ユーティリティでクラスを結合
<div className={cn("base-class", isActive && "active-class")} />

// ✅ Framer Motion のアニメーション
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
/>
```

### 4.3 Git コミット規約

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイルの変更（機能への影響なし）
refactor: リファクタリング
test: テストの追加・修正
chore: ビルド・設定の変更
perf: パフォーマンス改善
```

---

## 📎 関連ドキュメント

- [ARCHITECTURE.md](./ARCHITECTURE.md) — システムアーキテクチャ
- [TECH_STACK.md](./TECH_STACK.md) — テックスタック
- [LESSON_ENGINE.md](./LESSON_ENGINE.md) — レッスンエンジン設計
