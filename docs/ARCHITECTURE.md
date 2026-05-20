# 🏛 Sensei Hub — システムアーキテクチャ

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20

---

## 1. システム全体図

```mermaid
graph TB
    subgraph Client["🌐 クライアント層"]
        Browser["ウェブブラウザ<br/>(Chrome/Firefox/Safari)"]
    end

    subgraph Frontend["🖥 フロントエンド層 — sensei-hub-dashboard"]
        Layout["Root Layout<br/>layout.tsx"]
        LP["LanguageProvider<br/>(React Context)"]
        
        subgraph Pages["📄 ページ"]
            Dashboard["/ — ダッシュボード<br/>page.tsx"]
            Subject["/subject/[slug]<br/>科目詳細ページ"]
        end

        subgraph Comp["🧩 コンポーネント"]
            SB["Sidebar<br/>(ナビゲーション)"]
            TB["TopBar<br/>(検索・言語・通知)"]
            DC["Dashboard Components<br/>(19個)"]
            SC["Subject Components<br/>(3個)"]
            UI["shadcn/ui<br/>(57個)"]
        end
    end

    subgraph Backend["⚙️ バックエンド層"]
        SA["Server Actions<br/>(Next.js 16)"]
        Auth["Auth.js v5<br/>(認証)"]
        Prisma["Prisma ORM<br/>(クエリビルダー)"]
    end

    subgraph Data["💾 データ層"]
        PG["PostgreSQL<br/>(RDS)"]
        MD["Markdown Files<br/>(lessons/)"]
    end

    subgraph Infra["☁️ AWS インフラ"]
        Amplify["AWS Amplify<br/>(ホスティング)"]
        S3["AWS S3<br/>(静的アセット)"]
        CF["CloudFront<br/>(CDN)"]
        RDS["AWS RDS<br/>(PostgreSQL)"]
    end

    Browser --> Layout
    Layout --> LP
    LP --> Pages
    Pages --> Comp
    Dashboard --> DC
    Subject --> SC
    DC --> UI
    SC --> UI

    Pages --> SA
    SA --> Auth
    SA --> Prisma
    Prisma --> PG
    Pages -.->|Markdown読込| MD

    Layout -.->|デプロイ| Amplify
    MD -.->|静的保存| S3
    S3 --> CF
    PG -.->|マネージド| RDS
```

---

## 2. App Router ルーティング構造

```
sensei-hub-dashboard/app/
├── layout.tsx          # ルートレイアウト（フォント・Provider・メタデータ）
├── globals.css         # グローバルCSS（テーマ変数・メッシュグラデーション）
├── page.tsx            # / — メインダッシュボード
└── subject/
    └── [slug]/
        └── page.tsx    # /subject/:slug — 科目詳細ページ
```

### ルーティングテーブル

| パス | コンポーネント | 説明 | レンダリング |
|------|-------------|------|------------|
| `/` | `app/page.tsx` | メインダッシュボード：挨拶、ヒーローバナー、統計行、科目グリッド | Client |
| `/subject/[slug]` | `app/subject/[slug]/page.tsx` | 科目詳細：ヘッダー、統計、モジュールリスト | Client |

### 有効なスラッグ一覧

`aws`, `bjt`, `database`, `devops`, `dsa`, `fe`, `mindset`, `system-design`

---

## 3. コンポーネントアーキテクチャ

```mermaid
graph TD
    subgraph Layout["📐 レイアウト層"]
        Sidebar["Sidebar<br/>固定左サイドバー<br/>(lg:w-72)"]
        TopBar["TopBar<br/>固定上部バー<br/>(検索・ストリーク・言語・通知)"]
    end

    subgraph DashboardPage["📊 ダッシュボードページ (19コンポーネント)"]
        HB["HeroBanner<br/>マスコット画像+CTA"]
        SR["StatsRow<br/>4つの統計カード"]
        SG["SubjectsGrid<br/>4列の科目カード"]
        DCh["DailyChallenge<br/>デイリーチャレンジ"]
        LB["Leaderboard<br/>リーダーボード"]
        SH["StreakHeatmap<br/>ストリーク熱マップ"]
        FC["FeaturedCourses<br/>おすすめコース"]
        QA["QuickActions<br/>クイックアクション"]
        RA["RecentActivity<br/>最近のアクティビティ"]
    end

    subgraph SubjectPage["📖 科目詳細ページ (3コンポーネント)"]
        SHd["SubjectHeader<br/>パンくず+ヒーローカード"]
        SS["SubjectStats<br/>4つの指標カード"]
        ML["ModulesList<br/>モジュール一覧"]
    end

    subgraph SharedUI["🧩 共有UI (57 shadcn/ui)"]
        Card["Card"]
        Button["Button"]
        Badge["Badge"]
        Dialog["Dialog"]
        More["...57個"]
    end

    subgraph Utilities["🔧 ユーティリティ"]
        i18n["useLanguage()<br/>多言語Hook"]
        Theme["ThemeProvider<br/>テーマ管理"]
        CN["cn()<br/>クラス結合"]
    end

    Layout --> DashboardPage
    Layout --> SubjectPage
    DashboardPage --> SharedUI
    SubjectPage --> SharedUI
    DashboardPage --> Utilities
    SubjectPage --> Utilities
```

### ダッシュボードコンポーネント一覧（19個）

| コンポーネント | ファイル | 説明 |
|-------------|---------|------|
| Card3D | `card-3d.tsx` | 3Dパースペクティブ効果のカードラッパー |
| DailyChallenge | `daily-challenge.tsx` | デイリーチャレンジカード（タイマー付き） |
| FeaturedCourses | `featured-courses.tsx` | おすすめコースカルーセル |
| GlassCard | `glass-card.tsx` | グラスモーフィズムカードラッパー |
| HeroBanner | `hero-banner.tsx` | ヒーローバナー（マスコット画像・CTA） |
| LanguageSwitcher | `language-switcher.tsx` | 言語切替ドロップダウン（EN/JA/VI） |
| Leaderboard | `leaderboard.tsx` | XPランキングリーダーボード |
| LessonCard | `lesson-card.tsx` | 個別レッスンカード |
| ProgressRing3D | `progress-ring-3d.tsx` | 3Dプログレスリング（SVG） |
| ProgressRing | `progress-ring.tsx` | 標準プログレスリング（SVG） |
| QuickActions | `quick-actions.tsx` | クイックアクションボタン群 |
| RecentActivity | `recent-activity.tsx` | 最近のアクティビティフィード |
| Sidebar | `sidebar.tsx` | 左サイドバー（ナビゲーション） |
| StatsCard | `stats-card.tsx` | 個別統計カード |
| StatsRow | `stats-row.tsx` | 統計行（4つのカード+スパークラインSVG） |
| StreakHeatmap | `streak-heatmap.tsx` | GitHubスタイルのストリーク熱マップ |
| SubjectCard | `subject-card.tsx` | 科目カード（グラデーション背景） |
| SubjectsGrid | `subjects-grid.tsx` | 科目グリッド（4列レイアウト） |
| TopBar | `top-bar.tsx` | 上部バー（検索・ストリーク・通知） |

### 科目詳細コンポーネント一覧（3個）

| コンポーネント | ファイル | 説明 |
|-------------|---------|------|
| SubjectHeader | `subject-header.tsx` | パンくず、ヒーローカード、SVGプログレスリング |
| SubjectStats | `subject-stats.tsx` | 4つの指標カード（進捗率・レッスン数・時間・レベル） |
| ModulesList | `modules-list.tsx` | モジュールカード一覧（ロック状態・難易度バッジ） |

---

## 4. データフロー

### 4.1 レッスンデータフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant App as Next.js App
    participant FS as ファイルシステム
    participant DB as PostgreSQL

    U->>App: 科目ページにアクセス
    App->>App: lib/subjects.ts から科目データ取得
    App-->>U: 科目情報・モジュール一覧表示
    
    U->>App: レッスン開始
    App->>FS: lessons/{lang}/{course}/day-XX/content.md 読込
    FS-->>App: Markdownコンテンツ + frontmatter
    App->>App: Markdown → HTML変換
    App-->>U: レッスンコンテンツ表示
    
    U->>App: レッスン完了
    App->>DB: LessonProgress 更新
    DB-->>App: 更新確認
    App-->>U: 進捗反映
```

### 4.2 多言語（i18n）データフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant LS as LanguageSwitcher
    participant LP as LanguageProvider
    participant Comp as コンポーネント
    participant Storage as localStorage

    U->>LS: 言語選択（EN/JA/VI）
    LS->>LP: setLanguage('ja')
    LP->>Storage: localStorage.setItem('sensei-lang', 'ja')
    LP->>Comp: Context更新（全コンポーネント再レンダリング）
    Comp->>LP: t('nav.dashboard')
    LP-->>Comp: 'ダッシュボード'
    Comp-->>U: 日本語UIで表示
```

---

## 5. ルートレイアウト構成

```typescript
// app/layout.tsx の構造
<html lang="ja" suppressHydrationWarning>
  <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
    <LanguageProvider>
      {/* Sidebar（デスクトップのみ） */}
      <Sidebar />
      
      {/* メインコンテンツエリア */}
      <main className="lg:pl-72">
        <TopBar />
        {children}
      </main>
      
      {/* 装飾フローティングオーブ */}
      <div className="floating-orbs" />
    </LanguageProvider>
    
    {/* 本番環境のみ */}
    <Analytics />
  </body>
</html>
```

### メタデータ設定

```typescript
export const metadata: Metadata = {
  title: "SENSEI HUB - Focus & Flow Learning",
  description: "Master IT, AWS & Kihon Jouhou in Your Native Language",
  colorScheme: "dark",
  themeColor: "#1e1b4b",  // Indigo-950
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-icon.png",
  },
};
```

---

## 6. 環境変数テンプレート

```bash
# データベース
DATABASE_URL="postgresql://user:password@localhost:5432/sensei_hub?schema=public"

# 認証 (Auth.js v5)
AUTH_SECRET="your-auth-secret"
AUTH_URL="http://localhost:3000"

# AWS (デプロイ時)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="ap-northeast-1"
AWS_S3_BUCKET="sensei-hub-assets"
```

---

## 7. Docker Compose（ローカル開発）

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    container_name: sensei-hub-db
    environment:
      POSTGRES_USER: sensei
      POSTGRES_PASSWORD: sensei_pass
      POSTGRES_DB: sensei_hub
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 📎 関連ドキュメント

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) — ディレクトリ構成詳細
- [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) — データベース設計
- [TECH_STACK.md](./TECH_STACK.md) — テックスタック
- [I18N_STRATEGY.md](./I18N_STRATEGY.md) — 国際化戦略
