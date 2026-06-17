# デプロイ — AWS EC2（Docker）

> 更新日: 2026-06-17

Sensei Hub は **単一の AWS EC2 インスタンス** に Docker Compose でデプロイします。
マネージド DB は使わず、SQLite を Docker ボリュームに置きます。

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

- イメージは `sensei-hub-dashboard/Dockerfile` からビルド（ビルドコンテキストはリポジトリ
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

## 5. リバースプロキシ（推奨）

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

## 6. 更新

```bash
git pull
docker compose up -d --build
```

- レッスンコンテンツの更新は次のリクエストから反映される（マウントした `lessons/` を
  読むため）。コンテンツのみの変更なら再ビルドは必須ではない。
- **Clerk の publishable key** を変更した場合は再ビルドが必要（ビルド時に埋め込まれる）。

## 7. バックアップ・運用メモ

- 学習進捗を保全するため `web_data` ボリュームを**バックアップ**:
  ```bash
  docker run --rm -v sensei-hub_web_data:/data -v $PWD:/backup alpine \
    tar czf /backup/sensei-db-$(date +%F).tar.gz -C /data .
  ```
- メモリ内の**キャッシュとレート制限はコンテナ再起動でリセット**され、プロセス単位。
  単一インスタンスなら問題ないが、水平スケールには不向き。
- ログ: `docker compose logs -f web`。

## 8. スキーマに関する注意

`User.password` は削除済み（認証は Clerk のみ）。この変更前に作成した
`dev.db`／`production.db` がある場合でも、`prisma db push` がスキーマを自動的に
合わせるため手動マイグレーションは不要。
