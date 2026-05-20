# 🚀 Sensei Hub — デプロイメントガイド

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20

---

## 1. ローカル開発環境

### 1.1 Docker Compose（PostgreSQL）

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

### 1.2 セットアップ手順

```bash
# 1. PostgreSQLコンテナ起動
docker-compose up -d

# 2. ダッシュボードアプリのセットアップ
cd sensei-hub-dashboard
pnpm install

# 3. 環境変数設定
cat > .env << EOF
DATABASE_URL="postgresql://sensei:sensei_pass@localhost:5432/sensei_hub?schema=public"
AUTH_SECRET="your-dev-auth-secret-at-least-32-chars"
AUTH_URL="http://localhost:3000"
EOF

# 4. データベースマイグレーション
pnpm prisma migrate dev --name init

# 5. Prisma Client 生成
pnpm prisma generate

# 6. 開発サーバー起動
pnpm dev
```

### 1.3 確認

- ブラウザで `http://localhost:3000` にアクセス
- Prisma Studio: `pnpm prisma studio`（`http://localhost:5555`）

---

## 2. AWS デプロイメント

### 2.1 事前準備

- AWSアカウント
- AWS CLI インストール・設定済み
- カスタムドメイン（オプション）

### 2.2 Step 1: IAMユーザー作成

```bash
# デプロイ専用IAMユーザー作成
aws iam create-user --user-name sensei-hub-deploy

# 必要なポリシーをアタッチ
aws iam attach-user-policy \
  --user-name sensei-hub-deploy \
  --policy-arn arn:aws:iam::aws:policy/AmazonRDSFullAccess

aws iam attach-user-policy \
  --user-name sensei-hub-deploy \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-user-policy \
  --user-name sensei-hub-deploy \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess
```

### 2.3 Step 2: RDS PostgreSQL

```bash
# PostgreSQL インスタンス作成
aws rds create-db-instance \
  --db-instance-identifier sensei-hub-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16 \
  --master-username sensei_admin \
  --master-user-password <STRONG_PASSWORD> \
  --allocated-storage 20 \
  --db-name sensei_hub \
  --vpc-security-group-ids <SG_ID> \
  --availability-zone ap-northeast-1a \
  --backup-retention-period 7 \
  --storage-encrypted
```

> ⚠️ **セキュリティ警告**: Security Groupでは、本番環境ではポート5432への接続元を**アプリケーションサーバーのIPのみ**に制限してください。`0.0.0.0/0`（全公開）は絶対に避けてください。

### 2.4 Step 3: S3 + CloudFront

```bash
# S3バケット作成（静的アセット用）
aws s3 mb s3://sensei-hub-assets --region ap-northeast-1

# バケットポリシー設定（CloudFrontからのアクセスのみ許可）
aws s3api put-bucket-policy \
  --bucket sensei-hub-assets \
  --policy file://s3-policy.json

# CloudFrontディストリビューション作成
aws cloudfront create-distribution \
  --origin-domain-name sensei-hub-assets.s3.ap-northeast-1.amazonaws.com \
  --default-root-object index.html
```

### 2.5 Step 4: AWS Amplify ホスティング

1. **Amplify Console** にアクセス
2. **GitHub リポジトリを接続**
3. **ビルド設定**:

```yaml
# amplify.yml
version: 1
applications:
  - appRoot: sensei-hub-dashboard
    frontend:
      phases:
        preBuild:
          commands:
            - npm install -g pnpm
            - pnpm install
        build:
          commands:
            - pnpm prisma generate
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

4. **環境変数設定**（Amplify Console）:

```
DATABASE_URL=postgresql://sensei_admin:<password>@<rds-endpoint>:5432/sensei_hub
AUTH_SECRET=<production-secret-at-least-32-chars>
AUTH_URL=https://your-domain.com
```

### 2.6 Step 5: カスタムドメイン + SSL

1. **Amplify Console** → **ドメイン管理**
2. カスタムドメインを追加
3. CNAME レコードを設定（DNS）
4. SSL証明書は自動発行（AWS Certificate Manager）

---

## 3. CI/CDパイプライン（GitHub Actions）

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS Amplify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: cd sensei-hub-dashboard && pnpm install
      
      - name: Run type check
        run: cd sensei-hub-dashboard && pnpm tsc --noEmit
      
      - name: Build
        run: cd sensei-hub-dashboard && pnpm build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 4. 本番環境チェックリスト

- [ ] RDS のセキュリティグループをアプリサーバーIPのみに制限
- [ ] `AUTH_SECRET` を十分な長さの安全な値に設定
- [ ] `next.config.mjs` の `ignoreBuildErrors` を `false` に変更
- [ ] 画像最適化を有効化（`unoptimized: false`）
- [ ] アクセスログの有効化（CloudFront）
- [ ] バックアップポリシーの確認（RDS）
- [ ] HTTPS リダイレクトの設定

---

## 📎 関連ドキュメント

- [ARCHITECTURE.md](./ARCHITECTURE.md) — システムアーキテクチャ
- [TECH_STACK.md](./TECH_STACK.md) — テックスタック
