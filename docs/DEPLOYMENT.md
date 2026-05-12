# 🚀 AWS デプロイメントガイド (Deployment Guide)

> **担当:** Member A (Cloud Architect)  
> **ターゲット:** AWS Amplify + RDS + S3 + CloudFront

---

## 1. 準備: AWS アカウントと IAM

```bash
# デプロイ用の IAM User を作成（ルートアカウントは使用しないこと）
1. AWS Console → IAM → Users → Create User
2. Username: gakushuu-deploy
3. Permissions: AdministratorAccess (またはカスタムポリシー)
4. Access Key ID と Secret Access Key を保存し、.env ファイルに追加する
```

---

## 2. AWS RDS (PostgreSQL) のセットアップ

### ステップ 1: RDS インスタンスの作成
```
AWS Console → RDS → Create Database
├── Engine: PostgreSQL
├── Version: 16.x
├── Template: Free tier (無料枠)
├── DB Instance ID: gakushuu-db
├── Master Username: postgres
├── Master Password: [強力なパスワード]
├── Instance: db.t3.micro
├── Storage: 20GB gp2
└── Public access: Yes (開発中のみ。本番では No に変更)
```

### ステップ 2: セキュリティグループ (Security Group) の設定
```
Inbound Rules:
- Port 5432 (PostgreSQL)
- Source: 0.0.0.0/0 (開発環境用) または Amplify の IP レンジ (本番用)
```

### ステップ 3: 接続文字列の取得
```
DATABASE_URL="postgresql://postgres:PASSWORD@RDS_ENDPOINT:5432/postgres"
```

---

## 3. AWS S3 + CloudFront のセットアップ

### S3 バケットの作成
```
AWS Console → S3 → Create Bucket
├── Bucket name: gakushuu-assets-[region]
├── Region: ap-northeast-1 (Tokyo)
└── Block all public access: OFF (画像配信用にパブリック読み取りが必要)
```

### バケットポリシー (Bucket Policy) の設定
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::gakushuu-assets-*/*"
  }]
}
```

### CloudFront ディストリビューションの作成
```
Origin: S3 bucket URL
Viewer Protocol Policy: Redirect HTTP to HTTPS
Price Class: Use Only North America, Europe, Asia
```

---

## 4. AWS Amplify (ホスティング) のセットアップ

### ステップ 1: リポジトリの接続
```
AWS Amplify Console → New App → Host Web App
├── Provider: GitHub
├── Repository: [your-repo]
└── Branch: main
```

### ステップ 2: ビルド設定 (Build Settings)
Amplify は自動的に Next.js を検出します。 `amplify.yml` を以下のように設定します。
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install
        - npx prisma generate
        - npx prisma migrate deploy
    build:
      commands:
        - pnpm build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### ステップ 3: 環境変数の設定
```
AWS Amplify Console → App → Environment Variables:

DATABASE_URL          = postgresql://...
NEXTAUTH_SECRET       = [ランダムな32文字の文字列]
NEXTAUTH_URL          = https://your-amplify-domain.com
GOOGLE_CLIENT_ID      = ...
GOOGLE_CLIENT_SECRET  = ...
AWS_REGION            = ap-northeast-1
AWS_ACCESS_KEY_ID     = ...
AWS_SECRET_ACCESS_KEY = ...
AWS_S3_BUCKET         = gakushuu-assets-ap-northeast-1
NEXT_PUBLIC_APP_URL   = https://your-amplify-domain.com
```

---

## 5. Prisma マイグレーション (本番環境)

```bash
# 本番データベースでマイグレーションを実行
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# 用語集などの初期データを投入（オプション）
DATABASE_URL="postgresql://..." npx prisma db seed
```

---

## 6. カスタムドメインと SSL

```
AWS Amplify → Domain Management → Add Domain
├── Domain: gakushuu.yourdomain.com
└── SSL: Amplify が自動で発行 (AWS Certificate Manager)

Route53 を使用する場合:
AWS Route53 → Create Hosted Zone → Add A Record → Amplify domain
```
