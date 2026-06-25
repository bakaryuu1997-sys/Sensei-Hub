# CI/CD セットアップ（GitHub Actions → ECR → EC2 自動デプロイ）

> `.github/workflows/ci.yml` の `deploy` ジョブが、`main` への push かつ下記シークレットが
> 揃っているときだけ自動デプロイする（build=lint/test/build が緑になってから動く）。
> シークレット未設定ならデプロイは丸ごとスキップされ、CI は緑のまま。

## フロー
```
main へ push → CI(build: lint + unit test + next build)
  → 緑なら deploy ジョブ:
     1. Docker build（NEXT_PUBLIC_* をビルド引数で埋め込み）
     2. ECR へ push（:latest と :<commit sha>）
     3. EC2 に SSH → docker compose pull → up -d → 古いイメージ prune
```
手元での手動 build/push/SSH は不要になる。

## 必要な GitHub Secrets
リポジトリ → **Settings → Secrets and variables → Actions → New repository secret** で登録。
**値はここには書かない**（値は各サービスから取得）。

| Secret 名 | 中身 / 取得元 |
|-----------|--------------|
| `AWS_ACCESS_KEY_ID` | ECR へ push 権限のある IAM ユーザーのアクセスキー。最小権限は `AmazonEC2ContainerRegistryPowerUser` 相当 |
| `AWS_SECRET_ACCESS_KEY` | 同上のシークレットアクセスキー |
| `EC2_HOST` | EC2 のパブリック IP（例: `3.27.73.135`） |
| `EC2_SSH_KEY` | `Sensei-hub.pem` の**中身全体**（`-----BEGIN ...` から `-----END ...` まで、改行込み） |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk の publishable key（`pk_test_...`）。ビルド時に焼き込まれる |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | （任意）web-push の VAPID 公開鍵。未設定なら通知トグルは非表示 |

> ⚠️ `CLERK_SECRET_KEY` と VAPID の秘密鍵は**実行時 env**（EC2 の `~/sensei-hub/.env`）側で
> 設定する。ビルド時には不要なので GitHub Secrets には入れない。

## 前提（EC2 側）
- `~/sensei-hub/docker-compose.prod.yml` と `.env`（`ECR_IMAGE`・`CLERK_SECRET_KEY` 等）が配置済み。
- EC2 に ECR pull 権限の IAM ロール（`AmazonEC2ContainerRegistryReadOnly` 相当）が付与済み。
- セキュリティグループで GitHub Actions ランナーからの SSH(22) を許可（または `0.0.0.0/0` の 22）。

## 動作確認
1. 上記シークレットを登録。
2. `main` に何かを push（または Actions タブから `CI` を手動再実行）。
3. Actions の `deploy` ジョブが緑になり、`Deployed <sha> to EC2.` が出れば成功。
4. `https://senseihub.baryuu.com/api/health` が 200。

## ロールバック
ECR には `:<commit sha>` タグも push されるため、EC2 で
`docker pull <ECR_URI>:<前のsha>` → `docker compose ... up -d`（`ECR_IMAGE` を一時的にそのタグへ）で戻せる。

## web-push を本番で有効化する場合
1. 本番用 VAPID 鍵を生成: `node -e "console.log(require('web-push').generateVAPIDKeys())"`
2. GitHub Secret `NEXT_PUBLIC_VAPID_PUBLIC_KEY` に公開鍵を設定（ビルド時埋め込み）。
3. EC2 の `~/sensei-hub/.env` に実行時 env を追加し `docker-compose.prod.yml` の
   `environment:` に渡す: `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` / `REMINDER_HOUR`。
4. push してデプロイ。設定画面のリマインドトグルが有効になり、日次 cron が動く。
