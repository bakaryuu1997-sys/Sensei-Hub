# 🏗️ システムアーキテクチャ (System Architecture)

> **スタック:** Next.js 15 + PostgreSQL (AWS RDS) + AWS Amplify  
> **パターン:** フルスタック・モノリス (単一のNext.jsアプリ)  
> **レンダリング:** レッスン画面はSSR、クイズなどのインタラクティブ画面はCSR

---

## 1. 全体アーキテクチャ (High-Level Architecture)

```mermaid
graph TB
    subgraph "Client"
        Browser["🌐 ブラウザ / モバイル"]
    end

    subgraph "AWS Cloud"
        subgraph "Amplify Hosting (SSR)"
            NextApp["⚡ Next.js 15 App\n(App Router + API Routes)"]
        end

        subgraph "Data Layer"
            RDS[("🗄️ AWS RDS\nPostgreSQL 16")]
        end

        subgraph "Asset Layer"
            S3["📦 AWS S3\n(画像/ファイル)"]
            CF["🌍 CloudFront CDN"]
        end

        subgraph "Security"
            WAF["🛡️ AWS WAF"]
            Cognito["🔐 Auth.js / Cognito"]
        end
    end

    Browser -->|HTTPS| WAF
    WAF --> NextApp
    NextApp --> Cognito
    NextApp -->|Prisma ORM| RDS
    NextApp -->|SDK| S3
    CF --> S3
    Browser -->|静的アセット| CF
```

---

## 2. アプリケーション層の詳細

### 2.1. Next.js App Router の構造

```
app/
├── [locale]/                   # i18n ルーティング (ja, vi, en)
│   ├── layout.tsx              # i18n Providerを含むルートレイアウト
│   ├── page.tsx                # ランディングページ (SSG)
│   ├── (auth)/
│   │   ├── login/page.tsx      # ログインページ
│   │   └── register/page.tsx   # 登録ページ
│   ├── (app)/                  # 保護されたルート (ログイン必須)
│   │   ├── layout.tsx          # アプリのシェル (Sidebar + Header)
│   │   ├── dashboard/page.tsx  # ダッシュボード (SSR)
│   │   ├── lessons/
│   │   │   ├── page.tsx        # レッスン一覧 (SSG)
│   │   │   └── [slug]/page.tsx # レッスン詳細 (SSR + ISR)
│   │   ├── vocabulary/page.tsx # 用語集 (SWRを使ったCSR)
│   │   └── quiz/
│   │       ├── page.tsx        # クイズ選択ページ
│   │       └── [id]/page.tsx   # クイズ実行ページ (CSR)
└── api/                        # API ルート
    ├── auth/[...nextauth]/
    ├── lessons/
    ├── vocab/
    ├── quiz/
    └── user/
```

---

### 2.2. レンダリング戦略

| ルート | 戦略 | 理由 |
|-------|----------|-------|
| ランディングページ | **SSG** (静的) | 頻繁に変更されないためSEOと速度を優先 |
| レッスン一覧 | **SSG + ISR** (1h) | 新しいレッスンが追加された時に更新 |
| レッスン詳細 | **SSR** | ユーザーごとの既読ステータスを反映するため |
| 用語集 | **CSR + SWR** | 動的な検索やフィルタリングが必要なため |
| クイズ | **CSR** | リアルタイムなインタラクションが必要なため |
| ダッシュボード | **SSR** | ユーザー個別の学習データを表示するため |

---

### 2.3. 認証フロー (Auth.js v5)

```mermaid
sequenceDiagram
    User->>NextApp: POST /api/auth/signin
    NextApp->>DB: EmailとPasswordハッシュの検証
    DB-->>NextApp: ユーザーレコード
    NextApp->>Browser: HttpOnly Cookieをセット (セッション)
    Browser->>NextApp: Cookieを使ったリクエスト
    NextApp->>NextApp: middleware.ts でセッションを検証
    NextApp-->>Browser: 保護されたコンテンツを表示
```

**対応するプロバイダ:**
- Email/Password (Credentials Provider)
- Google OAuth

---

### 2.4. データフロー: レッスンの読み込み

```mermaid
sequenceDiagram
    Browser->>NextApp: GET /ja/lessons/java-basic-01
    NextApp->>FileSystem: /lessons/ja/java-basic-01.md の読み込み
    NextApp->>NextApp: MDX を React コンポーネントにコンパイル
    NextApp->>DB: LessonProgress の取得 (userId, slug)
    DB-->>NextApp: { status: "IN_PROGRESS" }
    NextApp-->>Browser: 完全なHTMLを返す (SSR)
```

---

## 3. インフラストラクチャの詳細

### 3.1. AWS サービス

| サービス | 目的 | ティア |
|---------|---------|------|
| **Amplify** | ホスティング + CI/CD | Standard |
| **RDS (PostgreSQL 16)** | メインデータベース | `db.t3.micro` (無料枠) |
| **S3** | レッスンの画像、アバターの保存 | Standard |
| **CloudFront** | S3アセット配信用CDN | 無料枠対象 |
| **WAF** | DDoS対策、OWASP Top 10 | Basic |
| **CloudWatch** | ログとメトリクスの監視 | Basic |

### 3.2. 環境変数 (.env)

```bash
# Database
DATABASE_URL="postgresql://user:pass@rds-endpoint:5432/gakushuu"

# Auth
NEXTAUTH_SECRET="super-secret-random-string"
NEXTAUTH_URL="https://your-amplify-domain.com"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# AWS S3
AWS_REGION="ap-northeast-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="gakushuu-assets"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_DEFAULT_LOCALE="vi"
```
