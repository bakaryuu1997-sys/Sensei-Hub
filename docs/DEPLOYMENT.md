# デプロイ — AWS EC2（Docker）

> 更新日: 2026-06-19

Sensei Hub は **単一の AWS EC2 インスタンス** に Docker でデプロイします。
マネージド DB は使わず、SQLite を Docker ボリュームに置きます。

デプロイ方法は 2 通り。用途に応じて選びます。

- **A: EC2 上でビルド（§3–4）** — `docker compose up -d --build`。手軽。EC2 にビルド負荷がかかる。
- **B: ECR にイメージを push して EC2 で pull（§5）** — ローカル/CI でビルドして ECR に置き、
  EC2 は pull して起動するだけ。EC2 が軽く、ロールバックも容易。**本番推奨**。

## 1. 前提条件

- EC2 インスタンス（Ubuntu 22.04 以降推奨、`t3.small` 以上）。
- セキュリティグループのインバウンド: `22`（SSH）、`80`/`443`（Web）。前段に
  Nginx/ALB を置く場合、アプリのポート `3000` を公開する必要はない。
- Clerk アプリ（本番インスタンス）と publishable / secret キー。

## 2. ホストへ Docker をインストール

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # 実行後に再ログイン
```

Docker Engine には `docker compose` プラグインが同梱されています。

## 3. コード取得と秘密情報の設定

```bash
git clone https://github.com/bakaryuu1997-sys/Sensei-Hub.git
cd Sensei-Hub

# docker-compose.yml の隣に .env を作成（Compose が読み込む）:
cat > .env <<'EOF'
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxx
EOF
```

`DATABASE_URL`・`LESSONS_DIR`・Clerk のサインイン／アップ URL は `docker-compose.yml`
に設定済みです。`NEXT_PUBLIC_*` は**ビルド時**の値で、`docker compose build` の際に
イメージへ埋め込まれます。

## 4. ビルドと起動

```bash
docker compose up -d --build
```

処理の流れ:

- イメージはリポジトリルートの `Dockerfile` からビルド（ビルドコンテキストはリポジトリ
  ルートなので `lessons/` も含まれる）。
- 起動時に `docker-entrypoint.sh` が `prisma db push` で SQLite スキーマを作成し、
  ポート 3000 で `next start` を実行。
- SQLite ファイルは名前付きボリューム `web_data`（`/app/data/production.db`）に保存され、
  `docker compose down`／再デプロイでも残る。
- `lessons/` は `/lessons` に読み取り専用でマウントされる。

確認:

```bash
docker compose ps
docker compose logs -f web
curl -I http://localhost:3000
```

## 5. ECR にイメージを push して EC2 で動かす（方法 B・推奨）

EC2 でビルドせず、**ローカルまたは CI でビルドしたイメージを ECR に push**し、EC2 では
pull して起動します。

### 5.1 ECR リポジトリを用意（初回のみ）

```bash
export AWS_REGION=ap-northeast-1
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export ECR_REPO=sensei-hub

aws ecr create-repository --repository-name "$ECR_REPO" --region "$AWS_REGION" || true
export ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO"
```

### 5.2 ビルド（ビルドマシン側）

`NEXT_PUBLIC_*` は**ビルド時**にイメージへ埋め込まれるため、ビルド引数で渡します。
ビルドコンテキストは**リポジトリルート**（`lessons/` を含めるため）。

```bash
# リポジトリルートで実行（Dockerfile はルートにある）
docker build \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxx \
  -t "$ECR_URI:latest" -t "$ECR_URI:$(git rev-parse --short HEAD)" \
  .
```

> Apple Silicon など EC2 と CPU が異なる場合は `--platform linux/amd64` を付ける
> （EC2 が arm の Graviton なら `linux/arm64`）。

### 5.3 ECR にログインして push

```bash
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

docker push "$ECR_URI:latest"
docker push "$ECR_URI:$(git rev-parse --short HEAD)"
```

### 5.4 EC2 で pull して起動

EC2 にも IAM ロール（`AmazonEC2ContainerRegistryReadOnly` 相当）を付け、ECR にログインします。

```bash
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
docker pull "$ECR_URI:latest"
```

**実行時 env** はここで渡します（`CLERK_SECRET_KEY`・`DATABASE_URL`・`LESSONS_DIR`・
`LESSONS_INDEX_PATH`）。レッスンはイメージに同梱済みですが、コンテンツだけ差し替えたい場合は
ホストの `lessons/` を読み取り専用でマウントします。

```bash
docker run -d --name sensei-hub-web --restart always \
  -p 3000:3000 \
  -e CLERK_SECRET_KEY=sk_live_xxxxxxxx \
  -e DATABASE_URL="file:/app/data/production.db" \
  -e LESSONS_DIR=/lessons \
  -e LESSONS_INDEX_PATH=/app/data/lessons-index.json \
  -v sensei_web_data:/app/data \
  "$ECR_URI:latest"
```

- `-v sensei_web_data:/app/data` … SQLite（`production.db`）と生成インデックスを永続化。
- `/lessons` はイメージ同梱（読み取り専用）。インデックスは書き込み可能な `/app/data` に出力する
  ため `LESSONS_INDEX_PATH` を `/app/data` 配下にしている。
- ヘルスチェックは**イメージに内蔵**（`/api/health`）。`docker ps` の STATUS に `healthy` が出る。

**compose で pull・起動**したい場合は、`build:` の代わりに `image:` を指定する
`docker-compose.prod.yml` を置く運用が簡単です（`image: <ECR_URI>:latest` と
`environment:`・`volumes:`・`healthcheck:` は §4 と同じ）。

### 5.5 ロールバック

```bash
docker pull "$ECR_URI:<前のタグ>"
docker rm -f sensei-hub-web
docker run -d ... "$ECR_URI:<前のタグ>"   # 5.4 と同じ引数
```

## 6. リバースプロキシ（推奨）

Nginx を前段に置き 80/443 で HTTP/HTTPS を提供:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

TLS は Certbot（Let's Encrypt）を利用。

## 7. 更新

方法 A（EC2 ビルド）:

```bash
git pull
docker compose up -d --build
```

方法 B（ECR）: §5.2–5.4 を再実行（新しいタグを push → EC2 で pull → コンテナ再作成）。

- レッスンコンテンツの更新は次のリクエストから反映される（マウントした `lessons/` を
  読むため）。コンテンツのみの変更なら再ビルドは必須ではない。
- **Clerk の publishable key** を変更した場合は再ビルドが必要（ビルド時に埋め込まれる）。

## 8. バックアップ・運用メモ

- 学習進捗を保全するため `web_data` ボリュームを**バックアップ**:
  ```bash
  docker run --rm -v sensei-hub_web_data:/data -v $PWD:/backup alpine \
    tar czf /backup/sensei-db-$(date +%F).tar.gz -C /data .
  ```
- メモリ内の**キャッシュとレート制限はコンテナ再起動でリセット**され、プロセス単位。
  単一インスタンスなら問題ないが、水平スケールには不向き。
- ログ: `docker compose logs -f web`。

## 9. スキーマに関する注意

`User.password` は削除済み（認証は Clerk のみ）。この変更前に作成した
`dev.db`／`production.db` がある場合でも、`prisma db push` がスキーマを自動的に
合わせるため手動マイグレーションは不要。
