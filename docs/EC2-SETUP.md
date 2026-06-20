# EC2（Ubuntu）セットアップ & ECR デプロイ手順（ゼロから）

> 更新日: 2026-06-20
>
> **新規作成したまっさらな Ubuntu EC2** を対象に、Docker のインストールから ECR の
> イメージを pull して本番起動するまでの**ターミナルコマンドを通しでまとめた**手順書。
> イメージのビルド/push（開発マシン側）の詳細は [`DEPLOYMENT.md`](./DEPLOYMENT.md) §5 を参照。
>
> 表記ルール:
> - `<...>` は自分の値に置き換える。
> - `$ ` で始まる行はターミナルに打つコマンド。
> - リージョンは例として **`ap-northeast-1`（東京）** を使用。自分のリージョンに合わせて変更する。

---

## 0. 全体像

```
[開発マシン]  docker build → ECR に push
                                   │
                                   ▼
[EC2 Ubuntu]  docker / aws cli を入れる → ECR から pull → docker compose で起動
                                   │
                                   ▼
                      http://<EC2のIP>:3000  （必要なら Nginx + TLS で 80/443）
```

EC2 側でやることは大きく 4 つ:
1. システム更新と Docker / AWS CLI のインストール（§2–§4）
2. ECR から pull できるよう権限を用意（§5。**IAM ロール推奨**）
3. compose と `.env` を置いて起動（§6–§7）
4. 動作確認・公開（§8–§10）

---

## 1. 前提

- EC2 インスタンス: **Ubuntu Server 22.04 / 24.04 LTS**、`t3.small` 以上（メモリ 2GB 以上推奨）。
- ストレージ: 20GB 以上（イメージが ~1.9GB あるため余裕をみる）。
- セキュリティグループのインバウンド:
  - `22`（SSH）… 自分の IP のみに絞るのが安全。
  - `80` / `443`（Web。Nginx を前段に置く場合）。
  - 動作確認だけ直接やるなら一時的に `3000` を開けてもよい（本番では閉じる）。
- Clerk の publishable / secret キー（本番インスタンス）。
- ECR にイメージを push 済み、または push できる開発マシン。

### 1.1 SSH 接続

```bash
# 開発マシンから（キーのパーミッションは 400 にしておく）
$ chmod 400 <your-key>.pem
$ ssh -i <your-key>.pem ubuntu@<EC2のパブリックIP>
```

以降のコマンドは、特記がなければ **EC2 上**で実行する。

---

## 2. システム更新と基本ツール

```bash
$ sudo apt update && sudo apt upgrade -y
$ sudo apt install -y ca-certificates curl gnupg unzip git
```

---

## 3. Docker Engine をインストール（公式リポジトリ）

```bash
# 1) Docker の GPG キーを登録
$ sudo install -m 0755 -d /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$ sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 2) apt リポジトリを追加
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 3) インストール（Engine + CLI + compose プラグイン）
$ sudo apt update
$ sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 3.1 sudo なしで docker を使う

```bash
$ sudo usermod -aG docker $USER
# 反映には再ログインが必要。一度ログアウトして入り直すか、次を実行:
$ newgrp docker
```

### 3.2 動作確認

```bash
$ docker --version
$ docker compose version
$ docker run --rm hello-world
```

`hello-world` が "Hello from Docker!" を表示すれば OK。

---

## 4. AWS CLI v2 をインストール

```bash
$ curl "https://awscli.amazonaws.com/awscli-exe-linux-$(uname -m).zip" -o awscliv2.zip
$ unzip -q awscliv2.zip
$ sudo ./aws/install
$ aws --version          # aws-cli/2.x が出れば OK
$ rm -rf awscliv2.zip aws
```

---

## 5. ECR から pull する権限を用意

**方法 A（推奨）: EC2 に IAM ロールをアタッチ** — キーをサーバーに置かずに済み、安全。

1. AWS マネジメントコンソール → IAM → ロール → 「ロールを作成」。
2. 信頼されたエンティティ: **AWS service → EC2**。
3. ポリシー: **`AmazonEC2ContainerRegistryReadOnly`** をアタッチ。
4. ロール名（例 `ec2-ecr-readonly`）で作成。
5. EC2 コンソール → 対象インスタンス → 「アクション → セキュリティ → IAM ロールを変更」で
   作成したロールをアタッチ。

確認:

```bash
$ aws sts get-caller-identity        # ロール経由の identity が表示されれば OK
```

**方法 B: アクセスキーを設定**（ロールが使えない場合）

```bash
$ aws configure
# AWS Access Key ID / Secret Access Key / region(ap-northeast-1) / output(json) を入力
```

> ⚠️ アクセスキーは漏洩リスクがある。可能なら方法 A を使う。

### 5.1 ECR にログイン

```bash
$ export AWS_REGION=ap-northeast-1
$ export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
$ aws ecr get-login-password --region "$AWS_REGION" \
    | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
```

`Login Succeeded` が出れば OK。

---

## 6. compose ファイルと .env を配置

EC2 ではイメージをビルドしないので、リポジトリ全体は不要。**`docker-compose.prod.yml` 1 つ**を
置けばよい（レッスンはイメージに同梱されている）。

```bash
$ mkdir -p ~/sensei-hub && cd ~/sensei-hub

# リポジトリから本番用 compose を取得（どちらか）
#  (a) git で取る
$ git clone https://github.com/bakaryuu1997-sys/Sensei-Hub.git /tmp/sh \
    && cp /tmp/sh/docker-compose.prod.yml . && rm -rf /tmp/sh
#  (b) もしくは scp/手貼りで docker-compose.prod.yml を ~/sensei-hub に置く
```

`.env` を作成（compose と同じディレクトリ）:

```bash
$ cat > .env <<'EOF'
ECR_IMAGE=<ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/sensei-hub:latest
CLERK_SECRET_KEY=sk_live_xxxxxxxx
EOF
```

- `ECR_IMAGE` … push したイメージの URI（タグ付き）。`<ACCOUNT_ID>` と region を自分の値に。
- `CLERK_SECRET_KEY` … Clerk のシークレットキー（実行時に使用）。
- publishable key は**ビルド時にイメージへ埋め込み済み**なので EC2 では不要。

---

## 7. pull して起動

```bash
$ cd ~/sensei-hub
$ docker compose -f docker-compose.prod.yml pull
$ docker compose -f docker-compose.prod.yml up -d
```

起動時にコンテナ内の `docker-entrypoint.sh` が次を実行する:
1. `prisma db push` で SQLite スキーマを作成（`/app/data/production.db`）
2. レッスンインデックス生成（`/app/data/lessons-index.json`）
3. `next start` でポート 3000 起動

SQLite と生成物は名前付きボリューム `web_data`（`/app/data`）に保存され、再デプロイでも残る。

---

## 8. 動作確認

```bash
$ docker compose -f docker-compose.prod.yml ps          # STATUS が "healthy" になるか
$ docker compose -f docker-compose.prod.yml logs -f web # 起動ログ（Ctrl+C で抜ける）
$ curl -i http://localhost:3000/api/health              # {"status":"ok",...} が返る
```

ブラウザで `http://<EC2のパブリックIP>:3000`（セキュリティグループで 3000 を開けている場合）。
ログイン → レッスン → クイズ → チャットが動けば成功。

---

## 9. Nginx で 80/443 公開（推奨）

`3000` を直接公開せず、Nginx をリバースプロキシにする。

```bash
$ sudo apt install -y nginx
$ sudo tee /etc/nginx/sites-available/sensei-hub >/dev/null <<'EOF'
server {
    listen 80;
    server_name <your-domain.com>;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
$ sudo ln -sf /etc/nginx/sites-available/sensei-hub /etc/nginx/sites-enabled/
$ sudo nginx -t && sudo systemctl reload nginx
```

### 9.1 HTTPS（Let's Encrypt）

DNS で `<your-domain.com>` を EC2 の IP に向けてから:

```bash
$ sudo apt install -y certbot python3-certbot-nginx
$ sudo certbot --nginx -d <your-domain.com>
```

公開後は、セキュリティグループで **3000 のインバウンドを閉じる**（80/443 のみ公開）。

---

## 10. 更新・ロールバック・運用

### 更新（新しいイメージを push した後）

```bash
$ cd ~/sensei-hub
$ docker compose -f docker-compose.prod.yml pull
$ docker compose -f docker-compose.prod.yml up -d
$ docker image prune -f          # 古いイメージを掃除
```

> ECR ログインのトークンは約 12 時間で失効する。pull に失敗したら §5.1 を再実行。

### ロールバック

`.env` の `ECR_IMAGE` のタグを前のもの（例 `:<git短縮ハッシュ>`）に変えて `pull` → `up -d`。

### 自動起動

`restart: always` を指定済みのため、Docker デーモンが起動すればコンテナも自動復帰する。
Docker 自体をブート時起動に:

```bash
$ sudo systemctl enable docker
```

### バックアップ（学習進捗 DB）

```bash
$ docker run --rm -v sensei-hub_web_data:/data -v $PWD:/backup alpine \
    tar czf /backup/sensei-db-$(date +%F).tar.gz -C /data .
```

> ボリューム名は `docker volume ls` で確認（`<compose プロジェクト名>_web_data`）。

### ログ

```bash
$ docker compose -f docker-compose.prod.yml logs -f web
```

---

## 11. トラブルシュート

| 症状 | 対処 |
| --- | --- |
| `docker login` で `denied` / `no basic auth` | §5.1 を再実行（トークン失効）。IAM ロール/権限を確認。 |
| `pull` が `repository ... not found` | `ECR_IMAGE` の URI・リージョン・タグを確認。push 済みか確認。 |
| コンテナが起動直後に終了する | `docker compose -f docker-compose.prod.yml logs web` を確認。`.env` の `CLERK_SECRET_KEY` 未設定が多い。 |
| `/api/health` が応答しない | `docker compose ... ps` で `healthy` か確認。起動には数十秒かかる。 |
| ログインできない / Clerk エラー | publishable key はビルド時埋め込み。変更したら**開発マシンで再ビルド→push**が必要。 |
| ディスク不足 | `docker system df` で確認し、`docker image prune -f` / `docker system prune` で掃除。 |

---

## 付録: 開発マシンでビルド & push（参考）

詳細は [`DEPLOYMENT.md`](./DEPLOYMENT.md) §5。要点のみ:

```bash
# リポジトリルートで（ビルドコンテキストはルート: lessons/ を含むため）
$ export AWS_REGION=ap-northeast-1
$ export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
$ export ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/sensei-hub"

# 初回のみ: リポジトリ作成
$ aws ecr create-repository --repository-name sensei-hub --region "$AWS_REGION" || true

# ビルド（リポジトリルートで実行。Dockerfile はルートにある。NEXT_PUBLIC_* はビルド時に埋め込む）
$ docker build \
    --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxx \
    -t "$ECR_URI:latest" -t "$ECR_URI:$(git rev-parse --short HEAD)" .

# ログインして push
$ aws ecr get-login-password --region "$AWS_REGION" \
    | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
$ docker push "$ECR_URI:latest"
$ docker push "$ECR_URI:$(git rev-parse --short HEAD)"
```

> EC2 と CPU アーキテクチャが違う場合は `docker build` に `--platform linux/amd64`
> （Graviton の arm EC2 なら `linux/arm64`）を付ける。
